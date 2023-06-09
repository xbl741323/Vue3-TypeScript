# Vue3学习记录

## 一、Vue3新特性介绍

### 1、重写双向绑定

```
vue2 基于Object.defineProperty()实现
vue3 基于Proxy
```

proxy与Object.defineProperty(obj, prop, desc)方式优势对比如下：

Proxy的优势：

1、Proxy可以直接监听对象而不是属性(Object.defineProperty一次只能监视一个属性，如果要监视一个对象，那么需要遍历这个对象)，可以直接监听数组的变化(Object.defineProperty需要对7个核心数组进行重写才能监视数组)

2、Proxy有多达13中拦截方法，不限于apply,ownKeys,deleteProperty等等，这些是Object.defineProperty所不具备的

3、Proxy返回的是一个新的对象，我们可以只操作新的对象来达到目的，而Object.defineProperty只能遍历对象属性直接修改

Object.defineProperty的优势如下：

兼容性好，支持IE9，而Proxy的存在浏览器的兼容问题，而且无法用polyfill(垫片)来弥补

### 2、Vue3 优化Vdom

在Vue2中,每次更新diff,都是全量对比,Vue3则只对比带有标记的,这样大大减少了非动态内容的对比消耗

### 3、Vue3 Fragment

vue3 允许我们支持多个根节点

```
<template>
  <div></div>
  <div></div>
</template>
```

同时支持render JSX 写法，新增了Suspense teleport和多v-model用法

### 4、Vue3 Tree shaking

简单来讲，就是在保持代码运行结果不变的前提下，去除无用的代码，在Vue2中，无论我们使用什么功能，它们最终都会出现在生产代码中。主要原因是Vue实例在项目中是单例的，捆绑程序无法检测到该对象的哪些属性在代码中被使用到，而Vue3源码引入tree shaking特性，将全局 API 进行分块。如果你不使用其某些功能，它们将不会包含在你的基础包中，就是比如你要用watch 就是import {watch} from 'vue' 其他的computed 没用到就不会给你打包减少体积

### 5、Vue 3 Composition Api

Setup 语法糖式编程

## 二、nvm介绍与使用

Vue3需要16.0或更高版本的Node.js支持，这里推荐使用nvm进行Node版本的切换，nvm可以在一台电脑上安装多个 Node.js 版本，并且可以一条指令随时下载或切换版本，而不需要频繁地下载/卸载不同版本的 node.js 来满足当前项目的要求。

+ 官方下载地址：`https://github.com/coreybutler/nvm-windows/releases`

```
常用命令：
nvm --version 显示nvm版本
nvm list available 显示所有可以下载的版本
nvm list installed 显示已安装的版本
nvm install 14.5.0 安装 14.5.0 版本的 node.js
nvm uninstall 14.5.0 卸载 14.5.0 版本的 node.js
nvm use 14.5.0 切换 14.5.0 版本的 node.js
nvm current 查看当前使用的node版本
```

## 三、项目脚手架创建

```
npm init vue@latest // Vue官方的项目脚手架
或
npm init vite@latest // 支持多种框架Vue React等
```
+ 项目创建完成以后在vscode中安装一下Vue Language Features(Volar)和TypeScript Vue Plugin(Volar)就可以编写Vue3代码了（Vue2的Vetur需要禁用，不然会有冲突）

## 四、Vue3语法介绍
### 1、TypeScript 与组合式 API

组合式 API (Composition API) 是一系列 API 的集合，使我们可以使用函数而不是声明选项的方式书写 Vue 组件。
```
<template></template>

<script setup lang='ts'>
import { ref, reactive } from 'vue'

</script>

<style scoped></style>
```
组合式 API 最基本的优势是它使我们能够通过组合函数来实现更加简洁高效的逻辑复用。在选项式 API 中我们主要的逻辑复用机制是 mixins，而组合式 API 解决了 mixins 的所有缺陷。
```
更多组合式API常见解答见官网：https://cn.vuejs.org/guide/extras/composition-api-faq.html
```

### 2、ref与reactive
+ 1、ref函数
```
1、作用：定义一个响应式的数据，主要用于基本类型
import { ref } from 'vue'
const a = ref(0)
2、js中操作数据：a.value
a.value = 1
3、模板中读取数据：不需要.value，直接<div>{{a}}</div>
```

+ 2、reactive函数

```
1、作用：定义一个对象（或数组）类型的响应式数据（基本类型别用它，用ref函数）
import { reactive } from 'vue'
const a = reactive({
  name:'胡桃'
})
2、js中操作数据：不需要a.value，直接操作
a.name = '甘雨'
3、reactive定义的响应式数据是"深层次的"
```

