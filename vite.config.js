import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: process.env.PORT ? Number(process.env.PORT) : 5173,
    strictPort: !!process.env.PORT,
    proxy: {
      '/api': {
        target: process.env.VITE_PROXY_TARGET || 'http://127.0.0.1:4000',
        changeOrigin: true,
        timeout: 30000,
        proxyTimeout: 30000,
        configure(proxy) {
          proxy.on('error', (err, _req, res) => {
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
      '/socket.io': {
        target: process.env.VITE_PROXY_TARGET || 'http://127.0.0.1:4000',
        changeOrigin: true,
        ws: true,
      },
    },
  },
})
