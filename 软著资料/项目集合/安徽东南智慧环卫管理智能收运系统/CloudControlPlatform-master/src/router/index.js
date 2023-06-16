import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/find',
    component: () => import('@/views/login/find'),
    hidden: true
  },
  {
    path: '/reset',
    component: () => import('@/views/login/reset'),
    hidden: true
  },
  {
    path: '/deploy',
    component: () => import('@/views/deploy/deploy'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/500',
    component: () => import('@/views/error-page/500'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      component: () => import('@/views/monitor/new'),
      name: 'Dashboard',
      meta: {
        title: 'dashboard',
        icon: 'dashboard',
        affix: true
      }
    }]
  },
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [

  // {
  //   path: '/icon',
  //   component: Layout,
  //   children: [{
  //     path: 'index',
  //     component: () => import('@/views/icons/index'),
  //     name: 'Icons',
  //     meta: {
  //       title: 'icons',
  //       icon: 'icon',
  //       noCache: true
  //     }
  //   }]
  // },
  {
    path: '/monitor',
    component: Layout,
    redirect: '/monitor',
    children: [{
      path: 'index',
      component: () => import('@/views/monitor/new'),
      name: 'Monitor',
      meta: {
        title: '实时监控',
        icon: 'eye-open',
      }
    }]
  },
  {
    path: '/user',
    component: Layout,
    children: [{
      path: 'index',
      component: () => import('@/views/userManager/index'),
      name: 'Users',
      meta: {
        title: '用户管理',
        icon: 'el-icon-user',
        noCache: true
      }
    }]
  },
  {
    path: '/park',
    component: Layout,
    children: [{
        path: 'index',
        component: () => import('@/views/parkManager/index'),
        name: 'Park',
        meta: {
          title: '园区管理',
          icon: 'international',
          noCache: true
        }
      },
      {
        path: 'create',
        component: () => import('@/views/parkManager/create'),
        meta: {
          title: '新增园区',
          noCache: true
        },
        name: 'createPark',
        hidden: true
      },
    ]
  },
  {
    path: '/task',
    component: Layout,
    meta: {
      title: '作业规划',
      icon: 'form',
      roles: ['admin', 'editor'] // you can set roles in root nav
    },
    children: [{
        path: 'taskArea',
        name: 'taskArea',
        component: () => import('@/views/taskPlan/taskArea'),
        meta: {
          title: '作业区域',
          noCache: true
        }
      },
      {
        path: 'planIndex',
        name: 'planIndex',
        component: () => import('@/views/taskPlan/planIndex'),
        meta: {
          title: '作业计划',
          noCache: true
        }
      },
      {
        path: 'taskRecord',
        name: 'taskRecord',
        component: () => import('@/views/taskPlan/taskRecord'),
        meta: {
          title: '任务记录',
          noCache: true
        },
      },
      {
        path: 'historyDetails/:vin17/:startTime/:endTime/:taskSchedule',
        component: () => import('@/views/taskPlan/historyDetails'),
        meta: {
          title: '历史回放',
          noCache: true
        },
        name: 'historyDetails',
        hidden: true
      },
    ]
  },

  {
    path: '/vehicles',
    component: Layout,
    children: [{
      path: 'index',
      component: () => import('@/views/vehicles/index'),
      name: 'Vehicles',
      meta: {
        title: '车辆管理',
        icon: 'component',
        noCache: true
      }
    }]
  },

  {
    path: '/logs',
    component: Layout,
    children: [{
      path: 'index',
      component: () => import('@/views/logs/index'),
      name: 'Log',
      meta: {
        title: '日志管理',
        icon: 'el-icon-notebook-2',
        noCache: true
      }
    }]
  },

  {
    path: '/systemConfig',
    component: Layout,
    children: [{
      path: 'index',
      component: () => import('@/views/systemConfig/index'),
      name: 'systemConfig',
      meta: {
        title: '系统配置',
        icon: 'example',
        noCache: true
      }
    }]
  },

  // 404 page must be placed at the end !!!
  {
    path: '*',
    redirect: '/404',
    hidden: true
  }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({
    y: 0
  }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