+ 补充数组相关
```
interface info {
  id: number,
  title: string
}
interface dataInfoFace {
  title: string, dataList: info[]
}
// 用ref定义规范数组
const dataList = ref<info[]>([])
// 用reactive定义对象中的规范数组
const dataInfo = reactive<dataInfoFace>({
  title: '',
  dataList: []
})

const getList = () => {
  let params = {
    substationId: 20
  }
  // 用res:any解决code找不到的问题
  getListColumn(params).then((res: any) => {
    if (res.code == 0) {
      dataList.value = res.data
      dataInfo.dataList = res.data
    }
  })
}
```

### 3、计算属性
```
功能：与Vue2.x中computed配置功能一致
<template>
  <div class="contain">
    <h1>{{ name }}</h1>
    <h1>{{ getName }}</h1>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
let name = ref('胡桃')
let getName = computed(() => {
  return `我是${name}`
})
</script>

<style scoped></style>
```

### 4、watch和watchEffect
+ 1、watch的作用是：既要指明监视的属性，也要指明监视的回调。
+ 2、watchEffect的作用是：不用指明监视哪个属性，监视的回调中用到哪个属性，那就监视哪个属性。
```
watch功能与Vue2.x中computed配置功能一致
watchEffect有点像computed：
但computed注重的计算出来的值（回调函数的返回值），所以必须要写返回值。
而watchEffect更注重的是过程（回调函数的函数体），所以不用写返回值。

<template>
  <div class="contain">
    <div @click="changeVal()">点我改名</div>
    <h1>{{ name }}</h1>
    <h1>{{ getName }}</h1>
    <h1>{{ age }}</h1>
    <h1>{{ info.name }}{{ info.age }}{{ info.hobby.name }}</h1>
    <button @click="stopWatch()">停止监听</button>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, watchEffect } from 'vue';
let name = ref<string>('胡桃')
let age = ref<number>(18)
type obj = {
  name: string,
  age: number,
  hobby: {
    name: string,
  }
}
let info = reactive<obj>({
  name: '七七',
  age: 8,
  hobby: {
    name: '玩游戏'
  }
})
let changeVal = () => {
  name.value = '甘雨'
  age.value = 20
  info.name = '可莉'
  info.age = 18
  info.hobby = {
    name: '读书'
  }
}
// watch 1、监视单响应个数据
watch(name, (newVal, oldVal) => {
  console.log(newVal, 'newVal')
  console.log(oldVal, 'oldVal')
})

// watch 2、监视多个响应数据
watch([name, age], (newVal, oldVal) => {
  console.log(newVal, 'newVal')
  console.log(oldVal, 'oldVal')
})

// watch 3、监视响应对象 immediate：true 初始化加载时执行监听 
// 注意：此处无法正确获取oldValue
watch(info, (newVal, oldVal) => {
  console.log(newVal, 'newVal')
  console.log(oldVal, 'oldVal')
}, { immediate: true })

// watch 4、监视reactive所定义的一个响应式对象数据中的某个属性
watch(() => info.age, (newVal, oldVal) => {
  console.log(newVal, 'newVal age')
  console.log(oldVal, 'oldVal age')
}, { immediate: true }

// watch 5、监视reactive所定义的一个响应式对象数据中的多个属性
watch([() => info.name,() => info.age], (newVal, oldVal) => {
  console.log(newVal, 'newVal name age')
  console.log(oldVal, 'oldVal name age')
}, { immediate: true }

// watch 6、监视reactive所定义的一个响应式对象数据中的对象属性，deep: true 对对象进行深度监听
watch(() => info.hobby, (newVal, oldVal) => {
  console.log(newVal, 'newVal hobby')
  console.log(oldVal, 'oldVal hobby')
}, { immediate: true, deep: true })

// watchEffect 1、立即运行一个函数，同时响应式地追踪其依赖，并在依赖更改时重新执行。
watchEffect(() => {
  console.log(name.value, 'watchEffect')
})

// watchEffect 2、onInvalidate可以在执行监听前执行
watchEffect((onInvalidate) => {
  console.log(name.value, 'watchEffect')
  onInvalidate(() => {
    console.log('before')
  })
})

// watchEffect 3、停止侦听器：
const stop = watchEffect((onInvalidate) => {
  console.log(name.value, 'watchEffect')
  onInvalidate(() => {
    console.log('before')
  })
})

const stopWatch = () => stop()

// watchEffect 4、设置 flush: 'post' 将会使侦听器延迟到组件渲染之后再执行。
watchEffect(() => {}, {
  flush: 'post',
  onTrack(e) {
    debugger
  },
  onTrigger(e) {
    debugger
  }
})

</script>

<style scoped></style>
```

