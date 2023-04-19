# Vue3学习记录

## 一、学习Vue3第一章

### 1、Vue3新特性介绍
+ 1、重写双向绑定
```
vue2 基于Object.defineProperty()实现
vue3 基于Proxy
```
proxy与Object.defineProperty(obj, prop, desc)方式优势对比如下：
```
Proxy的优势：
1.Proxy可以直接监听对象而不是属性(Object.defineProperty一次只能监视一个属性，如果要监视一个对象，那么需要遍历这个对象)，可以直接监听数组的变化(Object.defineProperty需要对7个核心数组进行重写才能监视数组)

2.Proxy有多达13中拦截方法，不限于apply,ownKeys,deleteProperty等等，这些是Object.defineProperty所不具备的

3.Proxy返回的是一个新的对象，我们可以只操作新的对象来达到目的，而Object.defineProperty只能遍历对象属性直接修改
```
```
Object.defineProperty的优势如下：
兼容性好，支持IE9，而Proxy的存在浏览器的兼容问题，而且无法用polyfill(垫片)来弥补
```
+ 2、Vue3 优化Vdom
在Vue2中,每次更新diff,都是全量对比,Vue3则只对比带有标记的,这样大大减少了非动态内容的对比消耗

+ 3、Vue3 Fragment
vue3 允许我们支持多个根节点
```
<template>
  <div></div>
  <div></div>
</template>
```
同时支持render JSX 写法，新增了Suspense teleport和多v-model用法

+ 4、Vue3 Tree shaking
简单来讲，就是在保持代码运行结果不变的前提下，去除无用的代码，在Vue2中，无论我们使用什么功能，它们最终都会出现在生产代码中。主要原因是Vue实例在项目中是单例的，捆绑程序无法检测到该对象的哪些属性在代码中被使用到，而Vue3源码引入tree shaking特性，将全局 API 进行分块。如果你不使用其某些功能，它们将不会包含在你的基础包中，就是比如你要用watch 就是import {watch} from 'vue' 其他的computed 没用到就不会给你打包减少体积

+ 5、Vue 3 Composition Api
Setup 语法糖式编程 

### 2、nvm介绍与使用
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

