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
          includeAssets: ['favicon.svg'],
          manifest: {
            name: 'PCR Master Mix & Thermocycler Assistant',
            short_name: 'PCR Assistant',
            description: 'A handy tool for calculating PCR master mixes and thermocycler programs.',
            theme_color: '#4f46e5',
            background_color: '#ffffff',
            icons: [
              {
                src: 'favicon.svg',
                sizes: 'any',
                type: 'image/svg+xml',
                purpose: 'any'
              }
            ]
          }
        })
      ]
    };
});