### 5、生命周期
Vue3.0中也提供了Composition API形式的生命周期钩子，与Vue2.x中钩子对应关系如下：
+ beforeCreate ==> setup()
+ created ==> setup()
+ beforeMount ==> onBeforeMount
+ mounted ==> onMounted
+ beforeUpdate ==> onBeforeUpdate
+ updated ==> onUpdated
+ beforeUnmount ==> onBeforeUnmount
+ unmounted ==> onUnmounted
```
<script setup lang="ts">
import { onBeforeMount, onMounted, onBeforeUpdate, onUpdated, onBeforeUnmount, onUnmounted } from 'vue';

// 创建前-读取不到dom
onBeforeMount(() => {
  console.log('onBeforeMount')
})

// 创建完成-可以读取dom
onMounted(() => {
  console.log('onMounted')
})

// 更新前-获取的是更新前的dom
onBeforeUpdate(() => {
  console.log('onBeforeUpdate')
})

// 更新完成-获取的是更新完成后的dom
onUpdated(() => {
  console.log('onUpdated')
})

// 销毁前
onBeforeUnmount(() => {
  console.log('onBeforeUnmount')
})

// 销毁完成
onUnmounted(() => {
  console.log('onUnmounted')
})
</script>
```

### 6、父子组件传值
+ 父组件传值给子组件
```
<template>
  <Head :title="title"></Head>
  <button @click="toPage('甘雨',13)"></button>
</template>

<script setup lang="ts">
import Head from '@/components/common/head.vue'
import { ref } from 'vue'
const title = ref('首页')
</script>
```
+ 子组件接收父组件值
```
<script setup lang="ts">
// 方式1：运行时声明
const props = defineProps({
  title: { type: String, required: true },
})

// 方式2：基于类型的声明，使用泛型接收
const props = defineProps<{
  title: string
}>()

// 当使用基于类型的声明时，我们失去了为 props 声明默认值的能力，这可以通过 withDefaults 编译器宏解决
const props = withDefaults(defineProps<{
  title: string,
  age: number
}>(), {
  title: '我是默认值',
  age: ()=>{ // 通过方法返回
    return: `我是默认值`
  }
})
</script>
```
+ 子组件使用emit传值给父组件，以及暴露属性和方法给父组件
```
<script setup lang="ts">
// 子组件使用emit传值给父组件
// 1、运行时
const emit = defineEmits(['changeTitle','changeName'])

// 2、基于类型
const emit = defineEmits<{
  (e: 'changeTitle', name: string, index: number): void
  (e: 'changeName', name: string, index: number): void
}>()

const toPage = (name: string, index: number) => {
  // 使用
  emit('changeTitle', name, index)
  emit('changeName', name, index)
};


// 子组件暴露给父组件的属性和方法
const activeIndex = ref(0)
defineExpose({
  activeIndex,
  open:()=>{
    console.log('子组件暴露的open')
  }
})
</script>
```
+ 父组件使用子组件暴露的属性和方法
```
<template>
  // 1、绑定ref
  <Head :title="title" @changeTitle="changeHeadTitle" ref="head"></Head>
</template>

<script setup lang="ts">
import Head from '@/components/common/head.vue'
import { ref } from 'vue'
const title = ref('首页')
  // 2、使用InstanceType定义获取子组件暴露的值
const head = ref<InstanceType<typeof Head>>()
const changeHeadTitle = (val: string) => {
  title.value = val
  // 3、使用Head.value获取属性与方法
  console.log(Head.value?.activeIndex,'子组件暴露的值')
  head.value?.open()
}
</script>
```

### 7、其它Composition API
+ toRef
```
作用：创建一个ref对象，其value值指向另一个对象中的某个属性值
const a = reactive({
  name:'甘雨'
})
const name = toRef(a,'name')
应用：要将响应式对象中的某个属性单独提供给外部使用时
注意：只对响应式对象有用，修改非响应式对象视图无变化
```

+ toRefs
```
作用：toRefs与toRef功能一致，但可以批量创建多个ref对象
const a = reactive({
  name: '甘雨',
  gender: '女',
  age: 18
})
const {name,gender,age} = toRefs(a)
应用：需要解构获取响应式对象的属性值时
原理解释：
const toRefs = <T extends object>(a:T){
  const map:any = {}
  for(let key in a){
    map[key] = toRef(a,key)
  }
  return map
}
```
+ toRaw
```
作用：将一个由reactive生成的对象转为普通对象
const a = reactive({
  name: '甘雨',
  gender: '女',
  age: 18
})
toRaw(a)
```
+ markRaw
```
作用：标记一个对象，使其永远不会再成为响应式对象
应用场景：
(1)：有些值不应被设置为响应式的，例如复杂的第三方类库等
(2)：当渲染具有不可变数据源的大列表时，跳过响应式转换可以提高性能
```

