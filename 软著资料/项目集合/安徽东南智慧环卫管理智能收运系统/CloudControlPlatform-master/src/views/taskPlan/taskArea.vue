<template>
  <div>
    <div id="container" :style="{ height: 'calc(100vh - ' + 1 + 'px)' }"></div>
    <div class="jobArea">
      <el-collapse accordion>
        <el-collapse-item>
          <template slot="title">
            <span style="font-size: 24px">作业区域</span>
          </template>
          <div class="app-container">
            <div class="filter-container">
              <el-input
                v-model="listQuery.areaName"
                placeholder="作业区域/路线名称"
                style="width: 170px"
                class="filter-item"
                @keyup.enter.native="handleFilter"
              />
              <el-button
                class="filter-item"
                style="margin-left: 10px"
                @click="handleFilter"
              >
                {{ $t("查询") }}
              </el-button>
              <el-button
                class="filter-item"
                style="margin-left: 10px"
                @click="deleteJobArea"
              >
                {{ $t("删除") }}
              </el-button>
            </div>

            <el-table
              :data="list"
              :border="false"
              :stripe="true"
              ref="areaTable"
              @select="showSelectedArea"
              fit
              highlight-current-row
            >
              <el-table-column type="selection" width="50"> </el-table-column>
              <el-table-column :label="$t('编号')" align="center">
                <template slot-scope="{ row }">
                  <span>{{ row.areaNumber }}</span>
                </template>
              </el-table-column>

              <el-table-column :label="$t('区域名称')" align="center">
                <template slot-scope="{ row }">
                  <span>{{ row.areaName }}</span>
                </template>
              </el-table-column>

              <el-table-column :label="$t('作业园区')" align="center">
                <template slot-scope="{ row }">
                  <span>{{ row.parkName }}</span>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>

    <div class="input-card">
      <h4>作业区域/路线绘制</h4>
      <div class="input-item">
        <input
          type="button"
          class="btn"
          value="绘制区域"
          id="start"
          @click="startDrawPolygon()"
        />
        <input
          type="button"
          class="btn"
          value="绘制路线"
          id="pause"
          @click="startDrawLine()"
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

    <el-dialog
      title="新增作业区域"
      :visible.sync="dialogFormVisible"
      width="40%"
    >
      <el-form
        :model="jobAreaForm"
        :rules="jobAreaRules"
        ref="jobAreaForm"
        status-icon
        label-position="left"
        label-width="150px"
        class="step2-style"
      >
        <el-form-item :label="$t('作业园区')" prop="parkName">
          <el-select
            v-model="jobAreaForm.parkName"
            clearable
            class="select-width"
            placeholder="请选择作业园区"
          >
            <el-option
              v-for="item in parkOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item :label="$t('作业区域/路线名称')" prop="areaName">
          <el-input
            v-model="jobAreaForm.areaName"
            clearable
            class="select-width"
            placeholder="请输入作业区域/路线名称"
          >
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="createJobArea">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
// 添加要素
import {
  addJobArea,
  inquireJobArea,
  deleteJobArea,
} from "@/api/operationalPlanning";
import { inquirePark } from "@/api/park";
import { Message } from "element-ui";
export default {
  data() {
    return {
      center: [108.939621, 34.343147],
      map: null,
      mouseTool: null,
      polyType: {
        strokeColor: "#3366FF",
        strokeOpacity: 1,
        strokeWeight: 3,
        // strokeOpacity: 0.2,
        fillColor: "red",
        // fillOpacity: 0.4,
        // 线样式还支持 'dashed'
        strokeStyle: "solid",
        // strokeStyle是dashed时有效
        // strokeDasharray: [30,10],
      },
      lineType: {
        strokeColor: "red",
        strokeOpacity: 1,
        strokeWeight: 3,
        // 线样式还支持 'dashed'
        strokeStyle: "solid",
        // strokeStyle是dashed时有效
        // strokeDasharray: [10, 5],
      },
      polygonList: [],
      savedPolygon: [],
      layer: null,
      eventKey: null,
      dialogFormVisible: false,
      jobAreaForm: {
        parkName: "",
        areaName: "",
        areaLocation: [],
      },
      parkOptions: [],
      jobAreaRules: {
        parkName: [
          { required: true, message: "请选择作业园区", trigger: "blur" },
        ],
        areaName: [
          {
            required: true,
            message: "请输入作业区域/路线名称",
            trigger: "blur",
          },
        ],
      },
      formLabelWidth: "120px",
      list: null,
      total: 0,
      listQuery: {
        page: 1,
        pageSize: 20,
        areaName: undefined,
      },
    };
  },
  mounted() {
    setTimeout(() => {
      this.mapInit();
    }, 1000);
    this.getParkData();
    this.getList();
  },

  methods: {
    mapInit() {
      this.map = new AMap.Map("container", {
        center: this.center,
        zoom: 10,
      });
      this.map.addControl(
        new AMap.MapType({
          defaultType: 0, //0代表默认，1代表卫星
        })
      );
    },
    //获取列表数据
    getList() {
      inquireJobArea(this.listQuery).then((response) => {
        this.list = response.data.jobAreas;
        this.total = response.data.count;
      });
    },
    //查询
    handleFilter() {
      this.listQuery.page = 1;
      this.getList();
    },
    //获取园区数据
    getParkData() {
      inquirePark({}).then((response) => {
        for (let item of response.data.parks) {
          this.parkOptions.push({
            value: item.parkName,
            label: item.parkName,
          });
        }
      });
    },
    //创建作业区域
    createJobArea() {
      if (this.jobAreaForm.areaLocation.length < 2) {
        Message({
          message: "请先在地图绘制范围",
          type: "warning",
          duration: 3000,
        });
        return false;
      }
      this.$refs["jobAreaForm"].validate((valid) => {
        if (valid) {
          addJobArea(this.jobAreaForm).then((response) => {
            if (response.code == 200) {
              this.clearPolygon();
              this.dialogFormVisible = false;
              this.getList();
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
    deleteJobArea() {
      const data = [];
      const selectedData = this.$refs.areaTable.selection;
      if (selectedData.length < 1) {
        Message({
          message: "请选择要删除的作业区域或路线",
          type: "error",
          duration: 3000,
        });
        return;
      }
      for (let item of selectedData) {
        data.push(item.areaName);
      }
      const sendData = { areaName: data.join(",") };
      deleteJobArea(sendData).then((response) => {
        if (response.code == 200) {
          this.getList();
          Message({
            message: "作业区域或路线删除成功",
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
    },
    //绘制作业区域
    startDrawPolygon() {
      this.clearPolygon();
      let __this = this;
      this.map.plugin("AMap.MouseTool", function () {
        __this.mouseTool = new AMap.MouseTool(__this.map);
      });
      this.mouseTool.polygon(this.polyType);
      //监听draw事件可获取画好的覆盖物
      // this.polygonList = [];
      this.mouseTool.on("draw", function (e) {
        __this.polygonList.push(e.obj);
        console.log("绘制的多边形", __this.polygonList);
        __this.mouseTool.close();
      });
    },
    //绘制作业路线
    startDrawLine() {
      this.clearPolygon();
      let __this = this;
      this.map.plugin("AMap.MouseTool", function () {
        __this.mouseTool = new AMap.MouseTool(__this.map);
      });
      this.mouseTool.polyline(this.lineType);
      //监听draw事件可获取画好的覆盖物
      // this.polygonList = [];
      this.mouseTool.on("draw", function (e) {
        __this.polygonList.push(e.obj);
        console.log("绘制的作业路线", __this.polygonList);
        __this.mouseTool.close();
      });
    },
    stopAndSave() {
      //清空缓存
      this.$nextTick(() => {
        this.$refs["jobAreaForm"].clearValidate();
        this.$refs["jobAreaForm"].resetFields();
      });
      this;
      let savedPolygon = [];
      this.dialogFormVisible = true;
      for (let i = 0; i < this.polygonList.length; i++) {
        console.log(this.polygonList[i].getOptions());
        let op = this.polygonList[i].getOptions();
        let routePath = [];
        op.path.forEach((item) => {
          routePath.push([item.lng, item.lat]);
          this.jobAreaForm.areaLocation.push({
            lng: item.lng,
            lat: item.lat,
          });
        });

        let savearr = {
          path: routePath,
          strokeColor: op.strokeColor,
          strokeOpacity: op.strokeOpacity,
          fillOpacity: op.fillOpacity,
          fillColor: op.fillColor,
          zIndex: op.zIndex,
        };
        this.savedPolygon.push(savearr);
      }
      let save = JSON.stringify(this.savedPolygon);
      console.log("savedPolygon", save);
      // 模拟数据库存取
      sessionStorage.setItem("savedPolygon", save);
    },

    clearPolygon() {
      // this.map.remove(this.polygonList);
      this.polygonList.length = 0;
      this.jobAreaForm.areaLocation = [];
      this.map.clearMap(); // 清除地图上的所有覆盖物
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
    //展示选中的区域
    showSelectedArea(row) {
      if (row.length > 0) {
        let polygonArr = new Array();
        let lnglat = new Array();
        // let savedPolygon = eval("(" + row[0].areaLocation + ")");
        let savedPolygon = row[0].areaLocation;
        for (let i = 0; i < savedPolygon.length; i++) {
          polygonArr.push(
            new AMap.LngLat(savedPolygon[i].lng, savedPolygon[i].lat)
          );
        }
        this.handlePolygon(polygonArr);
      } else {
        this.map.clearMap(); // 清除地图上的所有覆盖物
      }
    },
    //绘制边界
    handlePolygon(polygonArr) {
      let polygon = new AMap.Polygon({
        map: this.map,
        path: polygonArr, //设置多边形边界路径
        strokeColor: "#0000ff", //线颜色
        strokeOpacity: 0.5, //线透明度
        strokeWeight: 5, //线宽
        fillColor: "#f5deb3", //填充色
        fillOpacity: 0.35, //填充透明度
      });

      this.map.setFitView();
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
  left: 20px;
  top: 20px;
  width: 410px;
  height: 500px;
  overflow-y: auto;
}
.input-card .btn {
  margin-right: 1.2rem;
  width: 9rem;
}

.input-card .btn:last-child {
  margin-right: 0;
}
</style>