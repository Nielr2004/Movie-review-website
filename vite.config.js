// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Change this line:
  base: '/', // This is the correct base for most Vercel deployments
  // If you absolutely needed a subpath (very rare for Vercel SPAs),
  // you would also need to configure BrowserRouter's basename.
  // But for now, '/' is almost certainly correct.
  resolve: {
    alias: {
      'src': path.resolve(__dirname, './src'),
    },
  },
});