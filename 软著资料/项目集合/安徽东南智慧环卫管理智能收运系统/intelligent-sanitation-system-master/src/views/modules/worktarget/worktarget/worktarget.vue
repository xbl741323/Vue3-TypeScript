<!-- 垃圾车运输管理 -->
<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-worktarget__worktarget}">
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
        <el-form-item label="部门">
          <dept-tree v-model="dataForm.orgId" @change="changeOrg" placeholder="请选择"></dept-tree>
        </el-form-item>
        <el-form-item label="垃圾车收运类型" v-if="showWorktargetType">
          <worktarget-type-select v-model="dataForm.worktargetTypeId"
            @changeWorktargetType="changeWorktargetType"></worktarget-type-select>
        </el-form-item>
        <el-form-item label="名称">
          <el-input v-model="dataForm.name"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="getDataList()">{{ $t('query') }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="getDataList()">{{ $t('query') }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="info" @click="exportHandle()">{{ $t('export') }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button v-if="$hasPermission('worktarget:worktarget:save')" type="primary" @click="addOrUpdateHandle()">{{
            $t('add') }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button v-if="$hasPermission('worktarget:worktarget:delete')" type="danger" @click="deleteHandle()">{{
            $t('deleteBatch') }}</el-button>
        </el-form-item>
      </el-form>
      <div class="table-container" :style="[{ width: foldStatus ? '60%' : '0px' }]">
        <el-table v-loading="dataListLoading" :data="dataList" border @selection-change="dataListSelectionChangeHandle"
          style="width: 100%;" @row-click="onRowClick" @select="onRowSelect">
          <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
          <el-table-column prop="name" label="名称" header-align="center" align="center"></el-table-column>
          <el-table-column prop="worktargetTypeName" label="设施类型" header-align="center" align="center"></el-table-column>
          <el-table-column prop="address" label="地址" header-align="center" align="center"></el-table-column>
          <el-table-column prop="orgName" label="所属部门" header-align="center" align="center"></el-table-column>
          <!-- <el-table-column prop="contacts" label="联系人" header-align="center" align="center"></el-table-column> -->
          <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">
            <template slot-scope="scope">
              <el-button v-if="$hasPermission('worktarget:worktarget:update')" type="text" size="small"
                @click="addOrUpdateHandle(scope.row.id)">{{ $t('update') }}</el-button>
              <el-button v-if="$hasPermission('worktarget:worktarget:delete')" type="text" size="small"
                @click="deleteHandle(scope.row.id)">{{ $t('delete') }}</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination :style="`${foldStatus ? '' : 'display:none'}`" :current-page="page" :page-sizes="[10, 20, 50, 100]"
          :page-size="limit" :total="total" layout="total, sizes, prev, pager, next, jumper"
          @size-change="pageSizeChangeHandle" @current-change="pageCurrentChangeHandle">
        </el-pagination>
        <div class="fold_btn">
          <i v-show="!foldStatus" class="el-icon-d-arrow-right" @click="clickFold" />
          <i v-show="foldStatus" class="el-icon-d-arrow-left" @click="clickFold" />
        </div>
      </div>
      <!-- 地图 -->
      <div class="map" :id="`worktarget-container_${worktargetTypeId}`" :style="[{ width: foldStatus ? '40%' : '100%' }]">
      </div>
      <!-- 弹窗, 新增 / 修改 -->
      <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
    </div>
  </el-card>
</template>

<script>
import mixinViewModule from '@/mixins/view-module'
import AddOrUpdate from './worktarget-add-or-update'
import shopEdited from '@/assets/img/shopEdited.png'
import shopEditing from '@/assets/img/shopEditing.png'
import AMap from 'AMap'
export default {
  mixins: [mixinViewModule],
  data() {
    return {
      foldStatus: true,
      amap: '',
      mapConfig: {
        center: [116.404, 39.915],
        zoom: 6,
        resizeEnable: true,
        plugin: {
        },
        events: {
          init() {
          },
          click(e) {
          }
        }
      },
      markerList: [],
      activeMarker: '',
      markerMap: new Map(),
      mixinViewModuleOptions: {
        getDataListURL: '/worktarget/worktarget/listPage',
        getDataListIsPage: true,
        exportURL: '/worktarget/worktarget/export',
        deleteURL: '/worktarget/worktarget',
        deleteIsBatch: true,
        createdIsNeed: false,
        activatedIsNeed: false
      },
      activeId: '',
      worktargetTypeId: '',
      plftype: '',
      worktargetTypeName: '',
      worktargetTypeList: [],
      worktargetTypeMap: new Map(),
      dataForm: {
        orgId: '',
        worktargetTypeId: '',
        name: ''
      }
    }
  },
  watch: {
    markerList(val) {
      this.cleanMap()
      if (this.markerList && this.markerList.length > 0) {
        for (var i = 0; i < this.markerList.length; i++) {
          var markerObj = this.markerList[i]
          this.createMarker(markerObj)
        }
      }
      this.amap.setFitView()
    }
  },
  computed: {
    showWorktargetType() {
      return !this.worktargetTypeId
    },
    showPoint() {
      return this.plftype == 1
    },
    showPolyline() {
      return this.plftype == 2 || this.plftype == 3
    },
    ploygonColor() {
      return (ploygonObj) => {
        return this.activeId == ploygonObj.id ? 'red' : 'blue'
      }
    },
    ploylineColor() {
      return (ploylineObj) => {
        return this.activeId == ploylineObj.id ? 'red' : 'blue'
      }
    },
    markerImg() {
      return (marker) => {
        return this.activeId == marker.id ? 'img/start.png' : 'img/village48.png'
      }
    }
  },
  components: {
    AddOrUpdate
  },

  mounted() {
    if (this.$route.meta.cusParams && this.$route.meta.cusParams.worktargetTypeId) {
      this.worktargetTypeId = this.$route.meta.cusParams.worktargetTypeId
      this.dataForm.worktargetTypeId = this.worktargetTypeId
      if (this.worktargetTypeId) {
        this.$http.get('/worktarget/worktargettype/' + this.worktargetTypeId).then(({ data: res }) => {
          if (res.code != 0) {
            return this.$message.error(res.msg)
          }
          this.worktargetType = res.data
          this.plftype = this.worktargetType.plftype
          this.worktargetTypeName = this.worktargetType.worktargetTypeName
        }).catch(() => { })
      }
    }
    this.initMap()
    this.query()
  },
  methods: {
    initMap() {
      var divId = 'worktarget-container_' + this.worktargetTypeId
      var amap = new AMap.Map(divId, {
        ...this.mapConfig
      })
      this.amap = amap
    },
    query() {
      this.dataListLoading = true
      this.$http.get(
        this.mixinViewModuleOptions.getDataListURL,
        {
          params: {
            order: this.order,
            orderField: this.orderField,
            page: this.mixinViewModuleOptions.getDataListIsPage ? this.page : null,
            limit: this.mixinViewModuleOptions.getDataListIsPage ? this.limit : null,
            ...this.dataForm
          }
        }
      ).then(({ data: res }) => {
        this.dataListLoading = false
        if (res.code != 0) {
          this.dataList = []
          this.total = 0
          return this.$message.error(res.msg)
        }
        this.dataList = this.mixinViewModuleOptions.getDataListIsPage ? res.data.list : res.data
        this.total = this.mixinViewModuleOptions.getDataListIsPage ? res.data.total : 0
        this.mapConfig.zoom = 5
        var markerList = []
        for (var i = 0; i < this.dataList.length; i++) {
          var dataInfo = this.dataList[i]
          if (dataInfo.plftype == 2 || dataInfo.plftype == 3) {
            if (dataInfo.geoinfo) {
              dataInfo.position = [dataInfo.geoCenter.lng, dataInfo.geoCenter.lat]
              dataInfo.path = []
              var geoPointList = dataInfo.geoPointList
              for (var l = 0; l < geoPointList.length; l++) {
                var point = [geoPointList[l].lng, geoPointList[l].lat]
                dataInfo.path.push(point)
              }
              markerList.push(dataInfo)
            }
          } else if (dataInfo.plftype == 1) {
            if (dataInfo.lat && dataInfo.lng) {
              markerList.push(dataInfo)
            }
          }
        }
        this.markerList = markerList
      }).catch(() => {
        this.dataListLoading = false
      })
    },
    getWorktargetTypeList() {
      return this.$http
        .get('/worktarget/worktargettype/list', { params: {} })
        .then(({ data: res }) => {
          if (res.code != 0) {
            return this.$message.error(res.msg)
          }
          this.worktargetTypeList = res.data
          if (this.worktargetTypeList && this.worktargetTypeList.length > 0) {
            for (var i = 0; i < this.worktargetTypeList.length; i++) {
              var worktargetType = this.worktargetTypeList[i]
              this.worktargetTypeMap.set(worktargetType.id, worktargetType)
            }
          }
        })
        .catch(() => { })
    },
    // #region 地图
    clickFold() {
      if (this.foldStatus) {
        this.foldStatus = false
      } else {
        this.foldStatus = true
      }
    },
    createMarker(markerObj) {
      if (markerObj.plftype == 1) {
        if (markerObj.lat && markerObj.lng) {
          var marker = new AMap.Marker({
            map: this.amap,
            position: [markerObj.lng, markerObj.lat],
            extData: markerObj,
            icon: shopEdited
          })
          marker.on('click', this.markerClickCallback)
          this.markerMap.set(markerObj.id, marker)
        }
      } else if (markerObj.plftype == 2) {
        var polyline = new AMap.Polyline({
          map: this.amap,
          path: markerObj.path,
          extData: markerObj,
          fillColor: 'blue'
        })
        polyline.on('click', this.markerClickCallback)
        this.markerMap.set(markerObj.id, polyline)
      } else if (markerObj.plftype == 3) {
        var polygon = new AMap.Polygon({
          map: this.amap,
          path: markerObj.path,
          extData: markerObj,
          fillColor: 'blue'
        })
        polygon.on('click', this.markerClickCallback)
        this.markerMap.set(markerObj.id, polygon)
      }
    },
    markerClickCallback(e) {
      let marker = e.target.getExtData()
      this.openWindowInfo(marker)
    },
    openWindowInfo(marker) {
      var info = []
      info.push('<p>名称：' + marker.name + '</p>')
      info.push('<p>部门：' + marker.orgName + '</p>')
      if (!this.worktargetTypeId) {
        info.push('<p>设施类型：' + marker.worktargetTypeName + '</p>')
      }
      info.push('<p>地址：' + marker.address + '</p>')
      var infoWindow = new AMap.InfoWindow({
        content: info.join('') // 使用默认信息窗体框样式，显示信息内容
      })

      infoWindow.open(this.amap, [marker.lng, marker.lat])
    },
    unActiveShow() {
      if (this.activeMarker) {
        var extData = this.activeMarker.getExtData()
        if (extData) {
          if (extData.plftype == 1) {
            this.activeMarker.setIcon(shopEdited)
          } else if (extData.plftype == 2) {
            var polylineOptions = this.activeMarker.getOptions()
            polylineOptions.strokeColor = 'blue'
            this.activeMarker.setOptions(polylineOptions)
          } else if (extData.plftype == 3) {
            var polygonOptions = this.activeMarker.getOptions()
            polygonOptions.strokeColor = 'blue'
            this.activeMarker.setOptions(polygonOptions)
          }
        }
      }
    },
    activeShow(markerId) {
      this.unActiveShow()
      var marker = this.markerMap.get(markerId)
      if (marker != null) {
        var extData = marker.getExtData()
        if (extData) {
          if (extData.plftype == 1) {
            marker.setIcon(shopEditing)
          } else if (extData.plftype == 2) {
            var polylineOptions = marker.getOptions()
            polylineOptions.strokeColor = 'red'
            marker.setOptions(polylineOptions)
          } else if (extData.plftype == 3) {
            var polygonOptions = marker.getOptions()
            polygonOptions.strokeColor = 'red'
            marker.setOptions(polygonOptions)
          }
        }
        this.amap.setFitView(marker)
      }
      this.activeMarker = marker
    },
    cleanMap() {
      if (this.amap) {
        this.amap.clearMap()
      }
    },
    zoomEnd(e) {
      this.map.zoom = e.target.getZoom()
    },
    onInput(value) {
      this.getDataList()
    },
    onRowClick(row, column, event) {
      this.activeShow(row.id)
    },
    onRowSelect(selection, row) {
      var isExist = selection.find(x => x.id == row.id)
      if (isExist) {
        this.map.zoom = 14
        this.map.center = {
          lng: row.geoCenter.lng,
          lat: row.geoCenter.lat
        }
      }
    },
    addOrUpdateHandle(id) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.dataForm.id = id
        if (this.worktargetTypeId) {
          this.$refs.addOrUpdate.worktargetTypeName = this.worktargetTypeName
          this.$refs.addOrUpdate.worktargetTypeId = this.worktargetTypeId
          this.$refs.addOrUpdate.dataForm.worktargetTypeId = this.worktargetTypeId
          this.$refs.addOrUpdate.plftype = this.plftype
          this.$refs.addOrUpdate.dataForm.plftype = this.plftype
        }
        this.$refs.addOrUpdate.init()
      })
    },
    changeWorktargetType(worktargetType) {
      this.dataForm.worktargetTypeId = worktargetType.id
    },
    changeOrg(org) {
      this.dataForm.orgId = org.id
    }
  }
}
</script>
<style lang="scss">
.table-container {
  background-color: white;
  width: 60%;
  height: calc(100vh - 215px);
  float: left;
  position: relative;
  z-index: 999;

  .fold_btn {
    position: absolute;
    right: -40px;
    top: 50%;
    height: 100px;
    width: 40px;
    background-color: rgba(255, 255, 255, 0.9);
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
    cursor: pointer;
    margin-top: -50px;
    text-align: center;

    i {
      font-size: 18px;
      line-height: 100px;
    }
  }
}

.map {
  float: left;
  width: 40%;
  height: calc(100vh - 215px);
}
</style>
