import {
  clearSession,
  getAccessToken,
  getRefreshToken,
  saveSession,
} from '../lib/session.js'

const API_BASE = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '')

export class ApiError extends Error {
  constructor({ status, code, message, details = [], requestId }) {
    super(message || 'Request failed')
    this.name = 'ApiError'
    this.status = status
    this.code = code || 'REQUEST_FAILED'
    this.details = details
    this.requestId = requestId
  }
}

let refreshPromise = null

async function refreshAccessToken() {
  const refreshToken = getRefreshToken()
  if (!refreshToken) throw new ApiError({ status: 401, code: 'UNAUTHORIZED', message: 'Session expired' })

  const res = await fetch(`${API_BASE}/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ refreshToken }),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    clearSession()
    throw new ApiError({
      status: res.status,
      code: data?.error?.code || 'UNAUTHORIZED',
      message: data?.error?.message || 'Session expired. Please log in again.',
      details: data?.error?.details || [],
    })
  }
  saveSession({
    accessToken: data.accessToken,
    refreshToken: data.refreshToken || refreshToken,
    member: data.member,
  })
  return data.accessToken
}

function ensureRefresh() {
  if (!refreshPromise) {
    refreshPromise = refreshAccessToken().finally(() => {
      refreshPromise = null
    })
  }
  return refreshPromise
}

/**
 * @param {string} path
 * @param {{ method?: string, body?: any, auth?: boolean, headers?: Record<string,string>, idempotencyKey?: string }} [options]
 */
export async function apiRequest(path, options = {}) {
  const {
    method = 'GET',
    body,
    auth = false,
    headers = {},
    idempotencyKey,
    retry = true,
  } = options

  const reqHeaders = {
    Accept: 'application/json',
    ...headers,
  }
  if (body !== undefined) reqHeaders['Content-Type'] = 'application/json'
  if (idempotencyKey) reqHeaders['Idempotency-Key'] = idempotencyKey

  if (auth) {
    const token = getAccessToken()
    if (token) reqHeaders.Authorization = `Bearer ${token}`
  }

  let res
  try {
    res = await fetch(`${API_BASE}${path.startsWith('/') ? path : `/${path}`}`, {
      method,
      headers: reqHeaders,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })
  } catch {
    throw new ApiError({
      status: 0,
      code: 'NETWORK_ERROR',
      message: 'Network error. Check your connection and try again.',
    })
  }

  if (res.status === 401 && auth && retry && getRefreshToken()) {
    try {
      await ensureRefresh()
      return apiRequest(path, { ...options, retry: false })
    } catch (err) {
      // Ensure callers see a consistent unauthorized signal after refresh failure
      clearSession()
      throw err instanceof ApiError
        ? err
        : new ApiError({ status: 401, code: 'UNAUTHORIZED', message: 'Session expired. Please log in again.' })
    }
  }

  if (res.status === 204) return null

  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    const err = data?.error || {}
    throw new ApiError({
      status: res.status,
      code: err.code || 'REQUEST_FAILED',
      message: err.message || res.statusText || 'Request failed',
      details: err.details || [],
      requestId: err.requestId,
    })
  }
  return data
}

export function getApiBase() {
  return API_BASE
}
