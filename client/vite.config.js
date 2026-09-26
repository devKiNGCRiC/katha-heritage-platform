import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// 🚀 KATHA Heritage Platform - Vite Configuration
// 🎯 Purpose: Build configuration for React + Tailwind CSS
const config = defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  server: {
    port: 5173,
    strictPort: true,
    open: true
  }
});

export default config;
