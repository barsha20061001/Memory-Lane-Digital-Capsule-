import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // 🛑 ADD THIS BLOCK TO FORCE THE PORT 🛑
  server: {
    port: 5173,
    strictPort: true,
  }
});