<!-- GPS定位管理 -->
<template>
  <el-dialog width="80%" :visible.sync="visible" :title="worktargetTypeName + (!dataForm.id ? $t('add') : $t('update'))"
    :close-on-click-modal="false" :close-on-press-escape="false">
    <div class="commonarea-edit-mian">
      <div class="commonarea-form-container">
        <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmitHandle()"
          :label-width="$i18n.locale === 'en-US' ? '120px' : '80px'">
          <el-row>
            <el-col :span="12">
              <el-form-item label="名称" prop="name">
                <el-input v-model="dataForm.name" placeholder="名称"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="面积" prop="area">
                <el-input :readonly="true" v-model="dataForm.area" placeholder="面积">
                  <template slot="append" v-if="areaUnit != ''">{{ areaUnit }}</template>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="所属部门" prop="orgId">
                <dept-tree v-model="dataForm.orgId" @change="changeOrg" placeholder="请选择"></dept-tree>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="建造单位" prop="buildUnit">
                <el-input v-model="dataForm.buildUnit" placeholder="建造单位"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="联系人" prop="contacts">
                <el-input v-model="dataForm.contacts" placeholder="联系人"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="联系电话" prop="contactTel">
                <el-input v-model="dataForm.contactTel" placeholder="联系人电话"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="地址" prop="address">
                <el-input v-model="dataForm.address" placeholder="地址"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24" style="text-align:center;">
              <el-button @click="visible = false">{{ $t('cancel') }}</el-button>
              <el-button type="primary" @click="dataFormSubmitHandle()">{{ $t('confirm') }}</el-button>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div class="commonarea-form-map">
        <div id="commonarea-edit-container" class="commonarea-edit-map">
          <div class="text-btn">
            <el-button v-show="!dragging" type="primary" size="small" @click="openDraw">
              开启定位
            </el-button>
            <el-button v-show="dragging" type="primary" size="small" @click="closeDraw">
              关闭定位
            </el-button>
          </div>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import debounce from 'lodash/debounce'
