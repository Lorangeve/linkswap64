import { defineConfig } from "@solidjs/start/config";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  ssr: true, // Enable SSR for SSG
  server: {
    preset: 'static', // Use static preset for GitHub Pages
    prerender: {
      crawlLinks: true, // Crawl links for SSG
      routes: ['/', '/about'], // Explicit routes to prerender
    }
  },
  vite: {
    plugins: [
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.ico'],
        manifest: {
          name: 'LinkSwap64',
          short_name: 'LinkSwap',
          description: 'A SolidJS PWA on GitHub Pages',
          theme_color: '#075985',
          background_color: '#ffffff',
          display: 'standalone',
          orientation: 'portrait',
          scope: './',
          start_url: './',
          icons: [
            {
              src: 'pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png'
            },
            {
              src: 'pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png'
            }
          ]
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
          runtimeCaching: [
            {
              urlPattern: /\.(?:js|css|html)$/,
              handler: 'StaleWhileRevalidate',
              options: {
                cacheName: 'static-resources',
              }
            }
          ]
        },
        devOptions: {
          enabled: false
        }
      })
    ],
    base: process.env.NODE_ENV === 'production' ? '/linkswap64/' : '/',
  },
});
