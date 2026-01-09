import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ["icons/icono.png"],
      manifest: {
        name: 'Lector QR',
        short_name: 'QR Lector',
        description: 'Lector de códigos QR profesional con historial',
        theme_color: '#1e1b4b',
        background_color: '#0f0f23',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: 'icons/icono.png',
            sizes: '192x192',
            type: 'image/png'
          },
         
        ]
      },
      workbox: {
          navigateFallback: "/index.html",
      },
    }),
  ],
 
})