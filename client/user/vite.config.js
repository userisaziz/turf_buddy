import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import sitemap from "vite-plugin-sitemap";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    sitemap({
      hostname: "https://turf-buddy.vercel.app/",
      routes: ["/"],
    }),
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        name: "Turf Buddy",
        short_name: "TurfBuddy",
        start_url: "/",
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#22c55e",
        icons: [
          {
            src: "logo192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "logo512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,png,jpg,jpeg,svg,woff2,woff}"],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/turf-buddy\.vercel\.app\/.*$/,
            handler: "NetworkFirst",
            options: {
              cacheName: "turf-buddy-cache",
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
              },
            },
          },
        ],
      },
    }),
  ],
  build: {
    rollupOptions: {
      // Ensure static files are included
      input: {
        main: "index.html",
      },
    },
  },
  publicDir: "public",
});
