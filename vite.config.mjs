import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import { VuetifyPlugin } from 'webpack-plugin-vuetify'

export default defineConfig({
  plugins: [
    vue(),
    // Vuetify auto-import
    {
      name: 'vuetify-styles',
      transformIndexHtml() {
        return [
          {
            tag: 'link',
            attrs: {
              rel: 'stylesheet',
              href: 'https://cdn.jsdelivr.net/npm/vuetify@3.9.4/dist/vuetify.min.css'
            }
          }
        ]
      }
    }
  ],
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler' // Use modern API to avoid deprecation warnings
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@modules': path.resolve(__dirname, './src/modules'),
      '@shared': path.resolve(__dirname, './src/shared')
    }
  },
  server: {
    port: 8080,
    open: false,
    hmr: {
      port: 8080,
      host: 'localhost'
    },
    // 성능 개선을 위한 설정
    fs: {
      strict: false
    }
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['vue', 'vue-router', 'vuex'],
          'vuetify': ['vuetify'],
          'fontawesome': ['@fortawesome/fontawesome-svg-core', '@fortawesome/vue-fontawesome']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  },
  optimizeDeps: {
    include: ['vue', 'vue-router', 'vuex', 'vuetify']
  }
})