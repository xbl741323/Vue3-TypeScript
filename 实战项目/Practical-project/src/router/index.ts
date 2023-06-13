import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/home/index.vue'
import Personal from '@/views/personal/index.vue'
import Login from '@/views/login/login.vue'
import Register from '@/views/login/register.vue'
import Authentication from '@/views/authentication/index.vue'//认证

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/personal',
      name: 'personal',
      component: Personal
    },
    {
      path: '/Login',
      name: 'Login',
      component: Login
    },
    {
      path: '/Register',
      name: 'Register',
      component: Register
    },
    {
      path: '/Authentication',
      name: 'Authentication',
      component: Authentication
    },
  ]
})

export default router
