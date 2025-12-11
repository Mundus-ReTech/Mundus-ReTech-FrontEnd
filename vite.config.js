import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  host: 'localhost',  
  server: { port: 3000 }
})
