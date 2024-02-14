import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import WindiCSS from 'vite-plugin-windicss'
import path from "path"
import dynamicImportVars from '@rollup/plugin-dynamic-import-vars';



// https://vitejs.dev/config/
export default defineConfig({
  build: {
    rollupOptions: {
      plugins: [
        dynamicImportVars(),
        // other Rollup plugins if needed
      ],
    },
  },
  // server:{
  //   hmr:{
  //     overlay:false
  //   }
  // },
  server:{
    proxy:{
      '/api': {
        target: 'http://localhost:8088',
        // target: 'http://ceshi13.dishait.cn',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      },
    }
  },
  resolve:{
    alias:{
      "~": path.resolve(__dirname,"src/"),

    }
  },
  plugins: [vue(),WindiCSS()]
})
