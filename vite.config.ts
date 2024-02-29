import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
//const base = process.env.REACT_APP_API_SERVER_URL;

export default defineConfig({
  define: {
    global: {},
  },
  base: '/',
  plugins: [react()],
  preview: {
    port: 4041,
  },
  // for dev
  server: {
    port: 4040,
  },
})
