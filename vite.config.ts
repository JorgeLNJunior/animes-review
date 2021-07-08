import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@components': resolve(__dirname, '/src/components'),
      '@pages': resolve(__dirname, '/src/pages'),
      '@assets': resolve(__dirname, '/src/assets'),
      '@api': resolve(__dirname, '/src/api')
    }
  },
  server: {
    port: 5000
  }
})
