import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    tailwindcss(),
    react()],
  
    server: {
      port: 3000, // Ensure it's running on the correct port
      host: true, // Allows external access
      strictPort: true, // Ensures the port doesn't change
      allowedHosts: ['.ngrok-free.app'] // Allows all `ngrok-free.app` URLs
    }
});

