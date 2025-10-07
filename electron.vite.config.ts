import { defineConfig, externalizeDepsPlugin } from 'electron-vite'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()]
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    server: {
      headers: {
        'Content-Security-Policy': "script-src 'self'; worker-src 'self' blob:;"
      }
    }
  }
})
