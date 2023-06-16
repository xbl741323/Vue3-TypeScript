<template>
  <el-dialog :visible.sync="visible" width="80%"  :title="!dataForm.id ? $t('add') : $t('update')" :close-on-click-modal="false" :close-on-press-escape="false"  @close="onDialogClose">
    <div class="dustbinroad-edit-main">
      <div class="dustbinroad-form-container">
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
                  <el-form-item label="里程数" prop="length">
                    <el-input :readonly="true" v-model="dataForm.length" placeholder="里程数">
                      <template slot="append">公里</template>
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="运行时长" prop="times">
                    <el-input :readonly="true" v-model="timeStr" >
                    </el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-form-item label="起点" prop="startWorktargetId">
                    <div style="display:flex">
                        <worktarget-type-select v-model="dataForm.startWorktargetTypeId" @changeWorktargetType="changeStartWorktargetType"></worktarget-type-select>
                        <span style="width:10px;"></span>
                        <worktarget-select :worktargetTypeId="dataForm.startWorktargetTypeId" :worktargetId="dataForm.startWorktargetId" @changeWorktarget="changeStartWorktarget"></worktarget-select>
                    </div>
                  </el-form-item>
              </el-row>
              <el-row>
                <el-form-item label="终点" prop="endWorktargetId">
                    <div style="display:flex">
                        <worktarget-type-select v-model="dataForm.endWorktargetTypeId" @changeWorktargetType="changeEndWorktargetType"></worktarget-type-select>
                        <span style="width:10px;"></span>
                        <worktarget-select :worktargetTypeId="dataForm.endWorktargetTypeId" :worktargetId="dataForm.endWorktargetId" @changeWorktarget="changeEndWorktarget"></worktarget-select>
                    </div>
                  </el-form-item>
              </el-row>
              <el-row>
                  <el-col :span="24" style="text-align:center;">
                    <el-button @click="visible = false">{{ $t('cancel') }}</el-button>
                    <el-button :disabled="optimalRouteEnable" @click="calcOptimalRoute">生成路线图</el-button>
                    <el-button type="primary" @click="dataFormSubmitHandle()">{{ $t('confirm') }}</el-button>
                  </el-col>
              </el-row>
              <clean-worktarget-transfer :worktargetInfos.sync="dataForm.worktargetInfos" @change="changeWorktargetInfos"></clean-worktarget-transfer>
          </el-form>
        </div>
        <div class="dustbinroad-form-map">
          <div id="dustbinroad-edit-container" class="dustbinroad-edit-map">
          </div>
        </div>
    </div>
    <div id="dustbinroad-route" class="dustbinroad-route">

    </div>
    <div id="dustbinroad-route2" class="dustbinroad-route">

    </div>
  </el-dialog>
</template>

