import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
// 自动引入vue3 hooks
import AutoImport from 'unplugin-auto-import/vite'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    AutoImport({ // 使用
      imports: ['vue'],
      dts: 'src/auto-import.d.ts',
      // 如有用到eslint记得加上写段，没有用到可以忽略
      eslintrc: {
        enabled: true,
      },
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    }
  },
  server: {
    host: 'localhost',// 指定服务器主机名
    port: 8000, // 指定服务器端口
    hmr: true,  // 开启热更新
    open: true, // 在服务器启动时自动在浏览器中打开应用程序
    https: false, // 不支持https
    proxy: {
      '/service': {
        target: 'https://www.hnxmsq.cn/service/',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/service/, '')
      }
    }
  }
})
