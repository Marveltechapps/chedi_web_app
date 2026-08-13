import { vegImg } from '../data/vegImages.js'
import { HERO_PLOT_IMG, WELCOME_IMG, PLOT_GALLERY_4 } from '../data/plots.js'

export function mapPlot(p) {
  if (!p) return null
  return {
    key: p.key,
    name: p.name,
    status: p.status,
    size: p.size,
    state: p.state,
    district: p.district,
    city: p.city,
    region: p.region,
    crop: p.crop,
    total: p.totalUnits ?? p.total ?? 0,
    available: p.availableUnits ?? p.available ?? 0,
    img: p.imageUrl || p.img || HERO_PLOT_IMG,
    leasedByMe: Boolean(p.leasedByMe),
    notifyRequested: Boolean(p.notifyRequested),
    gallery: (p.gallery || []).map((g) => g.imageUrl || g.img).filter(Boolean),
    soil: p.soil,
    cropCycle: p.cropCycle,
  }
}

export function mapPlan(p) {
  if (!p) return null
  return {
    key: p.key,
    tag: p.tag,
    name: p.name,
    price: p.priceFormatted || p.price,
    priceInr: p.priceInr,
    plots: p.plotsLabel || p.plots,
    size: p.sizeLabel || p.size,
    featured: Boolean(p.featured),
    total: p.totalFormatted || p.total,
    totalInr: p.totalInr,
    deliveryChargeFormatted: p.deliveryChargeFormatted,
    deliveryChargeInr: p.deliveryChargeInr,
    features: p.features || [],
  }
}

export function mapSubscription(sub) {
  if (!sub) return null
  return {
    id: sub.id,
    plotKey: sub.plotKey,
    planKey: sub.planKey,
    total: sub.totalFormatted || sub.total,
    totalInr: sub.totalInr,
    start: sub.cycleStartLabel || sub.start,
    end: sub.cycleEndLabel || sub.end,
    billPaid: Boolean(sub.billPaid),
    status: sub.status || 'active',
    nextBillDue: sub.nextBillDue || sub.cycleEnd,
    nextBillAmountFormatted: sub.nextBillAmountFormatted,
    plot: sub.plot ? mapPlot(sub.plot) : undefined,
    plan: sub.plan ? mapPlan(sub.plan) : undefined,
  }
}

export function mapAddress(a) {
  if (!a) return null
  return {
    id: a.id,
    label: a.label || 'Home',
    line: a.line,
    city: a.city,
    pin: a.pin,
    def: Boolean(a.isDefault ?? a.def),
  }
}

export function mapPaymentMethod(pm) {
  if (!pm) return null
  const kind = pm.kind === 'card' || pm.kind === 'Card' ? 'Card' : 'Net banking'
  return {
    id: pm.id,
    kind,
    label: pm.label,
    primary: Boolean(pm.isPrimary ?? pm.primary),
    fixed: Boolean(pm.isFixed ?? pm.fixed),
    removable: pm.removable !== false && !pm.isFixed,
    brand: pm.brand,
    last4: pm.last4,
  }
}

export function mapMemberToForm(member, profile) {
  return {
    name: profile?.name || member?.name || '',
    phone: profile?.phoneDisplay || profile?.phone || member?.phoneDisplay || member?.phone || '',
    email: profile?.email || member?.email || '',
    address: '',
    city: '',
    pin: '',
  }
}

/** First name for sidebar / greetings — prefer authenticated member over join-form leftovers. */
export function memberDisplayName(member, form) {
  const full = String(member?.name || member?.firstName || form?.name || '')
    .trim()
  if (full) return full.split(/\s+/)[0]
  const email = String(member?.email || form?.email || '').trim()
  if (email.includes('@')) return email.split('@')[0]
  return 'Member'
}

/** True when today's local calendar date is on or after a YYYY-MM-DD due date. */
export function isOnOrAfterCalendarDate(ymd) {
  const due = String(ymd || '').slice(0, 10)
  if (!/^\d{4}-\d{2}-\d{2}$/.test(due)) return false
  const now = new Date()
  const today = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, '0'),
    String(now.getDate()).padStart(2, '0'),
  ].join('-')
  return today >= due
}

export function relativeTime(iso) {
  if (!iso) return ''
  const then = new Date(iso).getTime()
  if (Number.isNaN(then)) return ''
  const diff = Math.max(0, Date.now() - then)
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return mins <= 1 ? '1m ago' : `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 48) return hours === 1 ? '1h ago' : `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 14) return days === 1 ? '1 day ago' : `${days} days ago`
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

export function mapBasketItem(b) {
  return {
    name: b.name,
    qty: b.qty,
    img: b.imageUrl || vegImg(b.name),
  }
}

export function mapGrowing(g) {
  return {
    name: g.name,
    stage: g.stage,
    img: vegImg(g.name),
  }
}

export function defaultGallery() {
  return PLOT_GALLERY_4
}

export function defaultHero() {
  return HERO_PLOT_IMG
}

export function defaultWelcomeImg() {
  return WELCOME_IMG
}

export function newIdempotencyKey() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID()
  return `idem_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`
}
