import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';

export default defineConfig(() => ({
  build: { outDir: '../../build/ui' },
  plugins: [react()],
  server: { open: true, port: 3000 },
}));
