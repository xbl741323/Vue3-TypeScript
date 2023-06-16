<template>
  <el-dialog :visible.sync="visible" top="7vh" :title="worktargetTypeName + (!dataForm.id ? $t('add') : $t('update'))" :close-on-click-modal="false" :close-on-press-escape="false" @close="onDialogClose">
    <div class="form-container">
      <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmitHandle()" :label-width="$i18n.locale == 'en-US' ? '80px' : '80px'">
            <el-form-item label="名称" prop="name">
              <el-input v-model="dataForm.name" placeholder="名称"></el-input>
            </el-form-item>
            <el-form-item label="设施类型" prop="worktargetTypeId">
               <worktarget-type-select v-model="dataForm.worktargetTypeId" @changeWorktargetType="changeWorktargetType"></worktarget-type-select>
            </el-form-item>
            <el-form-item label="所属部门" prop="orgId">
              <dept-tree v-model="dataForm.orgId" @change="changeOrg" placeholder="请选择"></dept-tree>
            </el-form-item>
            <el-form-item label="地址" prop="address">
              <el-input v-model="dataForm.address" placeholder="地址"></el-input>
            </el-form-item>
        <div v-if="plftype == 1">
          <el-form-item label="经度" prop="lng">
            <el-input v-model="dataForm.lng" :readonly="true" placeholder="经度"></el-input>
          </el-form-item>
          <el-form-item label="维度" prop="lat">
            <el-input v-model="dataForm.lat" :readonly="true" placeholder="维度"></el-input>
          </el-form-item>
        </div>
        <div v-if="plftype == 2 || plftype == 3">
          <el-form-item label="地理信息" prop="geoinfo">
            <el-input v-model="dataForm.geoinfo" :readonly="true" placeholder="地理信息"></el-input>
          </el-form-item>
        </div>
        <div style="text-align: center">
          <el-button @click="visible = false">{{ $t('cancel') }}</el-button>
          <el-button type="primary" @click="dataFormSubmitHandle()">
            {{ $t('confirm') }}
          </el-button>
        </div>
      </el-form>
    </div>
    <!-- 地图 -->
    <div class="form-map">
          <div v-if="showControl">
            <div class="text-btn">
              <el-button v-show="!dragging" type="text" size="small" @click="openDraw">
                开启定位
              </el-button>
              <el-button v-show="dragging" type="text" size="small" @click="closeDraw">
                关闭定位
              </el-button>
            </div>
          </div>
          <div id="worktarget-edit-container" class="edit-map">
          </div>
        </div>
    <template slot="footer">
      <div style="height: 400px"></div>
    </template>
  </el-dialog>
</template>

