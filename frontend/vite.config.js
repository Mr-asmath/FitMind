import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  server: {
    hmr: {
      clientPort: 5173, // Explicitly set the port
      protocol: 'ws',  // Force WebSocket protocol
      host: 'localhost'
    },
    // For Docker or network setups:
    host: true, // Listen on all addresses
    port: 5173, // Explicit port
    strictPort: true // Don't try other ports
  }
})