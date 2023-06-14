/*
  路由中间件文件
  return navigateTo('/login') - 跳转使到login页面
  return abortNavigation() - 停止当前导航，跳转到404页面
*/
export default defineNuxtRouteMiddleware((to, from) => {
  // if (to.fullPath == '/personal') {
  // return navigateTo('/login')
  // return abortNavigation()
  // }
})