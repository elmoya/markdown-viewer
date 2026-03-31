import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => ({
  base: mode === 'ghpages' ? '/markdown-viewer/' : '/',
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5002,
    watch: {
      usePolling: true,
      interval: 1000,
    },
  },
}))
