import { defineConfig, loadEnv } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import tailwindcss from "@tailwindcss/vite"

// https://vite.dev/config/
export default defineConfig(({mode}) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_')
  const apiUrl = new URL(env.VITE_API_URL || 'http://localhost:8000/api')

  return {
  plugins: [
    tailwindcss(),
    react(),
    babel({ presets: [reactCompilerPreset()] })
  ],
  server: {
    host: true,
    port: 5173,
    proxy: {
      '/api': {
        target: apiUrl.origin,
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api(?=\/|$)/, apiUrl.pathname.replace(/\/$/, '')),
      },
    },
  },
  }
})