<script>
import debounce from 'lodash/debounce'
import shopEdited from '@/assets/img/shopEdited.png'
import shopEditing from '@/assets/img/shopEditing.png'
import AMap from 'AMap'
export default {
  data () {
    return {
      visible: false,
      addressKeyword: '',
      worktargetTypeName: '',
      center: { lng: 116.404, lat: 39.915 },
      zoom: 14,
      worktargetTypeId: '',
      worktargetType: '',
      plftype: '',
      dataForm: {
        id: '',
        name: '',
        worktargetTypeId: '',
        address: '',
        lng: '',
        lat: '',
        area: '',
        geoinfo: '',
        orgId: '',
        districtCode: '',
        buildUnit: '',
        contacts: '',
        contactTel: '',
        creator: '',
        createDate: '',
        updater: '',
        updateDate: ''
      },
      dragging: false,
      editAmap: '',
      polygonEditor: '',
      polylineEditor: '',
      markerObj: {
        ...this.dataForm,
        path: [],
        position: []
      },
      marker: '',
      mapConfig: {
        center: [116.404, 39.915],
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
      }
    }
  },
  computed: {
    dataRule () {
      return {
        worktargetTypeId: [{ required: true, message: this.$t('validate.required'), trigger: 'blur,change' }],
        name: [{ required: true, message: this.$t('validate.required'), trigger: 'blur,change' }],
        address: [{ required: true, message: this.$t('validate.required'), trigger: 'blur,change' }],
        orgId: [{ required: true, message: this.$t('validate.required'), trigger: 'blur,change' }]
      }
    },
    showControl () {
      return this.plftype != ''
    }
  },
  watch: {
    worktargetTypeId (val) {
      if (val) {
        this.dataForm.worktargetTypeId = this.worktargetTypeId
        if (this.worktargetTypeId) {
          this.$http.get('/worktarget/worktargettype/' + this.worktargetTypeId).then(({ data: res }) => {
            if (res.code != 0) {
              return this.$message.error(res.msg)
            }
            this.worktargetType = res.data
            this.plftype = this.worktargetType.plftype
          }).catch(() => {})
        }
      }
    }
  },
  methods: {
    initMap () {
      var editAmap = new AMap.Map('worktarget-edit-container', {
        ...this.mapConfig
      })
      editAmap.on('click', (e) => {
        console.log(this.markerObj)
        if (this.dragging && this.plftype == 1) {
          this.markerObj = {}
          this.markerObj.position = [e.lnglat.lng, e.lnglat.lat]
          if (this.marker) {
            this.updateMarker(this.marker, this.markerObj)
          } else {
            this.addMarker(this.markerObj)
          }
        }
      })
      this.editAmap = editAmap
    },
    init () {
      this.visible = true
      this.$nextTick(() => {
        if (!this.editAmap) {
          this.initMap()
        }
        this.$refs['dataForm'].resetFields()
        if (this.dataForm.id) {
          this.getInfo()
        }
      })
    },
    // 获取信息
    getInfo () {
      this.$http.get('/worktarget/worktarget/' + this.dataForm.id).then(({ data: res }) => {
        if (res.code != 0) {
          return this.$message.error(res.msg)
        }
        this.dataForm = {
          ...this.dataForm,
          ...res.data
        }
        this.plftype = this.dataForm.plftype
        var markerObj = {
          ...this.dataForm,
          position: [this.dataForm.lng, this.dataForm.lat]
        }
        this.markerObj = markerObj
        if (this.plftype == 1) {
          this.createMarker(this.markerObj)
          this.marker.setDraggable(false)
          this.marker.setIcon(shopEdited)
        } else if (this.plftype == 2) {
          this.markerObj.position = [this.markerObj.geoCenter.lng, this.markerObj.geoCenter.lat]
          this.markerObj.path = []
          var linePointList = this.markerObj.geoPointList
          for (var i = 0; i < linePointList.length; i++) {
            var linePoint = [linePointList[i].lng, linePointList[i].lat]
            this.markerObj.path.push(linePoint)
          }
          this.createPolyline(this.markerObj)
        }
        if (this.plftype == 3) {
          this.markerObj.position = [this.markerObj.geoCenter.lng, this.markerObj.geoCenter.lat]
          this.markerObj.path = []
          var geoPointList = this.markerObj.geoPointList
          for (var l = 0; l < geoPointList.length; l++) {
            var point = [geoPointList[l].lng, geoPointList[l].lat]
            this.markerObj.path.push(point)
          }
          this.createPolygon(this.markerObj)
          this.editAmap.setFitView([this.markerObj])
        }
      }).catch(() => {})
    },
    addMarker (markerObj) {
      if (!this.marker) {
        this.createMarker(markerObj)
      }
    },
    createMarker (markerObj) {
      var marker = new AMap.Marker({
        icon: shopEditing,
        position: markerObj.position,
        draggable: true,
        map: this.editAmap
      })
      marker.on('dblclick', () => {
        this.marker.setDraggable(false)
        this.closeDraw()
      })
      this.marker = marker
    },
    updateMarker (marker, markerObj) {
      marker.setPosition(markerObj.position)
    },
    createPolyline (markerObj) {
      var marker = new AMap.Polyline({
        path: markerObj.path,
        strokeColor: 'blue',
        strokeWeight: 6,
        strokeOpacity: 0.5,
        map: this.editAmap

      })
      this.marker = marker
    },
    createPolygon (markerObj) {
      var marker = new AMap.Polygon({
        path: markerObj.path,
        strokeColor: 'blue',
        strokeWeight: 6,
        strokeOpacity: 0.5,
        map: this.editAmap
      })
      this.marker = marker
    },
    createPolygonEditor (editAmap) {
      var polygonEditor = new AMap.PolygonEditor(editAmap)
      var self = this
      polygonEditor.on('add', function (data) {
        console.log(data)
        var polygon = data.target
        polygonEditor.addAdsorbPolygons(polygon)
        self.marker = polygon
      })
      this.polygonEditor = polygonEditor
    },
    createPolylineEditor (editAmap, markerObj) {
      var polylineEditor = new AMap.PolylineEditor(editAmap)
      var self = this
      polylineEditor.on('add', function (data) {
        console.log(data)
        var polyline = data.target
        polylineEditor.addAdsorbPolygons(polyline)
        self.marker = polyline
      })
      this.polylineEditor = polylineEditor
    },
    openDraw () {
      this.dragging = !this.dragging
      if (this.plftype == 1) {
        if (this.marker) {
          this.marker.setDraggable(true)
          this.marker.setIcon(shopEditing)
        }
      } else if (this.plftype == 3) {
        if (!this.polygonEditor) {
          this.createPolygonEditor(this.editAmap)
        }
        if (!this.marker) {
          this.polygonEditor.close()
          this.polygonEditor.setTarget()
          this.polygonEditor.open()
        } else {
          this.polygonEditor.setTarget(this.marker)
          this.polygonEditor.open()
        }
      } else if (this.plftype == 2) {
        if (!this.polylineEditor) {
          this.createPolylineEditor(this.editAmap)
        }
        if (!this.marker) {
          this.polylineEditor.close()
          this.polylineEditor.setTarget()
          this.polylineEditor.open()
        } else {
          this.polylineEditor.setTarget(this.marker)
          this.polylineEditor.open()
        }
      }
    },
    closeDraw () {
      console.log(this.marker)
      if (this.plftype == 1) {
        this.markerObj.position = this.marker.getPosition()
        this.dataForm.lng = this.markerObj.position.lng
        this.dataForm.lat = this.markerObj.position.lat
        this.marker.setDraggable(false)
        this.marker.setIcon(shopEdited)
      } else if (this.plftype == 3) {
        var polygon = this.polygonEditor.getTarget()
        this.markerObj.path = polygon.getPath()
        this.dataForm.geoinfo = this.getGeoInfo(this.markerObj)
        polygon.remove()
        this.createPolygon(this.markerObj)
        this.polygonEditor.close()
      } else if (this.plftype == 2) {
        var polyline = this.polylineEditor.getTarget()
        this.markerObj.path = polyline.getPath()
        this.dataForm.geoinfo = this.getGeoInfo(this.markerObj)
        polyline.remove()
        this.createPolyline(this.markerObj)
        this.polylineEditor.close()
      }
      this.dragging = false
    },
    onSearchResult (pois) {
      if (pois.length > 0) {
        this.$nextTick(() => {
          this.$refs.searchBox.keyword = pois[0].name
        })
      }
      // 这边类似模糊查询 会返回一个数组，我就直接取第一个值了。
      this.map.center = [pois[0].lng, pois[0].lat]
    },
    getGeoInfo (polyObj) {
      var path = polyObj.path
      var geoinfo = ''
      for (var i = 0; i < path.length; i++) {
        var pathPoint = path[i]
        geoinfo += pathPoint.lat + '_' + pathPoint.lng + 'P'
      }
      return geoinfo
    },
    // 表单提交
    dataFormSubmitHandle: debounce(function () {
      this.$refs['dataForm'].validate((valid) => {
        if (!valid) {
          return false
        }
        this.$http[!this.dataForm.id ? 'post' : 'put']('/worktarget/worktarget/', this.dataForm).then(({ data: res }) => {
          if (res.code != 0) {
            return this.$message.error(res.msg)
          }
          this.$message({
            message: this.$t('prompt.success'),
            type: 'success',
            duration: 500,
            onClose: () => {
              this.visible = false
              this.$emit('refreshDataList')
            }
          })
        }).catch(() => {})
      })
    }, 1000, { 'leading': true, 'trailing': false }),
    onDragging (event) {
      this.curentLongitude = event.point.lng.toFixed(4)
      this.curentLatitude = event.point.lat.toFixed(4)
    },
    zoomEnd (e) {
      this.zoom = e.target.getZoom()
    },
    onCloseSelectPoint () {
      this.dragging = false
      this.addressKeyword = ''
      if (this.plftype == '3') {
        var geoinfo = ''
        for (var i = 0; i < this.polygonPath.length; i++) {
          geoinfo += 'P' + this.polygonPath[i].lat + '_' + this.polygonPath[i].lng
        }
        this.dataForm.geoinfo = geoinfo
      } else if (this.plftype == 2) {
        var lineGeoinfo = ''
        for (var j = 0; j < this.polylinePath.length; j++) {
          lineGeoinfo += 'P' + this.polylinePath[j].lat + '_' + this.polylinePath[j].lng
        }
        this.dataForm.geoinfo = lineGeoinfo
      }
    },
    onDialogClose () {
      // 关闭可拖动状态
      this.dragging = false
      this.center = { lng: 116.404, lat: 39.915 }
      this.zoom = 14
      this.plftype = ''
      this.marker = ''
      this.markerObj = ''
      this.editAmap.clearMap()
      this.dataForm = {
        id: '',
        townId: '',
        townCode: '',
        name: '',
        adress: '',
        lng: '',
        lat: '',
        rings: '',
        contactMan: '',
        tel: '',
        videoNumber: '',
        liquidNumber: '',
        creator: '',
        createDate: ''
      }
      this.addressKeyword = ''
    },
    changeWorktargetType (worktargetType) {
      this.worktargetType = worktargetType
      this.worktargetTypeId = worktargetType.id
      this.dataForm.worktargetTypeId = worktargetType.id
      this.plftype = worktargetType.plftype
      this.dataForm.plftype = this.plftype
    },
    changeOrg (org) {
      this.dataForm.orgId = org.id
    }
  }
}
</script>
<style lang="scss">
.form-container {
  background-color: white;
  width: 40%;
  height: 400px;
  float: left;
  padding: 0px 30px 0px 0px;
  .position {
    .el-input {
      width: 80%;
    }
    @media screen and (max-width: 1680px) {
      .el-input {
        width: 70%;
      }
    }
    @media screen and (max-width: 1366px) {
      .el-input {
        width: 52%;
      }
    }
    .text-btn {
      position: absolute;
      top: 0;
      right: 0;
    }
  }
  .manager {
    .el-input {
      width: 88%;
    }
    @media screen and (max-width: 1680px) {
      .el-input {
        width: 80%;
      }
    }
    .el-button {
      position: absolute;
      right: 0;
    }
  }
}
.form-map {
  float: left;
  width: 60%;
  height: 400px;
  .map_local_search {
    z-index: 4;
    width: 18%;
    position: absolute;
    top: 83px;
    right: -180px;
  }
}
.dept-list {
  .el-input__inner,
  .el-input__suffix {
    cursor: pointer;
  }
}
.edit-map {
  float: left;
  width: 100%;
  height: 280px;
}
</style>
