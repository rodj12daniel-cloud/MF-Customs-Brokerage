import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const projectRoot = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': resolve(projectRoot, 'src'),
    },
  },
  build: {
    rollupOptions: {
      input: {
        home: resolve(projectRoot, 'index.html'),
        services: resolve(projectRoot, 'services.html'),
        team: resolve(projectRoot, 'team.html'),
        contact: resolve(projectRoot, 'contact.html'),
      },
    },
  },
});