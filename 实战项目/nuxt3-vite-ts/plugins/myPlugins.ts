/*
  用于存放自定义插件，使用示例：const { $sayHello } = useNuxtApp()
*/
export default defineNuxtPlugin((nuxtApp) => {
  return {
    provide: {
      sayHello: (msg: string) => {
        console.log(`hello ${msg}`)
      }
    }
  }
})