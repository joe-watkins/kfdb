import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig(() => {
    return {
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      // For local development, proxy requests to Netlify Functions
      server: {
        proxy: {
          '/.netlify/functions': {
            // For local development with Netlify CLI
            target: 'http://localhost:8888',
            changeOrigin: true,
          }
        }
      }
    };
});
