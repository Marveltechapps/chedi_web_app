import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { initialState } from '../logic/initialState.js'
import { downloadReceipt, TERMS_TEXT, PRIVACY_TEXT } from '../logic/receipt.js'
import Icon from '../components/icons/Icon.jsx'
import {
  clearSession,
  getAccessToken,
  getRefreshToken,
  hasSession,
  saveSession,
} from '../lib/session.js'
import {
  defaultGallery,
  defaultHero,
  defaultWelcomeImg,
  mapAddress,
  mapBasketItem,
  mapGrowing,
  mapMemberToForm,
  memberDisplayName,
  mapPaymentMethod,
  mapPlan,
  mapPlot,
  mapSubscription,
  newIdempotencyKey,
  isOnOrAfterCalendarDate,
  relativeTime,
} from '../lib/mappers.js'
import {
  isValidEmail,
  isValidOtp,
  mapApiFormErrors,
  phoneValidationMessage,
  sanitizePhoneInput,
  validateAddressForm,
  validateJoinForm,
  validateProfileDraft,
} from '../lib/validation.js'
import {
  addressesApi,
  authApi,
  deliveriesApi,
  meApi,
  membershipApi,
  myPlotApi,
  notificationsApi,
  overviewApi,
  paymentsApi,
  plansApi,
  plotsApi,
  subscriptionsApi,
  supportApi,
} from '../api/index.js'
import { ApiError } from '../api/client.js'
import { connectRealtime, disconnectRealtime, subscribeRealtime, REALTIME_EVENTS } from '../lib/realtime.js'

const ACCENT = '#b98a2e'
const OTP_RESEND_SECONDS = 60

function otpResendWaitSeconds(res) {
  const raw = Number(res?.resendAvailableInSeconds ?? res?.data?.resendAvailableInSeconds)
  if (Number.isFinite(raw) && raw >= OTP_RESEND_SECONDS) return Math.round(raw)
  return OTP_RESEND_SECONDS
}

function errMessage(err, fallback = 'Something went wrong. Please try again.') {
  if (!err) return fallback
  if (err instanceof ApiError) return err.message || fallback
  return err.message || fallback
}

function buildPaymentBody() {
  return { method: 'payment_request' }
}

/** Keep date/status on delivery timeline labels; drop clock times like "8:40 PM" or "by 10 AM". */
function dateOnlyTrackingLabel(label) {
  return String(label || '')
    .replace(/,\s*by\s+\d{1,2}(?::\d{2})?\s*(?:AM|PM)/gi, '')
    .replace(/,\s*\d{1,2}:\d{2}\s*(?:AM|PM)/gi, '')
    .trim()
}

