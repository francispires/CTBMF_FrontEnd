import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    global: {},
  },
  base: "/CTBMF_FrontEnd",
  plugins: [react()],
  preview: {
    port: 4041,
  },
  // for dev
  server: {
    port: 4040,
  },
})
