const ACCESS_KEY = 'chedi_access_token'
const REFRESH_KEY = 'chedi_refresh_token'
const MEMBER_KEY = 'chedi_member'

export function getAccessToken() {
  return localStorage.getItem(ACCESS_KEY)
}

export function getRefreshToken() {
  return localStorage.getItem(REFRESH_KEY)
}

export function getStoredMember() {
  try {
    const raw = localStorage.getItem(MEMBER_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function saveSession({ accessToken, refreshToken, member }) {
  if (accessToken) localStorage.setItem(ACCESS_KEY, accessToken)
  if (refreshToken) localStorage.setItem(REFRESH_KEY, refreshToken)
  if (member) localStorage.setItem(MEMBER_KEY, JSON.stringify(member))
}

export function clearSession() {
  localStorage.removeItem(ACCESS_KEY)
  localStorage.removeItem(REFRESH_KEY)
  localStorage.removeItem(MEMBER_KEY)
}

export function hasSession() {
  return Boolean(getAccessToken())
}
