import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())

  return {
    plugins: [vue()],
    define: {
      'import.meta.env.VITE_APP_TITLE': JSON.stringify(env.VITE_APP_TITLE),
      'import.meta.env.VITE_API_BASE_URL': JSON.stringify(env.VITE_API_BASE_URL),
      'import.meta.env.VITE_APP_PORT': JSON.stringify(env.VITE_APP_PORT),
      'import.meta.env.VITE_APP_ENV': JSON.stringify(env.VITE_APP_ENV)
    },
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src')
      }
    },
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler',
          additionalData: `@use "@/styles/global.scss" as *;`
        }
      },
      modules: {
        localsConvention: 'camelCase'
      }
    },
    server: {
      port: Number(env.VITE_APP_PORT) || 3000,
      open: true,
      host: true,
      proxy: mode === 'development' ? {
        '/api': {
          target: 'http://localhost:8080',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '')
        }
      } : undefined
    },
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: mode === 'development',
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: mode === 'production',
          drop_debugger: mode === 'production'
        }
      },
      rollupOptions: {
        output: {
          manualChunks: {
            'vue-vendor': ['vue', 'vue-router', 'pinia'],
            'echarts-vendor': ['echarts'],
            'utils': ['axios']
          },
          chunkFileNames: 'js/[name]-[hash].js',
          entryFileNames: 'js/[name]-[hash].js',
          assetFileNames: '[ext]/[name]-[hash].[ext]'
        }
      },
      chunkSizeWarningLimit: 1000,
      reportCompressedSize: false
    },
    optimizeDeps: {
      include: ['vue', 'vue-router', 'pinia', 'echarts', 'axios'],
      exclude: []
    },
    assetsInclude: ['**/*.glb', '**/*.gltf', '**/*.hdr']
  }
})
