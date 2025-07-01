import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Optional: If you want to use absolute path imports like `import Component from 'src/components/Component'`
  resolve: {
    alias: {
      'src': path.resolve(__dirname, './src'),
    },
  },
});