import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Укажите входную точку для Tauri
    outDir: './src-tauri/dist', // Путь, где будут сохраняться собранные файлы
    target: 'esnext', // Поддержка top-level await
  },
  server: {
    // Конфигурация для разработки
    strictPort: true, // Порт, на котором будет работать сервер
  },
})