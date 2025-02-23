import { defineConfig } from 'vite';
import dotenv from 'dotenv';

export default defineConfig({
  server: {
    port: 5173, // Asegúrate de que este es el puerto correcto
  },
  resolve: {
    alias: {
      "@": "/src", // Opcional, pero útil si usas importaciones absolutas
    },
  },
});
