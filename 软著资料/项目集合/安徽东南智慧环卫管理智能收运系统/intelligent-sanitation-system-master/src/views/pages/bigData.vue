<template>
  <div >
    <div style="width: 100vw;height: 100vh">
    <iframe src="/bigData/index.html"  style="width: 100%;height: 100%" frameborder="0" scrolling="no"  id="bdIframe">
    </iframe>
    </div>
    <div class="btn-bar">
      <el-button v-show="false" id="enter_sys_btns" type="primary" @click="$router.push({ name: 'home' })">进入系统</el-button>
    </div>
  </div>
</template>

<script>

export default {
  name: "bigData",

    mounted() {
    // console.log(index); oIframe
//      const oIframe = document.getElementById('bdIframe');
//      const deviceWidth = document.documentElement.clientWidth;
//      const deviceHeight = document.documentElement.clientHeight;
//      console.log('deviceHeight',deviceHeight)
//      oIframe.style.width = (Number(deviceWidth)) + 'px'; //数字是页面布局宽度差值
//      oIframe.style.height = (Number(deviceHeight)-120) + 'px'; //数字是页面布局高度差
  }
}
</script>

<style scoped>

</style>