+ 响应式数据的判断
```
isRef：检查一个值是为一个ref对象
isReactive：检查一个对象是否是由reactive创建的响应式代理
isReadonly：检查一个对象是否是由readonly创建的只读代理
isProxy：检查一个对象是否是由reactive或者readonly方法创建的代理
```
+ readonly与shallowReadonly
```
readonly：让一个响应式数据变为只读的（深只读）
shallowReadonly：让一个响应式数据变为只读的（浅只读，reactive创建的对象数据第一层不能改）
应用场景：不希望数据被修改时
```

+ shallowReactive与shallowRef
```
shallowReactive：只处理对象最外层属性的响应式（浅响应式）
shallowRef：只处理基本数据类型的响应式，不进行对象的响应式处理
使用场景：
如果有一个对象数据，结构比较深，但变化时只是外层属性变化 ==> shallowReactive
如果有一个对象，后续功能不会修改该对象中的属性，而是生成新的对象来替换 ==> shallowRef
```

+ customRef
```
作用：创建一个自定义的ref，并对其依赖项跟踪和更新触发进行显式控制，案例：实现防抖效果
```

## 五、Vue3 Router（路由）`官网地址：https://router.vuejs.org/zh/`
+ vue-route是vue.js官方给出路由解决方案，只能结合vue项目使用，能够轻松管理SPA项目中的组件切换。
+ 注意版本：vue-router3.x只能结合vue2使用，vue-router4.x只能结合vue3使用，此处介绍的是vue-router4.x版本。

### 1、创建路由
```
import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/home/index.vue'
import Service from '@/views/service/index.vue'
import Policy from '@/views/policy/index.vue'
import PolicyDetail from '@/views/policy/detail.vue'
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
      path: '/policyDetail',
      name: 'policyDetail',
      component: PolicyDetail
    },
    {
      path: '/personal',
      name: 'personal',
      component: Personal
    }
  ]
})

export default router
```

### 2、编程式导航
+ 因为我们在 setup 里面没有访问 this，所以我们不能再直接访问 this.$router 或 this.$route。作为替代，我们使用 useRouter 和 useRoute
```
<script setup lang="ts">
import { useRouter } from 'vue-router'
import { reactive } from 'vue';
interface essayInter {
  id: number
  title: string,
  content: string,
}

const router = useRouter();
const toPage = (info: essayInter) => {
  router.push({
    name: 'policyDetail',
    query: {
      title: info.title,
      content: info.content
    }
  })
}
</script>
```
+ 接收参数
```
<template>
  <div class="contain">
    <span>{{ route.query.title }}</span>
    <span>{{ route.query.content }}</span>
  </div>
</template>

<script setup lang='ts'>
import { useRoute } from 'vue-router'
const route = useRoute()
</script>
```

+ 注意：在模板中我们仍然可以访问 $router 和 $route，所以不需要在 setup 中返回 router 或 route。
```
<template>
  <div class="contain">
    <span>{{ $route.query.title }}</span>
  </div>
</template>
```
+ 注意：最新版本路由已经不支持 params传参（需要配合动态传参使用），可以通过 query 传参
```
<script setup lang="ts">
import { useRouter } from 'vue-router'
import { reactive } from 'vue';
interface essayInter {
  id: number
  title: string,
  content: string,
}

const router = useRouter();
const toPage = (info: essayInter) => {
  router.push({
    name: 'policyDetail',
    // 不支持params传参，获取的参数为空
    // params: {
    //   title: info.title,
    //   content: info.content
    // }
    query: {
      title: info.title,
      content: info.content
    }
  })
}
</script>
```

### 3、动态传参
+ 路由页面配置参数id
```
import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/home/index.vue'
import PolicyDetail from '@/views/policy/detail.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/policyDetail/:id',  // 动态路由参数
      name: 'policyDetail',
      component: PolicyDetail
    }
  ]
})

export default router

```
+ 传参页面
```
<script setup lang="ts">
import { useRouter } from 'vue-router'
interface essayInter {
  id: number
  title: string,
  content: string,
}

const router = useRouter();
const toPage = (info: essayInter) => {
  router.push({
    name: 'policyDetail',
    params:{
      id: 1
    }
  })
}
</script>
```
+ 接收参数页面
```
<template>
  <div class="contain">
    <span>{{ $route.params.id }}</span>
  </div>
</template>

```