import AMap from 'AMap'
export default {
  data() {
    let self = this
    return {
      visible: false,
      worktargetTypeName: '',
      worktargetTypeId: '',
      dataForm: {
        id: '',
        name: '',
        worktargetTypeId: '',
        address: '',
        lng: '',
        lat: '',
        area: '',
        geoinfo: '',
        plftype: '3',
        orgId: '',
        districtCode: '',
        buildUnit: '',
        contacts: '',
        contactTel: '',
        creater: '',
        createDate: '',
        updater: '',
        updateDate: ''
      },
      dragging: false,
      editAmap: {},
      polyEditor: {},
      polygonObj: {},
      polygon: '',
      areaUnit: '',
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
      }
    }
  },
  computed: {
    dataRule() {
      return {
        worktargetTypeId: [{ required: true, message: this.$t('validate.required'), trigger: 'blur,change' }],
        name: [{ required: true, message: this.$t('validate.required'), trigger: 'blur' }],
        address: [{ required: true, message: this.$t('validate.required'), trigger: 'blur' }],
        orgId: [{ required: true, message: this.$t('validate.required'), trigger: 'blur,change' }]
      }
    }
  },
  methods: {
    initMap() {
      var editAmap = new AMap.Map('commonarea-edit-container', {
        ...this.mapConfig
      })
      let selft = this
      this.editAmap = editAmap
      this.createPolyEditor(editAmap)
    },
    init() {
      this.visible = true
      this.$nextTick(() => {
        this.initMap()
        this.$refs['dataForm'].resetFields()
        if (this.dataForm.id) {
          this.getInfo()
        }
      })
    },
    createPolyEditor(editAmap) {
      this.polyEditor = new AMap.PolygonEditor(editAmap)
      let self = this
      this.polyEditor.on('add', function (data) {
        var polygon = data.target
        self.polyEditor.addAdsorbPolygons(polygon)
        polygon.on('dblclick', () => {
          self.polyEditor.setTarget(polygon)
          self.polyEditor.open()
        })
      })
      this.polyEditor.on('end', function (event) {
        console.log(event)
      })
    },
    // 获取信息
    getInfo() {
      this.$http.get('/worktarget/twgtworktargetcommonarea/' + this.dataForm.id).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.dataForm = {
          ...this.dataForm,
          ...res.data
        }
        this.polygonObj = {
          ...this.dataForm
        }
        this.polygonObj.position = [this.polygonObj.geoCenter.lng, this.polygonObj.geoCenter.lat]
        this.polygonObj.path = []
        var geoPointList = this.polygonObj.geoPointList
        for (var l = 0; l < geoPointList.length; l++) {
          var point = [geoPointList[l].lng, geoPointList[l].lat]
          this.polygonObj.path.push(point)
        }
        this.polygon = this.createPolygon(this.polygonObj)
        this.editAmap.setFitView([this.polygon])
      }).catch(() => { })
    },
    changeOrg(org) {
      this.dataForm.orgId = org.id
    },
    getGeoInfo(polygonObj) {
      var path = polygonObj.path
      var geoinfo = ''
      for (var i = 0; i < path.length; i++) {
        var pathPoint = path[i]
        geoinfo += pathPoint.lat + '_' + pathPoint.lng + 'P'
      }
      return geoinfo
    },
    createPolygon(polygonObj) {
      var polygon = new AMap.Polygon({
        map: this.editAmap,
        path: polygonObj.path,
        extData: polygonObj,
        fillColor: 'blue'
      })
      return polygon
    },
    openDraw() {
      this.dragging = !this.dragging
      this.polyEditor.close()
      if (this.polygonObj.path && this.polygonObj.path.length >= 3) {
        this.polyEditor.setTarget(this.polygon)
      } else {
        this.polyEditor.setTarget()
      }

      this.polyEditor.open()
    },
    closeDraw() {
      this.dragging = false
      var polygon = this.polyEditor.getTarget()
      this.polygonObj.path = polygon.getPath()
      this.dataForm.area = AMap.GeometryUtil.ringArea(this.polygonObj.path)
      console.log(this.dataForm.area)
      if (this.dataForm.area > 1000) {
        this.dataForm.area = this.dataForm.area / 1000000
        this.areaUnit = '平方公里'
      } else {
        this.areaUnit = '平方米'
      }
      this.dataForm.area = this.dataForm.area.toFixed(2)
      var geoinfo = this.getGeoInfo(this.polygonObj)
      this.dataForm.geoinfo = geoinfo
      polygon.remove()
      this.drawPolygon(this.polygonObj)
      this.polyEditor.close()
    },
    drawPolygon(polygonObj) {
      this.polygon = this.createPolygon(polygonObj)
      this.editAmap.add(this.polygon)
    },
    onSearchResult(pois) {
      if (pois.length > 0) {
        this.$nextTick(() => {
          this.$refs.searchBox.keyword = pois[0].name
        })
      }
      // 这边类似模糊查询 会返回一个数组，我就直接取第一个值了。
      this.map.center = [pois[0].lng, pois[0].lat]
    },
    onDialogClose() {
      if (this.editAmap) {
        this.editAmap.destroy()
        this.editAmap = ''
      }
    },
    // 表单提交
    dataFormSubmitHandle: debounce(function () {
      this.$refs['dataForm'].validate((valid) => {
        if (!valid) {
          return false
        }
        if (this.dataForm.geoinfo == '') {
          this.$message({
            message: '请编辑地理信息',
            type: 'error',
            duration: 1000
          })
          return false
        }
        this.$http[!this.dataForm.id ? 'post' : 'put']('/worktarget/twgtworktargetcommonarea/', this.dataForm).then(({ data: res }) => {
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
        }).catch(() => { })
      })
    }, 1000, { 'leading': true, 'trailing': false })
  }
}
</script>
<style lang="scss">
.commonarea-edit-mian {
  height: 100%;
  width: 100%;
  display: inline-flex;
}

.commonarea-form-container {
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

.commonarea-form-map {
  width: 40%;
  height: 100%;
  display: table-cell;

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

.commonarea-edit-map {
  width: 100%;
  height: 65vh;

  .text-btn {
    position: absolute;
    top: 10px;
    right: 0;
    left: 10px;
    float: left;
    z-index: 10;
  }
}</style>
