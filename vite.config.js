import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
   server: {
    allowedHosts: ["elan-homme-admin.vercel.app"], // Only allow this host
    host: "0.0.0.0", // Listen on all interfaces, making it accessible externally
    port: 5173, // Set your desired port
    strictPort: true, // Ensure the port is strictly bound
    cors: true, // Enable CORS if necessary for external access
  },
})
