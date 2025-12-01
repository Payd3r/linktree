import path from 'path'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '')
  return {
    root: '.',
    publicDir: '../public',
    server: {
      port: 3000,
      host: true,
      strictPort: false,
      hmr: {
        protocol: 'ws',
        host: 'localhost',
        port: 3000
      },
      watch: {
        usePolling: false
      },
      proxy: {
        '/api': {
          target: 'http://localhost:3001',
          changeOrigin: true
        },
        '/uploads': {
          target: 'http://localhost:3001',
          changeOrigin: true
        },
        '/images': {
          target: 'http://localhost:3001',
          changeOrigin: true
        }
      }
    },
    plugins: [
      react({
        jsxRuntime: 'automatic'
      }),
      tailwindcss()
    ],
    define: {
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src')
      }
    },
    build: {
      outDir: '../dist',
      emptyOutDir: true
    }
  }
})


