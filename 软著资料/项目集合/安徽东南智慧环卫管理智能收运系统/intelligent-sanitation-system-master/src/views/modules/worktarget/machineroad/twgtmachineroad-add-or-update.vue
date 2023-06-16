<template>
  <el-dialog :visible.sync="visible" :title="!dataForm.id ? $t('add') : $t('update')" :close-on-click-modal="false" :close-on-press-escape="false">
    <div class="machineroad-edit-main">
      <div class="machineroad-form-container">
        <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmitHandle()" :label-width="$i18n.locale === 'en-US' ? '120px' : '80px'">
          <el-row>
            <el-col :span="12">
              <el-form-item label="名称" prop="name">
                <el-input v-model="dataForm.name" placeholder="名称"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="所属部门" prop="orgId">
                <dept-tree v-model="dataForm.orgId" @change="changeOrg" placeholder="请选择"></dept-tree>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="长度" prop="length">
                <el-input :readonly="true" v-model="dataForm.length" placeholder="长度">
                  <template slot="append">公里</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="宽度" prop="width">
                <el-input v-model="dataForm.width" >
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24" style="text-align:center;">
                <el-button @click="visible = false">{{ $t('cancel') }}</el-button>
                <el-button :disabled="dragging" type="primary" @click="dataFormSubmitHandle()">{{ $t('confirm') }}</el-button>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div class="machineroad-form-map">
        <div>
          <div class="text-btn">
            <el-button v-show="!dragging" type="primary" size="small" @click="openDraw">
              开启定位
            </el-button>
            <el-button v-show="dragging" type="primary" size="small" @click="closeDraw">
              关闭定位
            </el-button>
          </div>
        </div>
        <div id="machineroad-edit-container" class="machineroad-edit-map">
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import debounce from 'lodash/debounce'
import AMap from 'AMap'
import { validatePositiveFloatNumber } from '@/utils/rules'
export default {
  data () {
    let self = this
    return {
      visible: false,
      dataForm: {
        id: '',
        code: '',
        name: '',
        address: '',
        worktargetTypeId: '1',
        orgId: '',
        manager: '',
        lat: '',
        lng: '',
        plftype: '2',
        length: '',
        width: '',
        description: '',
        creator: '',
        createDate: '',
        updater: '',
        updateDate: '',
        nodeList: [],
        editedNode: '0'
      },
      dragging: false,
      editAmap: '',
      polylineEditor: '',
      marker: '',
      markerObj: {
        ...this.dataForm,
        path: [],
        position: []
      },
      mapConfig: {
        center: [116.404, 39.915],
        zoom: 9,
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
        name: [{ required: true, message: this.$t('validate.required'), trigger: 'blur' }],
        orgId: [{ required: true, message: this.$t('validate.required'), trigger: 'blur,change' }],
        length: [{ required: true, message: this.$t('validate.required'), trigger: 'blur' }],
        width: [{ required: true, message: this.$t('validate.required'), trigger: 'blur' },
          { validator: validatePositiveFloatNumber, trigger: 'blur', required: true }
        ]
      }
    }
  },
  methods: {
    initMap () {
      var editAmap = new AMap.Map('machineroad-edit-container', {
        ...this.mapConfig
      })
      this.editAmap = editAmap
    },
    init () {
      this.visible = true
      this.$nextTick(() => {
        this.polylineEditor = ''
        this.marker = ''
        this.markerObj = {
          ...this.dataForm,
          path: [],
          position: []
        }
        if (!this.editAmap) {
          this.initMap()
        }
        this.editAmap.clearMap()
        this.$refs['dataForm'].resetFields()
        if (this.dataForm.id) {
          this.getInfo()
        }
      })
    },
    // 获取信息
    getInfo () {
      this.$http.get('/worktarget/twgtmachineroad/' + this.dataForm.id).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.dataForm = {
          ...this.dataForm,
          ...res.data
        }
        var markerObj = {
          ...this.dataForm,
          position: [this.dataForm.lng, this.dataForm.lat]
        }
        this.markerObj = markerObj
        this.markerObj.position = [this.markerObj.geoCenter.lng, this.markerObj.geoCenter.lat]
        this.markerObj.path = []
        var linePointList = this.markerObj.geoPointList
        for (var i = 0; i < linePointList.length; i++) {
          var linePoint = [linePointList[i].lng, linePointList[i].lat]
          this.markerObj.path.push(linePoint)
        }
        this.createPolyline(this.markerObj)
        this.editAmap.setFitView()
      }).catch(() => {})
    },
    createPolyline (markerObj) {
      var marker = new AMap.Polyline({
        path: markerObj.path,
        strokeColor: 'blue',
        strokeWeight: 3,
        strokeOpacity: 0.5,
        map: this.editAmap
      })
      this.marker = marker
    },
    openDraw () {
      this.dragging = !this.dragging
      // if (this.marker) {
      //   this.marker.remove()
      // }
      if (!this.polylineEditor) {
        this.createPolylineEditor(this.editAmap)
      }
      this.polylineEditor.open()
    },
    createPolylineEditor (editAmap, markerObj) {
      var polylineEditor = new AMap.PolylineEditor(editAmap, this.marker)
      var self = this
      polylineEditor.on('add', function (data) {
        var polyline = data.target
        self.marker = polyline
      })
      polylineEditor.on('addnode', function (data) {
        self.dataForm.editedNode = 1
      })
      polylineEditor.on('adjust', function (data) {
        self.dataForm.editedNode = 1
      })
      polylineEditor.on('removenode', function (data) {
        self.dataForm.editedNode = 1
      })
      this.polylineEditor = polylineEditor
    },
    getGeoInfo (polyObj) {
      var path = polyObj.path
      var geoinfo = ''
      this.dataForm.nodeList = []
      var length = 0
      for (var i = 0; i < path.length; i++) {
        var pathPoint = path[i]
        geoinfo += pathPoint.lat + '_' + pathPoint.lng + 'P'
        var node = {
          nodeLat: pathPoint.lat,
          nodeLng: pathPoint.lng,
          nodePlace: '',
          distance: 0
        }
        if (i != 0) {
          var prePathNode = path[i - 1]
          var curPathNode = path[i]
          var distance = AMap.GeometryUtil.distance(prePathNode, curPathNode)
          node.distance = distance
          length += distance
        }
        this.getPositionByLonLat(node)
        this.dataForm.nodeList.push(node)
      }
      console.log(this.dataForm.nodeList)
      length = (length / 1000).toFixed(3)
      this.dataForm.length = length
      return geoinfo
    },
    closeDraw () {
      console.log(this.marker)
      var polyline = this.polylineEditor.getTarget()
      if (polyline) {
        this.markerObj.path = polyline.getPath()
        this.dataForm.geoinfo = this.getGeoInfo(this.markerObj)
        polyline.remove()
        this.createPolyline(this.markerObj)
        this.polylineEditor.close()
      }
      this.dragging = false
    },
    changeOrg (org) {
      this.dataForm.orgId = org.id
    },
    onDialogClose () {
      if (this.editAmap) {
        this.editAmap.destroy()
        this.editAmap = ''
      }
    },
    getPositionByLonLat (node) {
      var lnglatXY = [node.lng, node.lat] // 地图上所标点的坐标
      let geocoder = new AMap.Geocoder({})
      geocoder.getAddress(lnglatXY, function (status, result) {
        if (status === 'complete' && result.info === 'OK') {
          node.address = result.regeocode.formattedAddress
        } else {
          console.log('error')
        }
      })
    },
    // 表单提交
    dataFormSubmitHandle: debounce(function () {
      this.$refs['dataForm'].validate((valid) => {
        if (!valid) {
          return false
        }
        this.$http[!this.dataForm.id ? 'post' : 'put']('/worktarget/twgtmachineroad/', this.dataForm).then(({ data: res }) => {
          if (res.code !== 0) {
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
    }, 1000, { 'leading': true, 'trailing': false })
  }
}
</script>
<style lang="scss">
.machineroad-edit-main {
  height: 100%;
  width: 100%;
  // display: inline-flex;
}
.machineroad-form-container {
  background-color: white;
  width: 100%;
  // display: table-cell;
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
.machineroad-form-map {
  margin-top: 10px;
  width: 100%;
  .text-btn {
      position: relative;
      top: 40px;
      right: 0;
      left: 10px;
      float: left;
      z-index: 10;
  }
}
.dept-list {
  .el-input__inner,
  .el-input__suffix {
    cursor: pointer;
  }
}
.machineroad-edit-map {
  width: 100%;
  height: 50vh;
}
.search-box {
  width: 120px;
  height: 20px;
}
.machineroad-route {
  margin-top: 10px;
  max-height: 300px;
  overflow: hidden;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  white-space: nowrap;
}

</style>
