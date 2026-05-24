import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const apiTarget = 'http://localhost:8000'

const proxyConfig = {
  target: apiTarget,
  changeOrigin: true,
  secure: false,
  rewrite: (path) => path.replace(/^\/api/, ''),
}

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': proxyConfig,
    },
  },
})
