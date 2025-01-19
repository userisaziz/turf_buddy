import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import sitemap from 'vite-plugin-sitemap'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    sitemap({
      hostname: 'https://turf-buddy.vercel.app/',
      routes: ['/'],
    }),
  ],
  build: {
    rollupOptions: {
      // Ensure static files are included
      input: {
        main: 'index.html',
      },
    },
  },
  publicDir: 'public',
})