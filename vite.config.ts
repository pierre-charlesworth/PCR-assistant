import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      plugins: [
        VitePWA({
          registerType: 'autoUpdate',
          includeAssets: ['mr-pcr-logo.png'],
          manifest: {
            name: 'Mr. PCR',
            short_name: 'MrPCR',
            description: 'A handy tool for calculating PCR master mixes and thermocycler programs.',
            theme_color: '#4f46e5',
            background_color: '#ffffff',
            icons: [
              {
                src: 'mr-pcr-logo.png',
                sizes: '192x192',
                type: 'image/png',
                purpose: 'any maskable'
              },
              {
                src: 'mr-pcr-logo.png',
                sizes: '512x512',
                type: 'image/png',
                purpose: 'any maskable'
              }
            ]
          }
        })
      ]
    };
});
