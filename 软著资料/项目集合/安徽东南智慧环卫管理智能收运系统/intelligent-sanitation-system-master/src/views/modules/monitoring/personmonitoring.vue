<template>
  <el-card shadow="never" class="aui-card--fill">
    <el-container style="overflow-y: hidden">
      <el-aside :style="{ width: asideWidth + 'vw' }">
        <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
          <el-tab-pane label="人员" name="second" v-if="workerShow">
            <div>
              <el-button @click="queryTree('-1')">
                <el-row style="padding-bottom:2px;">全部</el-row>
                <el-row>({{ sumUp[0].carSum + sumUp[1].carSum }})</el-row>
              </el-button>
              <el-button @click="queryTree('1')" type="success">
                <el-row style="padding-bottom:2px;">在线</el-row>
                <el-row>({{ sumUp[0].carSum }})</el-row>
              </el-button>
              <el-button @click="queryTree('0')" type="info">
                <el-row style="padding-bottom:2px;">离线</el-row>
                <el-row>({{ sumUp[1].carSum }})</el-row>
              </el-button>
              <el-button @click="queryTree('-2')" type="danger">
                <el-row style="padding-bottom:2px;">未到岗</el-row>
                <el-row>({{ sumUp[3].carSum }})</el-row>
              </el-button>
            </div>
            <div :style="{
              position: 'absolute',
              zIndex: typeIndex,
              backgroundColor: 'white',
              height: '52px',
              width: '20vw',
              overflowX: 'auto',
              overflowY: 'hidden',
              whiteSpace: 'nowrap',
              paddingTop: '5px',
            }">
              <el-checkbox-group v-model="choiceWorkerType" size="small">
                <el-checkbox-button label="" @change="workTypeChangeALl">全部</el-checkbox-button>
                <el-checkbox-button v-for="(city, i) in workerTypeList" :label="city.detailTypeId"
                  @change="workTypeChange" :key="city.detailTypeId">{{ city.detailTypeName }}</el-checkbox-button>
              </el-checkbox-group>
            </div>
            <div style="margin-top: 55px; background-color: white">
              <div style="display: flex">
                <el-input style="margin-bottom: 10px" placeholder="输入关键字进行过滤" v-model="filterText">
                </el-input>
                <ren-dept-tree v-model="dataForm.deptId" :placeholder="$t('dept.title')" :query="true"
                  :styleState="true"></ren-dept-tree>
              </div>
              <el-table :data="searchCarData" style="width: 100%" @row-click="updateWorkCentre" max-height="325">
                <el-table-column label="所属部门">
                  <template slot-scope="scope">
                    {{ scope.row.deptName }}
                  </template>
                </el-table-column>
                <el-table-column label="人员姓名">
                  <template slot-scope="scope">
                    <!-- <h4
                      :style="{
                        color:
                          scope.row.onlineStatus == '1'
                            ? 'green'
                            : scope.row.goStatus == '0'
                            ? 'orange'
                            : 'gray',
                      }"
                    > -->
                    <h4 :style="{
                      color:
                        scope.row.onlineStatus == '0'
                          ? 'gray'
                          : scope.row.toGangDay == '0'
                            ? 'orange'
                            : 'green',
                    }">
                      {{ scope.row.name }}
                    </h4>
                  </template>
                </el-table-column>
                <el-table-column label="操作">
                  <template slot-scope="scope">
                    <i class="el-icon-position" @click="workerPlay(scope.row.workerId)"></i>
                  </template>
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
            </div>
          </el-tab-pane>
          <el-tab-pane label="设施" name="third" v-if="workTargetShow">
            <div :style="{
              position: 'absolute',
              top: '-0.5vh',
              zIndex: typeIndex,
              backgroundColor: 'white',
              height: '55px',
              width: '20vw',
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
                @check="getWorkTargetCheckedNodes" @node-click="handleNodeClick"
                :default-expanded-keys="defaultExpandIds" @node-expand="handleNodeExpand"
                @node-collapse="handleNodeCollapse" style="height: 70vh; overflow: auto"
                :filter-node-method="filterNode" :props="defaultProps">
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
            <div :style="{
              position: 'absolute',
              top: '-0.5vh',
              zIndex: typeIndex,
              backgroundColor: 'white',
              height: '65px',
              width: '20vw',
              overflowX: 'auto',
              overflowY: 'hidden',
              whiteSpace: 'nowrap',
              paddingTop: '5px',
            }">
              <el-radio-group v-model="choiceEvent" @change="queryEventTree">
                <el-radio-button :label="''" :key="''">所有<br />
                  {{ eventCount }}</el-radio-button>
                <el-radio-button v-for="(city, i) in eventList" :label="city.detailTypeCode" :key="city.detailTypeCode">
                  {{ city.detailTypeName }}<br />{{
                      city.len
                  }}</el-radio-button>
              </el-radio-group>
            </div>
            <div style="margin-top: 65px; background-color: white">
              <div style="display: flex">
                <el-input style="margin-bottom: 10px" placeholder="输入关键字进行过滤" v-model="eventFilterText">
                </el-input>
                <ren-dept-tree v-model="deptIdStr" :placeholder="$t('dept.title')" :query="true" :styleState="true">
                </ren-dept-tree>
              </div>
              <el-tree :data="eventData" node-key="id" ref="eventTree" highlight-current
                style="height: 70vh; overflow: auto" show-checkbox @check="getEventCheckedNodes"
                :filter-node-method="filterNode" :props="defaultProps">
                <span class="custom-tree-node" slot-scope="{ node, data }">
                  <span v-if="data.nodeType == 'bigtype'">
                    <i class="el-icon-user" style="color: gray"></i>
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
      <el-container>
        <div style="z-index: 999; position: absolute; top: 2vh">
          <i v-if="asideShow" class="el-icon-s-fold" @click="asidePackUp" style="font-size: 20px !important"></i>
          <i v-else class="el-icon-s-unfold" @click="asideUnfold" style="font-size: 20px !important"></i>
          <el-switch style="margin-top: -10px; margin-left: 10px" v-model="refresh" @change="shiShi" active-text="实时刷新">
          </el-switch>
        </div>
        <div id="dropdownRight">
          <el-dropdown @command="carDropdown" v-if="personCoverage">
            <el-button type="primary">
              图层控制<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="30">作业区域</el-dropdown-item>
              <el-dropdown-item>违规点</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>

          <!--          <el-dropdown @command="carDropdown"  v-if="facilityCoverage">-->
          <!--            <el-button type="primary">-->
          <!--              图层控制<i class="el-icon-arrow-down el-icon&#45;&#45;right"></i>-->
          <!--            </el-button>-->
          <!--            <el-dropdown-menu slot="dropdown">-->
          <!--              <el-dropdown-item command="13">停车场</el-dropdown-item>-->
          <!--              <el-dropdown-item command="18">垃圾箱</el-dropdown-item>-->
          <!--              <el-dropdown-item command="30">作业区域</el-dropdown-item>-->
          <!--              <el-dropdown-item command="10">中转站</el-dropdown-item>-->
          <!--              <el-dropdown-item command="3">加水点</el-dropdown-item>-->
          <!--            </el-dropdown-menu>-->
          <!--          </el-dropdown>-->

          <el-dropdown @command="mistakeDropdown" v-if="eventCoverage">
            <el-button type="primary">
              图层控制<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-for="(city, i) in eventList" :key="city.detailTypeId" :command="city.detailTypeCode">
                {{ city.detailTypeCode }}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
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
        <el-footer :style="{
          height: footerHeight + 'vh',
          position: 'absolute',
          bottom: '0vh',
          width: footerWidth + '%',
        }">
          <div v-if="workerTableShow">
            <el-table :data="workerDataList" class="show_table" height="250" style="width: 100%"
              @row-click="updateWorkCentre">

              <el-table-column prop="workerName" fixed label="人员姓名" header-align="center" align="center">
              </el-table-column>
              <el-table-column prop="workerTypeName" fixed label="人员类型" header-align="center" align="center">
              </el-table-column>
              <el-table-column prop="deptName" fixed label="所属部门" width="180" header-align="center" align="center">
              </el-table-column>
              <el-table-column prop="scheduleAreaName" fixed label="规划区域" header-align="center" align="center">
              </el-table-column>
              <el-table-column prop="xunchaNum" fixed label="巡查次数" header-align="center" align="center">
              </el-table-column>
              <el-table-column prop="startWorkTime" label="到岗时间" header-align="center" align="center">
              </el-table-column>
              <el-table-column prop="endWorkTime" label="离岗时间" header-align="center" align="center">
              </el-table-column>

              <el-table-column prop="xunchaMileage" label="作业里程" :formatter="numFilter" header-align="center"
                align="center"></el-table-column>
              <el-table-column prop="xunchaLong" label="作业时长" :formatter="timeFormatter" header-align="center"
                align="center"></el-table-column>
              <el-table-column prop="yuejieNum" label="越界次数" header-align="center" align="center"></el-table-column>
              <el-table-column prop="zhiliuNum" label="滞留次数" header-align="center" align="center"></el-table-column>
              <el-table-column prop="lastupdatedate" label="最后上报时间" header-align="center" align="center">
              </el-table-column>

            </el-table>
            <el-pagination :current-page="workerParams.page" :page-sizes="[5, 10, 15, 30]"
              :page-size="workerParams.limit" :total="workerParams.total" @current-change="handleWorkerCurrentChange"
              layout="total, prev, pager, next, jumper">
              <!-- layout="total, sizes, prev, pager, next, jumper" -->
            </el-pagination>
          </div>
          <div v-if="facilityTableShow">
            <el-table :data="workerDataList" class="show_table" style="width: 100%">
              <el-table-column prop="deptName" label="所属部门" width="180" header-align="center" align="center">
              </el-table-column>
              <el-table-column prop="workerName" label="公厕编号" header-align="center" align="center"></el-table-column>
              <el-table-column prop="workerTypeName" label="公厕名称" header-align="center" align="center">
              </el-table-column>
              <el-table-column prop="xunchaNum" label="负责人" header-align="center" align="center"></el-table-column>
              <el-table-column prop="xunchaLong" label="联系电话" header-align="center" align="center"></el-table-column>
              <el-table-column prop="xunchaMileage" label="视频设备号" header-align="center" align="center">
              </el-table-column>
              <el-table-column prop="yuejieNum" label="气味检查设备号" header-align="center" align="center"></el-table-column>
              <el-table-column prop="yuejieLong" label="位置" header-align="center" align="center"></el-table-column>
            </el-table>
            <el-pagination :current-page="workerParams.page" :page-sizes="[5, 10, 15, 30]"
              :page-size="workerParams.limit" :total="workerParams.total" @current-change="handleWorkerCurrentChange"
              layout="total, sizes, prev, pager, next, jumper">
            </el-pagination>
          </div>
          <div v-if="targetTableShow">
            <el-table :data="targetDataList" class="show_table" style="width: 100%" height="250"
              @row-click="updateEventCentre">
              <el-table-column prop="deptName" fixed label="所属部门" header-align="center" align="center">
              </el-table-column>
              <el-table-column prop="workerName" label="人员姓名" header-align="center" align="center"></el-table-column>
              <el-table-column prop="eventType" label="违规类型" header-align="center" align="center"></el-table-column>
              <el-table-column prop="parkingTime" label="时间段" header-align="center" align="center"></el-table-column>
              <el-table-column prop="eventLong" label="违规时长" header-align="center" align="center"></el-table-column>
              <el-table-column prop="createDate" label="违规时间" header-align="center" align="center"></el-table-column>
              <el-table-column prop="eventPlace" label="违规地点" width="280" header-align="center" align="center">
              </el-table-column>
            </el-table>
          </div>
        </el-footer>
      </el-container>
    </el-container>
    <trackReplaying v-if="trackHistoryVisible" ref="trackReplaying"></trackReplaying>
    <carVideo v-if="carVideoVisible" ref="carVideo"></carVideo>
  </el-card>
