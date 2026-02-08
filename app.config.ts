import { defineConfig } from "@solidjs/start/config";
import tailwindcss from "@tailwindcss/vite";

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
    plugins: [tailwindcss()],
    base: process.env.NODE_ENV === 'production' ? '/linkswap64/' : '/',
  },
});
