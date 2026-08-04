import { apiRequest } from './client.js'

export const authApi = {
  sendOtp: (email) => apiRequest('/auth/otp', { method: 'POST', body: { email } }),
  resendOtp: (email) => apiRequest('/auth/otp/resend', { method: 'POST', body: { email } }),
  verifyOtp: (email, code) =>
    apiRequest('/auth/otp/verify', { method: 'POST', body: { email, code } }),
  logout: (refreshToken) =>
    apiRequest('/auth/logout', { method: 'POST', auth: true, body: { refreshToken } }),
  revokeAll: () => apiRequest('/auth/sessions/revoke-all', { method: 'POST', auth: true }),
}

export const membershipApi = {
  register: (payload) => apiRequest('/membership/register', { method: 'POST', body: payload }),
  pay: (payload, idempotencyKey) =>
    apiRequest('/membership/payments', {
      method: 'POST',
      body: payload,
      idempotencyKey,
    }),
  me: () => apiRequest('/membership/me', { auth: true }),
}

export const meApi = {
  get: () => apiRequest('/me', { auth: true }),
  updateProfile: (payload) => apiRequest('/me/profile', { method: 'PATCH', auth: true, body: payload }),
  phoneOtp: (newPhone) => apiRequest('/me/phone/otp', { method: 'POST', auth: true, body: { newPhone } }),
  phoneVerify: (newPhone, code) =>
    apiRequest('/me/phone/verify', { method: 'POST', auth: true, body: { newPhone, code } }),
  savePreferences: (payload) =>
    apiRequest('/me/preferences/notifications', { method: 'PUT', auth: true, body: payload }),
  setActiveSubscription: (subscriptionId) =>
    apiRequest('/me/active-subscription', { method: 'PUT', auth: true, body: { subscriptionId } }),
  deleteAccount: () => apiRequest('/me', { method: 'DELETE', auth: true, body: { confirmation: 'DELETE' } }),
}

export const plotsApi = {
  list: (params = {}) => {
    const q = new URLSearchParams()
    Object.entries(params).forEach(([k, v]) => {
      if (v != null && v !== '' && v !== 'all') q.set(k, String(v))
    })
    const qs = q.toString()
    return apiRequest(`/plots${qs ? `?${qs}` : ''}`, { auth: true })
  },
  get: (plotKey) => apiRequest(`/plots/${encodeURIComponent(plotKey)}`, { auth: true }),
  notifyMe: (plotKey) =>
    apiRequest(`/plots/${encodeURIComponent(plotKey)}/notify-me`, { method: 'POST', auth: true }),
}

export const plansApi = {
  list: () => apiRequest('/plans'),
  get: (planKey) => apiRequest(`/plans/${encodeURIComponent(planKey)}`),
  produceShares: (planKey) =>
    apiRequest(`/plans/${encodeURIComponent(planKey)}/produce-shares`, { auth: true }),
}

export const subscriptionsApi = {
  list: () => apiRequest('/subscriptions', { auth: true }),
  quote: (plotKey, planKey) =>
    apiRequest('/subscriptions/quote', { method: 'POST', auth: true, body: { plotKey, planKey } }),
  renew: (subscriptionId, payload, idempotencyKey) =>
    apiRequest(`/subscriptions/${encodeURIComponent(subscriptionId)}/renewal-payments`, {
      method: 'POST',
      auth: true,
      body: payload,
      idempotencyKey,
    }),
}

export const paymentsApi = {
  netBanks: () => apiRequest('/payments/net-banks'),
  history: () => apiRequest('/payments/history', { auth: true }),
  create: (payload, idempotencyKey) =>
    apiRequest('/payments', { method: 'POST', auth: true, body: payload, idempotencyKey }),
  get: (paymentId) => apiRequest(`/payments/${encodeURIComponent(paymentId)}`, { auth: true }),
  receipt: (paymentId) =>
    apiRequest(`/payments/${encodeURIComponent(paymentId)}/receipt`, { auth: true }),
  listMethods: () => apiRequest('/payment-methods', { auth: true }),
  addCard: (payload) => apiRequest('/payment-methods', { method: 'POST', auth: true, body: payload }),
  setPrimary: (id) =>
    apiRequest(`/payment-methods/${encodeURIComponent(id)}/primary`, { method: 'POST', auth: true }),
  removeMethod: (id) =>
    apiRequest(`/payment-methods/${encodeURIComponent(id)}`, { method: 'DELETE', auth: true }),
}

export const addressesApi = {
  list: () => apiRequest('/addresses', { auth: true }),
  create: (payload) => apiRequest('/addresses', { method: 'POST', auth: true, body: payload }),
  update: (id, payload) =>
    apiRequest(`/addresses/${encodeURIComponent(id)}`, { method: 'PATCH', auth: true, body: payload }),
  setDefault: (id) =>
    apiRequest(`/addresses/${encodeURIComponent(id)}/default`, { method: 'POST', auth: true }),
  remove: (id) =>
    apiRequest(`/addresses/${encodeURIComponent(id)}`, { method: 'DELETE', auth: true }),
}

export const notificationsApi = {
  list: () => apiRequest('/notifications', { auth: true }),
  clear: () => apiRequest('/notifications/clear', { method: 'POST', auth: true }),
  markRead: (id) =>
    apiRequest(`/notifications/${encodeURIComponent(id)}/read`, { method: 'POST', auth: true }),
}

export const deliveriesApi = {
  list: (subscriptionId) => {
    const qs = subscriptionId ? `?subscriptionId=${encodeURIComponent(subscriptionId)}` : ''
    return apiRequest(`/deliveries${qs}`, { auth: true })
  },
  cancel: (deliveryId, subscriptionId, reason) =>
    apiRequest(`/deliveries/${encodeURIComponent(deliveryId)}/cancel`, {
      method: 'POST',
      auth: true,
      body: { subscriptionId, reason },
    }),
}

export const overviewApi = {
  get: () => apiRequest('/overview', { auth: true }),
}

export const myPlotApi = {
  get: (subscriptionId) => {
    const qs = subscriptionId ? `?subscriptionId=${encodeURIComponent(subscriptionId)}` : ''
    return apiRequest(`/my-plot${qs}`, { auth: true })
  },
}

export const supportApi = {
  get: () => apiRequest('/support'),
  legal: (doc) => apiRequest(`/legal/${encodeURIComponent(doc)}`),
}
