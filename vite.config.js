import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'copy-404',
      closeBundle() {
        const indexPath = path.resolve(__dirname, 'dist/index.html')
        const notFoundPath = path.resolve(__dirname, 'dist/404.html')
        if (fs.existsSync(indexPath)) {
          fs.copyFileSync(indexPath, notFoundPath)
        }
      }
    }
  ],
  base: './',
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: 'dist'
  }
})
