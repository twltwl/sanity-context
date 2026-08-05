import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // relative to the project root, since npm scripts run from there
  root: 'dev',
  plugins: [react()],
  server: {port: 5199},
})
