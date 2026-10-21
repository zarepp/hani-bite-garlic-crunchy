import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/hani-bite-garlic-crunchy/',
  plugins: [react()],
});