<template>
  <el-card shadow="never" class="aui-card--fill">
    <el-container>
      <el-aside :style="{ width: asideWidth + 'vw' }">
        <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
          <el-tab-pane label="车辆" name="first" v-if="vehicleShow">
            <div class="card-msg">
              <el-button @click="queryTree(-1)">全部<span style="display: block">({{ carTotal.online + carTotal.offLine
              }})</span></el-button>
              <el-button @click="queryTree(1)" type="success">在线<span style="display: block">({{ carTotal.online
              }})</span></el-button>
              <el-button @click="queryTree(0)" type="info">离线<span style="display: block">({{ carTotal.offLine
              }})</span></el-button>
              <el-button @click="queryTree(2)" type="danger">未出车<span style="display: block">({{ carTotal.noGoCar
              }})</span></el-button>
            </div>
            <div class="elCheckbox" :style="{
              position: 'absolute',
              zIndex: typeIndex,
              backgroundColor: 'white',
              height: '60px',
              width: '21vw',
              overflowX: 'auto',
              overflowY: 'hidden',
              whiteSpace: 'nowrap',
              paddingTop: '5px',
            }">
              <el-checkbox-group v-model="choiceCarType" size="small">
                <el-checkbox-button label="" @change="carTypeChangeALl">全部</el-checkbox-button>
                <el-checkbox-button v-for="(city, i) in carTypeList" :label="city.detailTypeId" @change="carTypeChange"
                  :key="city.detailTypeId">{{ city.detailTypeName }}</el-checkbox-button>
              </el-checkbox-group>
            </div>
            <div style="margin-top: 65px; background-color: white">
              <div style="display: flex">
                <el-input style="margin-es: 10px" placeholder="输入关键字进行过滤" v-model="filterText">
                </el-input>
                <ren-dept-tree v-model="dataForm.deptId" :placeholder="$t('dept.title')" :query="true"
                  :styleState="true"></ren-dept-tree>
              </div>
              <el-table :data="searchCarData" style="width: 100%" @row-click="updateCarCentre" max-height="350">
                <el-table-column label="所属部门">
                  <template slot-scope="scope">
                    {{ scope.row.deptName }}
                  </template>
                </el-table-column>
                <el-table-column label="车牌号">
                  <template slot-scope="scope">
                    <h4 :style="{
                      color:
                        scope.row.currentstate == '1'
                          ? 'green'
                          : scope.row.currentstate == '2'
                            ? 'orange'
                            : 'gray',
                    }">
                      {{ scope.row.vehicleNum }}
                    </h4>
                  </template>
                </el-table-column>

                <el-table-column label="操作">
                  <span class="custom-tree-node" slot-scope="scope">
                    <span v-if="scope.row.status" @click="updateCarCentre(scope.row, 1)">
                      <el-tooltip v-if="whetherToShowPlay" class="item" effect="dark" content="轨迹回放"
                        placement="right-start">
                        <i class="el-icon-position" @click="carPlay(scope.row.id)"></i>
                      </el-tooltip>
                      <el-tooltip v-if="whetherToShowVideo" class="item" effect="dark" content="视频监控"
                        placement="right-start">
                        <i class="el-icon-video-camera" @click="carVideo(scope.row.typeName, scope.row)"></i>
                      </el-tooltip>
                      <el-tooltip v-if="whetherToShowOil && scope.row.haveOil" class="item" effect="dark" content="油耗曲线"
                        placement="right-start">
                        <i class="el-icon-data-line" @click="carGasCurve(scope.row.id)"></i>
                      </el-tooltip>
                    </span>
                  </span>
                </el-table-column>
              </el-table>
              <template>
                <div class="statistics-card">
                  <el-card v-for="o in 4" :key="o" class="item-card">
                    <div style="margin: 0">
                      <p>
                        {{ sumUp[o - 1].carStatus }}
                      </p>
                      <p>
                        {{ sumUp[o - 1].carSum }}
                      </p>
                    </div>
                  </el-card>
                </div>
                <div style="width: 100%; height: 100%">
                  <div id="mains" ref="mains" style="width: 100%; height: 190px"></div>
                </div>
              </template>
              <!-- <div style="width:100%;">
                <el-pagination
                  @current-change="handleCurrentChange"
                  :current-page.sync="currentPage"
                  :page-size="5"
                  layout="total, prev, pager, next"
                  :total="100"
                >
                </el-pagination>
              </div> -->
            </div>
          </el-tab-pane>
          <el-tab-pane label="设施" name="third" v-if="workTargetShow">
            <div class="elCheckbox" :style="{
              position: 'absolute',
              top: '-0.5vh',
              zIndex: typeIndex,
              backgroundColor: 'white',
              height: '55px',
              width: '21vw',
              overflowX: 'auto',
              overflowY: 'hidden',
              whiteSpace: 'nowrap',
              paddingTop: '5px',
            }">
              <el-radio-group v-model="choiceWorkerTarget" @change="queryTargetTree">
                <el-radio-button v-for="(city, i) in workerTargetList" :label="city.detailTypeId"
                  :key="city.detailTypeId">{{ city.detailTypeName }}</el-radio-button>
              </el-radio-group>
            </div>
            <div style="margin-top: 55px; background-color: white">
              <el-input style="margin-bottom: 10px" placeholder="输入关键字进行过滤" v-model="targetFilterText">
              </el-input>
              <el-tree :data="targetData" node-key="id" ref="targetTree" show-checkbox highlight-current
                :default-expanded-keys="defaultExpandIds" @check="getWorkTargetCheckedNodes"
                @node-click="handleNodeClick" @node-expand="handleNodeExpand" @node-collapse="handleNodeCollapse"
                style="height: 70vh; overflow: auto" :filter-node-method="filterNode" :props="defaultProps">
                <span class="custom-tree-node" slot-scope="{ node, data }">
                  <span v-if="data.nodeType == 'dept'" style="color: black">
                    {{ node.label }} ({{ data.childrenTotalSize }})
                  </span>
                  <span v-else @click="queryTarget(data, 1)">
                    <span style="color: green">{{ node.label }}</span>
                  </span>
                </span>
              </el-tree>
            </div>
          </el-tab-pane>
          <el-tab-pane label="事件" name="fourth" v-if="eventShow">
            <div class="elCheckbox" :style="{
              position: 'absolute',
              top: '-0.5vh',
              zIndex: typeIndex,
              backgroundColor: 'white',
              height: '70px',
              width: '21vw',
              overflowX: 'auto',
              overflowY: 'hidden',
              whiteSpace: 'nowrap',
              paddingTop: '5px',
            }">
              <el-radio-group v-model="choiceEvent" @change="queryEventTree">
                <el-radio-button :label="''" :key="''">所有<br />
                  {{ eventCount }}
                </el-radio-button>
                <el-radio-button v-for="(city, i) in eventList" :label="city.detailTypeCode" :key="city.detailTypeCode">
                  {{ city.detailTypeName }}<br />{{ city.len }}
                </el-radio-button>
              </el-radio-group>
            </div>
            <div style="margin-top: 70px; background-color: white">
              <div style="display: flex">
                <el-input style="margin-bottom: 10px" placeholder="输入关键字进行过滤" v-model="eventFilterText">
                </el-input>
                <ren-dept-tree v-model="deptIdStr" :placeholder="$t('dept.title')" :query="true" :styleState="true">
                </ren-dept-tree>
              </div>
              <el-tree :data="eventData" node-key="id" ref="eventTree" show-checkbox highlight-current
                style="height: 70vh; overflow: auto" @check="getEventCheckedNodes" :filter-node-method="filterNode"
                :props="defaultProps">
                <span class="custom-tree-node" slot-scope="{ node, data }">
                  <span v-if="data.nodeType == 'bigtype'">
                    <i class="el-icon-truck" style="color: gray"></i>
                    <span style="color: gray">{{ node.label }}({{ data.len }})</span>
                  </span>
                  <span v-else style="color: gray" @click="updateEventCentre(data)">
                    <i class="el-icon-info"></i>
                    <span style="color: gray">{{ node.label }}</span>
                  </span>
                </span>
              </el-tree>
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-aside>
      <el-container style="height: 100%">
        <div :style="{ height: 100 - footerHeight + '%' }">
          <div style="z-index: 999; position: absolute; top: 2vh">
            <i v-if="asideShow" class="el-icon-s-fold" @click="asidePackUp" style="font-size: 20px !important"></i>
            <i v-else class="el-icon-s-unfold" @click="asideUnfold" style="font-size: 20px !important"></i>
            <el-switch style="margin-top: -10px; margin-left: 10px" v-model="refresh" @change="shiShi"
              active-text="实时刷新">
            </el-switch>
          </div>
          <el-main style="height: 100%">
            <div class="container" :id="pageNumber"></div>
          </el-main>
          <div :style="{
            zIndex: 999,
            position: 'absolute',
            bottom: footerBottom + 'vh',
            right: '1px',
          }">
            <i v-if="footerShow" class="el-icon-download" @click="footerPackUp" style="font-size: 20px !important"></i>
            <i v-else class="el-icon-upload2" @click="footerUnfold" style="font-size: 20px !important"></i>
          </div>
        </div>
        <el-footer :style="{
          height: footerHeight + '%',
          position: 'absolute',
          bottom: '0vh',
          width: footerWidth + '%',
        }">
          <div v-if="carTableShow" style="height: 100%">
            <el-table :data="dataList" class="show_table" style="width: 100%" @row-click="updateCarCentre"
              ref="refsTable">
              <el-table-column prop="deptName" fixed label="所属部门" width="180" header-align="center" align="center">
              </el-table-column>
              <el-table-column prop="plateNumber" fixed label="车牌号" header-align="center" align="center">
              </el-table-column>
              <el-table-column prop="carTypeName" fixed label="车辆类型" header-align="center" align="center">
              </el-table-column>
              <el-table-column prop="workttime" fixed label="出车时间" header-align="center" align="center" width="160">
              </el-table-column>
              <el-table-column prop="travelmileage" fixed label="行驶里程" :formatter="numFilter" header-align="center"
                align="center"></el-table-column>
              <el-table-column prop="overspeed" fixed label="超速违规次数" header-align="center" align="center">
              </el-table-column>
              <el-table-column prop="parkviolations" fixed label="停车违规次数" header-align="center" align="center">
              </el-table-column>
              <el-table-column prop="oilabnormal" fixed label="油量异常次数" header-align="center" align="center">
              </el-table-column>
              <el-table-column prop="currentState" fixed label="当前状态" width="180" header-align="center" align="center">
                <template slot-scope="scope">
                  <el-tag type="warning" v-if="scope.row.currentstate == '2'">停车</el-tag>
                  <el-tag type="info" v-else-if="scope.row.currentstate == '0'">离线</el-tag>
                  <el-tag type="success" v-else>在线行驶</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="lastupdatetime" fixed label="最后在线时间" header-align="center"></el-table-column>
            </el-table>
            <el-pagination style="margin-right: 40px" :current-page="queryParams.page" :page-sizes="[5, 10, 15, 30]"
              :page-size="5" :total="queryParams.total" @current-change="handleCurrentChange"
              layout="total, prev, pager, next, jumper">
            </el-pagination>
          </div>
          <div v-if="facilityTableShow"></div>
          <div v-if="targetTableShow">
            <el-table :data="targetDataList" class="show_table" style="width: 100%" height="250"
              @row-click="updateEventCentre">
              <el-table-column prop="deptName" fixed label="所属部门" width="180" header-align="center" align="center">
              </el-table-column>
              <el-table-column prop="plateNumber" fixed label="车辆编号" header-align="center" align="center">
              </el-table-column>
              <el-table-column prop="driverName" fixed label="司机" header-align="center" align="center">
              </el-table-column>
              <el-table-column prop="carTypeName" fixed label="车辆类型" header-align="center" align="center">
              </el-table-column>
              <el-table-column prop="mistaketype" fixed label="违规类型" header-align="center" align="center">
              </el-table-column>
              <el-table-column prop="parkingtime" fixed label="时间段" header-align="center" align="center">
              </el-table-column>
              <el-table-column prop="date" fixed label="违规时间" header-align="center" align="center"></el-table-column>
              <el-table-column prop="location" fixed label="违规地点" header-align="center" align="center">
              </el-table-column>
            </el-table>
          </div>
        </el-footer>
      </el-container>
    </el-container>
    <trackReplaying v-if="trackHistoryVisible" ref="trackReplaying"></trackReplaying>
    <carVideo v-if="carVideoVisible" ref="carVideo"></carVideo>
    <carGasCurve v-if="carGasCurveVisible" ref="carGasCurve"></carGasCurve>
  </el-card>
