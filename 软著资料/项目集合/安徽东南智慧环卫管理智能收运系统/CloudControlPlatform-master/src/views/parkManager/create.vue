<template>
  <div>
    <div id="container" :style="{ height: 'calc(100vh - ' + 1 + 'px)' }"></div>

    <div class="input-card">
      <h4>作业园区</h4>
      <div class="input-item">
        <input
          type="button"
          class="btn"
          value="绘制园区"
          id="start"
          @click="startDrawPolygon()"
        />
        <input
          type="button"
          class="btn"
          value="取消创建"
          id="stop"
          @click="cancelCreate()"
        />
      </div>
      <div class="input-item">
        <input
          type="button"
          class="btn"
          value="结束并保存"
          id="resume"
          @click="stopAndSave()"
        />
        <input
          type="button"
          class="btn"
          value="清空"
          id="stop"
          @click="clearPolygon()"
        />
      </div>
    </div>

    <el-dialog title="新增园区" :visible.sync="dialogFormVisible" width="40%">
      <el-form
        :model="parkForm"
        :rules="parkRules"
        ref="parkForm"
        status-icon
        label-position="left"
        label-width="120px"
        class="step2-style"
      >
        <el-form-item :label="$t('作业园区名称')" prop="parkName">
          <el-input
            v-model="parkForm.parkName"
            clearable
            class="select-width"
            placeholder="请输入作业园区名称"
          >
          </el-input>
        </el-form-item>

        <el-form-item :label="$t('作业园区属性')" prop="parkProperty">
          <el-select
            v-model="parkForm.parkProperty"
            clearable
            class="select-width"
            placeholder="请选择园区属性"
          >
            <el-option label="开放园区" value="1"></el-option>
            <el-option label="封闭园区" value="2"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="createPark">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
// 添加要素
import { addPark } from "@/api/park";
import { Message } from "element-ui";
export default {
  data() {
    return {
      center: [108.939621, 34.343147],
      map: null,
      layer: null,
      eventKey: null,
      dialogFormVisible: false,
      polygonList: [],
      parkForm: {
        parkName: "",
        parkProperty: "",
        parkLocation: [],
      },
      parkRules: {
        parkName: [
          { required: true, message: "请输入园区名称", trigger: "blur" },
        ],
        parkProperty: [
          { required: true, message: "请选择园区属性", trigger: "blur" },
        ],
      },
    };
  },
  mounted() {
    setTimeout(() => {
      this.mapInit();
    }, 1000);
  },

  methods: {
    mapInit() {
      this.map = new AMap.Map("container", {
        center: this.center,
        zoom: 4,
      });
      this.map.addControl(
        new AMap.MapType({
          defaultType: 0, //0代表默认，1代表卫星
        })
      );
    },

    //创建作业园区
    createPark() {
      if (this.parkForm.parkLocation.length < 2) {
        Message({
          message: "请先在地图绘制范围",
          type: "warning",
          duration: 3000,
        });
        return false;
      }
      this.$refs["parkForm"].validate((valid) => {
        if (valid) {
          addPark(this.parkForm).then((response) => {
            if (response.code == 200) {
              this.clearPolygon();
              this.goParkHome();
              Message({
                message: response.message,
                type: "success",
                duration: 3000,
              });
            } else {
              Message({
                message: response.message,
                type: "error",
                duration: 3000,
              });
            }
          });
        }
      });
    },
    //绘制作业园区
    startDrawPolygon() {
      this.clearPolygon();
      let __this = this;
      this.map.plugin("AMap.MouseTool", function () {
        __this.mouseTool = new AMap.MouseTool(__this.map);
      });
      this.mouseTool.polygon(this.polyType);
      //监听draw事件可获取画好的覆盖物
      this.polygonList = [];
      this.mouseTool.on("draw", function (e) {
        __this.polygonList.push(e.obj);
        console.log("绘制的多边形", __this.polygonList);
        __this.mouseTool.close();
      });
    },
    stopAndSave() {
      //清空缓存
      this.$nextTick(() => {
        this.$refs["parkForm"].clearValidate();
        this.$refs["parkForm"].resetFields();
      });
      let savedPolygon = [];
      this.dialogFormVisible = true;
      for (let i = 0; i < this.polygonList.length; i++) {
        console.log(this.polygonList[i].getOptions());
        let op = this.polygonList[i].getOptions();
        let routePath = [];
        op.path.forEach((item) => {
          routePath.push([item.lng, item.lat]);
          this.parkForm.parkLocation.push({
            lng: item.lng,
            lat: item.lat,
          });
        });
        console.log(routePath);
        console.log(this.parkForm.parkLocation);
      }
    },

    clearPolygon() {
      // this.map.remove(this.polygonList);
      this.polygonList = [];
      this.map.clearMap(); // 清除地图上的所有覆盖物
    },
    cancelCreate() {
      this.$router.go(-1);
    },
    // 用保存的数据重新绘制多边形并添加事件
    redrawPolygon() {
      let __this = this;
      // 用浏览器模拟数据库存取
      let savedPolygon = JSON.parse(sessionStorage.getItem("savedPolygon"));
      console.log("重绘多边形数据", savedPolygon);
      if (savedPolygon == null) return;
      for (let i = 0; i < savedPolygon.length; i++) {
        var polygon = new AMap.Polygon(savedPolygon[i]);
        this.map.add(polygon);
      }
    },
    //跳转首页
    goParkHome() {
      this.$router.push({ name: "Park" });
    },
  },
};
</script>

<style scoped>
@import url("https://a.amap.com/jsapi_demos/static/demo-center/css/demo-center.css");
.select-width {
  width: 100%;
}
.jobArea {
  position: absolute;
  left: 6px;
  top: 6px;
  width: 400px;
  height: 300px;
}
.input-card .btn {
  margin-right: 1.2rem;
  width: 9rem;
}

.input-card .btn:last-child {
  margin-right: 0;
}
</style>