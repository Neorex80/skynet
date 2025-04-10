import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
        '@components': resolve(__dirname, 'src/components'),
        '@features': resolve(__dirname, 'src/features'),
        '@hooks': resolve(__dirname, 'src/hooks'),
        '@services': resolve(__dirname, 'src/services'),
        '@utils': resolve(__dirname, 'src/utils'),
        '@types': resolve(__dirname, 'src/types'),
        '@assets': resolve(__dirname, 'src/assets'),
      },
    },
    optimizeDeps: {
      exclude: ['lucide-react'],
    },
    server: {
      port: 5173, 
      open: true, // Auto-open browser on server start
      // Proxy API requests to backend during development
      proxy: env.VITE_API_PROXY_ENABLED === 'true' ? {
        '/api': {
          target: env.VITE_API_PROXY_TARGET || 'http://localhost:3000',
          changeOrigin: true,
          secure: false,
        },
      } : undefined,
    },
    build: {
      outDir: 'dist', 
      sourcemap: mode !== 'production', // Enable source maps for debugging
      // Chunk size optimization
      chunkSizeWarningLimit: 1000, // Increased warning limit
      rollupOptions: {
        output: {
          // Chunking strategy for optimal loading
          manualChunks: {
            vendor: ['react', 'react-dom', 'react-router-dom'],
            ui: [
              'lucide-react', 
              '@heroicons/react', 
              'react-markdown'
            ],
            utils: ['axios', 'langchain', '@supabase/supabase-js'],
          },
        },
      },
    },
    css: {
      // Pre-processor options (if using SCSS, Less, etc.)
      preprocessorOptions: {
        // scss: {
        //   additionalData: `@import "@/styles/variables.scss";`,
        // },
      },
    },
    // Testing configuration
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './src/tests/setup.ts',
      coverage: {
        provider: 'v8',
        reporter: ['text', 'html'],
        exclude: ['node_modules/', 'src/tests/'],
      },
    },
  };
});