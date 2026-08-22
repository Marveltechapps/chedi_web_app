import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

function resolveProxyTarget(env) {
  const explicit = env.VITE_PROXY_TARGET?.trim()
  if (explicit) return explicit.replace(/\/$/, '')
  const api = env.VITE_API_URL?.trim() || ''
  if (/^https?:\/\//i.test(api)) {
    try {
      return new URL(api).origin
    } catch {
      /* ignore invalid URL */
    }
  }
  return 'http://127.0.0.1:4000'
}

function createProxy(proxyTarget) {
  const common = {
    target: proxyTarget,
    changeOrigin: true,
    secure: proxyTarget.startsWith('https://'),
  }

  return {
    '/api': {
      ...common,
      timeout: 30000,
      proxyTimeout: 30000,
      configure(proxyServer) {
        proxyServer.on('error', (err, _req, res) => {
          console.error('[vite proxy]', err.code || err.message)
          if (res && !res.headersSent && typeof res.writeHead === 'function') {
            res.writeHead(502, { 'Content-Type': 'application/json' })
            res.end(
              JSON.stringify({
                success: false,
                message: 'API unavailable. Please try again.',
                error: {
                  code: 'BAD_GATEWAY',
                  message: 'API unavailable. Please try again.',
                  details: [],
                },
              })
            )
          }
        })
      },
    },
    '/health': common,
    '/socket.io': { ...common, ws: true },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const proxyTarget = resolveProxyTarget(env)
  const proxy = createProxy(proxyTarget)
  console.log(`[vite] proxy /api → ${proxyTarget}`)

  return {
    plugins: [react()],
    server: {
      port: process.env.PORT ? Number(process.env.PORT) : 5173,
      strictPort: !!process.env.PORT,
      proxy,
    },
    preview: {
      port: process.env.PORT ? Number(process.env.PORT) : 4173,
      proxy,
    },
  }
})