### 4、嵌套路由
嵌套路由：通过路由实现组件的嵌套展示。
+ 1、声明子路由链接和子路由占位符
```
<template>
  <div class="contain">
    <div class="tab-contain">
      <!-- 声明子路由链接 -->
      <div 
       @click="changeTab(index)"
       :class="['tab-item', tabIndex === index ? 'active-tab-item' : '']" 
       v-for="(item, index) in tabList" 
       :key="item.path">{{ item.title }}</div>
      </div>
     <!-- 声明子路由占位符 -->
    <RouterView />
  </div>
</template>

<script setup lang="ts">
import {
  ref,
  reactive,
} from 'vue';
import { RouterView, useRouter } from 'vue-router';
const router = useRouter()
const tabIndex = ref<number>(0)
const tabList = reactive([
  {
    title: '服务1',
    path: '/service/serviceOne'
  },
  {
    title: '服务2',
    path: '/service/serviceTwo'
  }
])

const changeTab = (index:number)=>{
  tabIndex.value = index
  toPage(tabList[index].path)
}

const toPage = (path:string)=>{
  router.push({
    path: path
  })
}

</script>

<style scoped>
.contain {
  padding: 0;
}

.tab-contain {
  display: flex;
  height: 40px;
  border-bottom: 1px solid #e7e6eb;
}

.tab-item {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.active-tab-item {
  color: #36a6fe;
}
</style>
```
+ 2、在父路由规则中，通过children属性嵌套声明子路由规则
```
import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/home/index.vue'
import Service from '@/views/service/index.vue'
import ServiceOne from '@/views/service/children/service-one.vue'
import ServiceTwo from '@/views/service/children/service-two.vue'

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
      redirect: '/service/serviceOne', // 嵌套路由的重定向
      component: Service,
      // 通过 children 属性嵌套声明子级路由规则
      // 注意：子路由的path不要以/开头
      children: [
        {
          path: 'serviceOne',
          component: ServiceOne
        },
        {
          path: 'serviceTwo',
          component: ServiceTwo
        }
      ]
    }
  ]
})

export default router
```

## 六、pinia（轻量级的状态管理库）
+ Pinia 是 Vue 的存储库，它允许您跨组件/页面共享状态。
+ 与 Vuex 相比，Pinia 提供了一个更简单的 API，具有更少的规范，提供了 Composition-API 风格的 API，最重要的是，在与 TypeScript 一起使用时具有可靠的类型推断支持。

### 1、定义Store

+ 常规定义
```
import { defineStore } from 'pinia'
export const useCounterStore = defineStore('counter', {
  state: () => {
    return {
      count: 0
    }
  },
  // 也可以定义为
  // state: () => ({ count: 0 })
  getters: {
    // 自动将返回类型推断为数字
    doubleCount(state) {
      return state.count * 2
    },
    // 返回类型必须明确设置 可以通过this访问
    doublePlusOne(): number {
      return this.count * 2 + 1
    },
  },
  actions: {
    increment() {
      this.count++
    },
    reduce() {
      this.count--
    },
  },
})
```

+ 使用函数定义
```
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)
  const doubleCount = computed(() => count.value * 2)
  function increment() {
    count.value++
  }
  function reduce() {
    count.value--
  }
  return { count, doubleCount, increment, reduce }
})

```

### 2、页面使用
```
<template>
  <div class="contain">
    <h1>count：{{ counter.count }}</h1>
    <h1>doubleCount：{{ counter.doubleCount }}</h1>
    <button @click="countAdd">点我加一</button>
    <button @click="countReduce">点我减一</button>
    <button @click="countChange">点我改变</button>
  </div>
</template>

<script setup lang="ts">
import { useCounterStore } from '@/stores/counter'
const counter = useCounterStore()
const countAdd = () => {
  counter.increment()
}
const countReduce = () => {
  counter.reduce()
}
// 可以添加逻辑判断修改count值
const countChange = () => {
  counter.$patch((state) => {
    if (state.count < 0) {
      state.count = 0
    }
  })
}
</script>
```

### 3、解构store
+ state 也可以使用解构，但使用解构会使其失去响应式，这时候可以用 pinia 的 storeToRefs
```
<template>
  <div class="contain">
    <h1>count：{{ counter.count }}</h1>
    <button @click="countChange">点我改变</button>
  </div>
</template>

<script setup lang="ts">
import { useCounterStore } from '@/stores/counter'
import { storeToRefs } from 'pinia';
const counter = useCounterStore()
const { count } = storeToRefs(counter)
const countChange = () => {
  count.value++
}
</script>

<style scoped></style>
```
