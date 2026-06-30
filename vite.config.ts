import { defineConfig, loadEnv } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      tailwindcss(),
      react(),
      babel({ presets: [reactCompilerPreset()] })
    ],
    server: {
      proxy: {
        '/health': { target: 'https://prologue-vintage-cheesy.ngrok-free.dev', changeOrigin: true, headers: { 'User-Agent': 'Vite-Dev-Proxy/1.0', 'x-api-key': env.VITE_API_KEY } },
        '/search': { target: 'https://prologue-vintage-cheesy.ngrok-free.dev', changeOrigin: true, headers: { 'User-Agent': 'Vite-Dev-Proxy/1.0', 'x-api-key': env.VITE_API_KEY } },
        '/trends': { target: 'https://prologue-vintage-cheesy.ngrok-free.dev', changeOrigin: true, headers: { 'User-Agent': 'Vite-Dev-Proxy/1.0', 'x-api-key': env.VITE_API_KEY } },
      },
    },
  }
})
