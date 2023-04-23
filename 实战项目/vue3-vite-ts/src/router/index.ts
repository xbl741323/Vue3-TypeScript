import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/home/index.vue'
import Service from '@/views/service/index.vue'
import Policy from '@/views/policy/index.vue'
import Personal from '@/views/personal/index.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/service',
      name: 'service',
      component: Service
    },
    {
      path: '/policy',
      name: 'policy',
      component: Policy
    },
    {
      path: '/personal',
      name: 'personal',
      component: Personal
    }
  ]
})

export default router