<script>
import debounce from 'lodash/debounce'
import AMap from 'AMap'
import dustbinpointEdited from '@/assets/img/dustbinpointEdited.png'
import institutionEdited from '@/assets/img/institutionEdited.png'
import shopEdited from '@/assets/img/shopEdited.png'
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
        length: '',
        times: '',
        plftype: '2',
        startWorktargetTypeId: '',
        startWorktargetId: '',
        endWorktargetTypeId: '',
        endWorktargetId: '',
        description: '',
        creator: '',
        createDate: '',
        updater: '',
        updateDate: '',
        worktargetInfos: []
      },
      hour: '0',
      minute: '0',
      timeStr: '',
      dragging: false,
      startWorktarget: '',
      endWorktarget: '',
      viewWorktargetInfoArray: [],
      editAmap: '',
      driving: '',
      markerEditor: {},
      markerObj: {},
      marker: '',
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
        orgId: [{ required: true, message: this.$t('validate.required'), trigger: 'blur,change' }]
      }
    },
    optimalRouteEnable () {
      return this.viewWorktargetInfoArray.length < 1 || !this.startWorktarget || !this.endWorktarget
    }
  },
  methods: {
    initMap () {
      var editAmap = new AMap.Map('dustbinroad-edit-container', {
        ...this.mapConfig
      })
      editAmap.on('click', (e) => {
        if (!this.marker && this.dragging) {
          this.addMarker(e.lnglat.lng, e.lnglat.lat)
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
        this.editAmap.clearMap()
        this.$refs['dataForm'].resetFields()
        this.dataForm.worktargetInfos = []
        if (this.dataForm.id) {
          this.getInfo()
        }
      })
    },
    // 获取信息
    getInfo () {
      this.$http.get('/worktarget/twgtdustbinroad/' + this.dataForm.id).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.dataForm = {
          ...this.dataForm,
          ...res.data
        }
        this.startWorktarget = res.data.startWorktarget
        this.endWorktarget = res.data.endWorktarget
        this.$nextTick(() => {
          console.log(this.viewWorktargetInfoArray)
          this.calcOptimalRoute()
        })
      }).catch(() => {})
    },
    changeWorktargetInfos (viewWorktargetInfoArray) {
      this.viewWorktargetInfoArray = viewWorktargetInfoArray
      this.editAmap.clearMap()
      if (viewWorktargetInfoArray.length > 0) {
        for (var i = 0; i < viewWorktargetInfoArray.length; i++) {
          var worktargetInfo = viewWorktargetInfoArray[i]
          this.addMarker(worktargetInfo)
        }
      }
    },
    addMarker (worktargetInfo) {
      var icon = ''
      if (worktargetInfo.type == '21') {
        icon = dustbinpointEdited
      } else if (worktargetInfo.type == '37') {
        icon = institutionEdited
      } else if (worktargetInfo.type == '38') {
        icon = shopEdited
      } else if (worktargetInfo.type == '10') {
        icon = institutionEdited
      }
      var marker = new AMap.Marker({
        icon: dustbinpointEdited,
        position: [worktargetInfo.lng, worktargetInfo.lat],
        draggable: false,
        extData: worktargetInfo,
        map: this.editAmap
      })
      marker.on('click', this.markerClickCallback)
      this.editAmap.setFitView([marker])
    },
    markerClickCallback (e) {
      let marker = e.target.getExtData()
      this.openWindowInfo(marker)
    },
    openWindowInfo (marker) {
      var info = []
      info.push('<p>类型：' + marker.worktargetTypeName + '</p>')
      info.push('<p>名称：' + marker.name + '</p>')
      info.push('<p>部门：' + marker.orgName + '</p>')
      var infoWindow = new AMap.InfoWindow({
        content: info.join('') // 使用默认信息窗体框样式，显示信息内容
      })

      infoWindow.open(this.editAmap, [marker.lng, marker.lat])
    },
    calcOptimalRoute () {
      var startWorktarget = this.startWorktarget
      var endWorktarget = this.endWorktarget
      var waypoints = []
      var waypointsMap = new Map()
      if (this.viewWorktargetInfoArray.length >= 3) {
        for (var i = 0; i < this.viewWorktargetInfoArray.length; i++) {
          var viewWorktargetInfo = this.viewWorktargetInfoArray[i]
          if (viewWorktargetInfo.lng && viewWorktargetInfo.lat) {
            waypoints.push([viewWorktargetInfo.lng, viewWorktargetInfo.lat])
            waypointsMap.set(viewWorktargetInfo.lng + ':' + viewWorktargetInfo.lat, viewWorktargetInfo)
          }
        }
      }
      var that = this
      if (this.driving) {
        this.driving.clear()
      }
      var driving = new AMap.Driving({
        map: this.editAmap,
        policy: AMap.DrivingPolicy.LEAST_DISTANCE,
        showTraffic: false,
        hideMarkers: true,
        panel: 'dustbinroad-route'
      })
      this.driving = driving
      this.driving.search([startWorktarget.lng, startWorktarget.lat],
        [endWorktarget.lng, endWorktarget.lat],
        { waypoints: waypoints },
        function (status, result) {
          console.log(result)
          var steps = result.routes[0].steps
          var length = 0
          var times = 0
          var latlngs = []
          var worktargetViews = []
          for (var i = 0; i < steps.length; i++) {
            var step = steps[i]
            length += step.distance
            times += step.time
            var startLocation = step.start_location
            var endLocation = step.end_location
            if (step.assistant_action == '到达途经地') {
              var currentWaypoint = that.getWaypoint(startLocation, waypoints, step.distance)
              var worktargetView = waypointsMap.get(currentWaypoint)
              worktargetViews.push(worktargetView)
            }
          }
          that.dataForm.length = (length / 1000).toFixed(3)
          that.dataForm.times = times
          that.hour = Math.floor(times / 3600)
          that.minute = Math.round((times % 3600) / 60)
          that.timeStr = that.hour + '小时' + that.minute + '分钟'
          console.log(that.timeStr)
        })
    },
    getWaypoint (waypoint, waypoints, distance) {
      var minDistance = 0
      var minWaypoint = null
      for (var i = 0; i < waypoints.length; i++) {
        var currentWaypoint = waypoints[i]
        var currentDistance = AMap.GeometryUtil.distance(currentWaypoint, waypoint)
        if (currentDistance == distance ||
          ((currentDistance > distance - 10) && (currentDistance < distance + 10))) {
          return currentWaypoint[0] + ':' + currentWaypoint[1]
        } else {
          if (currentDistance < distance) {
            if (minWaypoint) {
              if (minDistance > currentDistance) {
                minDistance = currentDistance
                minWaypoint = currentWaypoint
              }
            } else {
              minDistance = currentDistance
              minWaypoint = currentWaypoint
            }
          }
        }
      }

      if (minWaypoint) {
        return minWaypoint[0] + ':' + minWaypoint[1]
      }
    },
    changeStartWorktarget (worktarget) {
      if (worktarget) {
        this.dataForm.startWorktargetId = worktarget.id
      } else {
        this.dataForm.startWorktargetId = ''
      }
      this.startWorktarget = worktarget
    },
    changeStartWorktargetType (worktargetType) {
      if (worktargetType) {
        this.dataForm.startWorktargetTypeId = worktargetType.id
      } else {
        this.dataForm.startWorktargetTypeId = ''
      }
      this.dataForm.startWorktargetId = ''
    },
    changeEndWorktarget (worktarget) {
      if (worktarget) {
        this.dataForm.endWorktargetId = worktarget.id
      } else {
        this.dataForm.endWorktargetId = ''
      }
      this.endWorktarget = worktarget
    },
    changeEndWorktargetType (worktargetType) {
      if (worktargetType) {
        this.dataForm.endWorktargetTypeId = worktargetType.id
      } else {
        this.dataForm.endWorktargetTypeId = ''
      }
      this.dataForm.endWorktargetId = ''
    },
    changeOrg (org) {
      this.dataForm.orgId = org.id
    },
    onDialogClose () {
      if (this.editAmap) {
        if (this.driving) {
          this.driving.clear()
          this.driving = ''
        }
        this.editAmap.destroy()
        this.editAmap = ''
      }
    },
    // 表单提交
    dataFormSubmitHandle: debounce(function () {
      this.$refs['dataForm'].validate((valid) => {
        console.log(valid)
        if (!valid) {
          return false
        }
        console.log(this.startWorktarget)
        if (!this.startWorktarget) {
          this.$message({
            message: '请选择路线起点',
            type: 'warning',
            duration: 1000
          })
          return false
        }
        console.log(this.endWorktarget)
        if (!this.endWorktarget) {
          this.$message({
            message: '请选择路线终点',
            type: 'warning',
            duration: 1000
          })
          return false
        }
        if (this.viewWorktargetInfoArray.length < 1) {
          this.$message({
            message: '请配置清运垃圾点',
            type: 'warning',
            duration: 1000
          })
          return false
        }
        if (this.dataForm.length == '' || this.dataForm.times == '') {
          this.$message({
            message: '请生成路线图',
            type: 'warning',
            duration: 1000
          })
          return false
        }
        this.$http[!this.dataForm.id ? 'post' : 'put']('/worktarget/twgtdustbinroad/', this.dataForm).then(({ data: res }) => {
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
.dustbinroad-edit-main {
  height: 100%;
  width: 100%;
  display: inline-flex;
}
.dustbinroad-form-container {
  background-color: white;
  width: 60%;
  display: table-cell;
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
.dustbinroad-form-map {
  float: left;
  width: 40%;
  display: table-cell;
  .map_local_search {
    z-index: 4;
    width: 18%;
    position: absolute;
    top: 83px;
    right: -180px;
  }
  .text-btn {
      position: absolute;
      top: 10px;
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
.dustbinroad-edit-map {
  width: 100%;
  height: 90vh;
}
.search-box {
  width: 120px;
  height: 20px;
}
.dustbinroad-route {
  margin-top: 10px;
  max-height: 300px;
  overflow: hidden;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  white-space: nowrap;
}

</style>
