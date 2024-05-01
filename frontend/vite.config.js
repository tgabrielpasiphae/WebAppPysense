import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      external: ['chart.js/auto']
    }
  },
  optimizeDeps: {
    imports: {
      'socket.io-client': 'socket.io-client',
    },
  },
});