</template>
<script src="https://webapi.amap.com/maps?v=2.0&key=79a5d3b87ec5dacf7aa2f57074ae75d5&plugin=AMap.Autocomplete"></script>
<script>
import {
  getListByPageNumber,
  getCommonTreeListByType,
  getCarType,
  getAdapterWorkWorkload,
  getCurrentPositionStatusList,
  getWorkerCommonTreeListByType,
  getWorkerType,
  getAdapterWorkerWorkload,
  getWorkerCurrentStatusListByType,
  getWorkTargetViewList,
  workTargetPage,
  getWorkTargetTreeListByType,
  getMistakeInfoList,
  getVehicleTypeList,
  getWorkerTypeList,
  getWorkTargetTypeList,
  getEventTypeTree,
  getFieldListByCode,
  getMistakeInfoVehTree,
  getVehWorkNormBigDataType,
  getCarAlls,
} from "@/api/carmonitoring";
import trackReplaying from "./track-replaying";
import { parseInt } from "lodash";
import carVideo from "./car_video";
import carGasCurve from "./car_gascurve";
import carRun from "@/assets/img/carRun.png";
import carWork from "@/assets/img/carWork.png";
import carOnLine from "@/assets/img/carOnLine.png";
import carStop from "@/assets/img/carStop.png";
import * as echarts from "echarts";
import { nextTick } from "vue";
let markers = [];
let markered = [];
let cluster;
let clusters;
export default {
  data() {
    return {
      defaultExpandIds: [],
      heights: "",
      dataForm: {
        deptId: "",
      },
      carTotal: {
        online: 0,
        offLine: 0,
        goCar: 0,
        noGoCar: 0,
      },
      timer: null,
      dialogVisible: false,
      visibleDept: false,
      deptIdStr: "",
      currentPage: 1,
      trackHistoryVisible: false,
      carVideoVisible: false,
      carGasCurveVisible: false,
      carCoverage: true,
      personCoverage: false,
      count: 0,
      countList: [],
      illegal: "",
      illegalList: [],
      keys: [],
      checkedKeys: [],
      facilityCoverage: false,
      eventCoverage: false,
      asideWidth: 21,
      asideShow: true,
      footerHeight: 0,
      footerShow: true,
      footerWidth: 77,
      footerBottom: 36,
      activeName: "first",
      carType: [],
      eventCount: 0,
      typeIndex: 0,
      typeHide: 3,
      typeLength: 9,
      vehicleShow: false,
      workTargetShow: false,
      refresh: false,
      eventShow: false,
      carTypeList: [],
      choiceCarType: [""],
      initCarType: [],
      initWorkType: [],
      showNodesList: [],
      workerTargetList: [],
      choiceWorkerTarget: "",
      targetName: "",
      initWorkerTarget: null,
      expandedKeys: null,
      eventList: [],
      choiceEvent: "",
      carTableShow: true,
      facilityTableShow: false,
      targetTableShow: false,
      data: [],
      carData: [],
      eventData: [],
      defaultProps: {
        children: "children",
        label: "label",
      },
      filterText: "",
      filterDeptText: "",
      deptList: [],
      targetFilterText: "",
      eventFilterText: "",
      markersList: [],
      markerTexts: [],
      map: null,
      dataList: [],
      pathList: [],
      pathLists: [],
      targetData: [],
      targetDataList: [],
      pageNumber: "allvehmonitor_1",
      isPage: true,
      getCarAll: {
        onlineStatus: -1,
        outVehicleStatus: -1,
        vehicleTypeIds: "",
      },
      queryParams: {
        status: -1,
        carTypeIds: [],
        carIds: [],
        deptId: [],
        page: 1,
        limit: 5,
        total: 1,
        deptIds: "",
        vehicleIds: "",
        onlineStatus: -1,
      },
      queryMistakeParams: {
        vehicleId: "",
        mistaketype: "",
        idsList: [],
        ids: "",
      },
      queryMistakeTreeParams: {
        mistaketypes: "",
        deptIds: "",
      },
      targetQuery: {
        worktargetTypeIds: null,
        worktargetTypeId: "",
        deptIds: "",
        worktargetIds: "",
        worktargetIdsList: [],
      },
      lastClickSS: "",

      //权限
      whetherToShowPlay: false,
      whetherToShowVideo: false,
      whetherToShowOil: false,
    };
  },
  components: {
    trackReplaying,
    carVideo,
    carGasCurve,
  },

  created() {
    window.addEventListener("resize", this.handleResize);
    this.handleResize();
    let query = this.$route.query;
    if (query.hasOwnProperty("pageNumber")) {
      // document.getElementById(this.pageNumber).id = query.pageNumber;
      this.pageNumber = query.pageNumber;
      this.isPage = false;
    }
    let that = this;
    getListByPageNumber(that.pageNumber).then((response) => {
      let pageNumber = response.data.data;
      for (let i = 0; i < pageNumber.length; i++) {
        if (pageNumber[i] == "vehicle") {
          that.vehicleShow = true;
          that.initCarTab();
        }
        if (pageNumber[i] == "worktarget") {
          that.workTargetShow = true;
          that.initWorkTargetTab();
        }
        if (pageNumber[i] == "event") {
          that.eventShow = true;
          that.initEventTab();
        }
      }
    });
  },
  methods: {
    // 树节点展开
    handleNodeExpand(data) {
      console.log("aa");
      // console.log(data, this.defaultExpandIds);
      // 保存当前展开的节点
      let flag = false;
      this.defaultExpandIds.some((item) => {
        if (item === data.id) {
          // 判断当前节点是否存在， 存在不做处理
          flag = true;
          return true;
        }
      });
      if (!flag) {
        // 不存在则存到数组里
        this.defaultExpandIds.push(data.id);
      }
    },
    // 树节点关闭
    handleNodeCollapse(data) {
      // 删除当前关闭的节点
      this.defaultExpandIds.some((item, i) => {
        if (item === data.id) {
          this.defaultExpandIds.splice(i, 1);
        }
      });
      this.removeChildrenIds(data); // 这里主要针对多级树状结构，当关闭父节点时，递归删除父节点下的所有子节点
    },
    removeChildrenIds(data) {
      const ts = this;
      if (data.children) {
        data.children.forEach(function (item) {
          const index = ts.defaultExpandIds.indexOf(item.id);
          if (index > 0) {
            ts.defaultExpandIds.splice(index, 1);
          }
          ts.removeChildrenIds(item);
        });
      }
    },
    handleResize(event) {
      this.fullWidth = document.documentElement.clientWidth;
      if (this.fullWidth <= 1842 && this.fullWidth > 1482) {
        this.typeHide = 2;
        // console.log(this.fullWidth);
      } else if (this.fullWidth <= 1482) {
        this.typeHide = 1;
        // console.log(this.fullWidth);
      } else {
        this.typeHide = 3;
        // console.log(this.fullWidth);
      }
    },
    shiShi(status) {
      console.log(status,'实时刷新');
      let that = this;
      // cluster.setData(null);
      // cluster.setData(null);
      if (!status) {
        // console.log(that.carData,'carData');
        that.map.clearMap();
        cluster.setData(null);
        that.getCheckedNodes(that.carData,status);
        this.$message({
          showClose: true,
          message: "关闭实时刷新",
          type: "success",
        });
        this.realTimeGo(false)
      } else {
        cluster.setData(null);
        this.$message({
          showClose: true,
          message: "开启实时刷新",
          type: "success",
        });
        that.realTimeGo(status);
      }
    },
    filterNode(value, data, node) {
      if (!value) return true;
      // return data.name.indexOf(value) !== -1;
      return this.findSearKey(node, value);
    },
    findSearKey(node, key) {
      if (node.label.indexOf(key) !== -1) {
        return true;
      } else {
        if (node.parent.parent == null) {
          return false;
        } else {
          return this.findSearKey(node.parent, key);
        }
      }
    },
    handleClose() {
      this.dialogVisible = false;
    },
    initCarTab() {
      let that = this;
      getVehicleTypeList(this.pageNumber).then((response) => {
        let vehicleTypeList = response.data.data;
        for (let i = 0; i < vehicleTypeList.length; i++) {
          let vehicleType = vehicleTypeList[i];
          if (vehicleType.isSelected == true) {
            that.carTypeList.push(vehicleType);
            that.queryParams.carTypeIds.push(vehicleType.detailTypeId);
          }
        }
        that.initCarType = that.queryParams.carTypeIds;
        that.typeLength = that.carTypeList.length;
        this.getCarAll = {};
        that.initCarTree(this.getCarAll);
      });
      //控制地图和树权限
      getFieldListByCode(that.pageNumber, "vehicle", "monitorMap").then(
        (response) => {
          let date = response.data.data;
          for (let i = 0; i < date.length; i++) {
            if (date[i].fieldCode == "travel_path_replay") {
              that.whetherToShowPlay = date[i].isSelected;
            }
            if (date[i].fieldCode == "view_oil") {
              that.whetherToShowOil = date[i].isSelected;
            }
            if (date[i].fieldCode == "view_video") {
              that.whetherToShowVideo = date[i].isSelected;
            }
          }
        }
      );
      // getFieldListByCode(that.pageNumber,"vehicle","monitorList").then(response => {
      //   console.log(response,9999)
      // });
      // getFieldListByCode(that.pageNumber,"vehicle","traceReplay").then(response => {
      //   console.log(response,9999)
      // });
    },
    initWorkTargetTab() {
      sessionStorage.clear();
      let that = this;
      getWorkTargetTypeList(this.pageNumber).then((response) => {
        let vehicleTypeList = response.data.data;
        for (let i = 0; i < vehicleTypeList.length; i++) {
          let vehicleType = vehicleTypeList[i];
          if (vehicleType.isSelected == true) {
            that.workerTargetList.push(vehicleType);
            that.countList.push(vehicleType.detailTypeId);
          }
        }
        if (that.workerTargetList.length > 0) {
          that.targetQuery.worktargetTypeIds =
            that.workerTargetList[0].detailTypeId;
          that.initWorkerTarget = that.targetQuery.worktargetTypeIds;
          that.targetQuery.worktargetTypeId = that.initWorkerTarget;
          that.choiceWorkerTarget = that.initWorkerTarget;
          that.count = that.choiceWorkerTarget;
          that.targetName = that.workerTargetList[0].detailTypeName;
          that.initWorkTargetTree();
        }
      });
    },
    initEventTab() {
      let that = this;
      getEventTypeTree(this.pageNumber).then((response) => {
        that.eventList = response.data.data;
      });
      that.initEventTree();
    },
    //请求所有车辆
    initCarTree(obj = {}) {
      let that = this;
      console.log(obj,'objobjobj');
      // console.log(obj, "oooooooooooooooooooooooooooooooooooooo");
      getCarAlls(obj).then((response) => {
        // console.log("resres", response.data.data);
        that.carData = response.data.data;
        // console.log(response,'请求所有的车辆');
        // if (that.dataForm.deptId.length > 0) {
        //   that.carData = that.carData.filter(
        //     (item) => item.deptId == that.dataForm.deptId
        //   );
        // }
        this.carData.forEach((item) => {
          if (item.typeName.includes("电动")) {
            item.haveOil = false;
          } else {
            item.haveOil = true;
          }
        });
        if (that.filterText.length > 0) {
          // console.log(this.carData);
          that.carData = that.carData.filter((item) =>
            item.typeName.includes(that.filterText)
          );
        }
        that.getCheckedNodes(that.carData);
        // console.count('funcMark');
      });
    },
    initWorkTargetTree() {
      let that = this;
      getWorkTargetTreeListByType(that.targetQuery).then((response) => {
        that.targetData = response.data.data;
      });
    },
    initEventTree(state) {
      let that = this;
      if (that.queryMistakeTreeParams.mistaketypes == "超速") {
        that.queryMistakeTreeParams.mistaketypes = "超速点";
      }
      // console.log(this.queryMistakeParams);
      getMistakeInfoVehTree(that.queryMistakeTreeParams).then((response) => {
        console.log(response.data.data,'response.data.data');
        let eventDataList = [];
        eventDataList = response.data.data.filter(
          (item) => item.children.length != null
        );
        eventDataList.map((item) => {
          item.len = item.children.length;
        });
        if (that.eventFilterText.length > 0) {
          eventDataList = eventDataList.filter((item) => {
            return item.label.includes(that.eventFilterText);
          });
        }
        if (that.choiceEvent == "" || state) {
          that.eventList.map((item) => {
            let eventNum = 0;
            let eventCount = 0;
            eventDataList.map((items) => {
              items.children.map((childItem) => {
                if (childItem.label == item.detailTypeName) {
                  eventNum += 1;
                }
                eventCount += 1;
              });
            });
            item.len = eventNum;
            that.eventCount = eventCount;
          });
        }
        console.log(eventDataList, 'eventDataList');
        eventDataList.forEach(item => {
          item.children.sort((a, b) => {
            return a.obj.date < b.obj.date ? 1 : -1
          })
        })
        that.eventData = eventDataList;
        var keys = JSON.parse(sessionStorage.getItem(`markersEventTree`)) || [];
        this.$refs.eventTree.setCheckedKeys(keys);
      });
    },
    handleCurrentChange(val) {
      this.queryParams.page = val;
      this.queryParams.carTypeIds = [];
      this.initTable();
    },
    handleSizeChange(val) {
      this.queryParams.limit = val;
      this.queryParams.carTypeIds = [];
      this.initTable();
    },
    initTable() {
      let that = this;
      that.footerHeight = 36;
      getAdapterWorkWorkload(that.queryParams).then((response) => {
        that.dataList = response.data.data.list;
        console.log(this.dataList,'dataList');
        that.queryParams.total = response.data.data.total;
      });
    },
    // filterNode(value, data) {
    //   if (!value) return true;
    //   return data.label.indexOf(value) !== -1;
    // },
    asidePackUp() {
      this.asideWidth = 0;
      this.asideShow = false;
      this.footerWidth = 100;
    },
    asideUnfold() {
      this.asideWidth = 21;
      this.asideShow = true;
      this.footerWidth = 77;
    },
    footerPackUp() {
      this.footerHeight = 0;
      this.footerBottom = 2;
      this.footerShow = false;
    },
    footerUnfold() {
      this.footerBottom = 36;
      this.footerHeight = 36;
      this.footerShow = true;
    },
    handleClick(tab, event) {
      let name = tab.name;
      // this.clearPolygon();
      // sessionStorage.clear();
      // this.refresh = false;
      // this.map.clearMap();
      // if (this.timer) {
      //   this.shiShi(false);
      // }
      // this.$refs.targetTree.setCheckedKeys([]);
      // let polygons = this.map.getAllOverlays("polygon");
      // let polyLines = this.map.getAllOverlays("polyline");
      // this.map.remove(polyLines);
      // this.map.remove(polygons);
      // cluster.setData(null);
      // markers = [];
      this.footerUnfold();
      if (name == "first") {
        this.carTableShow = true;
        this.facilityTableShow = false;
        this.targetTableShow = false;
        this.personCoverage = false;
        this.facilityCoverage = false;
        this.eventCoverage = false;
        this.carCoverage = true;
        // this.getCheckedNodes(this.searchCarData);
      }
      if (name == "third") {
        this.carTableShow = false;
        this.facilityTableShow = false;
        this.targetTableShow = false;
        this.personCoverage = false;
        this.facilityCoverage = false;
        this.eventCoverage = false;
        this.carCoverage = false;
        this.footerPackUp();
      }
      if (name == "fourth") {
        this.carTableShow = false;
        this.facilityTableShow = false;
        this.targetTableShow = true;
        this.personCoverage = false;
        this.facilityCoverage = false;
        this.eventCoverage = true;
        this.carCoverage = false;
        // this.getCheckedNodes();
      }
    },
    carTypeShow() {
      this.typeIndex = 99;
      this.typeHide = 99;
    },
    mouseLeave() {
      this.typeIndex = 0;
      this.handleResize();
    },
    queryTree(status) {
      // if (this.refresh) {
      //   return false;
      // }
      if (status == 2) {
        this.getCarAll.outVehicleStatus = 0;
        let { onlineStatus, ...rest } = this.getCarAll;
        console.log(rest,'restrestrest');
        this.initCarTree(rest);
        return;
      }
      this.queryParams.onlineStatus = status;
      this.getCarAll.onlineStatus = status;
      if (status == -1) {
        let { onlineStatus, outVehicleStatus, ...rest } = this.getCarAll;
        console.log(rest,'restrestrest');
        this.getCarAll = rest;
        this.initCarTree(rest);
      }
      if (status == 1 || status == 0) {
        let { outVehicleStatus, ...rest } = this.getCarAll;
        console.log(rest,'restrestrest');
        this.getCarAll = rest;
        this.initCarTree(rest);
      }
      // this.map.setZoom(13);
    },
    queryTargetTree(countItem) {
      let that = this;
      this.count = countItem;
      // console.log(countItem,'countItem');
      // this.clearPolygon();
      // cluster.setData(null);
      that.targetQuery.worktargetTypeIds = that.choiceWorkerTarget;
      that.targetQuery.worktargetTypeId = that.choiceWorkerTarget;
      that.targetQuery.worktargetIds = "";
      that.targetQuery.deptIds = "";
      for (let i = 0; i < that.workerTargetList.length; i++) {
        let target = that.workerTargetList[i];
        if (target.detailTypeId == that.targetQuery.worktargetTypeId) {
          that.targetName = target.detailTypeName;
        }
      }
      this.initWorkTargetTree();
      let keys;
      that.countList.map((item) => {
        if (item == countItem) {
          keys =
            JSON.parse(sessionStorage.getItem(`checkedKeys${countItem}`)) || [];
        }
      });
      this.$refs.targetTree.setCheckedKeys(keys);
    },
    queryEventTree(eventItem) {
      this.illegal = eventItem;
      // console.log(eventItem,'eventItem');
      this.queryMistakeParams.mistaketype = this.choiceEvent;
      this.queryMistakeTreeParams.mistaketypes = this.choiceEvent;
      this.initEventTree();
      var keys = JSON.parse(sessionStorage.getItem(`markersEventTree`)) || [];
      this.$refs.eventTree.setCheckedKeys(keys);
    },
    carTypeChange() {
      // if (this.refresh) {
      //   return false;
      // }
      this.choiceCarType = this.choiceCarType.filter((item) => item != "");
      if (this.choiceCarType.length > 0) {
        this.queryParams.carTypeIds = this.choiceCarType;
        this.getCarAll.vehicleTypeIds = this.choiceCarType.toString();
        this.initCarTree(this.getCarAll);
      } else {
        this.carTypeChangeALl();
      }
      this.map.setZoom(12);
    },
    carTypeChangeALl() {
      // if (this.refresh) {
      //   return false;
      // }
      this.queryParams.carTypeIds = this.initCarType;
      this.choiceCarType = [""];
      let { vehicleTypeIds, ...rest } = this.getCarAll;
      this.getCarAll = rest;
      this.initCarTree(rest);
      this.map.setZoom(12);
    },
    //实时移动
    realTimeGo(state) {
      let that = this;
      var lineArr = [];
      var position = [],
        center = [];
      var driverMaker = [];
      var driverlines = [];
      var driverInfo = {};
      // AMap.plugin('AMap.MoveAnimation', function(){
      //创建地图
      // var map = that.maptimer
      that.map.setFitView();

      //初始化坐标信息
      getDriverInfo({});

      //定期获取坐标信息
      if (state) {
        that.timer = setInterval(function () {
          // if (state) {
            getDriverInfo({});
            console.log("实时开始");
            cluster.setData(null);
          // } else {
          //   getDriverInfo({});
          //   console.log("实时结束");
            // cluster.setData(null);
          // }
        }, 1000);
      } else {
        clearInterval(that.timer);
        that.timer = null;
        console.log("已清除");
        return;
      }
      console.log('zou');
      var allDriverMarker = {};
      const createMarker2 = (data) => {
        //循环司机
        cluster.setData(null);
        console.log(data,'datadatadata');
        for (var i in data) {
          if (data[i].xcd) {
            var arr = [data[i].xcd, data[i].ycd];
            if (allDriverMarker[data[i].carid]) {
              allDriverMarker[data[i].carid].moveTo(arr, {
                duration: 10000,
                delay: 1000,
              });
            } else {
              let iconImg = "/images/greenicon.png";
              if (data[i].currentstate == "0") {
                iconImg = "/images/graiocny.png";
              }
              if (data[i].currentstate == "2") {
                iconImg = "/images/yellowicon.png";
              }
              // console.log(data,'这是datadata');
              AMap.plugin("AMap.MoveAnimation", function () {
                var temp = new AMap.Marker({
                  content: `<div style="width: 100px;text-align: center;">
                    <div style="width:51px;height:60px;transform:rotate(${
                      (data[i].directint - 1) * 45
                    } deg);margin: 0 auto;margin-bottom: -10px;background-image: url(${iconImg});transform: rotate(180deg);background-size: 100% 100%;background-repeat: no-repeat;background-attachment: fixed; text-align: center; line-height: 52px;color: rgb(0, 0, 0); font-size: 12px; cursor: pointer;">
                      <h1 style="color:white;transform:rotate(${
                      ((data[i].directint - 1) * -45)
                    } deg);">${
                      data[i].carTypeName.length <= 3
                        ? data[i].carTypeName.charAt(0)
                        : data[i].carTypeName.charAt(2)
                      }</h1>
                    </div>
                    <br/><span style="font-weight: bold;background-color: #81c5a5;padding: 4px;border-radius: 3px;">
                      ${data[i].plateNumber}
                    </span>
                  </div>`,
                  position: arr,
                  // icon: "https://webapi.amap.com/images/car.png",   //轨迹地图上出现车的图标(运行时有车在上面移动)
                  offset: new AMap.Pixel(-26, -13),
                  autoRotation: false,
                });
                that.map.add(temp);
                allDriverMarker[data[i].carid] = temp;
                // console.log(allDriverMarker[data[i].carid],'caridcarid');
              });
            }
          } else {
            if (allDriverMarker[data[i].carid]) {
              that.map.remove(allDriverMarker[data[i].carid]);
            }
          }
        }
        for (var i in allDriverMarker) {
          var flag = true;
          for (var j in data) {
            if (data[j].carid == i) {
              flag = false;
              break;
            }
          }
          if (flag) {
            that.map.remove(allDriverMarker[i]);
            allDriverMarker[i] = null;
          }
        }
      };
      const createPolyline = (data) => {
        // 绘制轨迹
        return new AMap.Polyline({
          map: that.map,
          path: data,
          showDir: true,
          strokeColor: "#28F",
          // strokeOpacity: 1,
          strokeWeight: 6,
          // strokeStyle: "solid"
        });
      };
      var passedPolyline = new AMap.Polyline({
        map: that.map,
        // path: lineArr,
        strokeColor: "#AF5",
        // strokeOpacity: 1,
        strokeWeight: 6,
        // strokeStyle: "solid"
      });
      function getDriverInfo(data) {
        // console.log(data,'初始化地图坐标信息');
        // if()
        //数据请求
        getCurrentPositionStatusList(that.queryParams).then((response) => {
          let data = response.data.data;
          // console.log(data,'循环司机循环死机');
          for (var i in data) {
            //data[i].move=data[i].line;
            if (data[i].xcd != null && data[i].ycd != null) {
              //position = data[0].line[data[0].line.length-1];
              center = [data[i].xcd, data[i].ycd];
              break;
            }
          }
          // 设置缩放级别和中心点
          if (allDriverMarker == {}) {
            that.map.setZoomAndCenter(14, center);
          }
          //marker.setMap(map);
          driverInfo = data;
          //之前轨迹的版本
          //createMarker(data);
          setTimeout(() => {
            createMarker2(data);
          }, 100);
        });
      }
      // })
    },
    //筛选
    getCheckedNodes(data,status=true) {
      cluster.setData(null);
      markers = [];
      let nodesList = data;
      this.queryParams.carIds = [];
      this.queryParams.deptId = [];
      this.queryParams.vehicleIds = "";
      this.queryParams.deptIds = "";
      let carIndex = 0;
      for (let i = 0; i < nodesList.length; i++) {
        if (nodesList[i].nodeType == "dept") {
          // this.queryParams.deptId[index]=nodesList[i].id;
          // index++;
        } else {
          if (this.queryParams.deptId.length > 0) {
            for (let j = 0; j < this.queryParams.deptId; j++) {
              if (
                parseInt(nodesList[i].pid) !=
                parseInt(this.queryParams.deptId[i])
              ) {
                this.queryParams.carIds[carIndex] = nodesList[i].id;
                carIndex++;
              }
            }
          } else {
            this.queryParams.carIds[carIndex] = nodesList[i].id;
            carIndex++;
          }
        }
      }
      ``;
      if (
        this.queryParams.carIds.length > 0 ||
        this.queryParams.deptId.length > 0
      ) {
        this.markersClusterer(status);
        this.queryWhereJoint();
        this.queryParams.carIds = [];
        this.queryParams.deptId = [];
        this.initTable();
      } else {
        this.dataList = [];
        this.queryParams.total = 0;
      }
    },
    getWorkTargetCheckedNodes(state) {
      let that = this;
      let keys = this.$refs.targetTree.getCheckedKeys();
      that.countList.map((item) => {
        if (item == that.count) {
          sessionStorage.setItem(`checkedKeys${item}`, JSON.stringify(keys));
        }
      });
      that.targetQuery.deptIds = "";
      let targetIds = this.$refs.targetTree.getCheckedKeys();
      that.targetQuery.worktargetIds = targetIds.toString();
      that.targetQuery.worktargetIdsList = targetIds;
      // }
      that.clearPolygon();
      if (
        this.targetQuery.deptIds.length > 0 ||
        that.targetQuery.worktargetIds.length > 0
      ) {
        console.log(that.targetQuery,'targetQuery');
        getWorkTargetViewList(that.targetQuery).then((response) => {
          let { data } = response.data;
          console.log(data,'datadatadata');
          let lastClickArr =
            that.lastClickSS == "" ? [] : that.lastClickSS.split(",");
          let currentClickArr = that.targetQuery.worktargetIds.split(",");
          currentClickArr.forEach((item) => {
            if (!lastClickArr.includes(item)) {
              that.currentClickStr = item;
            }
          });
          that.lastClickSS = that.targetQuery.worktargetIds;
          let currentData = data.filter(
            (item) => item.id != that.currentClickStr
          );
          let currentIndex = data.filter(
            (item) => item.id == that.currentClickStr
          );
          console.log(that.targetQuery, 'targetQuery');
          if (that.targetQuery.worktargetTypeId == 1) {
            if (
              that.targetQuery.worktargetIds.length > 0 ||
              that.targetQuery.deptIds.length > 0
            ) {
              that.dropRoad(
                [...currentData, ...currentIndex],
                that.targetQuery.worktargetTypeId,
                state.id
              );
              that.pathList = response.data.data;
            }
          } else {
            console.log(currentData, currentIndex, 'currentIndex');
            that.pathList = [...currentData, ...currentIndex]
            // console.log(that.pathList, 'currentIndex');
            that.dropJiaShui(
              [...currentData, ...currentIndex],
              that.targetQuery.worktargetTypeId
            );
          }
        });
      } else {
        this.dataList = [];
        this.queryParams.total = 0;
      }
    },
    getEventCheckedNodes(node) {
      let that = this;
      let nodesList = this.$refs.eventTree.getCheckedNodes();
      console.log(nodesList,'node');
      let keys = [];
      nodesList.forEach((item) => {
        // console.log(item);
        if (item.nodeType == "lastobject") {
          keys.push(item.id);
        }
      });
      sessionStorage.setItem(`markersEventTree`, JSON.stringify(keys));
      // console.log(keys,'keys');
      let vehicleIds = [];
      markers = [];
      // cluster.setData(null);
      that.targetDataList = [];
      that.queryMistakeParams.idsList = [];
      for (let i = 0; i < nodesList.length; i++) {
        if (nodesList[i].nodeType == "bigtype") {
        } else {
          vehicleIds.push(nodesList[i].id);
        }
      }
      if (vehicleIds.length > 0) {
        that.queryMistakeParams.idsList = vehicleIds;
        that.queryMistakeParams.ids = vehicleIds.toString();
        that.getMistakeInfo(node);
      } else {
        clusters.setData(null);
        this.realTimeGo(false)
      }
    },
    markerClick(e) {
      if (!e.driverName) {
        e.driverName = "暂无";
      }
      if (e.carTypeName.includes("电动")) {
        e.haveOil = false;
      } else {
        e.haveOil = true;
      }
      let infoWindow = new AMap.InfoWindow({
        offset: new AMap.Pixel(40, -30),
        closeWhenClickMap: true,
      });
      let driverName = e.driverName == null ? "--" : e.driverName;
      let travelMileage = e.travelMileage == null ? "--" : e.travelMileage;
      let worktTime = e.worktTime == null ? "--" : e.worktTime;
      let html =
        '<div><table style="width: 350px">' +
        '<tr class="particularsClass"><td><span >所属部门：</span><span>' +
        e.deptName +
        "</span></td>" +
        '<td style="padding-left: 3vw;"><span>车辆类型：</span><span>' +
        e.carTypeName +
        "</span></td></tr>" +
        '<tr class="particularsClass"><td><span>车牌号：</span><span>' +
        e.plateNumber +
        "</span></td>" +
        '<td style="padding-left: 3vw;"><span>司机：</span><span>' +
        e.driverName +
        "</span></td></tr>" +
        '<tr class="particularsClass"><td><span>速度：</span><span>' +
        e.carspeed +
        "</span></td>" +
        '<td style="padding-left: 3vw;"><span>里程：</span><span>' +
        travelMileage +
        "</span></td></tr></table>" +
        '<span class="particularsClass">出收车时间：' +
        worktTime +
        "</span><br/>" +
        '<span class="particularsClass">最后在线时间：' +
        e.lastupdatetime +
        "</span><br/>" +
        '<span class="particularsClass">车辆位置：' +
        e.location +
        "</span><br/>";
      if (this.whetherToShowPlay) {
        html +=
          '<span class="particularsClass trackMonitoring" onclick="carPlay(' +
          e.carid +
          ')"><i class="el-icon-position"></i>轨迹回放</span>';
      }
      if (this.whetherToShowVideo) {
        html +=
          '<span class="particularsClass trackMonitoring" onclick="carVideo(\'' +
          e.plateNumber +
          "'," +
          e.videodeviceids +
          ')"><i class="el-icon-video-camera"></i>视频监控</span>';
      }
      if (this.whetherToShowOil && e.haveOil) {
        html +=
          '<span class="particularsClass trackMonitoring" onclick="carGasCurve(' +
          e.carid +
          ')"><i class="el-icon-data-line"></i>油耗曲线</span>';
      }
      html += "</div>";
      infoWindow.setContent(html);
      infoWindow.open(this.map, [e.xcd, e.ycd]);
    },
    async markersClusterer(status=true) {
      let that = this;
      // that.map.clearMap();
      // cluster.setData(null);
      markered = [];
      // carList = []
      that.queryWhereJoint();
      getCurrentPositionStatusList(that.queryParams).then((response) => {
        let listData = response.data.data;
        // for (let i=0;i<listData.length;i++){
        //   let iconImg = 'http://121.36.213.139/m/carRun.png';
        //   if(listData[i].currentstate=='0'){
        //     iconImg = 'http://121.36.213.139/m/carOnLine.png';
        //   }
        //   if(listData[i].currentstate=='2'){
        //     iconImg = 'http://121.36.213.139/m/carStop.png';
        //   }
        //   let marker = new AMap.Marker({
        //     content: '<div style="transform:rotate('+(listData[i].directint-1) * 45+'deg)"><img width="51" height="51" src="' + iconImg + '" /></div>',
        //     position: [listData[i].xcd,listData[i].ycd],
        //     extData : {
        //       "id":listData[i].carid
        //     }
        //   });
        //
        //   marker.on('click', function (e){
        //     that.markerClick(listData[i]);
        //   });
        //   markers.push(marker);
        // }
        var count = 0;
        for (let i = 0; i < listData.length; i++) {
          markered.push({
            lnglat: [listData[i].xcd, listData[i].ycd],
            extData: {
              id: parseInt(listData[i].carid),
              date: listData[i],
            },
          });
          count += 1;
        }
        cluster = new AMap.MarkerCluster(this.map, markered, {
          gridSize: 60,
          renderMarker: function (object) {
            // console.log(object,'object object');
            // let iconImg = "http://121.36.213.139/m/carRun.png";
            let iconImg = "/images/greenicon.png";
            // console.log('object',object.data[0].extData.date.currentstate,object.data[0].extData.date.plateNumber);
            if (object.data[0].extData.date.currentstate == "0") {
              // iconImg = "http://121.36.213.139/m/carOnLine.png";
              iconImg = "/images/graiocny.png";
            }
            if (object.data[0].extData.date.currentstate == "2") {
              iconImg = "/images/yellowicon.png";
              // iconImg = "http://121.36.213.139/m/carStop.png";
            }
            object.marker.setContent(
              `<div style="width: 100px;text-align: center;">
                  <div style="width:51px;height:60px;transform:rotate(${
                    (object.data[0].extData.date.directint - 1) * 45
                  } deg);margin: 0 auto;margin-bottom: -10px;background-image: url(${iconImg});background-size: 100% 100%;background-repeat: no-repeat;background-attachment: fixed; text-align: center; line-height: 52px;color: rgb(0, 0, 0); font-size: 12px; cursor: pointer;">
                    <h1 style="color:white;">${
                      object.data[0].extData.date.carTypeName.length <= 3
                        ? object.data[0].extData.date.carTypeName.charAt(0)
                        : object.data[0].extData.date.carTypeName.charAt(2)
                    }</h1>
                  </div>
                  <br/><span style="font-weight: bold;background-color: #81c5a5;padding: 4px;border-radius: 3px;">
                    ${object.data[0].extData.date.plateNumber}
                  </span>
              </div>`
            );
            object.marker.on("click", function (data) {
              that.markerClick(object.data[0].extData.date);
            });
          },
          renderClusterMarker: function (context) {
            // 聚合中点个数
            var clusterCount = context.count;
            // console.log(context,123123123213213)
            let bgColor = "";
            // 聚合点配色
            if (clusterCount >= 0 && clusterCount < 10) {
              bgColor = "http://webapi.amap.com/theme/v1.3/m1.png";
            } else if (clusterCount >= 10 && clusterCount < 100) {
              bgColor = "http://webapi.amap.com/theme/v1.3/m2.png";
            } else if (clusterCount >= 100 && clusterCount < 1000) {
              bgColor = "http://webapi.amap.com/theme/v1.3/m3.png";
            } else if (clusterCount >= 1000 && clusterCount < 10000) {
              bgColor = "http://webapi.amap.com/theme/v1.3/m4.png";
            } else if (clusterCount >= 10000) {
              bgColor = "http://webapi.amap.com/theme/v1.3/m5.png";
            }
            var size = Math.round(
              25 + Math.pow(clusterCount / count, 1 / 5) * 40
            );
            context.marker.setOffset(new AMap.Pixel(-size / 2, -size / 2));
            context.marker.setContent(
              `<div id="ssss" style="width: 56px; height: 56px; background-image: url(${bgColor});background-size: 100% 100%;background-repeat: no-repeat;background-attachment: fixed; text-align: center; line-height: 56px;color: rgb(0, 0, 0); font-size: 12px; cursor: pointer;">${clusterCount}</div>`
            );
            let infoWindow;
            context.marker.on("mouseover", (e) => {
              //判断长度是否相同
              if (context.count != context.clusterData.length) {
                //深度克隆原所有数据数组
                var markered1 = JSON.parse(JSON.stringify(markered));
                //根据两点之间距离大小进行排序
                markered1.sort((a, b) => {
                  var temp = context.marker._opts.position;
                  var temp1 =
                    (temp[0] - a.extData.date.xcd) ** 2 +
                    (temp[1] - a.extData.date.ycd) ** 2;
                  var temp2 =
                    (temp[0] - b.extData.date.xcd) ** 2 +
                    (temp[1] - b.extData.date.ycd) ** 2;
                  return temp1 - temp2;
                });
                //截取距离最小到长度
                markered1 = markered1.slice(0, context.count);
                //最后赋值
                context.clusterData = markered1;
              }
              infoWindow = new AMap.InfoWindow({
                offset: new AMap.Pixel(5, -30),
                closeWhenClickMap: true,
              });
              let html = `<div>
                  <ul style="list-style: none;width:200px;height:${
                    context.clusterData.length > 5 ? "200px" : "100%"
                  };">
                    ${context.clusterData
                      .map((item) => {
                        let iconImg = "/images/greenicon.png";
                        if (item.extData.date.currentstate == "0") {
                          iconImg = "/images/graiocny.png";
                        }
                        if (item.extData.date.currentstate == "2") {
                          iconImg = "/images/yellowicon.png";
                        }
                        let ret = `<li style="display: flex;align-items: center;">
                                <div style="width: 40px; height: 50px; background-image: url(${iconImg});background-size: 100% 100%;background-repeat: no-repeat;background-attachment: fixed; text-align: center; line-height: 45px;color: rgb(0, 0, 0); font-size: 12px; cursor: pointer;"><h2 style="color:white;">${
                          item.extData.date.carTypeName.length <= 3
                            ? item.extData.date.carTypeName.charAt(0)
                            : item.extData.date.carTypeName.charAt(2)
                        }</h2></div>
                                &nbsp;&nbsp;&nbsp; <h3>${
                                  item.extData.date.plateNumber
                                }</h3>
                              </li>`;
                        // var otest = document.getElementsByClassName("juheClick");
                        // console.log(otest)
                        // otest.onclick = () => {
                        //     console.log('aaaa')
                        //   };
                        return ret;
                      })
                      .join("")}
                  </ul>
              </div>`;
              infoWindow.setContent(html);
              if (e.lnglat != null) {
                infoWindow.open(that.map, [
                  context.marker.getPosition().lng,
                  context.marker.getPosition().lat,
                ]);
              } else {
                console.log(e, infoWindow, 888);
              }
            });
            context.marker.on("click", () => {
              if (infoWindow) {
                infoWindow.close();
              }
            });
          },
        });
        cluster.on("click", (item) => {
          //此处是通过包含点的数量判断是否是聚合点，不是聚合点就执行上方单个点的点击方式
          if (item.clusterData.length <= 1) {
            return;
          }
          //这里是计算所有聚合点的中心点
          let alllng = 0,
            alllat = 0;
          for (const mo of item.clusterData) {
            alllng += mo.lnglat.lng;
            alllat += mo.lnglat.lat;
          }
          const lat = alllat / item.clusterData.length;
          const lng = alllng / item.clusterData.length;
          //这里是放大地图，此处写死了每次点击放大的级别，可以根据点的数量和当前大小适应放大，体验更佳
          if(!status){
            return false
          }else{
            this.map.setZoomAndCenter(this.map.getZoom() + 4, [lng, lat]);
          }
        })
        if(status){
          if (markered.length > 0) {
            this.map.setCenter([listData[0].xcd, listData[0].ycd]);
          }
        }
      });
    },
    juheClick(data) {
      // console.log(data);
      //             object.marker.on("click", function (data) {
      //   that.markerClick(object.data[0].extData.date);
      // });juheClick
    },
    carPlay(id) {
      this.trackHistoryVisible = true;
      this.$nextTick(() => {
        this.$refs.trackReplaying.queryParams.vehicleId = id;
        this.$refs.trackReplaying.type = 1;
        this.$refs.trackReplaying.initParameter();
      }, 200);
      // this.trackHistoryVisible = true;
      // this.$router.push({path:'/monitoring-carmonitoring-track-history.vue',query:{id:id,type:1}})
    },
    carVideo(label, device) {
      // console.log(label, device.videodeviceids);
      if (device.videodeviceids != "") {
        this.carVideoVisible = true;
        this.$nextTick(() => {
          this.$refs.carVideo.carVideoVisible = true;
          this.$refs.carVideo.carName = label;
          this.$refs.carVideo.device = device.videodeviceids;
          let that = this;
          setTimeout(() => {
            that.$refs.carVideo.clickVideo();
          }, 3 * 100);
        }, 200);
      } else {
        this.$message({
          message: "未查询到视频设备号",
          type: "warning",
        });
      }
    },
    carGasCurve(id) {
      this.carGasCurveVisible = true;
      this.$nextTick(() => {
        this.$refs.carGasCurve.carGasCurveVisible = true;
        this.$refs.carGasCurve.id = id;
        this.$refs.carGasCurve.initGas();
      }, 200);
    },
    queryWhereJoint() {
      let that = this;
      that.queryParams.vehicleIds = "";
      if (that.queryParams.carIds.length > 0) {
        that.queryParams.vehicleIds = that.queryParams.carIds.toString();
      }
      that.queryParams.deptIds = "";
      if (that.queryParams.deptId.length > 0) {
        that.queryParams.deptIds = that.queryParams.deptId.toString();
      }
    },
    updateCarCentre(node, i) {
      if (!(typeof i === "number" && !isNaN(i))) {
        i = 1;
      }
      let that = this;
      let id = 0;
      if (node.carid) {
        id = String(node.carid);
      } else {
        id = node.id;
      }
      if (i < 3) {
        let targetMarker = null;
        for (let i = 0; i < markered.length; i++) {
          // 获取存在每个 extData 中的 id
          let markersId = markered[i].extData.id;
          if (markersId == id || parseInt(markersId) == id) {
            targetMarker = markered[i];
            break;
          }
        }
        if (targetMarker == null) {
          let vehIds = this.queryParams.vehicleIds.split(",");
          if (!vehIds.hasOwnProperty(node.id)) {
            vehIds.push(node.id);
            that.queryParams.carIds = vehIds;
            // this.markersClusterer();
            // this.initTable();
            i++;
            setTimeout(() => {
              that.updateCarCentre(node, i);
            }, 2 * 100);
          }
        }
        if (targetMarker != null) {
          // 显示大概位置不显示信息的方法
          // let nodeObj = cluster._.filter(
          //   (item) => item.extData.date.carid == node.id
          // );
          let nodeObj = cluster._.filter(
            (item) => item.extData.date.carid == id
          );
          if (nodeObj.length > 0) {
            if (!nodeObj[0].extData.date.driverName) {
              nodeObj[0].extData.date.driverName = "暂无";
            }
            this.map.setZoom(25);
            that.markerClick(nodeObj[0].extData.date);
          }
          that.map.setCenter(targetMarker.lnglat);
        } else {
          // this.updateCarCentre(node);
        }
      }
    },
    updateEventCentre(node) {
      let that = this;
      let id = parseInt(node.id);
      // console.log(node,'nodenodenodenodenodenode');
      let targetMarker = null;
      for (let i = 0; i < markers.length; i++) {
        // 获取存在每个 extData 中的 id
        // console.log(markers[i].extData);
        let markersId = markers[i].extData.id;
        if (parseInt(markersId) === id) {
          targetMarker = markers[i];
          break;
        }
      }
      that.queryMistakeParams.idsList.push(id);
      if (targetMarker == null) {
        that.queryMistakeParams.ids =
          that.queryMistakeParams.idsList.toString();
        this.$refs.eventTree.setCheckedKeys(that.queryMistakeParams.idsList);
        that.getMistakeInfo("");
        setTimeout(() => {
          that.updateEventCentre(node);
        }, 2 * 100);
      }

      if (targetMarker != null) {
        let nodeObj = {};
        if (node.hasOwnProperty("obj")) {
          nodeObj = clusters._.filter(
            (item) => item.extData.date.id == node.obj.id
          );
        } else {
          nodeObj = clusters._.filter(
            (item) => item.extData.date.id == node.id
          );
        }
        if (nodeObj) {
          this.map.setZoom(25);
          that.markerMistakeClick(nodeObj[0].extData.date);
        }
        that.map.setCenter(targetMarker.lnglat);
        // AMap.event.trigger(targetMarker ,"click");
      } else {
      }
    },
    updateCentre(node) {
      let id = 0;
      if (node.hasOwnProperty("carid") && !node.hasOwnProperty("mistaketype")) {
        id = node.carid;
      } else if (node.hasOwnProperty("workerId")) {
        id = parseInt(node.workerId);
      } else {
        id = node.id;
      }
      let targetMarker = null;
      for (let i = 0; i < markers.length; i++) {
        // 获取存在每个 extData 中的 id
        let markersId = markers[i].extData.id;
        if (markersId === id) {
          targetMarker = markers[i];
          break;
        }
      }
      if (targetMarker != null) {
        this.map.setCenter(targetMarker.lnglat);
        // AMap.event.trigger(targetMarker ,"click");
      } else {
        if (node.hasOwnProperty("carid")) {
          let vehIds = this.queryParams.vehicleIds.split(",");
          if (!vehIds.hasOwnProperty(node.id)) {
            vehIds.push(node.id);
            this.markersClusterer();
            this.queryParams.vehicleIds = vehIds.toString();
            this.$refs.carTree.setCheckedKeys(vehIds);
          }
        } else {
          this.$message({
            message: "未查到对应的信息！",
            type: "warning",
          });
        }
      }
    },
    mistakeDropdown(i) {
      let that = this;
      that.queryMistakeParams.mistaketype = i;
      that.getMistakeInfo("");
    },
    carDropdown(i) {
      let that = this;
      that.targetQuery.worktargetTypeId = i;
      getWorkTargetViewList(that.targetQuery).then((response) => {
        if (i == 1) {
          that.dropRoad(response.data.data, i);
        } else {
          that.dropJiaShui(response.data.data, i);
        }
      });
    },
    handleNodeClick(state) {
      console.log(state,'123123');
      console.log(this.pathList,'pathList');
      var path = [];
      if (this.pathList.filter((item) => item.id == state.id).length > 0) {
        let geoinfo = this.pathList
          .filter((item) => item.id == state.id)[0]
          .geoinfo.split("P");
        for (let j = 0; j < geoinfo.length; j++) {
          if (geoinfo[j].length > 0) {
            let latLng = geoinfo[j].split("_");
            path.push([latLng[1] * 1, latLng[0] * 1]);
          }
        }
        console.log(path,'path');
        this.map.panTo(path[path.length - 1]);
      } else {
        this.getWorkTargetCheckedNodes(state);
      }
    },
    handleNodeClicks(state) {
      if (this.pathLists.filter((item) => item.id == state.id).length > 0) {
        let geoinfo = this.pathLists.filter((item) => item.id == state.id)[0];
        this.map.panTo([geoinfo.xcd, geoinfo.ycd]);
      }
    },
    dropRoad(listData) {
      let that = this;
      let polygons = [];
      let path = [];
      let markers = [];
      // cluster.setData(null);
      for (let i = 0; i < listData.length; i++) {
        // if(listData[i].id == id){
        //   geoinfo = listData[i].geoinfo.split("P");
        // }
        if (listData[i].geoinfo != null) {
          path = [];
          let geoinfo = listData[i].geoinfo.split("P");
          for (let j = 0; j < geoinfo.length; j++) {
            if (geoinfo[j].length > 0) {
              let latLng = geoinfo[j].split("_");
              path.push([latLng[1] * 1, latLng[0] * 1]);
            }
          }
          if (path.length > 0) {
            let polygon = new AMap.Polyline({
              path: path,
              strokeColor: "green",
              strokeWeight: 6,
              strokeOpacity: 0.9,
              zIndex: 50,
              bubble: false,
              extData: {
                id: listData[i].id,
                geoinfo: listData[i].geoinfo,
              },
            });
            // console.log(path[path.length/2][0],"pppppppppppppppppp");
            //  var markerContent = '' +
            //   '<div class="custom-content-marker">' +
            //   '   <div class="close-btn">哈哈哈哈</div>' +
            //   '</div>';
            // var marker = new AMap.Marker({
            //     position: new AMap.LngLat(path[path.length/2][0], path[path.length/2][1]),
            //     content: markerContent,
            //     // offset: new AMap.Pixel(0, 0)
            // });
            // that.map.add(marker);
            markers.push(polygon._opts.extData.id);
            polygon.on("click", function (e) {
              let infoWindow = new AMap.InfoWindow({
                offset: new AMap.Pixel(0, 0),
                closeWhenClickMap: true,
              });
              let address =
                listData[i].address != null ? listData[i].address : "";
              let html =
                '<div style="width: 200px;">' +
                '<span class="particularsClass">道路名称：' +
                listData[i].name +
                "</span><br/>" +
                '<span class="particularsClass">设施类型：作业道路</span><br/>' +
                '<span class="particularsClass">位置：' +
                address +
                "</span><br/>" +
                "</div>";
              infoWindow.setContent(html);
              infoWindow.open(that.map, [e.lnglat.getLng(), e.lnglat.getLat()]);
            });
            if (
              that.markersList.filter(
                (item) => item._opts.extData.id == polygon._opts.extData.id
              ).length <= 0
            ) {
              that.markersList.push(polygon);
              polygons.push(polygon);
            } else {
              let idx = that.markersList.findIndex(
                (item) => item._opts.extData.id == polygon._opts.extData.id
              );
            }
          }
        }
      }
      markers[-1] = 52;
      sessionStorage.setItem(`markers${that.count}`, JSON.stringify(markers));
      if (path.length > 0) {
        that.map.panTo(path[path.length - 1]);
      }
      if (polygons.length > 0) {
        // that.map.remove(that.markerTexts)
        listData.forEach((item) => {
          if (item.geoinfo) {
            let infos = item.geoinfo.split("P");
            let index = Math.ceil(infos.length / 2) - 1;
            let Lng = infos[index].split("_")[1];
            let Lat = infos[index].split("_")[0];
            let text1 = new AMap.Text({
              position: new AMap.LngLat(Lng, Lat),
              text: item.name,
              offset: new AMap.Pixel(-100, 0),
              extData: {
                id: item.id,
                geoinfo: item.geoinfo,
              },
            });
            text1.on("click", function (e) {
              let infoWindow = new AMap.InfoWindow({
                offset: new AMap.Pixel(0, 0),
                closeWhenClickMap: true,
              });
              let address = item.address != null ? item.address : "";
              let html =
                '<div style="width: 200px;">' +
                '<span class="particularsClass">道路名称：' +
                item.name +
                "</span><br/>" +
                '<span class="particularsClass">设施类型：作业道路</span><br/>' +
                '<span class="particularsClass">位置：' +
                address +
                "</span><br/>" +
                "</div>";
              infoWindow.setContent(html);
              infoWindow.open(that.map, [e.lnglat.getLng(), e.lnglat.getLat()]);
            });
            text1.setStyle({
              "background-color": "rgba(27, 118, 255, 0.582)",
              color: "white",
              border: "none",
            });
            if (
              that.markerTexts.filter(
                (item) => item._opts.extData.id == text1._opts.extData.id
              ).length <= 0
            ) {
              that.map.add(text1);
              that.markerTexts.push(text1);
            }
          }
        });
        that.map.add(polygons);
        // cluster.addMarkers(markers);
        // that.map.panTo(path[path.length - 1]);
      } else {
        // this.$message({
        //   message: "未查到对应的设施！",
        //   type: "warning",
        // });
      }
    },
    dropJiaShui(listData, type) {
      let that = this;
      // cluster.setData(null);
      that.clearPolygon();
      let polygons = [];
      let path = [];
      // cluster.setData(null);
      markers = [];
      for (let i = 0; i < listData.length; i++) {
        if (listData[i].geoinfo != null) {
          path = [];
          let geoinfo = listData[i].geoinfo.split("P");
          for (let j = 0; j < geoinfo.length; j++) {
            if (geoinfo[j].length > 0) {
              let latLng = geoinfo[j].split("_");
              path.push([latLng[1] * 1, latLng[0] * 1]);
            }
          }
          if (geoinfo.length < 1) {
            path.push([listData[i].lng, listData[i].lat]);
          }
          if (path.length > 0) {
            let polygon = new AMap.Polygon({
              path: path,
              strokeColor: "#2a85d5",
              fillColor: "#2a85d5",
              extData: {
                id: listData[i].id,
              },
            });
            markers.push(polygon._opts.extData.id);
            polygon.on("click", function (e) {
              let infoWindow = new AMap.InfoWindow({
                offset: new AMap.Pixel(0, 0),
                closeWhenClickMap: true,
              });
              let address =
                listData[i].address != null ? listData[i].address : "";
              let html =
                '<div style="width: 130px;">' +
                '<span class="particularsClass">设施名称：' +
                listData[i].name +
                "</span><br/>" +
                '<span class="particularsClass">设施类型：' +
                that.targetName +
                "</span><br/>" +
                '<span class="particularsClass">地址：' +
                address +
                "</span><br/>" +
                "</div>";
              infoWindow.setContent(html);
              // let infos = listData[i].geoinfo.split("P");
              // let index = Math.ceil(infos.length / 2);
              // infoWindow.open(that.map, [
              //   infos[index].split("_")[1],
              //   infos[index].split("_")[0],
              // ]);
              infoWindow.open(that.map, [e.lnglat.getLng(), e.lnglat.getLat()]);
            });
            if (
              that.markersList.filter(
                (item) => item._opts.extData.id == polygon._opts.extData.id
              ).length <= 0
            ) {
              that.markersList.push(polygon);
              polygons.push(polygon);
            }
          }
        }
      }
      console.log(path,'pathpath');
      sessionStorage.setItem(`markers${that.count}`, JSON.stringify(markers));
      if (path.length > 0) {
        let polyList = [];
        path.map((item) => {
          polyList.push(item);
        });
        let lng = 0.0,
          lat = 0.0;
        for (var i = 0; i < polyList.length; i++) {
          if (polyList[i] == null) {
            continue;
          }
          lng = lng + parseFloat(polyList[i][0]);
          lat = lat + parseFloat(polyList[i][1]);
        }
        lng = lng / polyList.length;
        lat = lat / polyList.length;
        that.map.panTo([lng, lat]);
      }
      if (polygons.length > 0) {
        listData.forEach((item) => {
          if (item.geoinfo) {
            let polyList = [];
            let infos = item.geoinfo.split("P");
            infos.map((item) => {
              if (item.split("_").length == 2) {
                polyList.push(item.split("_"));
              }
            });
            let lng = 0.0,
              lat = 0.0;
            for (var i = 0; i < polyList.length; i++) {
              if (polyList[i] == null) {
                continue;
              }
              lng = lng + parseFloat(polyList[i][1]);
              lat = lat + parseFloat(polyList[i][0]);
            }
            lng = lng / polyList.length;
            lat = lat / polyList.length;
            let text1 = new AMap.Text({
              position: new AMap.LngLat(lng, lat),
              text: item.name,
              offset: new AMap.Pixel(-50, 0),
              extData: {
                id: item.id,
                geoinfo: item.geoinfo,
              },
            });
            text1.setStyle({
              "background-color": "rgba(27, 118, 255, 0.582)",
              color: "white",
              border: "none",
            });
            text1.on("click", function (e) {
              let infoWindow = new AMap.InfoWindow({
                offset: new AMap.Pixel(0, 0),
                closeWhenClickMap: true,
              });
              let address = item.address != null ? item.address : "";
              let html =
                '<div style="width: 130px;">' +
                '<span class="particularsClass">设施名称：' +
                item.name +
                "</span><br/>" +
                '<span class="particularsClass">设施类型：' +
                that.targetName +
                "</span><br/>" +
                '<span class="particularsClass">地址：' +
                address +
                "</span><br/>" +
                "</div>";
              infoWindow.setContent(html);
              infoWindow.open(that.map, [e.lnglat.getLng(), e.lnglat.getLat()]);
            });
            if (
              that.markerTexts.filter(
                (item) => item._opts.extData.id == text1._opts.extData.id
              ).length <= 0
            ) {
              that.map.add(text1);
              that.markerTexts.push(text1);
            }
          }
        });
        that.map.add(polygons);
        // cluster.addMarkers(markers);
        // that.map.setFitView();
      } else {
        // this.$message({
        //   message: "未查到对应的设施！",
        //   type: "warning",
        // });
      }
    },
    clearPolygon() {
      let that = this;
      let list = this.$refs.targetTree.getCheckedKeys();
      that.countList.map((item) => {
        if (sessionStorage.getItem(`markers${item}`)) {
          if (that.count == item) {
            JSON.parse(sessionStorage.getItem(`markers${item}`)).map(
              (items) => {
                if (list.indexOf(items) < 0) {
                  let len = that.markersList.length;
                  while (len > 0) {
                    len--;
                    if (that.markersList[len]._opts.extData.id == items) {
                      that.map.remove(that.markersList[len]);
                      that.map.remove(
                        that.markerTexts.filter(
                          (itemY) => itemY._opts.extData.id == items
                        )
                      );
                      that.markersList.splice(len, 1);
                      that.markerTexts.splice(len, 1);
                    }
                  }
                }
              }
            );
          }
        }
      });
      // let polygons = that.map.getAllOverlays("polygon");
      // let polyLines = that.map.getAllOverlays("polyline");
      // console.log(polygons,polyLines,"890464354658143165");
      // that.map.remove(polyLines);
      // that.map.remove(polygons);
    },
    getMistakeInfo(label) {
      let that = this;
      if (clusters) {
        clusters.setData(null);
      }
      markers = [];
      let markersid = [];
      if (that.queryMistakeParams.mistaketype == "超速") {
        that.queryMistakeParams.mistaketype = "超速点";
      }
      console.log(this.queryMistakeParams);
      getMistakeInfoList(this.queryMistakeParams).then((response) => {
        let listData = response.data.data;
        console.log(listData,'listData');
        listData =  listData.sort((a,b)=>{
          return a.date < b.date ? 1 : -1
        })
        that.targetDataList = listData;
        if (listData.length > 0) {
          that.footerHeight = 36;
        }
        var count = 0;
        for (let i = 0; i < listData.length; i++) {
          markers.push({
            lnglat: [listData[i].xcd, listData[i].ycd],
            extData: {
              id: parseInt(listData[i].id),
              date: listData[i],
            },
          });
          markersid.push(parseInt(listData[i].id));
          count += 1;
        }
        clusters = new AMap.MarkerCluster(that.map, markers, {
          gridSize: 50,
          renderMarker: function (object) {
            let dateMistake = object.data[0].extData.date;
            let icon = "http://121.36.213.139/m/missdata.png";
            if (dateMistake.mistaketype == "超时停车") {
              icon = "http://121.36.213.139/m/exceedStop.png";
            }
            if (
              dateMistake.mistaketype == "超速" ||
              dateMistake.mistaketype == "慢速作业"
            ) {
              icon = "http://121.36.213.139/m/exceedSpeed.png";
            }
            if (dateMistake.mistaketype == "油量异常减少") {
              icon = "http://121.36.213.139/m/oilConsumption.png";
            }
            object.marker.setIcon(
              new AMap.Icon({
                image: icon,
              })
            ),
              object.marker.on("click", function (data) {
                that.markerMistakeClick(object.data[0].extData.date);
              });
          },
          renderClusterMarker: function (context) {
            // 聚合中点个数
            var clusterCount = context.count;
            let bgColor = "";
            // 聚合点配色
            if (clusterCount >= 0 && clusterCount < 10) {
              bgColor = "http://webapi.amap.com/theme/v1.3/m1.png";
            } else if (clusterCount >= 10 && clusterCount < 100) {
              bgColor = "http://webapi.amap.com/theme/v1.3/m2.png";
            } else if (clusterCount >= 100 && clusterCount < 1000) {
              bgColor = "http://webapi.amap.com/theme/v1.3/m3.png";
            } else if (clusterCount >= 1000 && clusterCount < 10000) {
              bgColor = "http://webapi.amap.com/theme/v1.3/m4.png";
            } else if (clusterCount >= 10000) {
              bgColor = "http://webapi.amap.com/theme/v1.3/m5.png";
            }
            var size = Math.round(
              25 + Math.pow(clusterCount / count, 1 / 5) * 40
            );
            context.marker.setOffset(new AMap.Pixel(-size / 2, -size / 2));
            context.marker.setContent(
              `<div id="ssss" style="width: 56px; height: 56px; background-image: url(${bgColor});background-size: 100% 100%;background-repeat: no-repeat;background-attachment: fixed; text-align: center; line-height: 56px;color: rgb(0, 0, 0); font-size: 12px; cursor: pointer;">${clusterCount}</div>`
            );
            let infoWindow;
            context.marker.on("mouseover", (e) => {
              //判断长度是否相同
              if (context.count != context.clusterData.length) {
                //深度克隆原所有数据数组
                var markered1 = JSON.parse(JSON.stringify(markers));
                //根据两点之间距离大小进行排序
                markered1.sort((a, b) => {
                  var temp = context.marker._opts.position;
                  var temp1 =
                    (temp[0] - a.extData.date.xcd) ** 2 +
                    (temp[1] - a.extData.date.ycd) ** 2;
                  var temp2 =
                    (temp[0] - b.extData.date.xcd) ** 2 +
                    (temp[1] - b.extData.date.ycd) ** 2;
                  return temp1 - temp2;
                });
                //截取距离最小到长度
                markered1 = markered1.slice(0, context.count);
                //最后赋值
                context.clusterData = markered1;
              }
              infoWindow = new AMap.InfoWindow({
                offset: new AMap.Pixel(5, -30),
                closeWhenClickMap: true,
              });
              let html = `<div>
                  <ul style="list-style: none;width:200px;height:${
                    context.clusterData.length > 5 ? "200px" : "100%"
                  };">
                    ${context.clusterData
                      .map((item) => {
                        //聚合点内部标签
                        let icon = "http://121.36.213.139/m/missdata.png";
                        if (item.extData.date.mistaketype == "超时停车") {
                          icon = "http://121.36.213.139/m/exceedStop.png";
                        }
                        if (
                          item.extData.date.mistaketype == "超速" ||
                          item.extData.date.mistaketype == "慢速作业"
                        ) {
                          icon = "http://121.36.213.139/m/exceedSpeed.png";
                        }
                        if (item.extData.date.mistaketype == "油量异常减少") {
                          icon = "http://121.36.213.139/m/oilConsumption.png";
                        }
                        return `<li style="display: flex;align-items: center;">
                                <div style="width: 30px; height: 40px; background-image: url(${icon});background-size: 100% 100%;background-repeat: no-repeat; text-align: center; line-height: 45px;color: rgb(0, 0, 0); font-size: 12px; cursor: pointer;"><h2 style="color:white;"></h2></div>
                                &nbsp;&nbsp;&nbsp; <h3>${item.extData.date.plateNumber}(${item.extData.date.mistaketype})</h3>
                              </li>`;
                      })
                      .join("")}
                  </ul>
              </div>`;
              infoWindow.setContent(html);
              if (e.lnglat != null) {
                infoWindow.open(that.map, [
                  context.marker.getPosition().lng,
                  context.marker.getPosition().lat,
                ]);
              } else {
                console.log(e, infoWindow, 888);
              }
            });
            context.marker.on("click", () => {
              if (infoWindow) {
                infoWindow.close();
              }
            });
          },
        });
        clusters.on("click", (item) => {
          // window.alert("21332")
          //此处是通过包含点的数量判断是否是聚合点，不是聚合点就执行上方单个点的点击方式
          if (item.clusterData.length <= 1) {
            return;
          }
          //这里是计算所有聚合点的中心点
          let alllng = 0,
            alllat = 0;
          for (const mo of item.clusterData) {
            alllng += mo.lnglat.lng;
            alllat += mo.lnglat.lat;
          }
          const lat = alllat / item.clusterData.length;
          const lng = alllng / item.clusterData.length;
          //这里是放大地图，此处写死了每次点击放大的级别，可以根据点的数量和当前大小适应放大，体验更佳
          this.map.setZoomAndCenter(this.map.getZoom() + 4, [lng, lat]);
        });
        if (markers.length > 0) {
          if (label != "" && label.children == null) {
            this.map.setZoom(25);
            that.markerMistakeClick(
              listData.filter((item) => item.id == label.id)[0]
            );
            this.map.setCenter([
              listData.filter((item) => item.id == label.id)[0].xcd,
              listData.filter((item) => item.id == label.id)[0].ycd,
            ]);
          } else {
            this.map.setZoom(25);
            this.map.setCenter([
              listData[listData.length - 1].xcd,
              listData[listData.length - 1].ycd,
            ]);
          }
        } else {
          this.$message({
            message: "未查到对应的违规信息！",
            type: "warning",
          });
        }
      });
    },
    markerMistakeClick(e) {
      console.log(e,'eeeeeeeeeeeeeee');
      let infoWindow = new AMap.InfoWindow({
        offset: new AMap.Pixel(0, -30),
        closeWhenClickMap: true,
      });
      let driverName = e.driverName != null ? e.driverName : "";
      let date = e.date != undefined ? e.date : "";
      let html =
        '<div style="width: 270px;">' +
        '<span class="particularsClass">所属部门：' +
        (e.deptName || "--") +
        "</span><br/>" +
        '<span class="particularsClass">车辆编号：' +
        (e.plateNumber || "--") +
        "</span><br/>" +
        '<span class="particularsClass">司&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;机：' +
        (driverName || "--") +
        "</span><br/>" +
        '<span class="particularsClass">车辆类型：' +
        (e.carTypeName || "--") +
        "</span><br/>" +
        '<span class="particularsClass">时&nbsp;&nbsp;间&nbsp;&nbsp;段：' +
        (e.parkingtime || "--") +
        "</span><br/>" +
        '<span class="particularsClass">违规类型：' +
        (e.mistaketype || "--") +
        "</span><br/>" +
        '<span class="particularsClass">违规时间：' +
        (date || "--") +
        "</span><br/>" +
        '<span class="particularsClass">违规地点：' +
        (e.location || "--") +
        "</span><br/>" +
        "</div>";
      infoWindow.setContent(html);
      infoWindow.open(this.map, [e.xcd, e.ycd]);
    },
    queryMistakeInfo(data) {
      this.queryMistakeParams.vehicleId = data.id;
      this.getMistakeInfo(data.label);
    },
    queryTarget(data, index) {
      let that = this;
      let id = data.id;
      let polyLine = null;
      let polygon = null;

      if (that.targetQuery.worktargetTypeId == 1) {
        let polyLines = that.map.getAllOverlays("polyline");
        for (let i = 0; i < polyLines.length; i++) {
          let polyLineId = polyLines[i].getExtData().id;
          if (id == polyLineId) {
            polyLine = polyLines[i];
          }
        }
        that.polyLineIsCheck(polyLine, id, data, index);
      } else {
        let polygons = that.map.getAllOverlays("polygon");
        for (let i = 0; i < polygons.length; i++) {
          let polygonId = polygons[i].getExtData().id;
          if (id == polygonId) {
            polygon = polygons[i];
          }
        }
        that.polyLineIsCheck(polygon, id, data, index);
      }
      // let polygon = new AMap.Polyline
      // let polyLine = new AMap.Polygon
      // that.map.setCenter(targetMarker.getPosition());
    },
    polyLineIsCheck(polyLine, id, data, index) {
      let that = this;

      if (polyLine == null) {
        let ids = that.targetQuery.worktargetIdsList;
        ids.push(id);
        that.targetQuery.worktargetIds = ids.toString();
        that.targetQuery.worktargetIdsList = ids;
        that.carDropdown(that.targetQuery.worktargetTypeId);
        this.$refs.targetTree.setCheckedKeys(ids);
        if (index < 3) {
          setTimeout(() => {
            that.queryTarget(data, index);
          }, 2 * 100);
          index++;
        }
      } else {
        // AMap.event.trigger(polyLine,"click");
      }
    },
    numFilter(row, column, cellValue, index) {
      const realVal = parseFloat(cellValue).toFixed(2);
      return realVal;
    },
  },
  computed: {
    searchCarData() {
      let list = [];
      list = this.carData.filter((item) =>
        item.vehicleNum.includes(this.filterText)
      );
      // console.log(list,'list');
      return list;
    },
    sumUp() {
      let sum = [
        {
          carStatus: "在线",
          carSum: this.carTotal.online,
        },
        {
          carStatus: "离线",
          carSum: this.carTotal.offLine,
        },
        {
          carStatus: "出车",
          carSum: this.carTotal.goCar,
        },
        {
          carStatus: "未出车",
          carSum: this.carTotal.noGoCar,
        },
      ];
      return sum;
    },
  },
  watch: {
    filterText(val) {
      this.getCheckedNodes(this.searchCarData);
      // console.log("search", this.searchCarData);

      // this.initCarTree(this.getCarAll);
      // that.$refs.carTree.filter(val);
    },
    filterDeptText(val) {
      this.$refs.tree.filter(val);
    },
    targetFilterText(val) {
      let that = this;
      that.$refs.targetTree.filter(val);
    },
    eventFilterText(val) {
      let that = this;
      that.initEventTree();
      // that.$refs.eventTree.filter(val);
    },
    deptIdStr(val) {
      this.queryMistakeTreeParams.deptIds = val;
      this.initEventTree(true);
    },
    dataForm: {
      deep: true,
      handler: function (val) {
        this.queryParams.deptIds = val.deptId;
        let obj = {};
        if (val.deptId != "") {
          obj.deptIds = val.deptId;
        }
        let { onlineStatus, vehicleTypeIds, outVehicleStatus } = this.getCarAll;
        if (onlineStatus) {
          obj.onlineStatus = onlineStatus;
        }
        if (vehicleTypeIds) {
          obj.vehicleTypeIds = vehicleTypeIds;
        }
        if (outVehicleStatus) {
          obj.outVehicleStatus = outVehicleStatus;
        }
        this.initCarTree(obj);
        this.map.setZoom(13);
      },
    },
  },
  beforeDestroy() {
    // 页面关闭（路由跳转）时清除定时器
    clearInterval(this.timer);
    this.timer = null;
    window.removeEventListener("resize", this.handleResize);
  },
  mounted() {
    this.$nextTick(() => {
      // console.log(this.$refs.refsTable.$el.offsetTop);
      // 根据浏览器高度设置初始高度
      this.heights =
        window.innerHeight - this.$refs.refsTable.$el.offsetTop - 100;
      // 监听浏览器高度变化，修改表格高度
      window.onresize = () => {
        this.heights =
          window.innerHeight - this.$refs.refsTable.$el.offsetTop - 100;
      };
    });
    let param = {
      resizeEnable: true,
      center: [121.667855, 42.027915],
      zoom: 15,
    };
    // let query = this.$route.query;
    // if(query.hasOwnProperty('pageNumber')){
    //   document.getElementById(this.pageNumber).id = query.pageNumber;
    //   this.pageNumber = query.pageNumber;
    // }
    let mapId = this.pageNumber;
    if (this.isPage) {
      mapId = "container";
      document.getElementById(this.pageNumber).id = mapId;
    }
    this.map = new AMap.Map(mapId, param);
    cluster = new AMap.MarkerClusterer(this.map, markers, { gridSize: 80 });
    window.carPlay = this.carPlay;
    window.carVideo = this.carVideo;
    window.carGasCurve = this.carGasCurve;
    let yscartypeList = [];
    getCarAlls({ onlineStatus: 1 }).then((msg) => {
      this.carTotal.online = msg.data.data.length;
    });
    getCarAlls({ onlineStatus: 0 }).then((msg) => {
      this.carTotal.offLine = msg.data.data.length;
    });
    getVehWorkNormBigDataType().then((response) => {
      let datalist = response.data.data;
      console.log(datalist,"datalist");
      for (var index in datalist) {
        // console.log(datalist[index]);
        this.carTotal.goCar += Number(datalist[index].carWorkNum);
        this.carTotal.noGoCar += Number(datalist[index].notWork);
        let ifshow = true;
        yscartypeList.push({
          name: datalist[index].cartype,
          value: datalist[index].carWorkNum,
          notWork: datalist[index].notWork,
          labelLine: { show: ifshow },
          label: { show: ifshow },
          carLV: datalist[index].carLV,
          carTotal: datalist[index].carTotal,
          carWorkNum: datalist[index].carWorkNum,
        });
      }
    });
    setTimeout(() => {
      var mychart = echarts.init(document.getElementById("mains"));
      var option = {
        tooltip: {
          trigger: "item",
          formatter: function (parms) {
            var str =
              "" +
              parms.name +
              ":" +
              parms.data.carTotal +
              "</br>" +
              "出车数：" +
              parms.data.carWorkNum +
              "</br>" +
              "未出车数：" +
              parms.data.notWork +
              "</br>";
            return str;
          },
        },

        series: [
          {
            name: "Access From",
            type: "pie",
            avoidLabelOverlap: true,
            minAngle: 10,
            label: {
              normal: {
                show: false,
              },
            },
            labelLine: {
              normal: {
                show: false,
              },
            },
            data: yscartypeList,
          },
        ],
      };
      mychart.setOption(option);
      window.onresize = function () {
        mychart.resize();
      };
    }, 1000);
  },
};
</script>
<style>
.a {
  pointer-events: none;
}

