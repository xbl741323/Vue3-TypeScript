<template>
  <div>
  <aside :class="['aui-sidebar', `aui-sidebar--${$store.state.sidebarLayoutSkin}`]">
    <div class="aui-sidebar__inner">
      <el-menu
        :default-active="$store.state.sidebarMenuActiveName"
        :collapse="$store.state.sidebarFold"
        :unique-opened="true"
        :collapseTransition="false"
        class="aui-sidebar__menu">
        <sub-menu v-for="menu in $store.state.sidebarMenuList" :key="menu.id" :menu="menu" />
      </el-menu>

      <div style="height: 30px;width:100%" class="element">

         宁ICP备2022000053号
      </div>
    </div>

  </aside>


  </div>
</template>
<style>
.element {
position: fixed ;
bottom: 2px;
left: 30px;

}
</style>
<script>
import SubMenu from './main-sidebar-sub-menu'
export default {
  data () {
    return {
    }
  },
  components: {
    SubMenu
  },
  created () {
    this.$store.state.sidebarMenuList = window.SITE_CONFIG['menuList']
  }
}
</script>