</template>

<script>
import {
  getManAll2, getMotionAll, getManAll, getListByPageNumber, getCommonTreeListByType, getCarType, getAdapterWorkWorkload, getCurrentPositionStatusList, getWorkerCommonTreeListByType, getWorkerType, getAdapterWorkerWorkload, getWorkerCurrentStatusListByType, getWorkTargetViewList,
  workTargetPage, getWorkTargetTreeListByType, getMistakeInfoList, getPersonEventByIds, getWorkerTypeList, getWorkTargetTypeList, getEventTypeTree, getFieldListByCode, getPersonEventWorkerTree
} from "@/api/carmonitoring";
import trackReplaying from './track-replaying'
import { parseInt } from "lodash";
import DateUtil from '@/utils/dateUtil.js'
import carVideo from './car_video'
import * as echarts from "echarts";
let markers = [];
let cluster;
let markered = []
let clusters;
export default {
  data() {
    return {
      defaultExpandIds: [],
      pathList: [],
      times: null,
      deptIdStr: "",
      dataForm: {
        deptId: "",
      },
      markerTexts: [],
      trackHistoryVisible: false,
      carVideoVisible: false,
      carCoverage: true,
      personCoverage: false,
      facilityCoverage: false,
      eventCoverage: false,
      asideWidth: 20,
      asideShow: true,
      footerHeight: 0,
      footerShow: true,
      refresh: false,
      footerWidth: 77,
      footerBottom: 35,
      activeName: 'second',
      carType: [],
      typeIndex: 0,
      countList: [],
      markersList: [],
      count: 0,
      typeHide: 3,
      typeLength: 9,
      vehicleShow: false,
      workerShow: false,
      workTargetShow: false,
      eventShow: false,
      carTypeList: [],
      choiceCarType: [],
      initCarType: [],
      workerTypeList: [],
      choiceWorkerType: [],
      initWorkType: [],
      workerTargetList: [],
      choiceWorkerTarget: '',
      targetName: '',
      initWorkerTarget: null,
      eventList: [],
      eventCount: [],
      choiceEvent: '',
      carTableShow: true,
      workerTableShow: false,
      facilityTableShow: false,
      targetTableShow: false,
      data: [],
      eventData: [],
      workerData: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      filterText: '',
      targetFilterText: '',
      eventFilterText: '',
      map: null,
      dataList: [],
      workerDataList: [],
      targetData: [],
      targetDataList: [],
      pageNumber: 'allworkermonitor_1',
      isPage: true,
      workerTypeIdList: [],
      queryParams: {
        status: -1,
        carTypeIds: [],
        carIds: [],
        deptId: [],
        page: 1,
        limit: 5,
        total: 1,
        deptIds: '',
        vehicleIds: ''
      },
      workerParams: {
        status: -1,
        deptIdList: [],
        workerIds: '',
        workerIdsList: [],
        workerIdsStr: [],
        workerTypeIds: '',
        page: 1,
        limit: 5,
        total: 1,
        onlineStatus: -1,
      },
      workerPas: {
        deptId: "",
        deptIdList: [],
        workerTypeIdsStr: [],
        workerIds: "",
        toGangday: "-1"
      },
      queryMistakeParams: {
        ids: '',
        mistaketype: '',
        idsList: []
      },
      queryMistakeTreeParams: {
        deptId: '',
        personeventtypes: ''
      },
      targetQuery: {
        worktargetTypeIds: null,
        worktargetTypeId: '',
        deptIds: '',
        worktargetIds: '',
        worktargetIdsList: []
      },
      manTotal: {
        online: 0,
        offLine: 0,
        goMan: 0,
        noGoMan: 0
      },
      //权限
      whetherToShowPlay: false,
      whetherToShowVideo: false,
      whetherToShowOil: false,

      // 上一次点击 责任区/垃圾场/加冰点/公厕 设施的数组
      lastClickSS: '',
      currentClickStr: ''
    }
  },
  components: {
    trackReplaying,
    carVideo
  },
  computed: {
    searchCarData() {
      let list = [];
      list = this.workerData.filter((item) =>
        item.name.includes(this.filterText)
      );
      console.log(list, '搜索数据');
      return list;
    },
    sumUp() {
      let sum = [
        {
          carStatus: "在线",
          carSum: this.manTotal.online,
        },
        {
          carStatus: "离线",
          carSum: this.manTotal.offLine,
        },
        {
          carStatus: "到岗",
          carSum: this.manTotal.goMan,
        },
        {
          carStatus: "未到岗",
          carSum: this.manTotal.noGoMan,
        },
      ];
      return sum;
    },
  },
  created() {
    window.addEventListener('resize', this.handleResize)
    this.handleResize()
    let query = this.$route.query;
    if (query.hasOwnProperty('pageNumber')) {
      // document.getElementById(this.pageNumber).id = query.pageNumber;
      this.pageNumber = query.pageNumber;
      this.isPage = false;
    }
    let that = this;
    getListByPageNumber(that.pageNumber).then(response => {
      let pageNumber = response.data.data;
      for (let i = 0; i < pageNumber.length; i++) {
        if (pageNumber[i] == 'worker') {
          that.workerShow = true;
          that.initWorkerTab();
        }
        if (pageNumber[i] == 'worktarget') {
          that.workTargetShow = true;
          that.initWorkTargetTab();
        }
        if (pageNumber[i] == 'event') {
          that.eventShow = true;
          that.initEventTab();
        }

      }
    });
  },
  methods: {
    // 树节点展开
    handleNodeExpand(data) {
      console.log(data, this.defaultExpandIds)
      // 保存当前展开的节点
      let flag = false
      this.defaultExpandIds.some(item => {
        if (item === data.id) { // 判断当前节点是否存在， 存在不做处理
          flag = true
          return true
        }
      })
      if (!flag) { // 不存在则存到数组里
        this.defaultExpandIds.push(data.id)
      }
    },
    // 树节点关闭
    handleNodeCollapse(data) {
      // 删除当前关闭的节点
      this.defaultExpandIds.some((item, i) => {
        if (item === data.id) {
          this.defaultExpandIds.splice(i, 1)
        }
      })
      this.removeChildrenIds(data) // 这里主要针对多级树状结构，当关闭父节点时，递归删除父节点下的所有子节点
    },
    removeChildrenIds(data) {
      const ts = this
      if (data.children) {
        data.children.forEach(function (item) {
          const index = ts.defaultExpandIds.indexOf(item.id)
          if (index > 0) {
            ts.defaultExpandIds.splice(index, 1)
          }
          ts.removeChildrenIds(item)
        })
      }
    },
    handleNodeClick(state) {
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
        console.log(path);
        this.map.panTo(path[path.length - 1]);
      } else {
        this.getWorkTargetCheckedNodes(state);
      }
    },
    handleResize(event) {
      this.fullWidth = document.documentElement.clientWidth;
      if (this.fullWidth <= 1842 && this.fullWidth > 1482) {
        this.typeHide = 2;
        console.log(this.fullWidth)
      }
      else if (this.fullWidth <= 1482) {
        this.typeHide = 1;
        console.log(this.fullWidth)
      } else {
        this.typeHide = 3;
        console.log(this.fullWidth)
      }
    },
    initWorkerTab() {
      let that = this;
      getWorkerTypeList(this.pageNumber).then(response => {
        let vehicleTypeList = response.data.data;
        for (let i = 0; i < vehicleTypeList.length; i++) {
          let vehicleType = vehicleTypeList[i];
          if (vehicleType.isSelected == true) {
            that.workerTypeList.push(vehicleType);
            that.workerTypeIdList.push(vehicleType.detailTypeId);
          }
        }
        that.initWorkType = that.workerTypeIdList;
        that.initWorkerTree();
      });


    },
    initWorkTargetTab() {
      sessionStorage.clear();
      let that = this;
      getWorkTargetTypeList(this.pageNumber).then(response => {
        let vehicleTypeList = response.data.data;
        for (let i = 0; i < vehicleTypeList.length; i++) {
          let vehicleType = vehicleTypeList[i];
          if (vehicleType.isSelected == true) {
            that.workerTargetList.push(vehicleType);
            that.countList.push(vehicleType.detailTypeId);
          }
        }
        if (that.workerTargetList.length > 0) {
          that.targetQuery.worktargetTypeIds = that.workerTargetList[0].detailTypeId;
          that.initWorkerTarget = that.targetQuery.worktargetTypeIds;
          that.targetQuery.worktargetTypeId = that.initWorkerTarget;
          that.choiceWorkerTarget = that.initWorkerTarget;
          that.count = that.choiceWorkerTarget;
          that.targetName = that.workerTargetList[0].detailTypeName;
          that.initWorkTargetTree();
        }
      });

      getFieldListByCode(that.pageNumber, "worker", "monitorMap").then(response => {
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
      });
    },
    initEventTab() {
      let that = this;
      getEventTypeTree(this.pageNumber).then(response => {
        that.eventList = response.data.data;
      });
      that.initEventTree();

    },
    initCarTree() {
      let that = this;
      getCommonTreeListByType(that.queryParams).then(response => {
        that.data = response.data;
      });
    },
    // 根据筛选查询数据
    initWorkerTree() {
      let that = this;
      that.workerParams.workerTypeIds = that.workerTypeIdList.toString();
      console.log(that.workerPas);
      getWorkerCurrentStatusListByType(that.workerPas).then(response => {
        console.log(response.data.data, 'initWorkerTree')
        that.workerData = response.data.data;
        if (this.workerParams.status == '1') {
          that.workerData = response.data.data.filter(item => { return item.onlineStatus == "1" })
        }
        if (this.workerParams.status == '0') {
          that.workerData = response.data.data.filter(item => { return item.onlineStatus == "0" })
        }
        console.log(this.workerData)
        this.getWorkerCheckedNodes(that.workerData)
      });
      // getWorkerCommonTreeListByType(that.workerParams).then(response => {
      // that.workerData = response.data;
      // });
    },
    initWorkTargetTree() {
      let that = this;
      getWorkTargetTreeListByType(that.targetQuery).then(response => {
        that.targetData = response.data.data;
      });
    },
    initEventTree(state) {
      let that = this;
      getPersonEventWorkerTree(that.queryMistakeTreeParams).then(response => {
        // that.eventData = response.data;
        let eventDataList = [];
        eventDataList = response.data.filter(
          (item) => item.children.length != null
        );
        eventDataList.map((item) => {
          item.len = item.children.length;
        });
        if (that.eventFilterText.length > 0) {
          eventDataList = eventDataList.filter(item => {
            return item.label.includes(that.eventFilterText)
          })
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
            return a.obj.eventdate - b.obj.eventdate
          })
        })
        that.eventData = eventDataList;
        var keys = JSON.parse(sessionStorage.getItem(`markersEvent`)) || [];
        this.$refs.eventTree.setCheckedKeys(keys);
      });
      // getCarType
    },
    handleCurrentChange(val) {
      this.queryParams.page = val;
      this.initTable();
    },
    handleWorkerCurrentChange(val) {
      this.workerParams.page = val;
      this.initWorkerTable();
    },
    initTable() {
      let that = this;
      that.footerHeight = 36;
      that.workerParams.workerTypeIds = that.workerTypeIdList.toString();
      getAdapterWorkWorkload(that.queryParams).then(response => {
        that.dataList = response.data.data.list;
        that.queryParams.total = response.data.data.total;
      });
    },
    initWorkerTable() {
      let that = this;
      that.footerHeight = 36;
      that.workerTableShow = true;
      that.workerParams.workerTypeIds = that.workerTypeIdList.toString();
      getAdapterWorkerWorkload(that.workerParams).then(response => {
        console.log(response.data.data.list, 'workerDataList')
        that.workerDataList = response.data.data.list;
        that.workerParams.total = response.data.data.total;
      });
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
    asidePackUp() {
      this.asideWidth = 0;
      this.asideShow = false;
      this.footerWidth = 100;
    },
    asideUnfold() {
      this.asideWidth = 20;
      this.asideShow = true;
      this.footerWidth = 77;
    },
    footerPackUp() {
      this.footerHeight = 0;
      this.footerBottom = 1;
      this.footerShow = false;
    },
    footerUnfold() {
      this.footerBottom = 35;
      this.footerHeight = 36;
      this.footerShow = true;
    },
    handleClick(tab, event) {
      let name = tab.name;
      let that = this;
      that.footerUnfold();
      // sessionStorage.clear();
      // this.map.clearMap()
      // if (this.times) {
      //   that.shiShi(false)
      // }
      // this.$refs.targetTree.setCheckedKeys([]);
      // let polygons = this.map.getAllOverlays("polygon");
      // let polyLines = this.map.getAllOverlays("polyline");
      // this.map.remove(polyLines);
      // this.map.remove(polygons);
      // cluster.setData(null);
      // markers = [];
      if (name == 'second') {
        that.carTableShow = false;
        that.workerTableShow = true;
        that.facilityTableShow = false;
        that.targetTableShow = false;
        that.personCoverage = false;
        that.facilityCoverage = false;
        that.eventCoverage = false;
        that.carCoverage = false;
        // that.getWorkerCheckedNodes(this.searchCarData)
      }
      if (name == 'third') {
        that.carTableShow = false;
        that.workerTableShow = false;
        that.facilityTableShow = false;
        that.targetTableShow = false;
        that.personCoverage = false;
        that.facilityCoverage = false;
        that.eventCoverage = false;
        that.carCoverage = false;
        this.footerPackUp();
      }
      if (name == 'fourth') {
        that.carTableShow = false;
        that.workerTableShow = false;
        that.facilityTableShow = false;
        that.targetTableShow = true;
        that.personCoverage = false;
        that.facilityCoverage = false;
        that.eventCoverage = false;
        that.carCoverage = false;
      }
    },

    queryTree(status) {
      // if (this.refresh) {
      //   return false
      // }
      // if (status == -2) {  // 未到岗
      //   this.workerPas.toGangday = '0'
      //   this.workerParams.status = Number(status);
      // } else {
      //   this.workerPas.toGangday = '-1'
      //   this.workerParams.status = Number(status);
      // }

      if (status == -2) { // 未到岗
        this.workerPas.toGangday = '0'
        this.workerParams.status = '-1'
      } else if (status == 1) { // 在线
        this.workerPas.toGangday = '-1'
        this.workerParams.status = '1'
      } else if (status == 0) { // 离线
        this.workerPas.toGangday = '-1'
        this.workerParams.status = '0'
      } else { // 全部
        this.workerPas.toGangday = '-1'
        this.workerParams.status = '-1'
      }
      // cluster.setData(null)
      this.initWorkerTree();
      this.map.setZoom(13)
    },
    queryTargetTree(countItem) {
      let that = this;
      this.count = countItem;
      // this.clearPolygon();
      // cluster.clearMarkers();
      // cluster.setData(null);
      that.targetQuery.worktargetTypeIds = that.choiceWorkerTarget;
      that.targetQuery.worktargetTypeId = that.choiceWorkerTarget;
      that.targetQuery.worktargetIds = '';
      that.targetQuery.deptIds = '';
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
          keys = JSON.parse(sessionStorage.getItem(`checked${countItem}`)) || [];
        }
      });
      this.$refs.targetTree.setCheckedKeys(keys);
    },
    queryEventTree() {
      this.queryMistakeTreeParams.personeventtypes = this.choiceEvent;
      this.initEventTree();
      var keys = JSON.parse(sessionStorage.getItem(`markersEvent`)) || [];
      this.$refs.eventTree.setCheckedKeys(keys);
    },
    getEventCheckedNodes(node) {
      console.log(node, "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
      let that = this;
      let nodesList = this.$refs.eventTree.getCheckedNodes();
      let workerIds = [];
      let keys = [];
      nodesList.forEach((item) => {
        if (item.nodeType == "lastobject") {
          keys.push(item.id);
        }
      });
      sessionStorage.setItem(`markersEvent`, JSON.stringify(keys));
      let selectid = JSON.parse(sessionStorage.getItem('markersEvent'))
      console.log(selectid, '924');
      that.queryMistakeParams.idsList = [];
      for (let i = 0; i < nodesList.length; i++) {
        if (nodesList[i].nodeType == "bigtype") {
          // deptWhetherInclude = false;
          // vehicleIds[index]=nodesList[i].id;
          // index++;
        } else {
          workerIds.push(nodesList[i].id);
        }
      }
      if (workerIds.length > 0) {
        that.queryMistakeParams.idsList = workerIds;
        that.queryMistakeParams.ids = workerIds.toString();
      }
      if (selectid.length > 0) {
        that.getMistakeInfo(node);
      } else {
        // cluster.clearMarkers();
        clusters.setData(null);
        this.realTimeGo(false)
        that.targetDataList = [];
      }
    },
    carTypeChange() {
      if (this.choiceCarType.length > 0) {
        this.queryParams.carTypeIds = this.choiceCarType;
        this.initCarTree();
      }
    },
    carTypeChangeALl() {
      this.queryParams.carTypeIds = this.initCarType;
      this.initCarTree();
    },
    workTypeChange() {
      // if (this.refresh) {
      //   return false
      // }
      this.choiceWorkerType = this.choiceWorkerType.filter((item) => item != "");
      if (this.choiceWorkerType.length > 0) {
        this.workerTypeIdList = this.choiceWorkerType;
        this.workerPas.workerTypeIdsStr = this.choiceWorkerType.filter(item => item != '').toString()
        this.initWorkerTree();
      } else {
        this.workTypeChangeALl()
      }
      this.map.setZoom(13)
    },
    workTypeChangeALl() {
      // if (this.refresh) {
      //   return false
      // }
      this.workerTypeIdList = this.initWorkType
      this.choiceWorkerType = ['']
      this.workerPas.workerTypeIdsStr = []
      this.initWorkerTree();
      this.map.setZoom(13)
    },
    getWorkerCheckedNodes(data, status = true) {
      // cluster.clearMarkers();
      cluster.setData(null)
      // let nodesList = this.$refs.workTree.getCheckedNodes();
      let nodesList = data
      this.workerParams.deptIdList = []
      this.workerParams.workerIdsList = []
      let deptWhetherInclude = true
      let index = 0
      let workIndex = 0
      for (let i = 0; i < nodesList.length; i++) {
        this.workerParams.workerIdsList[workIndex] = nodesList[i].workerId
        workIndex++
      }
      if (this.workerParams.workerIdsList.length > 0 || this.workerParams.deptIdList.length > 0) {
        this.workerParams.workerIds = this.workerParams.workerIdsList.toString()
        this.makersWorkerClusterer(status)
        this.initWorkerTable()
      } else {
        this.workerDataList = []
        this.workerParams.total = 0
      }
    },
    getWorkTargetCheckedNodes(state) {
      let that = this
      let keys = this.$refs.targetTree.getCheckedKeys();
      that.countList.map((item) => {
        if (item == that.count) {
          sessionStorage.setItem(`checked${item}`, JSON.stringify(keys));
        }
      });
      // let nodesList = this.$refs.targetTree.getCheckedNodes();
      that.targetQuery.deptIds = ''
      // that.targetQuery.worktargetIds = ''
      // let index =0;
      // let deptWhetherInclude = true;
      // let deptIds = [];
      // for (let i=0;i<nodesList.length;i++){
      //   if(nodesList[i].nodeType == "dept"){
      //     deptWhetherInclude = false;
      //     deptIds[index]=nodesList[i].id;
      //     index++;
      //   }
      // }
      // if(deptIds.length > 0){
      //   that.targetQuery.deptIds = deptIds.toString();
      // }
      // if(deptWhetherInclude){
      let targetIds = this.$refs.targetTree.getCheckedKeys()
      that.targetQuery.worktargetIds = targetIds.toString()
      that.targetQuery.worktargetIdsList = targetIds
      // }
      that.clearPolygon()
      // cluster.clearMarkers();
      // cluster.setData(null);
      if (
        this.targetQuery.deptIds.length > 0 ||
        that.targetQuery.worktargetIds.length > 0
      ) {
        getWorkTargetViewList(that.targetQuery).then(response => {

          let { data } = response.data
          let lastClickArr =
            that.lastClickSS == '' ? [] : that.lastClickSS.split(',')
          let currentClickArr = that.targetQuery.worktargetIds.split(',')
          currentClickArr.forEach(item => {
            if (!lastClickArr.includes(item)) {
              that.currentClickStr = item
            }
          })
          that.lastClickSS = that.targetQuery.worktargetIds
          let currentData = data.filter(
            item => item.id != that.currentClickStr
          )
          let currentIndex = data.filter(
            item => item.id == that.currentClickStr
          )
          console.log(that.targetQuery, 'that.targetQuery');
          if (that.targetQuery.worktargetTypeId == 1) {
            // that.clearPolygon()
            if (
              that.targetQuery.worktargetIds.length > 0 ||
              that.targetQuery.deptIds.length > 0
            ) {
              that.dropRoad(
                [...currentData, ...currentIndex],
                that.targetQuery.worktargetTypeId,
                state.id
              );
              // that.pathList = response.data.data;
            }
            that.pathList = [...currentData, ...currentIndex]
            console.log(that.pathList, 'pathList');
          } else {
            that.dropJiaShui(
              [...currentData, ...currentIndex],
              that.targetQuery.worktargetTypeId
            )
            that.pathList = [...currentData, ...currentIndex]
          }
        })
      } else {
        this.dataList = []
        this.queryParams.total = 0
      }
    },
    markerWorkerClick(e) {
      console.log(e, 'eeeeeeeeeeeeeeee');
      let infoWindow = new AMap.InfoWindow({ offset: new AMap.Pixel(40, -30), closeWhenClickMap: true })
      let html = '<div style="width: 239px;">' +
        '<span class="particularsClass">所属部门：' + (e.deptName || '--') + '</span><br/>' +
        '<span class="particularsClass">人员类型：' + (e.workerTypename || '--') + '</span><br/>' +
        '<span class="particularsClass">人员姓名：' + (e.name || '--') + '</span><br/>' +
        '<span class="particularsClass">到岗时间：' + (e.startWorkTime || '--') + '</span><br/>' +
        '<span class="particularsClass">离岗时间：' + (e.endWorkTime || '--') + '</span><br/>' +
        '<span class="particularsClass">速&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;度：' + e.speed + '</span><br/>' +
        '<span class="particularsClass">当前状态：' + `${e.onlineStatus == 1 ? '在线' : e.goStatus == 0 ? '停车' : '离线'}` + '</span><br/>' +
        '<span class="particularsClass">作业里程：' + (e.xunchaMileage ? parseFloat(e.xunchaMileage).toFixed(2) : '--') + '</span><br/>' +
        '<span class="particularsClass">作业时长：' + (e.xunchaLong ? DateUtil.getTime(e.xunchaLong) : '--') + '</span><br/>' +
        // '<span class="lab">里&nbsp;&nbsp;&nbsp;&nbsp;程：</span><span>'+travelMileage +'</span><br/>' +
        '<span class="particularsClass">最后在线时间：' + (e.lastChangeDate || '--') + '</span><br/>';
      // '<span class="lab">最后位置：</span><span>'+e.location+'</span>' +
      html += '<span class="particularsClass trackMonitoring" onclick="workerPlay(' + e.workerId + ')"><i class="el-icon-position"></i>轨迹回放</span>';
      html += '</div>'
      infoWindow.setContent(html)
      infoWindow.open(this.map, [e.xcd, e.ycd])
    },
    workerPlay(id) {
      // this.trackHistoryVisible = true;
      this.trackHistoryVisible = true

      this.$nextTick(() => {
        this.$refs.trackReplaying.queryParams.workerId = id
        this.$refs.trackReplaying.type = 2
        this.$refs.trackReplaying.initParameter()
      }, 200)
      // this.$router.push({path:'/monitoring-carmonitoring-track-history.vue',query:{id:id,type:2}})
    },
    async makersWorkerClusterer(status = true) {
      let that = this
      // that.map.clearMap()
      // cluster.setData(null)
      // cluster.clearMarkers();
      markered = []
      that.workerParams.workerIds = that.workerParams.workerIdsList.toString()
      that.workerParams.workerIdsStr = that.workerParams.workerIdsList.toString()
      getWorkerCurrentStatusListByType(that.workerPas).then(response => {
        let listData = response.data.data
        if (this.workerParams.status == '1') {
          listData = response.data.data.filter(item => { return item.onlineStatus == '1' })
        }
        if (this.workerParams.status == '0') {
          listData = response.data.data.filter(item => { return item.onlineStatus == '0' })
        }
        // if(this.workerParams.status == '-2'){
        //   listData = response.data.data.filter(item => {return item.toGangDay !== "1.0"})
        // }
        if (that.filterText.length > 0) {
          listData = listData.filter((item) =>
            item.name.includes(that.filterText)
          )
        }
        console.log(listData, 'listData');
        getAdapterWorkerWorkload({
          status: this.workerParams.status,
          deptIdList: this.workerParams.deptIdList,
          workerIds: this.workerParams.workerIds,
          workerIdsList: this.workerParams.workerIdsList,
          workerIdsStr: this.workerParams.workerIdsStr,
          workerTypeIds: this.workerParams.workerTypeIds,
          // page: this.workerParams.page,
          limit: -1,
          total: this.workerParams.total,
          onlineStatus: this.workerParams.onlineStatus,
        }).then(response1 => {
          console.log(response1.data.data.list, 'workerDataListworkerDataList')
          let list1 = response1.data.data.list
          listData.forEach((item) => {
            list1.forEach((item1) => {
              if (item.workerId === item1.workerId) {
                item.startWorkTime = item1.startWorkTime
                item.endWorkTime = item1.endWorkTime
                item.xunchaMileage = item1.xunchaMileage
                item.xunchaLong = item1.xunchaLong
              }
            })
          })
        });
        if (listData != null) {
          var count = 0
          for (let i = 0; i < listData.length; i++) {
            // console.log(listData[i], 'XSLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLL')
            markered.push({
              lnglat: [listData[i].xcd, listData[i].ycd], extData: {
                'id': parseInt(listData[i].workerId),
                'date': listData[i]
              }
            })
            count += 1
          }
          cluster = new AMap.MarkerCluster(this.map, markered, {
            gridSize: 50,
            renderMarker: function (object) {
              console.log(object, 'objectobject');
              let iconImg = '/images/greenicon.png';
              if (object.data[0].extData.date.onlineStatus == "0") {
                iconImg = '/images/graiocny.png';
              }
              if (object.data[0].extData.date.goStatus == "0") {
                iconImg = '/images/yellowicon.png';
              }
              // object.marker.setContent('<div style="width: 100px;text-align: center;"><img width="51" height="51" style="transform:rotate('+(object.data[0].extData.date.directint-1) * 45+'deg);margin-bottom: 0px;" src="' + iconImg + '" /><br/><span style="font-weight: bold;background-color: #81c5a5;padding: 4px;border-radius: 3px;">'+object.data[0].extData.date.name+'</span></div>');
              object.marker.setContent(
                `<div style="width: 100px;text-align: center;">
                  <div style="width:51px;height:60px;transform:rotate(${(object.data[0].extData.date.directint - 1) * 45} deg);margin: 0 auto;margin-bottom: -10px;background-image: url(${iconImg});background-size: 100% 100%;background-repeat: no-repeat;background-attachment: fixed; text-align: center; line-height: 52px;color: rgb(0, 0, 0); font-size: 12px; cursor: pointer;">
                    <h1 style="color:white;">${object.data[0].extData.date.workerTypename.length <= 4 ? object.data[0].extData.date.workerTypename.charAt(0) : object.data[0].extData.date.workerTypename.charAt(2)}</h1>
                  </div>
                  <br/><span style="font-weight: bold;background-color: #81c5a5;padding: 4px;border-radius: 3px;">
                    ${object.data[0].extData.date.name} 
                  </span>
              </div>`
              );
              object.marker.on('click', function (data) {
                that.markerWorkerClick(object.data[0].extData.date);
              })
            },
            renderClusterMarker: function (context) {
              // 聚合中点个数
              var clusterCount = context.count
              let bgColor = ''
              // 聚合点配色
              if (clusterCount >= 0 && clusterCount < 10) {
                bgColor = 'http://webapi.amap.com/theme/v1.3/m1.png'
              } else if (clusterCount >= 10 && clusterCount < 100) {
                bgColor = 'http://webapi.amap.com/theme/v1.3/m2.png'
              } else if (clusterCount >= 100 && clusterCount < 1000) {
                bgColor = 'http://webapi.amap.com/theme/v1.3/m3.png'
              } else if (clusterCount >= 1000 && clusterCount < 10000) {
                bgColor = 'http://webapi.amap.com/theme/v1.3/m4.png'
              } else if (clusterCount >= 10000) {
                bgColor = 'http://webapi.amap.com/theme/v1.3/m5.png'
              }
              var size = Math.round(
                25 + Math.pow(clusterCount / count, 1 / 5) * 40
              );
              context.marker.setOffset(new AMap.Pixel(-size / 2, -size / 2));
              context.marker.setContent(
                `<div id="ssss" style="width: 56px; height: 56px; background-image: url(${bgColor});background-size: 100% 100%;background-repeat: no-repeat;background-attachment: fixed; text-align: center; line-height: 56px;color: rgb(0, 0, 0); font-size: 12px; cursor: pointer;">${clusterCount}</div>`
              )
              let infoWindow
              context.marker.on('mouseover', (e) => {
                // 判断长度是否相同
                if (context.count != context.clusterData.length) {
                  // 深度克隆原所有数据数组
                  var markered1 = JSON.parse(JSON.stringify(markered))
                  // 根据两点之间距离大小进行排序
                  markered1.sort((a, b) => {
                    var temp = context.marker._opts.position
                    var temp1 = (temp[0] - a.extData.date.xcd) ** 2 + (temp[1] - a.extData.date.ycd) ** 2
                    var temp2 = (temp[0] - b.extData.date.xcd) ** 2 + (temp[1] - b.extData.date.ycd) ** 2
                    return temp1 - temp2
                  })
                  //截取距离最小到长度
                  markered1 = markered1.slice(0, context.count)
                  console.log(markered1)
                  //最后赋值
                  context.clusterData = markered1
                  console.log(context)
                }
                infoWindow = new AMap.InfoWindow({
                  offset: new AMap.Pixel(5, -30),
                  closeWhenClickMap: true,
                });
                let html = `<div>
                  <ul style="list-style: none;width:200px;height:${context.clusterData.length > 5 ? "200px" : "100%"
                  };">
                    ${context.clusterData
                    .map((item) => {
                      let iconImg = "/images/greenicon.png";
                      if (item.extData.date.onlineStatus == "0") {
                        iconImg = "/images/graiocny.png";
                      }
                      if (item.extData.date.goStatus == "0") {
                        iconImg = "/images/yellowicon.png";
                      }
                      return `<li style="display: flex;align-items: center;">
                                <div style="width: 40px; height: 50px; background-image: url(${iconImg});background-size: 100% 100%;background-repeat: no-repeat;background-attachment: fixed; text-align: center; line-height: 45px;color: rgb(0, 0, 0); font-size: 12px; cursor: pointer;"><h2 style="color:white;">${item.extData.date.workerTypename.length <= 4 ? item.extData.date.workerTypename.charAt(0) : item.extData.date.workerTypename.charAt(2)}</h2></div>
                                &nbsp;&nbsp;&nbsp; <h3>${item.extData.date.name}</h3>
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
          cluster.on('click', (item) => {
            //此处是通过包含点的数量判断是否是聚合点，不是聚合点就执行上方单个点的点击方式
            if (item.clusterData.length <= 1) {
              return;
            }
            //这里是计算所有聚合点的中心点
            let alllng = 0, alllat = 0;
            for (const mo of item.clusterData) {
              alllng += mo.lnglat.lng;
              alllat += mo.lnglat.lat;
            }
            const lat = alllat / item.clusterData.length;
            const lng = alllng / item.clusterData.length;
            //这里是放大地图，此处写死了每次点击放大的级别，可以根据点的数量和当前大小适应放大，体验更佳
            if (status) {
              this.map.setZoomAndCenter(this.map.getZoom() + 4, [lng, lat]);
            }
          });
          if (status) {
            if (markered.length > 0) {
              this.map.setCenter([listData[0].xcd, listData[0].ycd]);
            }
          }
        }
      });
    },
    queryWhereJoint() {
      let that = this;
      that.queryParams.vehicleIds = '';
      if (that.queryParams.carIds.length > 0) {
        that.queryParams.vehicleIds = that.queryParams.carIds.toString();
      }
      that.queryParams.deptIds = '';
      if (that.queryParams.deptId.length > 0) {
        that.queryParams.deptIds = that.queryParams.deptId.toString();
      }
    },
    updateWorkCentre(node) {
      let id = 0;
      let that = this;
      if (node.hasOwnProperty('workerId')) {
        id = parseInt(node.workerId);
      } else {
        id = parseInt(node.id)
      }
      let targetMarker = null;
      for (let i = 0; i < markered.length; i++) {
        // 获取存在每个 extData 中的 id
        // console.log(markers[i])
        let markersId = markered[i].extData.id;
        if (markersId === id) {
          targetMarker = markered[i];
          break;
        }
      }
      this.workerParams.workerIdsList.push(node.id);
      // this.$refs.workTree.setCheckedKeys(this.workerParams.workerIdsList);
      if (targetMarker == null) {
        // this.makersWorkerClusterer();
        // this.initWorkerTable()
        setTimeout(() => {
          that.updateWorkCentre(node);
        }, 2 * 100)
      }
      // aaa
      if (targetMarker != null) {
        // cluster.addMarkers(markers);
        // new AMap.MarkerCluster(this.map, markers, {gridSize: 10});
        // console.log("执行了819，")
        let nodeObj = cluster._.filter(item => item.extData.date.workerId == node.workerId)
        if (nodeObj.length > 0) {
          this.map.setZoom(25)
          that.markerWorkerClick(nodeObj[0].extData.date)
        }
        that.map.setCenter(targetMarker.lnglat);
        // targetMarker.on("click")
        // map.on('click',  targetMarker);
        // AMap.event.trigger(targetMarker ,"click");
      } else {
        // this.updateCarCentre(node);
      }
    },
    updateEventCentre(node) {
      let that = this;
      let id = parseInt(node.id);
      console.log(node, 'nononononononono')
      let targetMarker = null;

      for (let i = 0; i < markers.length; i++) {
        // 获取存在每个 extData 中的 id
        let markersId = markers[i].extData.id;
        if (parseInt(markersId) === id) {
          targetMarker = markers[i];
          break;
        }
      }
      that.queryMistakeParams.idsList.push(id);
      if (targetMarker == null) {
        that.queryMistakeParams.ids = that.queryMistakeParams.idsList.toString();
        this.$refs.eventTree.setCheckedKeys(that.queryMistakeParams.idsList);
        that.getMistakeInfo("");
        setTimeout(() => {
          that.updateEventCentre(node);
        }, 2 * 100)
      }

      if (targetMarker != null) {
        let nodeObj = {}
        if (node.hasOwnProperty('obj')) {
          nodeObj = clusters._.filter(
            (item) => item.extData.date.id == node.obj.id
          );
        } else {
          nodeObj = clusters._.filter(
            (item) => item.extData.date.id == node.id
          );
        }
        if (nodeObj) {
          this.map.setZoom(25)
          that.markerMistakeClick(nodeObj[0].extData.date)
        }
        that.map.setCenter(targetMarker.lnglat);
        // AMap.event.trigger(targetMarker ,"click");
      } else {

      }
    },
    // 点击表格人员只显示地图位置但不显示详细信息的错误方法
    // updateCentre(node) {
    //   console.log(node,'updateCentre');
    //   let id = 0;
    //   if (node.hasOwnProperty('workerId')) {
    //     id = parseInt(node.workerId);
    //   } else {
    //     id = parseInt(node.id)
    //   }
    //   let targetMarker = null;
    //   for(let i = 0; i < markered.length; i++){
    //     // 获取存在每个 extData 中的 id
    //     let markersId = markered[i].extData.id;
    //     if(markersId === id){
    //       targetMarker = markered[i];
    //       break;
    //     }
    //   }

    //   if (targetMarker != null) {
    //     this.map.setCenter(targetMarker.lnglat);
    //     // AMap.event.trigger(targetMarker ,"click");
    //   } else {
    //     this.$message({
    //       message: '未查到对应的信息！',
    //       type: 'warning'
    //     });
    //   }
    // },
    mistakeDropdown(i) {
      let that = this;
      that.queryMistakeParams.mistaketype = i;
      that.getMistakeInfo("");
    },
    carDropdown(i) {
      let that = this;
      that.targetQuery.worktargetTypeId = i;
      getWorkTargetViewList(that.targetQuery).then(response => {
        let { data } = response.data;
        let lastClickArr = that.lastClickSS == '' ? [] : that.lastClickSS.split(',');
        let currentClickArr = that.targetQuery.worktargetIds.split(',');
        currentClickArr.forEach(item => {
          if (!lastClickArr.includes(item)) {
            that.currentClickStr = item
          }
        })
        that.lastClickSS = that.targetQuery.worktargetIds;
        let currentData = data.filter(item => item.id != that.currentClickStr)
        let currentIndex = data.filter(item => item.id == that.currentClickStr)

        if (i == 1) {
          that.dropRoad([...currentData, ...currentIndex], i);
        } else {
          that.dropJiaShui([...currentData, ...currentIndex], i);
        }
      });
    },
    dropRoad(listData) {
      let that = this;
      let polygons = [];
      let path = [];
      // that.clearPolygon();
      // cluster.clearMarkers();
      // cluster.setData(null);
      let markers = [];
      for (let i = 0; i < listData.length; i++) {
        if (listData[i].geoinfo != null) {
          path = [];
          let geoinfo = listData[i].geoinfo.split('P');
          for (let j = 0; j < geoinfo.length; j++) {
            if (geoinfo[j].length > 0) {
              let latLng = geoinfo[j].split('_');
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
              bubble: true,
            });
            markers.push(polygon._opts.extData.id);
            polygon.on('click', function (e) {
              let infoWindow =
                new AMap.InfoWindow({
                  offset: new AMap.Pixel(0, -30),
                  closeWhenClickMap: true
                });
              let address =
                listData[i].address != null ? listData[i].address : '';
              let html = '<div>' +
                '<span class="particularsClass">道路名称：' + listData[i].name + '</span><br/>' +
                '</div>';
              infoWindow.setContent(html);
              infoWindow.open(that.map, [e.lnglat.R, e.lnglat.Q]);
            });
            if (that.markersList.filter(item => item._opts.extData.id == polygon._opts.extData.id).length <= 0) {
              that.markersList.push(polygon);
              polygons.push(polygon);
            }
          }
        }
      }
      sessionStorage.setItem(`marker${that.count}`, JSON.stringify(markers));
      if (path.length > 0) {
        that.map.panTo(path[path.length - 1]);
      }
      if (polygons.length > 0) {
        listData.forEach(item => {
          if (item.geoinfo) {
            let infos = item.geoinfo.split("P");
            let index = Math.ceil(infos.length / 2) - 1;
            let Lng = infos[index].split("_")[1]
            let Lat = infos[index].split("_")[0]
            let text1 = new AMap.Text({
              position: new AMap.LngLat(Lng, Lat),
              text: item.name,
              offset: new AMap.Pixel(-100, 0),
              extData: {
                id: item.id,
                geoinfo: item.geoinfo,
              },
            })
            text1.setStyle({
              'background-color': 'rgba(27, 118, 255, 0.582)',
              'color': 'white',
              'border': 'none'
            })
            that.map.add(text1);
            that.markerTexts.push(text1)
            return;
          }
        })
        that.map.add(polygons);
        // cluster.addMarkers(markers);
      } else {
        // this.$message({
        //   message: '未查到对应的设施！',
        //   type: 'warning'
        // });
      }
    },
    dropJiaShui(listData, type) {
      let that = this;
      that.clearPolygon();
      let polygons = [];
      let path = [];
      // cluster.clearMarkers();
      // cluster.setData(null);
      markers = [];
      for (let i = 0; i < listData.length; i++) {
        if (listData[i].geoinfo != null) {
          path = [];
          let geoinfo = listData[i].geoinfo.split('P');
          for (let j = 0; j < geoinfo.length; j++) {
            if (geoinfo[j].length > 0) {
              let latLng = geoinfo[j].split('_');
              path.push([latLng[1] * 1, latLng[0] * 1]);
            }
          }
          if (path.length > 0) {
            let polygon = new AMap.Polygon({
              path: path,
              strokeColor: "#2a85d5",
              fillColor: '#2a85d5',
              extData: {
                id: listData[i].id
              }
            });
            markers.push(polygon._opts.extData.id);
            polygon.on('click', function (e) {
              let infoWindow = new AMap.InfoWindow({ offset: new AMap.Pixel(0, -30), closeWhenClickMap: true });
              let address = listData[i].address != null ? listData[i].address : '';
              let html = '<div style="width: 130px;">' +
                '<span class="particularsClass">设施名称：' + listData[i].name + '</span><br/>' +
                '<span class="particularsClass">设施类型：' + that.targetName + '</span><br/>' +
                '<span class="particularsClass">地址：' + address + '</span><br/>' +
                '</div>';
              infoWindow.setContent(html);
              let infos = listData[i].geoinfo.split("P");
              let index = Math.ceil(infos.length / 2);
              if (e != null && e.lnglat != null) {
                infoWindow.open(that.map, [e.lnglat.lng, e.lnglat.lat]);
              } else {
                infoWindow.open(that.map, [infos[index].split("_")[1], infos[index].split("_")[0]]);
              }
            });
            if (that.markersList.filter(item => item._opts.extData.id == polygon._opts.extData.id).length <= 0) {
              that.markersList.push(polygon);
              polygons.push(polygon);
            }
          }
        }
      }
      sessionStorage.setItem(`marker${that.count}`, JSON.stringify(markers));
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
                offset: new AMap.Pixel(0, -30),
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
        // that.map.setFitView();
      } else {
        // this.$message({
        //   message: '未查到对应的设施！',
        //   type: 'warning'
        // });
      }
    },
    clearPolygon() {
      let that = this;
      let list = this.$refs.targetTree.getCheckedKeys();
      that.countList.map((item) => {
        if (sessionStorage.getItem(`marker${item}`)) {
          if (that.count == item) {
            JSON.parse(sessionStorage.getItem(`marker${item}`)).map(
              (items) => {
                if (list.indexOf(items) < 0) {
                  let len = that.markersList.length;
                  while (len > 0) {
                    len--;
                    if (that.markersList[len]._opts.extData.id == items) {
                      that.map.remove(that.markersList[len]);
                      that.map.remove(that.markerTexts.filter(itemY => itemY._opts.extData.id == items));
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
    },
    getMistakeInfo(label) {
      let that = this;
      // cluster.clearMarkers();
      if (clusters) {
        clusters.setData(null);
      }
      markers = [];
      getPersonEventByIds(this.queryMistakeParams).then(response => {
        let listData = response.data.data;
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
              date: listData[i]
            }
          });
          count += 1
        }
        clusters = new AMap.MarkerCluster(this.map, markers, {
          gridSize: 50,
          renderMarker: function (object) {
            let iconImg = 'http://121.36.213.139/m/chidao.png';
            if (object.data[0].extData.date.eventType == '越界') {
              iconImg = 'http://121.36.213.139/m/yuejie.png';
            }
            if (object.data[0].extData.date.eventType == '滞留') {
              iconImg = 'http://121.36.213.139/m/zhiliu.png';
            }
            if (object.data[0].extData.date.eventType == '脱岗') {
              iconImg = 'http://121.36.213.139/m/tuogang.png';
            }
            if (object.data[0].extData.date.eventType == '早退') {
              iconImg = 'http://121.36.213.139/m/zaotui.png';
            }

            object.marker.setIcon(new AMap.Icon({
              image: iconImg,
              size: new AMap.Size(50, 50),//设置icon的大小
              imageSize: new AMap.Size(50, 50)
            }));
            object.marker.on('click', function (data) {
              that.markerMistakeClick(object.data[0].extData.date);
            })
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
                var markered1 = JSON.parse(JSON.stringify(markers))
                //根据两点之间距离大小进行排序
                markered1.sort((a, b) => {
                  var temp = context.marker._opts.position
                  var temp1 = (temp[0] - a.extData.date.xcd) ** 2 + (temp[1] - a.extData.date.ycd) ** 2
                  var temp2 = (temp[0] - b.extData.date.xcd) ** 2 + (temp[1] - b.extData.date.ycd) ** 2
                  return temp1 - temp2
                })
                //截取距离最小到长度
                markered1 = markered1.slice(0, context.count)
                //最后赋值
                context.clusterData = markered1
              }
              infoWindow = new AMap.InfoWindow({
                offset: new AMap.Pixel(5, -30),
                closeWhenClickMap: true,
              });
              let html = `<div>
                  <ul style="list-style: none;width:200px;height:${context.clusterData.length > 5 ? "200px" : "100%"
                };">
                    ${context.clusterData
                  .map((item) => {
                    let iconImg = 'http://121.36.213.139/m/chidao.png';
                    if (item.extData.date.eventType == '越界') {
                      iconImg = 'http://121.36.213.139/m/yuejie.png';
                    }
                    if (item.extData.date.eventType == '滞留') {
                      iconImg = 'http://121.36.213.139/m/zhiliu.png';
                    }
                    if (item.extData.date.eventType == '脱岗') {
                      iconImg = 'http://121.36.213.139/m/tuogang.png';
                    }
                    if (item.extData.date.eventType == '早退') {
                      iconImg = 'http://121.36.213.139/m/zaotui.png';
                    }
                    return `<li style="display: flex;align-items: center;">
                                <div  style="width: 40px; height: 40px; background-image: url(${iconImg});background-size: 100% 100%;background-repeat: no-repeat;background-attachment: fixed; text-align: center; line-height: 45px;color: rgb(0, 0, 0); font-size: 12px; cursor: pointer;"><h2 style="color:white;"></h2></div>
                                &nbsp;&nbsp;&nbsp; <h3>${item.extData.date.workerName
                      }(${item.extData.date.eventType})</h3>
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
        clusters.on('click', (item) => {
          //此处是通过包含点的数量判断是否是聚合点，不是聚合点就执行上方单个点的点击方式
          if (item.clusterData.length <= 1) {
            return;
          }
          //这里是计算所有聚合点的中心点
          let alllng = 0, alllat = 0;
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
          if (label != '' && label.children == null) {
            this.map.setZoom(25)
            that.markerMistakeClick(listData.filter(item => item.id == label.id)[0])
            this.map.setCenter([listData.filter(item => item.id == label.id)[0].xcd, listData.filter(item => item.id == label.id)[0].ycd]);
          } else {
            this.map.setZoom(25)
            this.map.setCenter([listData[listData.length - 1].xcd, listData[listData.length - 1].ycd]);
          }
        } else {
          this.$message({
            message: label + '未查到对应的违规信息！',
            type: 'warning'
          });
        }
      });
    },
    juheClick(data) {
      console.log(data)
    },
    shiShi(status) {
      let that = this
      // cluster.setData(null)
      if (!status) {
        that.map.clearMap()
        cluster.setData(null);
        that.getWorkerCheckedNodes(that.workerData, status)
        clearInterval(that.times);
        that.times = null
        this.$message({
          showClose: true,
          message: "关闭实时刷新",
          type: "success",
        });
        that.realTimeGo(false);
      } else {
        cluster.setData(null)
        this.$message({
          showClose: true,
          message: "开启实时刷新",
          type: "success",
        });
        that.realTimeGo(status);
      }
    },
    realTimeGo(state) {
      let that = this;
      var lineArr = [];
      var position = [],
        center = [];
      var driverMaker = [];
      var driverlines = [];
      var driverInfo = {};
      //创建地图
      // var map = that.map
      that.map.setFitView();

      //初始化坐标信息
      getDriverInfo({});

      //定期获取坐标信息
      if (state) {
        that.times = setInterval(function () {
          // if (state) {
          getDriverInfo({});
          console.log("实时开始");
          cluster.setData(null);
          // } else {
          //   console.log("实时结束");
          // }
        }, 1000);
      } else {
        clearInterval(that.times);
        that.times = null
        console.log("已清除");
        return;
      }

      var allDriverMarker = {};
      const createMarker2 = (data) => {
        //循环司机
        console.log(data, '循环司机');
        cluster.setData(null);
        for (var i in data) {
          if (data[i].xcd) {
            var arr = [data[i].xcd, data[i].ycd];
            if (allDriverMarker[data[i].workerId]) {
              var lnglat = new AMap.LngLat(arr[0], arr[1]);
              allDriverMarker[data[i].workerId].moveTo(arr, {
                duration: 10000,
                delay: 1000,
              });
            } else {
              let iconImg = "/images/greenicon.png";
              if (data[i].onlineStatus == "0") {
                iconImg = "/images/graiocny.png";
              }
              if (data[i].goStatus == "0") {
                iconImg = "/images/yellowicon.png";
              }
              AMap.plugin("AMap.MoveAnimation", function () {
                var temp = new AMap.Marker({
                  content: `<div style="width: 100px;text-align: center;">
                  <div style="width:51px;height:60px;transform:rotate(${(data[i].directint - 1) * 45
                    } deg);margin: 0 auto;margin-bottom: -10px;background-image: url(${iconImg});transform: rotate(180deg);background-size: 100% 100%;background-repeat: no-repeat;background-attachment: fixed; text-align: center; line-height: 52px;color: rgb(0, 0, 0); font-size: 12px; cursor: pointer;">
                    <h1 style="color:white;transform: rotate(180deg);">${data[i].workerTypename.length <= 4
                      ? data[i].workerTypename.charAt(0)
                      : data[i].workerTypename.charAt(2)
                    }</h1>
                  </div>
                  <br/><span style="font-weight: bold;background-color: #81c5a5;padding: 4px;border-radius: 3px;">
                    ${data[i].name} 
                  </span>
              </div>`,
                  position: arr,
                  // icon: "https://webapi.amap.com/images/car.png",   //轨迹地图上出现车的图标(运行时有车在上面移动)
                  offset: new AMap.Pixel(-26, -13),
                  autoRotation: false,
                  angle: 0,
                });
                console.log(data[i]);
                that.map.add(temp);
                allDriverMarker[data[i].workerId] = temp;
              });
            }
          } else {
            if (allDriverMarker[data[i].workerId]) {
              that.map.remove(allDriverMarker[data[i].workerId]);
            }
          }
        }
        for (var i in allDriverMarker) {
          var flag = true;
          for (var j in data) {
            if (data[j].workerId == i) {
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
      function getDriverInfo() {
        //数据请求
        getWorkerCurrentStatusListByType(that.workerPas).then(response => {
          let data = response.data.data;
          console.log(data, '这是司机的数据请求');
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
          // createMarker2(data);
        });
      }
    },
    markerMistakeClick(e) {
      console.log(e, 'eeeeeeeeeeeeeeeeeeeee')
      let infoWindow = new AMap.InfoWindow({ offset: new AMap.Pixel(0, -20), closeWhenClickMap: true });
      let html = '<div style="width: 300px;">' +
        '<span class="particularsClass">所属部门：' + e.deptName + '</span><br/>' +
        '<span class="particularsClass">人员姓名：' + e.workerName + '</span><br/>' +
        '<span class="particularsClass">时&nbsp;&nbsp;间&nbsp;&nbsp;段：' + e.parkingTime + '</span><br/>' +
        '<span class="particularsClass">违规时长：' + e.eventLong + '</span><br/>' +
        '<span class="particularsClass">违规类型：' + e.eventType + '</span><br/>' +
        '<span class="particularsClass">违规时间：' + e.createDate + '</span><br/>' +
        '<span class="particularsClass">违规地点：' + e.eventPlace + '</span><br/>' +
        '</div>';
      infoWindow.setContent(html);
      infoWindow.open(this.map, [e.xcd, e.ycd]);
    },
    queryMistakeInfo(data) {
      this.queryMistakeParams.vehicleId = data.id;
      this.getMistakeInfo(data.label);
    },
    timeFormatter(row, column, cellValue, index) {
      return DateUtil.getTime(cellValue)
    },
    numFilter(row, column, cellValue, index) {
      const realVal = parseFloat(cellValue).toFixed(2);
      return realVal;
    },
    queryTarget(data, index) {
      let that = this;
      let id = data.id;
      let polyLine = null;
      let polygon = null;
      if (that.targetQuery.worktargetTypeId == 1) {
        let polyLines = that.map.getAllOverlays('polyline');
        for (let i = 0; i < polyLines.length; i++) {
          let polyLineId = polyLines[i].getExtData().id;
          if (id == polyLineId) {
            polyLine = polyLines[i];
          } else if (parseInt(id) == parseInt(polyLineId)) {
            polyLine = polyLines[i];
          }
        }
        that.polyLineIsCheck(polyLine, id, data, index);
      } else {
        let polygons = that.map.getAllOverlays('polygon');
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
          }, 2 * 100)
          index++;
        }
      } else {
        // AMap.event.trigger(polyLine,"click");
      }
    },
  },
  watch: {
    filterText(val) {
      let that = this;
      // if (this.refresh) {
      //   return false
      // }
      that.getWorkerCheckedNodes(this.searchCarData)
      // that.$refs.workTree.filter(val);
    },
    targetFilterText(val) {
      let that = this;
      that.$refs.targetTree.filter(val);
    },
    eventFilterText(val) {
      let that = this;
      that.initEventTree()
      // that.$refs.eventTree.filter(val);
      // that.$refs.eventTree.setCheckedKeys([])
    },
    deptIdStr(val) {
      this.queryMistakeTreeParams.deptId = val;
      this.initEventTree(true);
    },
    dataForm: {
      deep: true,
      handler: function (val) {
        this.queryParams.deptId = val.deptId
        this.workerPas.deptId = val.deptId
        this.initWorkerTree()
      },
    },
  },
  beforeDestroy() {
    // 页面关闭（路由跳转）时清除定时器
    clearInterval(this.times)
    this.times = null
    window.removeEventListener('resize', this.handleResize)
  },
  mounted() {
    let param = {
      resizeEnable: true,
      center: [121.667855, 42.027915],
      zoom: 15
    };
    let mapId = this.pageNumber;
    if (this.isPage) {
      mapId = "container";
      document.getElementById(this.pageNumber).id = mapId;
    }
    this.map = new AMap.Map(mapId, param);
    cluster = new AMap.MarkerCluster(this.map, markers, { gridSize: 80 })
    window.workerPlay = this.workerPlay;
    let ysworkertypeList = []
    getManAll2().then(response => {

      console.log(response.data.data, '在线未在线');

      let { workerCount, workerOnlineCount } = response.data.data
      this.manTotal.online = Math.round(workerOnlineCount)
      this.manTotal.offLine = Math.round(workerCount) - Math.round(workerOnlineCount)
    })
    getMotionAll().then(response => {

      console.log(response.data.data, '到岗未到岗');

      let { toGangDay, weiDaoGang, workTotal } = response.data.data
      this.manTotal.goMan = Math.round(toGangDay)
      this.manTotal.noGoMan = Math.round(weiDaoGang)
    })
    getManAll().then((response) => {
      let datalist = response.data.data
      for (var index in datalist) {
        ysworkertypeList.push({
          name: datalist[index].typeName, value: datalist[index].toGangDay, notWork: datalist[index].weiDaoGang,
          daoGangLV: datalist[index].daoGangLV, workTotal: datalist[index].workTotal, workNum: datalist[index].toGangDay
        })
      }
    })

    setTimeout(() => {
      var mychart = echarts.init(document.getElementById("mains"));
      window.addEventListener('resize', function () {
        mychart.resize();
      });
      let sum = [
        {
          name: "在线",
          value: this.manTotal.online,
        },
        {
          name: "离线",
          value: this.manTotal.offLine,
        },
        {
          name: "到岗",
          value: this.manTotal.goMan,
        },
        {
          name: "未到岗",
          value: this.manTotal.noGoMan,
        },
      ];
      var option = {
        tooltip: {
          trigger: 'item',
          // formatter:function (parms){
          //   console.log(parms,'2222222222222');
          //     var str =  ""+ parms.data.name+":"+parms.data.value+"</br>"+
          //         "到岗数："+ parms.data.value+"</br>"+
          //         "未到岗数："+ parms.data.value+"</br>"+
          //         "到岗率："+ parms.data.value;
          //     return  str ;
          // }
        },
        series: [
          {
            // name: 'Access From',
            type: 'pie',
            radius: '50%',
            data: sum,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      };
      mychart.setOption(option);
    }, 1000)
  }
}
</script>

<style>
.el-card__body {
  padding: 0px !important;
}

.aui-content>.el-tabs>.el-tabs__content {
  padding: 0px !important;
}

.el-main {
  padding: 0px !important;
}

.container {
  height: 90vh;
}

.el-checkbox-button--small .el-checkbox-button__inner {
  padding: 10px 15px !important;
  margin: 2px !important;
  border-left: 1px solid #DCDFE6;
}

.el-radio-button--small .el-radio-button__inner {
  padding: 10px 15px !important;
  margin: 2px !important;
  border-left: 1px solid #DCDFE6;
}

.el-button--small,
.el-button--small.is-round {
  padding: 9px 11px !important;
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

/* .el-dialog { */
/* width: 85%!important; */
/* margin-top: 8vh !important; */
/* margin-left: 35vw; */
/* height: 88vh; */
/* } */

.particularsClass {
  font-weight: 600;
  font-size: 12px;
  line-height: 30px;
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

.aui-wrapper .el-pagination {
  margin-top: 5px !important;
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
</style>
