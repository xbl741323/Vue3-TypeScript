<template>
  <el-card shadow="never" class="aui-card--fill">
    <el-container >
      <el-aside :style="{width: asideWidth+'vw'}">
        <div  @mouseover="worktargettypeShow" @mouseleave="worktargettypeHiden" :class="worktargettypeClass">
            <worktarget-type-checkbox-group :worktargetTypeIds="worktargetTypeIds"
             businessType="dustbinClean"
             @change="changeWorktargetTypeIds"></worktarget-type-checkbox-group>
        </div>
        <div style="margin-top: 50px;background-color: white;">
            <el-input
                style="margin-bottom: 10px;"
                placeholder="输入关键字进行过滤"
                v-model="targetFilterText">
            </el-input>
            <el-tree
                :data="targetData"
                node-key="id"
                ref="targetTree"
                show-checkbox
                highlight-current
                :default-expand-all="true"
                @check="getWorkTargetCheckedNodes"
                style="height: 75vh;overflow: auto;"
                :filter-node-method="filterNode"
                :props="defaultProps">
                <span slot-scope="{ node, data }" @click="clickNode(data)">
                  <span v-if="data.nodeType!='ViewWorktargetInfoDTO'"  style="color: black;">
                      <svg class="icon-svg" aria-hidden="true">
                        <use :xlink:href="treeNodeSvg(node,data)"></use>
                      </svg>
                      {{ node.label }} ({{ data.childrenTotalSize }})
                  </span>
                  <span v-else @click="queryTarget(data)">
                      <span :class="nodeStyle(node,data)">
                        <svg class="icon-svg" aria-hidden="true">
                          <use :xlink:href="treeNodeSvg(node,data)"></use>
                        </svg>
                        {{ node.label }}
                      </span>
                  </span>
                </span>
            </el-tree>
        </div>
      </el-aside>
      <el-container>
        <div style="z-index: 999;position: absolute;top: 2vh;">
          <i v-if="asideShow" class="el-icon-s-fold" @click="asidePackUp" style="font-size: 20px!important;"></i>
          <i v-else class="el-icon-s-unfold" @click="asideUnfold" style="font-size: 20px!important;"></i>
        </div>
        <div id="dropdownRight">
        </div>
        <el-main style="height: 100%;">
          <div id="dustbincleanmonitor-map" class="container" ></div>
        </el-main>
        <div :style="{zIndex: 999,position: 'absolute',bottom: footerBottom+'vh',right:'1px'}">
          <i v-if="footerShow" class="el-icon-download" @click="footerPackUp" style="font-size: 20px!important;"></i>
          <i v-else class="el-icon-upload2" @click="footerUnfold" style="font-size: 20px!important;"></i>
        </div>
        <el-footer :style="{height: footerHeight+'vh', position: 'absolute',bottom: '0vh',width: footerWidth+'%'}">
          <div >
            <el-table :data="dataList" class="show_table" style="width: 100%;" >
              <el-table-column prop="worktargetTypeName" label="设施类型" width="180" header-align="center" align="center"></el-table-column>
              <el-table-column prop="worktargetName" label="设施名称" header-align="center" align="center"></el-table-column>
              <el-table-column prop="orgName" label="部门" header-align="center" align="center"></el-table-column>
              <el-table-column prop="cleanCount" label="清运次数" header-align="center" align="center"></el-table-column>
              <el-table-column prop="cleanAmount" label="清运量" header-align="center" align="center"></el-table-column>
            </el-table>
            <!-- <el-pagination
                :current-page="queryParams.page"
                :page-sizes="[5, 10, 15, 30]"
                :page-size="queryParams.limit"
                :total="queryParams.total"
                @current-change="handleCurrentChange"
                layout="total, sizes, prev, pager, next, jumper">
            </el-pagination> -->
          </div>
        </el-footer>
      </el-container>
    </el-container>
  </el-card>

</template>

