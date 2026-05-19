import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  base: '/bunny-english/',
  build: {
    outDir: 'docs',
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: [],
      manifest: {
        name: 'Bunny English - 美式英语学习',
        short_name: 'Bunny English',
        description: '6000 美式英语词汇，递进式学习 + 间隔重复',
        theme_color: '#6366f1',
        background_color: '#f8fafc',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/bunny-english/',
        scope: '/bunny-english/',
        icons: [
          { src: '/bunny-english/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/bunny-english/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
        ],
      },
    }),
  ],
});
