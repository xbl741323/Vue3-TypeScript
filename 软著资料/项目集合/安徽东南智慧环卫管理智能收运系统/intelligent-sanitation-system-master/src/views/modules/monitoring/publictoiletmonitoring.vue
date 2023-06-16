<template>
  <el-card shadow="never" class="aui-card--fill">
    <el-container >
      <el-aside :style="{width: asideWidth+'vw'}">
        <div style="margin-top: 15px;background-color: white;">
          <el-input
              style="margin-bottom: 10px;"
              placeholder="输入关键字进行过滤"
              v-model="filterText">
          </el-input>
          <el-tree
              :data="toiletData"
              node-key="id"
              ref="toiletTree"
              show-checkbox
              highlight-current
              @check="getCheckedNodes"
              style="height: 68vh;overflow: auto;"
              :filter-node-method="filterNode"
              :props="defaultProps">
              <span class="custom-tree-node" slot-scope="{ node, data }">
                  <span v-if="data.nodeType=='SysDeptDTO'"  style="color: black;">
                    <i class="el-icon-notebook-2"></i>
                    {{ data.name }}
                  </span>
                  <span v-else-if="data.nodeType=='PublictoiletDTO'"  style="color: black;">
                    <i class="el-icon-toilet-paper"></i>
                    {{ data.name }}
                  </span>
                </span>
          </el-tree>
        </div>
      </el-aside>
      <el-main style="height: 100%;">
        <div style="z-index: 999;position: absolute;top: 2vh;">
          <i v-if="asideShow" class="el-icon-s-fold" @click="asidePackUp" style="font-size: 20px!important;"></i>
          <i v-else class="el-icon-s-unfold" @click="asideUnfold" style="font-size: 20px!important;"></i>
        </div>
        <div class="toiletContainer" id="toiletContainer"></div>
      </el-main>
    </el-container>
  </el-card>
</template>

<script>
import { getPublicToiletTree } from "@/api/carmonitoring";



let markers = [];
let cluster;
export default {
  data () {
    return {
      asideWidth:20,
      asideShow:true,
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      filterText:'',
      toiletData:[],
    }
  },
  created () {
    let that = this;
    getPublicToiletTree().then(response => {
      that.toiletData=response.data.data;
      console.log(that.toiletData,999)
    });
  },
  methods: {
    asidePackUp() {
      this.asideWidth=0;
      this.asideShow=false;
      this.footerWidth=100;
    },
    asideUnfold() {
      this.asideWidth=20;
      this.asideShow=true;
      this.footerWidth=77;
    },
    getCheckedNodes(){

    },
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
  },
  watch: {
    filterText(val) {
      let that = this;
      that.$refs.toiletTree.filter(val);
    }
  },
  mounted() {
    let param = {
      resizeEnable: true,
      zoom: 15
    };
    this.map = new AMap.Map("toiletContainer", param);
    cluster = new AMap.MarkerClusterer(this.map, markers, {gridSize: 80})
  }
}
</script>

<style>
.el-card__body{
  padding: 0px!important;
}
.aui-content > .el-tabs > .el-tabs__content {
  padding: 0px!important;
}
.el-main{
  padding: 0px!important;
}

.toiletContainer {
  height: 92vh;
}
.show_table ::-webkit-scrollbar {
  display: none;
}
</style>