#pane-first {
  height: 100%;
}

.statistics-card {
  display: flex;
  padding: 0px 20px 0px 20px;
  flex-wrap: wrap;
  justify-content: space-between;
}

.item-card {
  width: 34%;
  margin: 0 !important;
  margin: 10px !important;
  height: 40px;
  text-align: center;
}

.el-card__body {
  padding: 0px !important;
}

.aui-content>.el-tabs>.el-tabs__content {
  padding: 0px !important;
}

.el-tabs__content {
  /* height: 100% !important; */
}

.el-tabs--card {
  height: 100%;
}

.el-main {
  padding: 0px !important;
}

.container {
  height: 89vh;
}

.el-checkbox-button--small .el-checkbox-button__inner {
  padding: 10px 15px !important;
  margin: 2px !important;
  border-left: 1px solid #dcdfe6;
}

.el-radio-button--small .el-radio-button__inner {
  padding: 10px 15px !important;
  margin: 2px !important;
  border-left: 1px solid #dcdfe6;
}

.el-button--small,
.el-button--small.is-round {
  padding: 9px 15px !important;
}

.card-msg>.el-button--small,
.card-msg>.el-button--small.is-round {
  padding: 7px 15px !important;
}

.el-footer {
  padding: 0px !important;
  overflow: auto;
  background-color: white;
  z-index: 999;
}

.show_table ::-webkit-scrollbar {
  display: none;
}

.trackDialog1 {
  width: 85% !important;
  margin-top: 6vh !important;
  margin-left: 12vw;
  height: 88vh;
}

.particularsClass {
  font-weight: 600;
  font-size: 12px;
  line-height: 30px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  -o-text-overflow: ellipsis;
}

.trackMonitoring {
  padding-left: 2vw;
  color: #1818be;
}

.el-dropdown {
  vertical-align: top;
}

.el-dropdown+.el-dropdown {
  margin-left: 15px;
}

.el-icon-arrow-down {
  font-size: 12px;
}

#dropdownRight {
  position: absolute;
  right: 1vh;
  top: 1vh;
  z-index: 999;
}

::v-deep .el-pagination {
  width: 90%;
  font-size: 8px;
  /* margin-left: 15px; */
}

.el-pager {
  /* width: 100px; */
}

.el-pagination__jump {
  /* margin-left: 140px !important; */
}

/*.amap-icon img {*/
/*  */
/*}*/
</style>