<script>
import { parseInt } from 'lodash'
import { getWorktargetTree } from '@/api/worktarget/cleanworktargetmonitor.js'
import { getWorktargetIcon } from '@/api/iconUtil.js'
import AMap from 'AMap'
export default {
  data () {
    return {
      facilityCoverage: false,
      worktypeStatus: '0',
      worktargetTypeIds: [],
      asideWidth: 20,
      asideShow: true,
      footerHeight: 0,
      footerShow: true,
      footerWidth: 77,
      footerBottom: 35,
      targetName: '',
      facilityTableShow: false,
      data: [],
      defaultProps: {
        children: 'children',
        label: 'name',
        key: 'key'
      },
      filterText: '',
      targetFilterText: '',
      eventFilterText: '',
      map: null,
      cluster: null,
      markers: [],
      markerMap: new Map(),
      worktargetExtendMap: new Map(),
      dataList: [],
      targetData: [],
      targetDataList: [],
      isPage: true,
      queryParams: {
        page: 1,
        limit: 5,
        total: 1,
        worktargetTypeIds: '',
        deptIds: '',
        typeAndId: ''
      },
      targetQuery: {
        worktargetTypeIds: null,
        deptIds: '',
        typeAndId: ''
      }
    }
  },
  components: {
  },
  computed: {
    worktargettypeClass () {
      return this.worktypeStatus == '0' ? 'worktargettype-hiden' : 'worktargettype-show'
    },
    nodeStyle () {
      return (node, data) => {
        if (data.extendData.cleanCount == 0) {
          return 'unclean'
        } else {
          return 'cleaned'
        }
      }
    },
    treeNodeSvg () {
      return (node, data) => {
        if (data.nodeType == 'SysDeptDTO') {
          return '#icon-zhhw-dept'
        } else if (data.nodeType == 'ViewWorktargetInfoDTO' && data.worktargetTypeId == 10) {
          return '#icon-zhhw-transferstation'
        } else if (data.nodeType == 'ViewWorktargetInfoDTO' && data.worktargetTypeId == 1) {
          return '#icon-zhhw-transferstation'
        } else if (data.nodeType == 'ViewWorktargetInfoDTO' && data.worktargetTypeId == 21) {
          return '#icon-zhhw-dustbinpoint'
        } else if (data.nodeType == 'ViewWorktargetInfoDTO' && data.worktargetTypeId == 37) {
          return '#icon-zhhw-institution'
        } else if (data.nodeType == 'ViewWorktargetInfoDTO' && data.worktargetTypeId == 38) {
          return '#icon-zhhw-shop'
        }
        return ''
      }
    }
  },
  methods: {
    initTable () {
      let that = this
      that.footerHeight = 36
    },
    filterNode (value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    asidePackUp () {
      this.asideWidth = 0
      this.asideShow = false
      this.footerWidth = 100
    },
    asideUnfold () {
      this.asideWidth = 20
      this.asideShow = true
      this.footerWidth = 77
    },
    footerPackUp () {
      this.footerHeight = 0
      this.footerBottom = 1
      this.footerShow = false
    },
    footerUnfold () {
      this.footerBottom = 35
      this.footerHeight = 36
      this.footerShow = true
    },
    changeWorktargetTypeIds (val) {
      this.worktargetTypeIds = val
      this.queryTargetTree()
    },
    queryTargetTree () {
      this.clearPolygon()
      this.markers = []
      this.initWorkTargetTree()
    },
    initWorkTargetTree () {
      var targetQuery = {
        ...this.targetQuery
      }
      targetQuery.worktargetTypeIds = this.worktargetTypeIds.join(',')
      getWorktargetTree(targetQuery).then(({ data: res }) => {
        this.targetData = res.data
        this.initNodeMarker(this.targetData)
        this.footerUnfold()
      })
    },
    initNodeMarker (nodeList) {
      if (nodeList.length > 0) {
        var fullKeys = []
        for (var i = 0; i < nodeList.length; i++) {
          var node = nodeList[i]
          if (node.nodeType == 'ViewWorktargetInfoDTO') {
            this.createMarker(node)
            node.key = node.typeAndId
          } else {
            node.key = node.id
          }
          fullKeys.push(node.key)
          if (node.children != null && nodeList.length > 0) {
            this.initNodeMarker(node.children)
          }
        }
        this.$refs.targetTree.setCheckedKeys(fullKeys)
        this.markers = []
        this.markerMap.forEach((value, key, map) => {
          // this.markers.push(value)
          this.markers.push({ lnglat: [value.getExtData().lng, value.getExtData().lat], marker: value, extData: value.getExtData() })
        })
        this.cluster.setData(this.markers)
      }
    },
    createMarker (targetNode) {
      if (targetNode.extendData) {
        targetNode.extendData.status = 1
        this.dataList.push(targetNode.extendData)
        this.worktargetExtendMap.set(targetNode.typeAndId, targetNode)
      }

      var worktargetTypeId = targetNode.worktargetTypeId
      var status = 1
      if (!targetNode.extendData || targetNode.extendData.cleanCount == 0) {
        status = 0
      }
      if (targetNode.plftype == 1) {
        if (targetNode.lat && targetNode.lng && targetNode.lng) {
          var marker = new AMap.Marker({
            // map: this.map,
            position: [targetNode.lng, targetNode.lat],
            extData: targetNode,
            icon: new AMap.Icon({ image: getWorktargetIcon(worktargetTypeId, status),
              size: new AMap.Size(30, 30), // 设置icon的大小
              imageSize: new AMap.Size(20, 20) })
          })
          marker.on('click', this.markerClickCallback)
          this.markerMap.set(targetNode.typeAndId, marker)
        }
      } else if (targetNode.plftype == 2 && targetNode.geoPointList.length > 0) {
        var linePath = []
        for (var i = 0; i < targetNode.geoPointList.length; i++) {
          var linePoint = targetNode.geoPointList[i]
          linePath.push([linePoint.lng, linePoint.lat])
        }
        targetNode.path = linePath
        var polyline = new AMap.Polyline({
          map: this.map,
          path: targetNode.geoPointList,
          extData: targetNode,
          fillColor: 'blue'
        })
        polyline.on('click', this.markerClickCallback)
        this.markerMap.set(targetNode.typeAndId, polyline)
      } else if (targetNode.plftype == 3 && targetNode.geoPointList.length > 0) {
        var gonPath = []
        for (var j = 0; j < targetNode.geoPointList.length; j++) {
          var point = targetNode.geoPointList[j]
          gonPath.push([point.lng, point.lat])
        }
        targetNode.path = gonPath
        var polygon = new AMap.Polygon({
          map: this.map,
          path: targetNode.path,
          extData: targetNode,
          fillColor: 'blue'
        })
        polygon.on('click', this.markerClickCallback)
        this.markerMap.set(targetNode.typeAndId, polygon)
      }
    },
    markerClickCallback (e) {
      let marker = e.target.getExtData()
      this.markerClick(marker)
    },
    clickNode (data) {
      if (data.nodeType == 'ViewWorktargetInfoDTO') {
        this.map.panTo([data.geoCenter.lng, data.geoCenter.lat])
        var marker = this.markerMap.get(data.typeAndId)
        if (marker) {
          this.map.setFitView(marker)
        }
      }
    },
    getWorkTargetCheckedNodes (data, treeInfo) {
      var checkedNodes = treeInfo.checkedNodes
      var dataList = []
      var currentMap = new Map()
      if (checkedNodes.length > 0) {
        for (var i = 0; i < checkedNodes.length; i++) {
          var node = checkedNodes[i]
          currentMap.set(node.key, node)
          if (node.nodeType == 'ViewWorktargetInfoDTO' && node.extendData) {
            dataList.push(node.extendData)
            var marker = this.markerMap.get(node.typeAndId)
            if (!marker) {
              this.createMarker(node)
            }
          }
        }
      }
      var removeMarkers = []
      this.markerMap.forEach((marker) => {
        var obj = currentMap.get(marker.getExtData().key)
        if (!obj) {
          removeMarkers.push(marker)
        }
      })
      for (var j = 0; j < removeMarkers.length; j++) {
        var removeMarker = removeMarkers[j]
        this.map.remove(removeMarker)
        this.markerMap.delete(removeMarker.getExtData().key)
      }
      this.markers = []
      this.markerMap.forEach((value, key, map) => {
        this.markers.push({ lnglat: [value.getExtData().lng, value.getExtData().lat], marker: value, extData: value.getExtData() })
      })
      this.cluster.setData(this.markers)

      this.dataList = dataList
    },
    markerClick (e) {
      let extendData = e.extendData
      let html = '<div><table style="width: 350px">' +
          '<tr class="particularsClass"><td><span >所属部门：</span><span>' + e.orgName + '</span></td>' +
          '<td style="padding-left: 3vw;"><span>设施类型：</span><span>' + e.worktargetTypeName + '</span></td></tr>' +
          '<tr class="particularsClass"><td><span>设施名称：</span><span>' + e.name + '</span></td>' +
          '<td style="padding-left: 3vw;"><span>清运次数：</span><span>' + extendData.cleanCount + '</span></td></tr>' +
          '<tr class="particularsClass"><td><span>清运辆：</span><span>' + extendData.cleanCount + '</span></td>'
      html += '</div>'
      var infoWindow = new AMap.InfoWindow({
        offset: [0, -30],
        content: html
      })
      if (e.lng && e.lat) {
        infoWindow.open(this.map, [e.lng, e.lat])
      } else {
        infoWindow.open(this.map, [e.geoCenter.lng, e.geoCenter.lat])
      }
    },
    clusterMarkerClickCallback (e) {
      let extendData = e.target.getExtData()
      let html = '<div><table style="width: 350px">' +
          '<tr class="particularsClass"><td><span >设施数：</span><span>' + extendData.targetCount + '</span></td>' +
          '<td style="padding-left: 3vw;"><span>清运个数：</span><span>' + extendData.cleanedTargetCount + '</span></td></tr>' +
          '<tr class="particularsClass"><td><span>清运次数：</span><span>' + extendData.cleanCount + '</span></td>' +
          '<td style="padding-left: 3vw;"><span>清运量：</span><span>' + extendData.cleanAmount + '</span></td></tr>'
      html += '</div>'
      var infoWindow = new AMap.InfoWindow({
        offset: [0, -10],
        content: html
      })
      infoWindow.open(this.map, [extendData.lnglat.lng, extendData.lnglat.lat])
    },
    clearPolygon () {
      let that = this
      let polygons = that.map.getAllOverlays('polygon')
      let polyLines = that.map.getAllOverlays('polyline')

      that.map.remove(polyLines)
      that.map.remove(polygons)
    },
    queryTarget (data) {

    },
    worktargettypeShow () {
      this.worktypeStatus = '1'
    },
    worktargettypeHiden () {
      this.worktypeStatus = '0'
    }
  },
  watch: {
    targetFilterText (val) {
      let that = this
      that.$refs.targetTree.filter(val)
    }
  },
  mounted () {
    let param = {
      resizeEnable: true,
      zoom: 15
    }
    this.map = new AMap.Map('dustbincleanmonitor-map', param)
    this.markers = []
    var that = this
    this.cluster = new AMap.MarkerCluster(this.map, this.markers, { gridSize: 80,
      renderMarker: function (obj) {
        var extData = obj.data[0].marker.getExtData()
        var status = 1
        if (!extData.extendData || extData.extendData.cleanCount == 0) {
          status = 0
        }
        obj.marker.setIcon(new AMap.Icon({ image: getWorktargetIcon(extData.worktargetTypeId, status),
          size: new AMap.Size(30, 30), // 设置icon的大小
          imageSize: new AMap.Size(20, 20) }))
        obj.marker.setExtData(extData)
        obj.marker.on('click', that.markerClickCallback)
      },
      renderClusterMarker: function (context) {
        var count = that.markers.length
        let extData = []
        // 将标记名称等存入marker的拓展信息字段extData中
        context.marker.extData = extData
        let factor = Math.pow(context.count / count, 1 / 18)
        let div = document.createElement('div')
        // let Hue = 240 - factor * 240
        let Hue = 200 + (factor * 40)
        let bgColor = 'hsla(' + Hue + ',100%,50%,0.7)'
        let fontColor = 'white'
        let borderColor = '#ffffff'
        let shadowColor = 'hsla(' + Hue + ',100%,50%,1)'
        div.style.backgroundColor = bgColor
        let size = Math.round(20 + Math.pow(context.count / count, 1 / 5) * 20)
        div.style.width = div.style.height = size + 'px'
        div.style.border = 'solid 2px ' + borderColor
        div.style.borderRadius = size / 2 + 'px'
        div.style.boxShadow = '0 0 1px ' + shadowColor
        div.innerHTML = context.count
        div.style.lineHeight = size + 'px'
        div.style.color = fontColor
        div.style.fontSize = '16px'
        div.style.textAlign = 'center'
        context.marker.setOffset(new AMap.Pixel(-size / 2, -size / 2))
        context.marker.setContent(div)
        var clusterData = context.clusterData
        var cleanCount = 0
        var cleanAmount = 0
        var targetCount = context.count
        var cleanedTargetCount = 0
        for (var i = 0; i < clusterData.length; i++) {
          var obj = clusterData[i]
          var info = obj.extData.extendData
          cleanCount += info.cleanCount
          cleanAmount += info.cleanAmount
          if (info.cleanCount > 0) {
            cleanedTargetCount++
          }
        }
        context.marker.setExtData({
          cleanCount: cleanCount,
          cleanAmount: cleanAmount,
          targetCount: targetCount,
          cleanedTargetCount: cleanedTargetCount,
          lnglat: context.marker.getPosition()
        })
        context.marker.on('click', that.clusterMarkerClickCallback)
      } })
  },
  beforeDestroy () {
    if (this.map) {
      this.map.destroy()
      this.map = ''
    }
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

  .container {
    height: 89vh;
  }
  .el-checkbox-button--small .el-checkbox-button__inner {
    padding: 10px 15px!important;
    margin: 2px!important;
    border-left: 1px solid #DCDFE6;
  }
  .el-radio-button--small .el-radio-button__inner {
    padding: 10px 15px!important;
    margin: 2px!important;
    border-left: 1px solid #DCDFE6;
  }
  .el-button--small, .el-button--small.is-round {
    padding: 9px 11px!important;
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
  .particularsClass{
    font-weight: 600;
    font-size: 12px;
    line-height: 30px;
  }
  .trackMonitoring{
    padding-left: 2vw;
    color: #1818be;
  }
  .el-dropdown {
    vertical-align: top;
  }
  .el-dropdown + .el-dropdown {
    margin-left: 15px;
  }
  .el-icon-arrow-down {
    font-size: 12px;
  }
  #dropdownRight{
    position: absolute;
    right: 1vh;
    top: 1vh;
    z-index: 999;
  }

  .worktargettype-hiden {
    position: absolute;
    z-index: 0;
    width: calc(20vw - 3px);
    padding-top: 5px;
    height: 50px;
    overflow: hidden;
    background-color: white;
  }

  .worktargettype-show {
    position: absolute;
    z-index: 99;
    width: calc(20vw - 3px);
    padding-top: 5px;
    height: auto;
    background-color: white;
  }
  .cleaned {
    color: green;
  }
  .unclean {
    color: red;
  }
</style>
