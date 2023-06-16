<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-worktarget__twgtinstitution">
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
        <el-form-item label="部门" prop="orgId">
          <dept-tree v-model="dataForm.orgId" @change="changeOrg" placeholder="请选择"></dept-tree>
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model="dataForm.name" ></el-input>
        </el-form-item>
        <el-form-item label="清运方式">
          <dict-select v-model="dataForm.cleanType" :comStyle="cleanTypeStyle" :dictType="'cleanType'" @change="changeCleanType"></dict-select>
        </el-form-item>
        <el-form-item>
          <el-button @click="getDataList()">{{ $t('query') }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="info" @click="exportHandle()">{{ $t('export') }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button v-if="$hasPermission('worktarget:twgtinstitution:save')" type="primary" @click="addOrUpdateHandle()">{{ $t('add') }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button v-if="$hasPermission('worktarget:twgtinstitution:delete')" type="danger" @click="deleteHandle()">{{ $t('deleteBatch') }}</el-button>
        </el-form-item>
      </el-form>
      <div class="table-container" :style="[{ width: foldStatus ? '60%' : '0px' }]">
        <el-table v-loading="dataListLoading" :data="dataList" border @selection-change="dataListSelectionChangeHandle" style="width: 100%;" @row-click="onRowClick" @select="onRowSelect">
          <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
          <el-table-column prop="code" label="编号" header-align="center" align="center"></el-table-column>
          <el-table-column prop="name" label="名称" header-align="center" align="center"></el-table-column>
          <el-table-column prop="address" label="地址" header-align="center" align="center"></el-table-column>
          <el-table-column prop="orgName" label="所属部门" header-align="center" align="center"></el-table-column>
          <el-table-column prop="manager" label="责任人" header-align="center" align="center"></el-table-column>
          <el-table-column prop="tel" label="联系电话" header-align="center" align="center"></el-table-column>
          <el-table-column prop="output" label="产出量" header-align="center" align="center"></el-table-column>
          <el-table-column prop="cleanTypeName" label="清运方式" header-align="center" align="center"></el-table-column>
          <el-table-column prop="cleanToWorktargetName" label="清运去向" header-align="center" align="center"></el-table-column>
          <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">
            <template slot-scope="scope">
              <el-button v-if="$hasPermission('worktarget:twgtinstitution:update')" type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">{{ $t('update') }}</el-button>
              <el-button v-if="$hasPermission('worktarget:twgtinstitution:delete')" type="text" size="small" @click="deleteHandle(scope.row.id)">{{ $t('delete') }}</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          v-show="foldStatus"
          :current-page="page"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="limit"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="pageSizeChangeHandle"
          @current-change="pageCurrentChangeHandle">
        </el-pagination>
        <div class="fold_btn">
            <i v-show="!foldStatus" class="el-icon-d-arrow-right" @click="clickFold" />
            <i v-show="foldStatus" class="el-icon-d-arrow-left" @click="clickFold" />
        </div>
      </div>
      <div class="map" id="institution-container" :style="[{ width: foldStatus ? '40%' : '100%' }]">
      </div>
      <!-- 弹窗, 新增 / 修改 -->
      <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
    </div>
  </el-card>
</template>

<script>
import mixinViewModule from '@/mixins/view-module'
import AddOrUpdate from './twgtinstitution-add-or-update'
import AMap from 'AMap'
import shopEdited from '@/assets/img/shopEdited.png'
import shopEditing from '@/assets/img/shopEditing.png'
export default {
  mixins: [mixinViewModule],
  data () {
    return {
      foldStatus: true,
      amap: '',
      mapConfig: {
        center: [116.902, 36.661],
        zoom: 6,
        resizeEnable: true,
        plugin: {
        },
        events: {
          init () {
          },
          click (e) {
          }
        }
      },
      markerList: [],
      activeMarker: '',
      markerMap: new Map(),
      mixinViewModuleOptions: {
        getDataListURL: '/worktarget/twgtinstitution/listPage',
        getDataListIsPage: true,
        exportURL: '/worktarget/twgtinstitution/export',
        deleteURL: '/worktarget/twgtinstitution',
        deleteIsBatch: true,
        createdIsNeed: false,
        activatedIsNeed: true
      },
      activeId: '',
      cleanTypeStyle: 'width:120px;',
      dataForm: {
        orgId: '',
        name: '',
        cleanType: ''
      }
    }
  },
  watch: {
    markerList (val) {
      this.cleanMap()
      if (this.markerList && this.markerList.length > 0) {
        for (var i = 0; i < this.markerList.length; i++) {
          var markerObj = this.markerList[i]
          if (markerObj.lng && markerObj.lat) {
            var marker = new AMap.Marker({
              map: this.amap,
              position: [markerObj.lng, markerObj.lat],
              extData: markerObj,
              icon: new AMap.Icon({ image: shopEdited,
                size: new AMap.Size(30, 30), // 设置icon的大小
                imageSize: new AMap.Size(20, 20) })
            })
            marker.on('click', this.markerClickCallback)
            this.markerMap.set(markerObj.id, marker)
          }
        }
      }
      this.amap.setFitView()
    }
  },
  components: {
    AddOrUpdate
  },
  computed: {
    markerImg () {
      return (marker) => {
        return this.activeId == marker.id ? shopEditing : shopEdited
      }
    }
  },
  mounted () {
    this.initMap()
  },
  destroyed () {
    if (this.amap) {
      this.amap.destroy()
    }
  },
  methods: {
    initMap () {
      var amap = new AMap.Map('institution-container', {
        ...this.mapConfig
      })
      this.amap = amap
    },
    query () {
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
          markerList.push(dataInfo)
        }
        this.markerList = markerList
        if (this.markerList.length > 0) {
          this.mapConfig.zoom = 14
          this.mapConfig.center = [ this.markerList[0].lng, this.markerList[0].lat ]
          this.amap.setZoomAndCenter(this.mapConfig.zoom, this.mapConfig.center)
        }
      }).catch(() => {
        this.dataListLoading = false
      })
    },
    // #region 地图
    clickFold () {
      if (this.foldStatus) {
        this.foldStatus = false
      } else {
        this.foldStatus = true
      }
    },
    markerClickCallback (e) {
      let marker = e.target.getExtData()
      this.openWindowInfo(marker)
    },
    openWindowInfo (marker) {
      // var info = []
      // info.push('<p>名称：' + marker.name + '</p>')
      // info.push('<p>部门：' + marker.orgName + '</p>')
      // info.push('<p>产出量：' + marker.output + '</p>')
      // info.push('<p>地址：' + marker.address + '</p>')
      // var infoWindow = new AMap.InfoWindow({
      //   content: info.join('') // 使用默认信息窗体框样式，显示信息内容
      // })
      var info = []
      info.push('<div class="info-content"><table style="width: 100%">')
      info.push('<tr><td class="info-content-key">名称：</td><td class="info-content-value">' + marker.name + '</td></tr>')
      info.push('<tr><td class="info-content-key">部门：</td><td class="info-content-value">' + marker.orgName + '</td></tr>')
      info.push('<tr><td class="info-content-key">产出量：</td><td class="info-content-value">' + marker.output + '</td></tr>')
      info.push('<tr><td class="info-content-key">地址：</td><td class="info-content-value">' + marker.address + '</td></tr>')
      info.push('</table></div>')
      var infoWindow = new AMap.InfoWindow({
        isCustom: true, // 使用自定义窗体
        offset: new AMap.Pixel(16, -40),
        content: this.createInfoWindow('信息', info.join(''))
      })

      infoWindow.open(this.amap, [marker.lng, marker.lat])
    },
    unActiveShow () {
      if (this.activeMarker) {
        this.activeMarker.setIcon(new AMap.Icon({ image: shopEdited,
          size: new AMap.Size(30, 30), // 设置icon的大小
          imageSize: new AMap.Size(20, 20) }))
      }
    },
    activeShow (markerId) {
      this.unActiveShow()
      var marker = this.markerMap.get(markerId)
      if (marker != null) {
        marker.setIcon(new AMap.Icon({ image: shopEditing,
          size: new AMap.Size(30, 30), // 设置icon的大小
          imageSize: new AMap.Size(20, 20) }))
        this.activeMarker = marker
      }
    },
    cleanMap () {
      if (this.amap) {
        this.amap.clearMap()
      }
    },
    zoomEnd (e) {
      this.map.zoom = e.target.getZoom()
    },
    onInput (value) {
      this.getDataList()
    },
    onRowClick (row, column, event) {
      var marker = this.markerMap.get(row.id)
      this.amap.setFitView([marker])
      this.activeId = row.id
      this.activeShow(row.id)
    },
    onRowSelect (selection, row) {
      var isExist = selection.find(x => x.id == row.id)
      if (isExist) {
        this.map.zoom = 14
        this.map.center = [row.lng, row.lat]
      }
    },
    addOrUpdateHandle (id) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.dataForm.id = id
        this.$refs.addOrUpdate.init()
      })
    },
    changeOrg (org) {
      this.dataForm.orgId = org.id
    },
    changeCleanType (cleanType) {
      this.dataForm.cleanType = cleanType.dictValue
    },
    createInfoWindow (title, content) {
      var info = document.createElement('div')
      info.className = 'custom-info input-card content-window-card'

      // 可以通过下面的方式修改自定义窗体的宽高
      info.style.width = '250px'
      // 定义顶部标题
      var top = document.createElement('div')
      var titleD = document.createElement('div')
      var closeX = document.createElement('img')
      top.className = 'info-top'
      titleD.innerHTML = title
      closeX.src = 'https://webapi.amap.com/images/close2.gif'
      closeX.onclick = this.closeInfoWindow

      top.appendChild(titleD)
      top.appendChild(closeX)
      info.appendChild(top)

      // 定义中部内容
      var middle = document.createElement('div')
      middle.className = 'info-middle'
      middle.style.backgroundColor = 'white'
      middle.innerHTML = content
      info.appendChild(middle)

      // 定义底部内容
      var bottom = document.createElement('div')
      bottom.className = 'info-bottom'
      bottom.style.position = 'relative'
      bottom.style.top = '0px'
      bottom.style.margin = '0 auto'
      var sharp = document.createElement('img')
      sharp.src = 'https://webapi.amap.com/images/sharp.png'
      bottom.appendChild(sharp)
      info.appendChild(bottom)
      return info
    },

    // 关闭信息窗体
    closeInfoWindow () {
      this.amap.clearInfoWindow()
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
  height: calc(100vh - 165px);
}

.content-window-card {
    position: relative;
    box-shadow: none;
    bottom: 0;
    left: 0;
    width: auto;
    padding: 0;
}

.content-window-card p {
    height: 2rem;
}

.custom-info {
    border: solid 1px silver;
}

div.info-top {
    position: relative;
    background: none repeat scroll 0 0 #F9F9F9;
    border-bottom: 1px solid #CCC;
    border-radius: 5px 5px 0 0;
}

div.info-top div {
    display: inline-block;
    color: #333333;
    font-size: 14px;
    font-weight: bold;
    line-height: 31px;
    padding: 0 10px;
}
div.info-top img {
    position: absolute;
    top: 10px;
    right: 10px;
    transition-duration: 0.25s;
}

div.info-top img:hover {
    box-shadow: 0px 0px 5px #000;
}

.info-content {
  padding: 5px 5px 5px 5px;
}

.info-content-key {
  width: 30%;
}

.info-content-value {
  width: 65%;
}
</style>
