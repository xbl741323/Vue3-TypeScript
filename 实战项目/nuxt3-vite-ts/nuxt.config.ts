// https://nuxt.com/docs/api/configuration/nuxt-config
import { resolve } from "path"
export default defineNuxtConfig({
  modules: ['@element-plus/nuxt'],
  typescript: {
    shim: false
  },
  alias: {
    "@": resolve(__dirname, "/")
  },
  css: ["~/assets/css/main.scss"],
  devtools: { enabled: true },
})
