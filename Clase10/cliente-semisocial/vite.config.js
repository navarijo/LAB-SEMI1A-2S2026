import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // Definimos 'global' como 'window' para que la librería de AWS funcione
    global: 'window', 
  },
})