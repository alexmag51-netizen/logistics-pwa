// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'path'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/icon-192.png', 'icons/icon-512.png'],
      manifest: {
        name: 'Logistics',
        short_name: 'Logistics',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#0ea5e9',
        icons: [
          { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' }
        ]
      },
      workbox: { globPatterns: ['**/*.{js,css,html,ico,png,svg}'] }
    })
  ],

  resolve: {
    alias: [
      // Подмена всего RN на RN Web (и подпутей тоже)
      { find: 'react-native', replacement: 'react-native-web' },

      // Шим вместо react-native-safe-area-context (чтобы Paper не тянул нативщину)
      {
        find: 'react-native-safe-area-context',
        replacement: path.resolve(__dirname, 'src/shims/safe-area-web.ts')
      }
    ]
  },

  optimizeDeps: {
    esbuildOptions: {
      // JSX встречается в .js у некоторых пакетов
      loader: { '.js': 'jsx' }
    }
  },

  define: {
    global: 'window',
    __DEV__: JSON.stringify(true)
  },

  build: {
    commonjsOptions: { transformMixedEsModules: true }
  }
})
