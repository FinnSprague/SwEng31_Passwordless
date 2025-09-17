import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    
    proxy: {
      "/generate-magic-link": {
        target: "http://localhost:5000",
        changeOrigin: true,
        secure: false,
      },
      "/magic-link": {
        target: "http://localhost:5000",
        changeOrigin: true,
        secure: false,
      },
      "/register": {
        target: "http://localhost:5000",
        changeOrigin: true,
        secure: false,
      },
      "/verify-reg": {
        target: "http://localhost:5000",
        changeOrigin: true,
        secure: false,
      },
      "/authentication": {
        target: "http://localhost:5000",
        changeOrigin: true,
        secure: false,
      },
      "/verify-auth": {
        target: "http://localhost:5000",
        changeOrigin: true,
        secure: false,
      },
      "/passkey-status": {
        target: "http://localhost:5000",
        changeOrigin: true,
        secure: false,
      },
      "/check-auth": {
        target: "http://localhost:5000",
        changeOrigin: true,
        secure: false,
      },
      "/logout": {
        target: "http://localhost:5000",
        changeOrigin: true,
        secure: false,
      },
      "/update-profile": {
        target: "http://localhost:5000",
        changeOrigin: true,
        secure: false,
      },
      "/delete-passkey": {
        target: "http://localhost:5000",
        changeOrigin: true,
        secure: false,
      },
      "/create-appointment": {
        target: "http://localhost:5000",
        changeOrigin: true,
        secure: false,
      },
      "/get-profile": {
        target: "http://localhost:5000",
        changeOrigin: true,
        secure: false,
      },
      "/get-appointments": {
        target: "http://localhost:5000",
        changeOrigin: true,
        secure: false,
      },
    
     "/add-patient": {
        target: "http://localhost:5000",
        changeOrigin: true,
        secure: false,
      },
      "/get-patients": {
        target: "http://localhost:5000",
        changeOrigin: true,
        secure: false,
      },
    },
    
    
  },
});