export default function useChediApp() {
  const [state, setState] = useState(initialState)
  const stateRef = useRef(state)
  stateRef.current = state

  const patch = useCallback((partial) => {
    setState((prev) => ({ ...prev, ...partial }))
  }, [])

  const flash = useCallback((key) => {
    setState((prev) => ({ ...prev, saved: key }))
    setTimeout(() => {
      setState((prev) => (prev.saved === key ? { ...prev, saved: '' } : prev))
    }, 2200)
  }, [])

  const forceLogout = useCallback((notice = '') => {
    disconnectRealtime()
    clearSession()
    setState((prev) => ({
      ...initialState,
      bootLoading: false,
      route: 'login',
      login: {
        ...initialState.login,
        notice: notice || prev.login.notice,
      },
    }))
  }, [])

  const loadCatalogs = useCallback(async () => {
    const [plansRes, plotsRes] = await Promise.all([
      plansApi.list(),
      plotsApi.list({ pageSize: 100 }),
    ])
    const plans = (plansRes.items || []).map(mapPlan)
    const plots = (plotsRes.items || []).map(mapPlot)
    const defaultPlot =
      plots.find((p) => p.status === 'available')?.key || plots[0]?.key || ''
    const defaultPlan = plans.find((p) => p.featured)?.key || plans[0]?.key || 'family8'
    setState((prev) => ({
      ...prev,
      catalogs: {
        ...prev.catalogs,
        plans,
        plots,
        deliveryChargeFormatted:
          plansRes.deliveryChargeFormatted || prev.catalogs.deliveryChargeFormatted,
      },
      selectedPlot: prev.selectedPlot || defaultPlot,
      selectedPlan: prev.selectedPlan || defaultPlan,
      heroPlotImg: defaultHero(),
      welcomeImg: defaultWelcomeImg(),
      notifiedPlots: plots.filter((p) => p.notifyRequested).map((p) => p.key),
    }))
    return { plans, plots }
  }, [])

  const loadMemberWorkspace = useCallback(async () => {
    const [
      me,
      subsRes,
      addrRes,
      pmRes,
      notifRes,
      histRes,
      overview,
      support,
      banks,
    ] = await Promise.all([
      meApi.get(),
      subscriptionsApi.list(),
      addressesApi.list(),
      paymentsApi.listMethods(),
      notificationsApi.list(),
      paymentsApi.history(),
      overviewApi.get(),
      supportApi.get().catch(() => ({ faq: [], contacts: [] })),
      paymentsApi.netBanks().catch(() => ({ items: [] })),
    ])

    const subs = (subsRes.items || []).map(mapSubscription)
    const addresses = (addrRes.items || []).map(mapAddress)
    const payments = (pmRes.items || []).map(mapPaymentMethod)
    const member = me.member
    const profile = me.profile
    const prefs = me.preferences?.notifications || { delivery: true, harvest: true, promos: false }
    const form = mapMemberToForm(member, profile)
    if (addresses[0]) {
      form.address = addresses.find((a) => a.def)?.line || addresses[0].line
      form.city = addresses.find((a) => a.def)?.city || addresses[0].city
      form.pin = addresses.find((a) => a.def)?.pin || addresses[0].pin
    }

    const activeSub = me.activeSubscriptionId || subsRes.activeSubscriptionId || subs[0]?.id || null

    let myPlot = null
    let deliveries = null
    if (subs.length) {
      ;[myPlot, deliveries] = await Promise.all([
        myPlotApi.get(activeSub).catch(() => null),
        deliveriesApi.list(activeSub).catch(() => null),
      ])
    }

    await loadCatalogs()

    setState((prev) => ({
      ...prev,
      bootLoading: false,
      actionLoading: false,
      route: 'app',
      isMember: true,
      member,
      memberId: member?.id || member?.memberCode?.replace('CHEDI-', '') || '',
      form,
      sec: { ...prev.sec, mobile: profile?.phoneDisplay || member?.phoneDisplay || '', view: 'idle' },
      notif: { delivery: !!prefs.delivery, harvest: !!prefs.harvest, promos: !!prefs.promos },
      notifChannel: me.preferences?.channel || 'push',
      subs,
      activeSub,
      addresses,
      payments,
      notifications: notifRes.items || [],
      paymentHistory: histRes.items || [],
      overview,
      myPlot,
      deliveries,
      welcomeBasket: overview?.welcomeBasket || null,
      supportFaq: support.faq || [],
      supportContacts: support.contacts || [],
      netBanks: banks.items || [],
      notifiedPlots: (prev.catalogs.plots || [])
        .concat([])
        .filter((p) => p.notifyRequested)
        .map((p) => p.key),
    }))
    if (member) {
      saveSession({
        accessToken: undefined,
        refreshToken: undefined,
        member,
      })
    }
  }, [loadCatalogs])

  // Bootstrap session
  useEffect(() => {
    let alive = true

    const finishGuest = async (extra = {}) => {
      try {
        const plansRes = await plansApi.list()
        if (!alive) return
        patch({
          bootLoading: false,
          catalogs: {
            plots: [],
            plans: (plansRes.items || []).map(mapPlan),
            deliveryChargeFormatted: plansRes.deliveryChargeFormatted || '₹10,000',
            staplesShare: [],
            seasonalShare: [],
          },
          membershipFeeFormatted: '₹500',
          route: 'join',
          ...extra,
        })
      } catch {
        if (alive) patch({ bootLoading: false, route: 'join', ...extra })
      }
    }

    ;(async () => {
      if (!hasSession()) {
        await finishGuest()
        return
      }

      try {
        await loadMemberWorkspace()
      } catch (err) {
        clearSession()
        if (!alive) return
        if (err?.status === 401 || err?.code === 'UNAUTHORIZED') {
          forceLogout('Your session expired. Please log in again.')
        } else {
          await finishGuest({
            globalError: errMessage(err, 'Could not restore your session. Please log in again.'),
            route: 'login',
          })
        }
      }
    })()

    return () => {
      alive = false
    }
  }, [forceLogout, loadMemberWorkspace, patch])

  const loadMemberWorkspaceRef = useRef(loadMemberWorkspace)
  loadMemberWorkspaceRef.current = loadMemberWorkspace
  const forceLogoutRef = useRef(forceLogout)
  forceLogoutRef.current = forceLogout
  const memberReloadTimer = useRef(null)
  const scheduleMemberReload = () => {
    if (memberReloadTimer.current) clearTimeout(memberReloadTimer.current)
    memberReloadTimer.current = setTimeout(() => {
      void loadMemberWorkspaceRef.current().catch(() => undefined)
    }, 250)
  }

  useEffect(() => {
    if (state.route !== 'app' || !state.isMember) {
      disconnectRealtime()
      return
    }

    connectRealtime({
      kind: 'member',
      getToken: getAccessToken,
      onReconnect: () => {
        void loadMemberWorkspaceRef.current().catch(() => undefined)
      },
    })

    const unsubscribe = subscribeRealtime(REALTIME_EVENTS, (event, payload) => {
      if (event === 'customer:deleted') {
        forceLogoutRef.current('Your account has been deleted.')
        return
      }

      if (event.startsWith('customer:address:') && Array.isArray(payload.addresses)) {
        const addresses = payload.addresses.map(mapAddress).filter(Boolean)
        setState((prev) => {
          const def = addresses.find((a) => a.def) || addresses[0]
          return {
            ...prev,
            addresses,
            form: def
              ? { ...prev.form, address: def.line, city: def.city, pin: def.pin }
              : prev.form,
          }
        })
        return
      }

      if (
        (event === 'customer:profile_updated' || event === 'customer:updated') &&
        (payload.member || payload.profile)
      ) {
        const member = payload.member || {}
        const profile = payload.profile || {}
        const nextName = member.name || profile.name
        const nextEmail = member.email || profile.email
        const nextPhone = member.phoneDisplay || profile.phoneDisplay
        setState((prev) => {
          const nextMember = prev.member
            ? {
                ...prev.member,
                ...(nextName ? { name: nextName, firstName: String(nextName).trim().split(/\s+/)[0] } : {}),
                ...(nextEmail ? { email: nextEmail } : {}),
                ...(nextPhone ? { phoneDisplay: nextPhone } : {}),
              }
            : prev.member
          if (nextMember) saveSession({ member: nextMember })
          return {
            ...prev,
            member: nextMember,
            form:
              prev.profileMode === 'edit'
                ? prev.form
                : {
                    ...prev.form,
                    ...(nextName ? { name: nextName } : {}),
                    ...(nextEmail ? { email: nextEmail } : {}),
                  },
            sec: nextPhone ? { ...prev.sec, mobile: nextPhone } : prev.sec,
          }
        })
      }

      if (event === 'notification:created' && payload.notification) {
        setState((prev) => ({
          ...prev,
          notifications: [payload.notification, ...(prev.notifications || [])],
        }))
      }

      if (
        event.startsWith('payment') ||
        event.startsWith('subscription:') ||
        event === 'delivery:updated' ||
        event === 'basket:updated' ||
        event === 'plot:updated' ||
        event === 'crop:updated' ||
        event === 'cancellation:updated' ||
        event === 'payment_method:updated'
      ) {
        scheduleMemberReload()
      }
    })

    return () => {
      unsubscribe()
      if (memberReloadTimer.current) clearTimeout(memberReloadTimer.current)
    }
  }, [state.route, state.isMember])

  // OTP resend countdown
  useEffect(() => {
    const t = setInterval(() => {
      const l = stateRef.current.login
      if (l.step === 'code' && l.resendIn > 0) {
        setState((prev) => ({
          ...prev,
          login: { ...prev.login, resendIn: Math.max(0, prev.login.resendIn - 1) },
        }))
      }
    }, 1000)
    return () => clearInterval(t)
  }, [])

  const refreshSubsAndPlot = useCallback(async (subscriptionId) => {
    const [subsRes, myPlot, deliveries, overview, histRes] = await Promise.all([
      subscriptionsApi.list(),
      myPlotApi.get(subscriptionId).catch(() => null),
      deliveriesApi.list(subscriptionId).catch(() => null),
      overviewApi.get().catch(() => null),
      paymentsApi.history().catch(() => ({ items: [] })),
    ])
    const subs = (subsRes.items || []).map(mapSubscription)
    setState((prev) => ({
      ...prev,
      subs,
      activeSub: subscriptionId || subsRes.activeSubscriptionId || subs[0]?.id || null,
      myPlot,
      deliveries,
      overview,
      paymentHistory: histRes.items || [],
    }))
  }, [])

  const openPay = (ctx, _method, amount) => {
    patch({
      pay: {
        open: true,
        ctx,
        method: 'payment_request',
        view: 'form',
        amount,
        bank: '',
        savedCard: 'new',
        cardNo: '',
        cardName: '',
        cardExp: '',
        cardCvv: '',
        error: '',
        paymentId: null,
        result: null,
        nonRefundableAgreed: false,
      },
    })
  }

  const requestPayConfirm = () => {
    const p = stateRef.current.pay
    patch({ pay: { ...p, view: 'confirm', error: '', nonRefundableAgreed: false } })
  }

  const backPayConfirm = () => {
    const p = stateRef.current.pay
    patch({ pay: { ...p, view: 'form', error: '', nonRefundableAgreed: false } })
  }

  const agreePayNonRefundable = () => {
    const p = stateRef.current.pay
    if (p.nonRefundableAgreed) return
    patch({ pay: { ...p, nonRefundableAgreed: true, error: '' } })
  }

  const submitPay = async () => {
    const p = stateRef.current.pay
    if (!p.nonRefundableAgreed) {
      patch({
        pay: {
          ...p,
          view: 'confirm',
          error: 'Please confirm that you have read and agree to the non-refundable condition.',
        },
      })
      return
    }
    patch({ pay: { ...p, view: 'processing', error: '' }, actionLoading: true })
    const body = buildPaymentBody()
    const key = newIdempotencyKey()

    try {
      let result
      if (p.ctx === 'membership') {
        const registrationId = stateRef.current.registrationId
        if (!registrationId) throw new Error('Registration missing. Go back and continue from account details.')
        result = await membershipApi.pay({ registrationId, ...body }, key)
      } else if (p.ctx && p.ctx.indexOf('renew:') === 0) {
        const id = p.ctx.split(':')[1]
        result = await subscriptionsApi.renew(id, body, key)
      } else {
        const s = stateRef.current
        result = await paymentsApi.create(
          {
            context: 'lease',
            ...body,
            metadata: { plotKey: s.selectedPlot, planKey: s.selectedPlan },
          },
          key
        )
      }

      await new Promise((r) => setTimeout(r, 700))
      if (!stateRef.current.pay.open) return
      patch({
        actionLoading: false,
        pay: {
          ...stateRef.current.pay,
          view: 'success',
          paymentId: result.payment?.id || null,
          result,
        },
      })
    } catch (err) {
      patch({
        actionLoading: false,
        pay: {
          ...stateRef.current.pay,
          view: 'confirm',
          error: errMessage(err, 'Could not send payment request. Please try again.'),
        },
      })
    }
  }

  const payContinue = async () => {
    const s = stateRef.current
    const p = s.pay
    const result = p.result
    try {
      if (p.ctx === 'membership') {
        patch({
          pay: { ...p, open: false },
          joinStep: 3,
          isMember: false,
          pendingPayment: result?.payment || null,
        })
        window.scrollTo({ top: 0 })
      } else if (p.ctx && p.ctx.indexOf('renew:') === 0) {
        patch({ pay: { ...p, open: false } })
        await refreshSubsAndPlot(p.ctx.split(':')[1])
        const hist = await paymentsApi.history().catch(() => null)
        if (hist) patch({ paymentHistory: hist.items || [] })
      } else {
        // Lease request pending — stay on done with notice, no subscription yet
        const hist = await paymentsApi.history().catch(() => null)
        const payment = result?.payment
          ? {
              ...result.payment,
              plotKey: result.payment.plotKey || s.selectedPlot,
              planKey: result.payment.planKey || s.selectedPlan,
              context: result.payment.context || 'lease',
              status: result.payment.status || 'pending',
            }
          : null
        patch({
          pay: { ...p, open: false },
          leaseView: 'done',
          pendingPayment: payment,
          paymentHistory: hist?.items || stateRef.current.paymentHistory,
          globalError: '',
        })
        await loadCatalogs()
        window.scrollTo({ top: 0 })
      }
    } catch (err) {
      patch({ pay: { ...p, open: false }, globalError: errMessage(err) })
    }
  }

  const icon = (name, stroke, size) => <Icon name={name} stroke={stroke} size={size} />

  const view = useMemo(() => {
    const s = state
    const route = s.route
    const accent = ACCENT
    const displayName = memberDisplayName(s.member, s.form)
    const memberId = s.memberId || s.member?.id || '—'
    const plans = s.catalogs.plans || []
    const plots = s.catalogs.plots || []
    const hasPlot = s.subs.length > 0
    const leasedKeys = s.subs.map((x) => x.plotKey)
    const activeSub = s.subs.find((x) => x.id === s.activeSub) || s.subs[0] || null
    const actPlot =
      (s.myPlot?.plot && mapPlot(s.myPlot.plot)) ||
      (activeSub ? plots.find((p) => p.key === activeSub.plotKey) || null : null)
    const actPlan =
      (s.myPlot?.plan && mapPlan(s.myPlot.plan)) ||
      (activeSub ? plans.find((p) => p.key === activeSub.planKey) || null : null)
    const curPlan = plans.find((p) => p.key === s.selectedPlan) || plans[0] || {
      key: '',
      name: '',
      price: '',
      plots: '',
      size: '',
      total: '',
      features: [],
    }
    const curPlot = plots.find((p) => p.key === s.selectedPlot) || plots[0] || {
      key: '',
      name: '',
      region: '',
      size: '',
      crop: '',
      img: defaultHero(),
      status: 'soon',
    }

    const joinProgress = [
      { label: '01 · Account', step: 1 },
      { label: '02 · Payment', step: 2 },
      { label: '03 · Welcome', step: 3 },
    ].map((x) => ({
      label: x.label,
      bar: s.joinStep >= x.step ? '#1c3b2c' : '#d4d9c9',
      color: s.joinStep >= x.step ? '#1c3b2c' : '#9aa08d',
    }))

    const payMethods = [
      { key: 'card', label: 'Card' },
      { key: 'nb', label: 'Net banking' },
    ].map((m) => ({
      label: m.label,
      onSelect: () => patch({ payMethod: m.key }),
      style: `flex:1;padding:12px;border-radius:3px;font-size:14px;font-weight:600;cursor:pointer;background:${s.payMethod === m.key ? '#eef2e9' : '#faf8f2'};border:1px solid ${s.payMethod === m.key ? accent : '#d8cfb8'};color:#1c3b2c`,
    }))

    const tabs = [
      { key: 'overview', label: 'Overview', svg: 'grid', title: 'Overview' },
      { key: 'plots', label: 'Browse Plots', svg: 'pin', title: 'Browse Plots', dot: !hasPlot },
      { key: 'plot', label: 'My Plot', svg: 'leaf', title: hasPlot ? 'My Plot · ' + (actPlot ? actPlot.name : '') : 'My Plot' },
      { key: 'deliveries', label: 'Deliveries', svg: 'truck', title: 'Deliveries' },
      { key: 'sub', label: 'Subscription', svg: 'card', title: 'Subscription & Payments' },
      { key: 'settings', label: 'Settings', svg: 'gear', title: 'Settings' },
    ]
    const appNav = tabs.map((t) => ({
      label: t.label,
      dot: !!t.dot,
      iconEl: icon(t.svg, s.appTab === t.key ? '#f6f3ea' : '#a9b8a0', 19),
      onClick: () => patch(t.key === 'plots' ? { appTab: 'plots', leaseView: 'list' } : { appTab: t.key }),
      style: `display:flex;align-items:center;gap:12px;width:100%;text-align:left;background:${s.appTab === t.key ? 'rgba(217,180,95,.16)' : 'none'};border:none;color:${s.appTab === t.key ? '#f6f3ea' : '#a9b8a0'};padding:11px 12px;border-radius:4px;font-size:14px;font-weight:600;cursor:pointer;border-left:3px solid ${s.appTab === t.key ? accent : 'transparent'}`,
    }))
    const appTitle = s.appTab === 'notifs' ? 'Notifications' : (tabs.find((t) => t.key === s.appTab) || {}).title || 'Overview'

    const notifFeed = (s.notifications || []).map((n) => ({
      icon: n.icon || 'leaf',
      title: n.title,
      desc: n.description,
      time: relativeTime(n.createdAt),
      unread: n.unread,
      iconEl: icon(n.icon || 'leaf', '#2e5a41', 18),
      rowBg: n.unread ? '#eef2e9' : '#fff',
      onClick: async () => {
        if (n.unread) {
          try {
            await notificationsApi.markRead(n.id)
            setState((prev) => ({
              ...prev,
              notifications: prev.notifications.map((x) =>
                x.id === n.id ? { ...x, unread: false } : x
              ),
            }))
          } catch {
            /* ignore */
          }
        }
        const tab = n.deepLinkTab || 'overview'
        patch({ appTab: tab })
      },
    }))

    const leaseTeaser = (s.overview?.leaseTeaser || [
      { step: 1, title: 'Pick a 600 sq ft organic plot near you.' },
      { step: 2, title: 'Choose a plan for your family size.' },
      { step: 3, title: 'We farm it; harvest arrives weekly.' },
    ]).map((t, i) => ({
      n: String(t.step || i + 1).padStart(2, '0'),
      t: t.title,
    }))

    const growing = (s.myPlot?.growingNow || s.overview?.growingNow || []).map(mapGrowing)
    const heroPlotImg = s.myPlot?.heroImageUrl || s.heroPlotImg || defaultHero()
    const welcomeImg = s.welcomeBasket?.imageUrl || s.welcomeImg || defaultWelcomeImg()

    const q = s.plotSearch.trim().toLowerCase()
    const inState = (p) => s.filterState === 'all' || p.state === s.filterState
    const inDist = (p) => s.filterDistrict === 'all' || p.district === s.filterDistrict
    const inCity = (p) => s.filterCity === 'all' || p.city === s.filterCity
    const uniq = (arr) => arr.filter((v, i) => arr.indexOf(v) === i)
    const stateOptions = [{ value: 'all', label: 'All states' }].concat(
      uniq(plots.map((p) => p.state)).map((v) => ({ value: v, label: v }))
    )
    const districtOptions = [{ value: 'all', label: 'All districts' }].concat(
      uniq(plots.filter(inState).map((p) => p.district)).map((v) => ({ value: v, label: v }))
    )
    const cityOptions = [{ value: 'all', label: 'All cities' }].concat(
      uniq(plots.filter((p) => inState(p) && inDist(p)).map((p) => p.city)).map((v) => ({
        value: v,
        label: v,
      }))
    )
    const geoScope = plots.filter((p) => inState(p) && inDist(p) && inCity(p))
    const geoTotal = geoScope.reduce((a, p) => a + (p.total || 0), 0)
    const geoAvail = geoScope.reduce((a, p) => a + (p.available || 0), 0)
    const inStatus = (p) => s.filterStatus === 'all' || p.status === s.filterStatus
    const filtered = geoScope.filter(
      (p) =>
        inStatus(p) &&
        (!q || (p.name + ' ' + p.region + ' ' + p.crop).toLowerCase().includes(q))
    )
    const stMeta = {
      available: {
        label: 'Available',
        badge: 'background:#eef2e9;color:#2e5a41;border:1px solid #cdd5be',
        btn: 'View & lease →',
        btnCss: 'background:#1c3b2c;color:#f6f3ea',
        dim: false,
      },
      soon: {
        label: 'Coming soon',
        badge: 'background:#f3efe4;color:#8a7a4e;border:1px solid #e0d9c6',
        btn: 'Notify me',
        btnCss: 'background:#eef2e9;color:#1c3b2c',
        dim: true,
      },
      booked: {
        label: 'Unavailable',
        badge: 'background:#f4e9e6;color:#a15642;border:1px solid #e6cfc7',
        btn: 'Currently unavailable',
        btnCss: 'background:#f0ece0;color:#9aa08d;cursor:not-allowed',
        dim: true,
      },
    }
    const pendingLeaseByPlot = {}
    ;(s.paymentHistory || []).forEach((pay) => {
      if (pay.context === 'lease' && pay.status === 'pending' && pay.plotKey) {
        pendingLeaseByPlot[pay.plotKey] = pay
      }
    })
    if (s.pendingPayment?.status === 'pending' && s.pendingPayment.plotKey) {
      const histMatch = (s.paymentHistory || []).find((p) => p.id === s.pendingPayment.id)
      if (!histMatch || histMatch.status === 'pending') {
        pendingLeaseByPlot[s.pendingPayment.plotKey] = {
          ...pendingLeaseByPlot[s.pendingPayment.plotKey],
          ...s.pendingPayment,
        }
      }
    }
    const pendingOnSelectedPlot = pendingLeaseByPlot[s.selectedPlot] || null
    const pendingPlanKeyOnSelected = pendingOnSelectedPlot?.planKey || null

    const plotList = filtered.map((p) => {
      const leased = leasedKeys.includes(p.key) || p.leasedByMe
      const pendingLease = pendingLeaseByPlot[p.key]
      const notified = (s.notifiedPlots || []).includes(p.key) || p.notifyRequested
      const m = leased
        ? {
            label: 'Leased by you',
            badge: 'background:#e7efe8;color:#2e5a41;border:1px solid #bcd2c0',
            btn: 'Already leased',
            btnCss: 'background:#eef2e9;color:#9aa08d',
            dim: true,
          }
        : pendingLease
          ? {
              label: 'Awaiting activation',
              badge: 'background:#f7ecd4;color:#8a5a12;border:1px solid #e6d3a4',
              btn: 'View plan status →',
              btnCss: 'background:#8a5a12;color:#fff8e8',
              dim: false,
            }
          : stMeta[p.status] || stMeta.soon
      const avail = p.status === 'available' && !leased && !pendingLease
      const canViewPending = Boolean(pendingLease && !leased)
      const isSoon = p.status === 'soon' && !leased && !pendingLease
      const btnLabel = isSoon && notified ? "✓ We'll notify you" : m.btn
      return {
        ...p,
        statusLabel: m.label,
        badgeStyle: `position:absolute;top:12px;right:12px;font-size:11px;font-weight:600;padding:4px 10px;border-radius:20px;${m.badge}`,
        cardStyle: `background:#fff;border:1px solid #e4ded0;border-radius:8px;overflow:hidden;${m.dim ? 'opacity:.78' : ''}`,
        btnLabel,
        btnStyle: `width:100%;margin-top:16px;padding:12px;border-radius:2px;font-weight:600;font-size:14px;cursor:${avail || canViewPending || (isSoon && !notified) ? 'pointer' : 'default'};border:none;${isSoon && notified ? 'background:#eef2e9;color:#2e5a41' : m.btnCss}`,
        onSelect: avail
          ? () => patch({ selectedPlot: p.key, leaseView: 'detail' })
          : canViewPending
            ? () =>
                patch({
                  selectedPlot: p.key,
                  selectedPlan: pendingLease.planKey || s.selectedPlan,
                  leaseView: 'plan',
                  pendingPayment: pendingLease,
                })
          : isSoon && !notified
            ? async () => {
                try {
                  await plotsApi.notifyMe(p.key)
                  patch({ notifiedPlots: (s.notifiedPlots || []).concat(p.key) })
                } catch (err) {
                  patch({ globalError: errMessage(err) })
                }
              }
            : () => {},
      }
    })

    const selPlotFacts = [
      { k: 'Plot size', v: curPlot.size },
      { k: 'Location', v: curPlot.region },
      { k: 'Crop cycle', v: curPlot.crop },
      { k: 'Soil', v: curPlot.soil || 'Certified organic' },
      { k: 'Status', v: pendingOnSelectedPlot ? 'Waiting for activation' : 'Ready to plant' },
    ]
    const leasePlanCards = plans.map((p) => {
      const awaitingActivation = pendingPlanKeyOnSelected === p.key
      const plotPending = Boolean(pendingOnSelectedPlot)
      const selected = s.selectedPlan === p.key
      const locked = plotPending
      return {
        ...p,
        checked: selected,
        radio: selected ? '#1c3b2c' : '#c3bba6',
        awaitingActivation,
        awaitingMessage: awaitingActivation ? 'Waiting for your plan activation' : '',
        onSelect: locked ? () => {} : () => patch({ selectedPlan: p.key }),
        cardStyle: `position:relative;text-align:left;background:${awaitingActivation ? '#faf6eb' : '#fff'};border:1px solid ${awaitingActivation ? '#e6d3a4' : selected ? accent : '#e4ded0'};border-radius:8px;padding:24px 22px;cursor:${locked ? 'default' : 'pointer'};opacity:${locked && !awaitingActivation ? '.55' : '1'};box-shadow:${selected && !locked ? '0 12px 34px -20px rgba(28,59,44,.5)' : 'none'}`,
      }
    })
    const totalNum = curPlan.total || s.quote?.totalFormatted || ''
    const reviewRows = [
      { k: 'Plot', v: curPlot.name + ' · ' + curPlot.region },
      { k: 'Plan', v: curPlan.name + ' (' + curPlan.plots + ')' },
      { k: 'Annual subscription', v: curPlan.price },
      { k: 'Delivery charge (across TN)', v: s.catalogs.deliveryChargeFormatted || '₹10,000' },
    ]

    const myPlotFacts =
      s.myPlot?.facts ||
      (actPlan && actPlot
        ? [
            { k: 'Plot ID', v: actPlot.name },
            { k: 'Size', v: actPlan.size + ' (' + actPlan.plots + ')' },
            { k: 'Farm', v: actPlot.region },
            { k: 'Your farmer', v: s.myPlot?.farmer?.name || 'Murugan V.' },
            { k: 'Plan', v: actPlan.name },
            { k: 'Cycle', v: activeSub ? activeSub.start + ' – ' + activeSub.end : '' },
          ]
        : [])

    const deliverySteps = (s.deliveries?.currentWeek?.tracking || []).map((d) => ({
      title: d.title,
      time: dateOnlyTrackingLabel(d.timeLabel || d.time),
      done: d.done,
      active: d.active,
    }))
    const basket = (s.deliveries?.currentWeek?.basket || []).map(mapBasketItem)
    const schedule = (s.deliveries?.schedule || []).map((w) => {
      const cancelled = w.cancelled
      const locked = w.locked || cancelled
      return {
        label: w.label,
        date: w.dateLabel || w.date,
        note: cancelled ? 'Cancelled' : locked ? (w.note || 'Planned') + ' · locked' : w.note || 'Planned',
        locked,
        cardStyle: `border:1px solid ${cancelled ? '#e6cfc7' : '#e4ded0'};border-radius:6px;padding:14px;background:${cancelled ? '#f7efec' : locked ? '#eef2e9' : '#faf8f2'}`,
        btnLabel: cancelled ? 'Cancelled' : locked ? 'Locked' : 'Cancel',
        btnStyle: `width:100%;margin-top:12px;padding:8px;border-radius:2px;font-size:12px;font-weight:600;border:1px solid ${locked || cancelled ? '#dcd6c6' : '#e3b7ab'};background:none;color:${locked || cancelled ? '#9aa08d' : '#b0361f'};cursor:${locked || cancelled ? 'not-allowed' : 'pointer'}`,
        onCancel:
          locked || cancelled || !w.cancellable
            ? () => {}
            : () => patch({ confirm: 'cancelWk:' + w.id }),
      }
    })

    const subCards = s.subs.map((sub) => {
      const pl = plots.find((p) => p.key === sub.plotKey) || sub.plot || plots[0]
      const pn2 = plans.find((p) => p.key === sub.planKey) || sub.plan || plans[0]
      const canRequestPayment = !sub.billPaid && isOnOrAfterCalendarDate(sub.nextBillDue)
      return {
        id: sub.id,
        isActive: activeSub && sub.id === activeSub.id,
        title: pl?.name || sub.plotKey,
        sub: (pn2?.name || '') + ' · ' + (pn2?.plots || ''),
        rows: [
          { k: 'Plan', v: (pn2?.name || '') + ' · ' + (pn2?.price || '') + '/yr' },
          { k: 'Plot', v: (pl?.name || '') + ' · ' + (pl?.region || '') },
          { k: 'Subscription cycle', v: sub.start + ' – ' + sub.end },
          { k: 'Status', v: 'Active' },
          { k: 'Billing', v: 'Manual · pay each cycle' },
          {
            k: 'Next bill',
            v: sub.billPaid
              ? 'Paid · next cycle ' + sub.end
              : (sub.nextBillAmountFormatted || sub.total) + ' due ' + (sub.nextBillDue || sub.end),
          },
        ],
        billPaid: sub.billPaid,
        canRequestPayment,
        cardStyle: `background:#fff;border:1px solid ${activeSub && sub.id === activeSub.id ? accent : '#e4ded0'};border-radius:8px;padding:24px;margin-bottom:16px`,
        onView: async () => {
          patch({ activeSub: sub.id, appTab: 'plot', actionLoading: true })
          try {
            await meApi.setActiveSubscription(sub.id)
            await refreshSubsAndPlot(sub.id)
          } catch (err) {
            patch({ globalError: errMessage(err) })
          } finally {
            patch({ actionLoading: false })
          }
        },
        onPayBill: canRequestPayment
          ? () => openPay('renew:' + sub.id, 'card', sub.nextBillAmountFormatted || sub.total)
          : () => {},
        payLabel: sub.billPaid ? 'Bill paid' : 'Request payment',
        payStyle: `flex:0 0 auto;border:none;padding:11px 20px;border-radius:2px;font-weight:600;font-size:14px;cursor:${sub.billPaid ? 'default' : 'pointer'};background:${sub.billPaid ? '#eef2e9' : '#1c3b2c'};color:${sub.billPaid ? '#9aa08d' : '#f6f3ea'}`,
      }
    })

    const payments = (s.paymentHistory.length
      ? s.paymentHistory
          .filter((p) => p.status === 'succeeded')
          .map((p) => ({
            label: p.label,
            date: p.date,
            amount: p.amountFormatted,
            ref: p.ref,
          }))
      : []
    ).map((p) => ({
      ...p,
      onReceipt: () => downloadReceipt(p, s.form.name),
    }))

    const staplesShare = (s.catalogs.staplesShare || []).map((v, i) => ({
      no: i + 1,
      name: Array.isArray(v) ? v[0] : v.name,
      qty: Array.isArray(v) ? v[1] : v.qty,
      rowStyle: `display:flex;align-items:center;padding:12px 18px;font-size:14px;border-top:1px solid ${i === 0 ? 'transparent' : '#efe9db'}`,
    }))
    const seasonalShare = (s.catalogs.seasonalShare || []).map((v, i) => ({
      no: i + 1,
      name: Array.isArray(v) ? v[0] : v.name,
      qty: Array.isArray(v) ? v[1] : v.qty,
      rowStyle: `display:flex;align-items:center;padding:12px 18px;font-size:14px;border-top:1px solid ${i === 0 ? 'transparent' : '#efe9db'}`,
    }))

    const plotGallery = (() => {
      const fromPlot = (curPlot.gallery || []).map((g, i) =>
        typeof g === 'string' ? { label: `view ${i + 1}`, img: g } : { label: g.label || `view ${i + 1}`, img: g.img || g.imageUrl }
      )
      if (fromPlot.length) return fromPlot
      const fromMyPlot = (s.myPlot?.gallery || []).map((g, i) => ({
        label: g.label || `view ${i + 1}`,
        img: g.imageUrl || g.img || g,
      }))
      if (fromMyPlot.length) return fromMyPlot
      return defaultGallery()
    })()

    return {
      bootLoading: s.bootLoading,
      actionLoading: s.actionLoading,
      globalError: s.globalError,
      clearGlobalError: () => patch({ globalError: '' }),
      isJoin: route === 'join',
      isApp: route === 'app',
      isLogin: route === 'login',

      goHome: async () => {
        try {
          const rt = getRefreshToken()
          if (hasSession()) await authApi.logout(rt).catch(() => {})
        } finally {
          forceLogout()
          window.scrollTo({ top: 0 })
        }
      },
      goLogin: () => {
        patch({
          route: 'login',
          login: { ...initialState.login },
          form: { ...initialState.form },
          member: null,
          memberId: '',
          joinErrors: {},
          globalError: '',
        })
        window.scrollTo({ top: 0 })
      },
      login: s.login,
      otpStepEmail: s.login.step === 'email',
      otpStepCode: s.login.step === 'code',
      otpTarget: s.login.email || 'you@email.com',
      otpError: s.login.error,
      otpNotice: s.login.notice,
      otpLocked: s.login.locked,
      demoOtp: s.login.demoOtp,
      resendIn: s.login.resendIn,
      resendReady: s.login.resendIn === 0,
      resendWaiting: s.login.resendIn > 0,
      otpInputStyle: `width:100%;margin-top:6px;padding:13px 14px;border:1px solid ${s.login.error ? '#d38b78' : '#d8cfb8'};border-radius:3px;font-size:20px;letter-spacing:.4em;text-align:center;background:${s.login.error ? '#fdf1ed' : '#faf8f2'}`,
      verifyStyle: `width:100%;margin-top:18px;color:#f6f3ea;border:none;padding:15px;border-radius:2px;font-weight:600;font-size:16px;background:${s.login.locked || s.actionLoading ? '#a9b0a0' : '#1c3b2c'};cursor:${s.login.locked || s.actionLoading ? 'not-allowed' : 'pointer'}`,
      onLoginEmail: (e) => patch({ login: { ...s.login, email: e.target.value, error: '' } }),
      onLoginOtp: (e) =>
        patch({
          login: {
            ...s.login,
            otp: e.target.value.replace(/[^0-9]/g, '').slice(0, 4),
            error: '',
          },
        }),
      sendOtp: async () => {
        if (!isValidEmail(s.login.email)) {
          patch({ login: { ...s.login, error: 'Enter a valid email address.' } })
          return
        }
        patch({ actionLoading: true })
        try {
          const res = await authApi.sendOtp(s.login.email.trim())
          patch({
            actionLoading: false,
            login: {
              ...s.login,
              step: 'code',
              otp: '',
              attempts: 0,
              error: '',
              notice: res.notice || `Code sent to ${res.email || s.login.email}.`,
              locked: false,
              resendIn: otpResendWaitSeconds(res),
              resends: 0,
              demoOtp: res.demoOtp || '',
              email: res.email || s.login.email.trim(),
            },
          })
        } catch (err) {
          patch({
            actionLoading: false,
            login: { ...s.login, error: errMessage(err, 'Could not send OTP.') },
          })
        }
      },
      resendOtp: async () => {
        const l = s.login
        if (l.resendIn > 0) return
        patch({ actionLoading: true })
        try {
          const res = await authApi.resendOtp(l.email)
          patch({
            actionLoading: false,
            login: {
              ...l,
              otp: '',
              attempts: 0,
              error: '',
              locked: false,
              resendIn: otpResendWaitSeconds(res),
              notice: res.notice || 'A new code has been sent to your email.',
              demoOtp: res.demoOtp || l.demoOtp,
            },
          })
        } catch (err) {
          const retry = err.details?.[0]?.retryAfterSeconds
          patch({
            actionLoading: false,
            login: {
              ...l,
              error: errMessage(err),
              resendIn: retry || l.resendIn,
            },
          })
        }
      },
      backToEmail: () =>
        patch({
          login: {
            ...s.login,
            step: 'email',
            otp: '',
            error: '',
            notice: '',
            attempts: 0,
            locked: false,
            resendIn: 0,
            resends: 0,
            demoOtp: '',
          },
        }),
      doLogin: async () => {
        const l = s.login
        if (l.locked || s.actionLoading) return
        if (!isValidOtp(l.otp)) {
          patch({ login: { ...l, error: 'Enter the 4-digit code.' } })
          return
        }
        patch({ actionLoading: true })
        try {
          const res = await authApi.verifyOtp(l.email, l.otp)
          const loggedInMember = res.member || null
          saveSession({
            accessToken: res.accessToken,
            refreshToken: res.refreshToken,
            member: loggedInMember,
          })
          // Sync sidebar identity immediately from the account tied to this login email
          patch({
            member: loggedInMember,
            memberId: loggedInMember?.id || loggedInMember?.memberCode?.replace('CHEDI-', '') || '',
            form: mapMemberToForm(loggedInMember, loggedInMember),
            isMember: true,
          })
          await loadMemberWorkspace()
          window.scrollTo({ top: 0 })
        } catch (err) {
          const locked = err.code === 'OTP_LOCKED'
          patch({
            actionLoading: false,
            login: {
              ...l,
              attempts: l.attempts + 1,
              locked,
              error: errMessage(err, 'Incorrect code.'),
              notice: '',
            },
          })
        }
      },
      goJoin: () => {
        clearSession()
        patch({
          route: 'join',
          joinStep: 1,
          registrationId: null,
          joinErrors: {},
          joinFormError: '',
          form: { name: '', phone: '', email: '', address: '', city: '', pin: '' },
          isMember: false,
          subs: [],
        })
        window.scrollTo({ top: 0 })
      },

      joinProgress,
      payMethods,
      displayName,
      memberId,
      joinStep1: s.joinStep === 1,
      joinStep2: s.joinStep === 2,
      joinStep3: s.joinStep === 3,
      joinErrors: s.joinErrors,
      nextJoin: async () => {
        const errors = validateJoinForm(s.form)
        if (Object.keys(errors).length) {
          patch({
            joinErrors: errors,
            joinFormError: 'Please fix the highlighted fields below and try again.',
          })
          return
        }
        patch({ actionLoading: true, joinErrors: {}, joinFormError: '', globalError: '' })
        try {
          const res = await membershipApi.register({
            name: s.form.name.trim(),
            phone: s.form.phone.trim(),
            email: s.form.email.trim(),
            address: {
              line: s.form.address.trim(),
              city: s.form.city.trim(),
              pin: s.form.pin.trim(),
              label: 'Home',
            },
          })
          patch({
            actionLoading: false,
            joinStep: 2,
            registrationId: res.registrationId,
            membershipFeeFormatted: res.membershipFeeFormatted || '₹500',
            joinFormError: '',
            joinErrors: {},
          })
        } catch (err) {
          const fieldErrors = mapApiFormErrors(err, {
            'address.line': 'address',
            'address.city': 'city',
            'address.pin': 'pin',
          })
          const message = errMessage(err, 'Could not create your account. Please try again.')
          patch({
            actionLoading: false,
            joinErrors: fieldErrors,
            joinFormError: message,
            globalError: Object.keys(fieldErrors).length ? '' : message,
          })
        }
      },
      prevJoin: () => patch({ joinStep: 1, joinFormError: '' }),
      payMembership: () =>
        openPay('membership', s.payMethod === 'nb' ? 'nb' : 'card', s.membershipFeeFormatted || '₹500'),
      enterApp: async () => {
        patch({ actionLoading: true })
        try {
          await loadMemberWorkspace()
          window.scrollTo({ top: 0 })
        } catch (err) {
          patch({ actionLoading: false, globalError: errMessage(err) })
        }
      },
      onName: (e) =>
        patch({
          form: { ...s.form, name: e.target.value },
          joinErrors: { ...s.joinErrors, name: '' },
          joinFormError: '',
        }),
      onPhone: (e) =>
        patch({
          form: { ...s.form, phone: sanitizePhoneInput(e.target.value) },
          joinErrors: { ...s.joinErrors, phone: '' },
          joinFormError: '',
        }),
      onEmail: (e) =>
        patch({
          form: { ...s.form, email: e.target.value },
          joinErrors: { ...s.joinErrors, email: '' },
          joinFormError: '',
        }),
      onAddress: (e) =>
        patch({
          form: { ...s.form, address: e.target.value },
          joinErrors: { ...s.joinErrors, address: '' },
          joinFormError: '',
        }),
      onCity: (e) =>
        patch({
          form: { ...s.form, city: e.target.value },
          joinErrors: { ...s.joinErrors, city: '' },
          joinFormError: '',
        }),
      onPin: (e) =>
        patch({
          form: { ...s.form, pin: e.target.value.replace(/[^0-9]/g, '').slice(0, 6) },
          joinErrors: { ...s.joinErrors, pin: '' },
          joinFormError: '',
        }),
      form: s.form,
      joinFormError: s.joinFormError,

      appNav,
      appTitle,
      memberStatus: hasPlot
        ? s.subs.length > 1
          ? 'Subscribed · ' + s.subs.length + ' plots'
          : 'Subscribed · active'
        : 'Member · no plot yet',
      plotBadge: hasPlot
        ? s.subs.length > 1
          ? s.subs.length + ' plots leased'
          : 'Plot ' + (actPlot ? actPlot.name : '')
        : 'No plot leased',
      noPlot: !hasPlot,
      hasPlotV: hasPlot,
      plotName: actPlot ? actPlot.name : curPlot.name,
      plotSizeLabel: actPlan ? actPlan.size : curPlan.size,
      welcomeEta: s.welcomeBasket?.etaLabel || 'Soon',
      welcomeAddr: s.form.city || 'your city',
      welcomeOpen: s.welcomeTrack,
      openWelcome: () => patch({ welcomeTrack: true }),
      closeWelcome: () => patch({ welcomeTrack: false }),
      logoutOpen: s.logoutConfirm,
      askLogout: () => patch({ logoutConfirm: true }),
      cancelLogout: () => patch({ logoutConfirm: false }),
      welcomeSteps: (s.welcomeBasket?.tracking || [
        { title: 'Order confirmed', timeLabel: 'Membership activated', done: true },
        { title: 'Packed at farm', timeLabel: 'In progress', done: false, active: true },
        { title: 'Out for delivery', timeLabel: 'Expected ' + (s.welcomeBasket?.etaLabel || 'soon'), done: false },
        { title: 'Delivered to your door', timeLabel: 'Expected ' + (s.welcomeBasket?.etaLabel || 'soon'), done: false },
      ]).map((step) => ({
        title: step.title,
        time: step.timeLabel || step.time,
        done: step.done,
        active: step.active,
      })),
      tabOverview: s.appTab === 'overview',
      tabPlots: s.appTab === 'plots',
      tabPlot: s.appTab === 'plot',
      tabDeliveries: s.appTab === 'deliveries',
      tabSub: s.appTab === 'sub',
      tabSettings: s.appTab === 'settings',
      goPlots: async () => {
        patch({ appTab: 'plots', leaseView: 'list', actionLoading: true })
        try {
          const hist = await paymentsApi.history().catch(() => null)
          const nextHistory = hist?.items || stateRef.current.paymentHistory
          const stillPending = (nextHistory || []).some(
            (p) =>
              p.context === 'lease' &&
              p.status === 'pending' &&
              p.id === stateRef.current.pendingPayment?.id
          )
          patch({
            actionLoading: false,
            paymentHistory: nextHistory,
            pendingPayment: stillPending ? stateRef.current.pendingPayment : null,
          })
        } catch {
          patch({ actionLoading: false })
        }
      },
      goOverview: () => patch({ appTab: 'overview' }),
      goMyPlot: () => patch({ appTab: 'plot' }),
      goDeliveries: () => patch({ appTab: 'deliveries' }),
      goNotifs: () => patch({ appTab: 'notifs' }),
      tabNotifs: s.appTab === 'notifs',
      notifFeed,
      notifEmpty: notifFeed.length === 0,
      notifHasItems: notifFeed.length > 0,
      clearNotifs: async () => {
        try {
          await notificationsApi.clear()
          patch({ notifications: [] })
        } catch (err) {
          patch({ globalError: errMessage(err) })
        }
      },
      leaseTeaser,
      growing,
      heroPlotImg,
      welcomeImg,
      selPlotImg: curPlot.img,

      leaseList: s.leaseView === 'list',
      leaseDetail: s.leaseView === 'detail',
      leasePlan: s.leaseView === 'plan',
      leaseReview: s.leaseView === 'review',
      leaseDone: s.leaseView === 'done',
      plotList,
      plotEmpty: plotList.length === 0,
      plotSearch: s.plotSearch,
      geoTotal,
      geoAvail,
      onPlotSearch: (e) => patch({ plotSearch: e.target.value }),
      clearPlotSearch: () =>
        patch({
          plotSearch: '',
          filterState: 'all',
          filterDistrict: 'all',
          filterCity: 'all',
          filterStatus: 'all',
        }),
      statusFilters: [
        { k: 'all', label: 'All' },
        { k: 'available', label: 'Available' },
        { k: 'soon', label: 'Coming soon' },
        { k: 'booked', label: 'Unavailable' },
      ].map((f) => ({
        label: f.label,
        onClick: () => patch({ filterStatus: f.k }),
        style: `padding:8px 15px;border-radius:20px;font-size:13px;font-weight:600;cursor:pointer;background:${s.filterStatus === f.k ? '#1c3b2c' : '#fff'};color:${s.filterStatus === f.k ? '#f6f3ea' : '#1c3b2c'};border:1px solid ${s.filterStatus === f.k ? '#1c3b2c' : '#d8cfb8'}`,
      })),
      filterState: s.filterState,
      filterDistrict: s.filterDistrict,
      filterCity: s.filterCity,
      stateOptions,
      districtOptions,
      cityOptions,
      onFilterState: (e) =>
        patch({ filterState: e.target.value, filterDistrict: 'all', filterCity: 'all' }),
      onFilterDistrict: (e) => patch({ filterDistrict: e.target.value, filterCity: 'all' }),
      onFilterCity: (e) => patch({ filterCity: e.target.value }),
      selPlotName: curPlot.name,
      selPlotFacts,
      plotGallery,
      leasePlanCards,
      leasePlanPending: Boolean(pendingOnSelectedPlot),
      leaseAwaitingPlanKey: pendingPlanKeyOnSelected,
      reviewRows,
      staplesShare,
      seasonalShare,
      reviewTotal: totalNum,
      leasePayOptions: (() => {
        const sel = s.leasePay || (s.payments.find((p) => p.primary) || s.payments[0] || {}).id
        return s.payments.map((p) => ({
          kind: p.kind,
          label: p.label,
          checked: p.id === sel,
          onSelect: () => patch({ leasePay: p.id }),
          rowStyle: `display:flex;align-items:center;gap:12px;width:100%;text-align:left;padding:14px 16px;border-radius:6px;cursor:pointer;background:${p.id === sel ? '#eef2e9' : '#faf8f2'};border:1px solid ${p.id === sel ? accent : '#e4ded0'}`,
          radio: p.id === sel ? '#1c3b2c' : '#c3bba6',
        }))
      })(),
      goPayMethods: () => patch({ appTab: 'settings', settingsView: 'payments' }),
      goProfile: () =>
        patch({
          appTab: 'settings',
          settingsView: 'profile',
          addrEdit: null,
          payAdd: null,
          saved: '',
          profileMode: 'view',
          addrErrors: {},
          draftErrors: {},
        }),
      backToList: () => patch({ leaseView: 'list' }),
      toDetail: () => patch({ leaseView: 'detail' }),
      toPlan: async () => {
        const planKey = pendingPlanKeyOnSelected || s.selectedPlan
        patch({
          leaseView: 'plan',
          selectedPlan: planKey,
          pendingPayment: pendingOnSelectedPlot || s.pendingPayment,
          actionLoading: true,
        })
        try {
          const shares = await plansApi.produceShares(planKey)
          patch({
            actionLoading: false,
            catalogs: {
              ...s.catalogs,
              staplesShare: shares.staples || [],
              seasonalShare: shares.seasonal || [],
            },
          })
        } catch {
          patch({ actionLoading: false, leaseView: 'plan' })
        }
      },
      toReview: async () => {
        if (pendingOnSelectedPlot) {
          patch({
            globalError:
              'This plan is waiting for activation. You cannot book it again until the admin marks your payment as Paid.',
          })
          return
        }
        patch({ actionLoading: true })
        try {
          const quote = await subscriptionsApi.quote(s.selectedPlot, s.selectedPlan)
          patch({ actionLoading: false, leaseView: 'review', quote })
        } catch (err) {
          patch({ actionLoading: false, globalError: errMessage(err) })
        }
      },
      activateSub: () => {
        if (pendingOnSelectedPlot) {
          patch({
            globalError:
              'This plan is waiting for activation. You cannot purchase it again until the admin approves your payment.',
          })
          return
        }
        const sel = s.leasePay || (s.payments.find((p) => p.primary) || s.payments[0] || {}).id
        const m = s.payments.find((p) => p.id === sel)
        openPay('lease', m && m.kind === 'Card' ? 'card' : 'nb', totalNum)
      },

      payOpen: s.pay.open,
      payAmount: s.pay.amount,
      payForm: s.pay.view === 'form',
      payConfirm: s.pay.view === 'confirm',
      payProcessing: s.pay.view === 'processing',
      paySuccess: s.pay.view === 'success',
      payError: s.pay.error,
      payNonRefundableAgreed: Boolean(s.pay.nonRefundableAgreed),
      requestPayConfirm: () => requestPayConfirm(),
      backPayConfirm: () => backPayConfirm(),
      agreePayNonRefundable: () => agreePayNonRefundable(),
      paySuccessMessage:
        s.pay.result?.notice ||
        (s.pay.result?.payment?.ref
          ? `Request ${s.pay.result.payment.ref} submitted for ${s.pay.amount}. Admin will email you to collect payment, then mark it Paid.`
          : ''),
      submitPay: () => submitPay(),
      payContinue: () => payContinue(),
      payCancel: () => patch({ pay: { ...s.pay, open: false } }),
      stopProp: (e) => e.stopPropagation(),
      leaseAwaitingPayment: Boolean(
        s.leaseView === 'done' &&
          (pendingOnSelectedPlot ||
            (s.pendingPayment && s.pendingPayment.status === 'pending'))
      ),
      pendingPaymentRef: (pendingOnSelectedPlot || s.pendingPayment)?.ref || '',
      pendingPlanName:
        plans.find((p) => p.key === (pendingPlanKeyOnSelected || s.pendingPayment?.planKey))?.name ||
        curPlan.name ||
        'your plan',

      myPlotFacts,
      deliverySteps,
      basket,
      schedule,
      subCards,
      payments,
      multiPlot: s.subs.length > 1,
      plotSwitch: s.subs.map((sub) => {
        const pl = plots.find((p) => p.key === sub.plotKey) || plots[0]
        const on = activeSub && sub.id === activeSub.id
        return {
          name: pl?.name || sub.plotKey,
          onClick: async () => {
            patch({ activeSub: sub.id, actionLoading: true })
            try {
              await meApi.setActiveSubscription(sub.id)
              await refreshSubsAndPlot(sub.id)
            } catch (err) {
              patch({ globalError: errMessage(err) })
            } finally {
              patch({ actionLoading: false })
            }
          },
          style: `padding:8px 16px;border-radius:20px;font-size:13px;font-weight:600;cursor:pointer;background:${on ? '#1c3b2c' : '#fff'};color:${on ? '#f6f3ea' : '#1c3b2c'};border:1px solid ${on ? '#1c3b2c' : '#d8cfb8'}`,
        }
      }),
      leaseAnother: () => patch({ appTab: 'plots', leaseView: 'list' }),
      confirmOpen: !!s.confirm,
      confirmTitle: 'Cancel this delivery?',
      confirmBody:
        'This upcoming weekly delivery will be cancelled. You can cancel deliveries up to 2 weeks in advance; the next two weeks stay locked.',
      confirmLabel: 'Cancel delivery',
      confirmYesStyle:
        'flex:1;border:none;padding:13px;border-radius:2px;font-weight:600;font-size:15px;cursor:pointer;color:#f6f3ea;background:#b0361f',
      confirmNo: () => patch({ confirm: null }),
      confirmYes: async () => {
        const c = s.confirm || ''
        if (c.indexOf('cancelWk:') === 0) {
          const id = c.split(':')[1]
          try {
            await deliveriesApi.cancel(id, s.activeSub)
            const deliveries = await deliveriesApi.list(s.activeSub)
            patch({ deliveries, confirm: null })
          } catch (err) {
            patch({ confirm: null, globalError: errMessage(err) })
          }
        } else patch({ confirm: null })
      },

      subHeading: hasPlot
        ? s.subs.length > 1
          ? 'Your subscriptions (' + s.subs.length + ')'
          : 'Active subscription'
        : 'No active subscription',

      settingsNav: [
        { k: 'profile', label: 'Profile' },
        { k: 'address', label: 'Addresses' },
        { k: 'notifications', label: 'Notifications' },
        { k: 'payments', label: 'Payments' },
        { k: 'security', label: 'Login & security' },
        { k: 'support', label: 'Help & support' },
        { k: 'account', label: 'Account' },
      ].map((x) => ({
        label: x.label,
        onClick: () =>
          patch({
            settingsView: x.k,
            addrEdit: null,
            payAdd: null,
            saved: '',
            profileMode: 'view',
            addrErrors: {},
            draftErrors: {},
          }),
        style: `display:flex;align-items:center;justify-content:space-between;width:100%;text-align:left;background:${s.settingsView === x.k ? '#eef2e9' : 'none'};border:none;border-left:3px solid ${s.settingsView === x.k ? '#1c3b2c' : 'transparent'};color:#1c3b2c;padding:12px 16px;font-size:14px;font-weight:${s.settingsView === x.k ? '700' : '500'};cursor:pointer`,
      })),
      svProfile: s.settingsView === 'profile',
      svAddress: s.settingsView === 'address',
      svNotif: s.settingsView === 'notifications',
      svPayments: s.settingsView === 'payments',
      svSecurity: s.settingsView === 'security',
      svSupport: s.settingsView === 'support',
      svAccount: s.settingsView === 'account',
      savedProfile: s.saved === 'profile',
      savedNotif: s.saved === 'notifications',
      savedAddress: s.saved === 'address',
      savedSecurity: s.saved === 'security',
      profView: s.profileMode === 'view',
      profEdit: s.profileMode === 'edit',
      profOtp: s.profileMode === 'otp',
      draftName: s.draft.name,
      draftPhone: s.draft.phone,
      draftEmail: s.draft.email,
      draftErrors: s.draftErrors,
      profSaveLabel: s.actionLoading ? 'Saving…' : 'Save changes',
      profOtpVal: s.profOtpVal,
      profOtpErr: s.profOtpErr,
      profOtpError: s.profOtpError,
      profOtpStyle: `width:100%;padding:12px 14px;border:1px solid ${s.profOtpErr ? '#d38b78' : '#d8cfb8'};border-radius:3px;font-size:18px;letter-spacing:.3em;text-align:center;background:${s.profOtpErr ? '#fdf1ed' : '#faf8f2'}`,
      editProfile: () =>
        patch({
          profileMode: 'edit',
          draft: { ...s.form },
          draftErrors: {},
          profileFormError: '',
          profOtpVal: '',
          profOtpErr: false,
          saved: '',
        }),
      cancelProfile: () =>
        patch({
          profileMode: 'view',
          profOtpVal: '',
          profOtpErr: false,
          draftErrors: {},
          profileFormError: '',
        }),
      onDraftName: (e) =>
        patch({
          draft: { ...s.draft, name: e.target.value },
          draftErrors: { ...s.draftErrors, name: '' },
          profileFormError: '',
        }),
      onDraftEmail: (e) =>
        patch({
          draft: { ...s.draft, email: e.target.value },
          draftErrors: { ...s.draftErrors, email: '' },
          profileFormError: '',
        }),
      submitProfile: async () => {
        const errors = validateProfileDraft(s.draft)
        if (Object.keys(errors).length) {
          patch({
            draftErrors: errors,
            profileFormError: 'Please fix the highlighted fields below and try again.',
          })
          return
        }
        patch({ actionLoading: true, profileFormError: '', draftErrors: {} })
        try {
          const res = await meApi.updateProfile({ name: s.draft.name.trim(), email: s.draft.email.trim() })
          const nextName = res.profile.name
          const nextEmail = res.profile.email
          const nextMember = s.member
            ? {
                ...s.member,
                name: nextName,
                email: nextEmail,
                firstName: String(nextName || '')
                  .trim()
                  .split(/\s+/)[0] || s.member.firstName,
              }
            : s.member
          patch({
            actionLoading: false,
            form: { ...s.form, name: nextName, email: nextEmail },
            member: nextMember,
            profileMode: 'view',
            profileFormError: '',
          })
          if (nextMember) saveSession({ member: nextMember })
          flash('profile')
        } catch (err) {
          const fieldErrors = mapApiFormErrors(err)
          const message = errMessage(err, 'Could not update your profile. Please try again.')
          patch({
            actionLoading: false,
            draftErrors: fieldErrors,
            profileFormError: message,
            globalError: Object.keys(fieldErrors).length ? '' : message,
          })
        }
      },
      profileFormError: s.profileFormError,
      onProfOtp: (e) =>
        patch({
          profOtpVal: e.target.value.replace(/[^0-9]/g, '').slice(0, 4),
          profOtpErr: false,
          profOtpError: '',
        }),
      verifyProfile: async () => {
        if (!isValidOtp(s.profOtpVal)) {
          patch({ profOtpErr: true, profOtpError: 'Enter the 4-digit code.' })
          return
        }
        try {
          const res = await meApi.phoneVerify(s.draft.phone, s.profOtpVal)
          patch({
            form: { ...s.form, ...s.draft, phone: res.profile.phoneDisplay || s.draft.phone },
            sec: { ...s.sec, mobile: res.profile.phoneDisplay || s.draft.phone },
            profileMode: 'view',
            profOtpVal: '',
            profOtpErr: false,
          })
          flash('profile')
        } catch (err) {
          patch({ profOtpErr: true, profOtpError: errMessage(err) })
        }
      },
      saveNotif: async () => {
        try {
          await meApi.savePreferences({
            delivery: s.notif.delivery,
            harvest: s.notif.harvest,
            promos: s.notif.promos,
            channel: s.notifChannel,
          })
          flash('notifications')
        } catch (err) {
          patch({ globalError: errMessage(err) })
        }
      },

      notifRows: [
        { key: 'delivery', label: 'Delivery alerts', desc: 'Out-for-delivery and delivered updates.' },
        { key: 'harvest', label: 'Harvest & plot updates', desc: "Weekly photos and what's growing." },
        { key: 'promos', label: 'Offers & news', desc: 'New crops, referrals and announcements.' },
      ].map((n) => ({
        label: n.label,
        desc: n.desc,
        on: s.notif[n.key],
        onToggle: () => patch({ notif: { ...s.notif, [n.key]: !s.notif[n.key] } }),
      })),
      notifChannels: [
        { k: 'push', label: 'Push' },
        { k: 'sms', label: 'SMS' },
        { k: 'email', label: 'Email' },
      ].map((c) => ({
        label: c.label,
        onClick: () => patch({ notifChannel: c.k }),
        style: `flex:1;padding:10px;border-radius:3px;font-size:13px;font-weight:600;cursor:pointer;background:${s.notifChannel === c.k ? '#1c3b2c' : '#faf8f2'};color:${s.notifChannel === c.k ? '#f6f3ea' : '#1c3b2c'};border:1px solid ${s.notifChannel === c.k ? '#1c3b2c' : '#d8cfb8'}`,
      })),

      addressList: s.addresses.map((a) => ({
        ...a,
        onDefault: async () => {
          try {
            const res = await addressesApi.setDefault(a.id)
            patch({ addresses: (res.items || []).map(mapAddress) })
          } catch (err) {
            patch({ globalError: errMessage(err) })
          }
        },
        onEdit: () => patch({ addrEdit: { ...a }, addrErrors: {}, addrFormError: '' }),
        onDelete: async () => {
          try {
            await addressesApi.remove(a.id)
            const list = await addressesApi.list()
            patch({ addresses: (list.items || []).map(mapAddress) })
          } catch (err) {
            patch({ globalError: errMessage(err, 'Could not delete address. Please try again.') })
          }
        },
      })),
      addrEditing: !!s.addrEdit,
      addrForm: s.addrEdit || { label: '', line: '', city: '', pin: '' },
      addrErrors: s.addrErrors,
      addrFormError: s.addrFormError,
      addrTitle: s.addrEdit && s.addrEdit.id ? 'Edit address' : 'Add address',
      addrNew: () =>
        patch({
          addrEdit: { id: null, label: '', line: '', city: '', pin: '' },
          addrErrors: {},
          addrFormError: '',
        }),
      addrCancel: () => patch({ addrEdit: null, addrErrors: {}, addrFormError: '' }),
      onAddrLabel: (e) => patch({ addrEdit: { ...s.addrEdit, label: e.target.value }, addrFormError: '' }),
      onAddrLine: (e) =>
        patch({
          addrEdit: { ...s.addrEdit, line: e.target.value },
          addrErrors: { ...s.addrErrors, line: '' },
          addrFormError: '',
        }),
      onAddrCity: (e) =>
        patch({
          addrEdit: { ...s.addrEdit, city: e.target.value },
          addrErrors: { ...s.addrErrors, city: '' },
          addrFormError: '',
        }),
      onAddrPin: (e) =>
        patch({
          addrEdit: { ...s.addrEdit, pin: e.target.value.replace(/[^0-9]/g, '').slice(0, 6) },
          addrErrors: { ...s.addrErrors, pin: '' },
          addrFormError: '',
        }),
      addrSave: async () => {
        const e = s.addrEdit
        if (!e) return
        const errors = validateAddressForm(e)
        if (Object.keys(errors).length) {
          patch({
            addrErrors: errors,
            addrFormError: 'Please fix the highlighted fields below and try again.',
          })
          return
        }
        try {
          if (e.id) {
            await addressesApi.update(e.id, {
              label: e.label,
              line: e.line,
              city: e.city,
              pin: e.pin,
            })
          } else {
            await addressesApi.create({
              label: e.label || 'Home',
              line: e.line,
              city: e.city,
              pin: e.pin,
              setDefault: s.addresses.length === 0,
            })
          }
          const list = await addressesApi.list()
          patch({
            addresses: (list.items || []).map(mapAddress),
            addrEdit: null,
            addrErrors: {},
            addrFormError: '',
          })
          flash('address')
        } catch (err) {
          const fieldErrors = mapApiFormErrors(err, { line: 'line', city: 'city', pin: 'pin' })
          const message = errMessage(err, 'Could not save address. Please try again.')
          patch({
            addrErrors: fieldErrors,
            addrFormError: message,
            globalError: Object.keys(fieldErrors).length ? '' : message,
          })
        }
      },

      paymentList: [],
      paymentHistoryList: (s.paymentHistory || []).map((p) => ({
        id: p.id,
        ref: p.ref,
        label: p.label,
        date: p.date,
        amountFormatted: p.amountFormatted,
        status: p.status,
      })),
      payAdding: false,
      payNotAdding: true,
      cardName: '',
      cardNo: '',
      cardExp: '',
      cardCvv: '',
      cardErr: '',
      payStartCard: () => {},
      onCardName: () => {},
      onCardNo: () => {},
      onCardExp: () => {},
      onCardCvv: () => {},
      cardPayCancel: () => patch({ payAdd: null }),
      paySave: () => {},

      secMobile: s.sec.mobile,
      secNewMobile: s.sec.newMobile,
      secOtp: s.sec.otp,
      secError: s.sec.error,
      secDemoOtp: s.sec.demoOtp || '',
      secIdle: s.sec.view === 'idle',
      secEnter: s.sec.view === 'enter',
      secOtpStep: s.sec.view === 'otp',
      secStart: () => patch({ sec: { ...s.sec, view: 'enter', newMobile: '', otp: '', error: '', demoOtp: '' } }),
      onSecNew: (e) =>
        patch({
          sec: { ...s.sec, newMobile: sanitizePhoneInput(e.target.value), error: '' },
        }),
      secSend: async () => {
        const phoneMsg = phoneValidationMessage(s.sec.newMobile)
        if (phoneMsg) {
          patch({ sec: { ...s.sec, error: phoneMsg } })
          return
        }
        try {
          const res = await meApi.phoneOtp(s.sec.newMobile)
          patch({
            sec: {
              ...s.sec,
              view: 'otp',
              error: '',
              demoOtp: res.demoOtp || '',
            },
          })
        } catch (err) {
          patch({
            sec: {
              ...s.sec,
              error: errMessage(err, 'Could not send verification code. Please try again.'),
            },
          })
        }
      },
      onSecOtp: (e) =>
        patch({ sec: { ...s.sec, otp: e.target.value.replace(/[^0-9]/g, '').slice(0, 4), error: '' } }),
      secVerify: async () => {
        if (!isValidOtp(s.sec.otp)) {
          patch({ sec: { ...s.sec, error: 'Enter the 4-digit code.' } })
          return
        }
        try {
          const res = await meApi.phoneVerify(s.sec.newMobile, s.sec.otp)
          patch({
            sec: {
              view: 'idle',
              mobile: res.profile.phoneDisplay || s.sec.newMobile,
              newMobile: '',
              otp: '',
              error: '',
              demoOtp: '',
            },
            form: { ...s.form, phone: res.profile.phoneDisplay || s.sec.newMobile },
          })
          flash('security')
        } catch (err) {
          patch({
            sec: {
              ...s.sec,
              error: errMessage(err, 'Could not verify the code. Please try again.'),
            },
          })
        }
      },
      secCancel: () => patch({ sec: { ...s.sec, view: 'idle', newMobile: '', otp: '', error: '', demoOtp: '' } }),
      logoutAll: async () => {
        try {
          await authApi.revokeAll()
        } catch {
          /* ignore */
        }
        forceLogout('Logged out of all sessions.')
        window.scrollTo({ top: 0 })
      },

      supportRows: (s.supportFaq.length
        ? s.supportFaq
        : [
            {
              label: 'How does the ₹500 membership work?',
              body: 'A one-time ₹500 activates your Farm Club membership.',
            },
          ]
      ).map((r, i) => ({
        label: r.label || r.question,
        body: r.body || r.answer,
        open: s.openHelp === i,
        icon: s.openHelp === i ? '−' : '+',
        onToggle: () => patch({ openHelp: s.openHelp === i ? -1 : i }),
      })),
      supportContacts: (s.supportContacts.length
        ? s.supportContacts
        : [
            { label: 'Email support', meta: 'support@chedi.in' },
            { label: 'Call us', meta: '+91 94441 26240' },
            { label: 'Terms & Conditions', meta: 'View →', doc: 'terms' },
            { label: 'Privacy Policy', meta: 'View →', doc: 'privacy' },
          ]
      ).map((r) => ({
        label: r.label,
        meta: r.meta || r.value || '',
        onClick: r.doc
          ? async () => {
              try {
                const doc = await supportApi.legal(r.doc)
                patch({
                  legal: r.doc,
                  legalDoc: doc,
                })
              } catch {
                patch({ legal: r.doc, legalDoc: null })
              }
            }
          : () => {},
        rowStyle: `display:flex;justify-content:space-between;align-items:center;width:100%;text-align:left;background:none;border:none;border-bottom:1px solid #efe9db;padding:14px 0;cursor:${r.doc ? 'pointer' : 'default'}`,
      })),
      legalOpen: !!s.legal,
      legalTitle: s.legalDoc?.title || (s.legal === 'privacy' ? 'Privacy Policy' : 'Terms & Conditions'),
      legalBody: s.legalDoc?.paragraphs
        ? s.legalDoc.paragraphs.join('\n\n')
        : s.legal === 'privacy'
          ? PRIVACY_TEXT
          : TERMS_TEXT,
      closeLegal: () => patch({ legal: null, legalDoc: null }),

      showDelete: s.showDelete,
      askDelete: () => patch({ showDelete: true }),
      cancelDelete: () => patch({ showDelete: false }),
      confirmDelete: async () => {
        try {
          await meApi.deleteAccount()
        } catch (err) {
          patch({ globalError: errMessage(err) })
          return
        }
        forceLogout('Your account has been deleted.')
        window.scrollTo({ top: 0 })
      },
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state])

  return view
}
