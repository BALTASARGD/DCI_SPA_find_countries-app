import { defineConfig } from 'vite'


export default defineConfig({
  server: {
    port: 5173, // Puerto donde Vite se ejecutará
    open: true,  // Abrir automáticamente en el navegador
  },
  resolve: {
    alias: {
      '@': '/src', // Alias para las rutas de la carpeta src
    },
  },
  build: {
    outDir: 'dist', // Directorio de salida para la build
    sourcemap: true, // Generar mapa fuente
  },
  
  
  base: '/my-app/',
})