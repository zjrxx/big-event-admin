import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()]
    }),
    Components({
      resolvers: [ElementPlusResolver()]
    })
  ],
  base: '/',
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  //配置代理
  server: {
    proxy: {
      '/api': {
        target: 'http://192.168.8.17:8101',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      },
      '^/cover/(.*)$': {
        target: 'https://test-1326397892.cos.ap-nanjing.myqcloud.com', // 注意这里的路径已经包含了cover目录
        changeOrigin: true
        // 如果是https请求，需要设置此项
        // rewrite: (path) => path.replace(/^\/cos-img\//, '') // 移除前端请求中的/cos-img前缀
      }
    }
  }
})
