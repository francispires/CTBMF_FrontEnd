import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/

const base = process.env.VITE_REACT_APP_BASE_URL;
console.log(base);

export default defineConfig({
  define: {
    global: {},
  },
  //base: base,
  plugins: [react()],
  preview: {
    port: 4041,
  },
  // for dev
  server: {
    port: 4040,
  },
})
