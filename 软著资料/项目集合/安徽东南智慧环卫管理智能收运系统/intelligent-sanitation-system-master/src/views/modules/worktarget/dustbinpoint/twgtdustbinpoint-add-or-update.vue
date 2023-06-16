<template>
  <el-dialog :visible.sync="visible"  width="80%"  :title="!dataForm.id ? $t('add') : $t('update')" :close-on-click-modal="false" :close-on-press-escape="false" @close="onDialogClose">
    <div class="dustbinpoint-edit-mian">
      <div class="dustbinpoint-form-container">
        <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmitHandle()" :label-width="$i18n.locale == 'en-US' ? '80px' : '80px'">
              <el-row>
                <el-col :span="12">
                  <el-form-item label="编号" prop="code">
                    <el-input v-model="dataForm.code" placeholder="编号"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="名称" prop="name">
                    <el-input v-model="dataForm.name" placeholder="名称"></el-input>
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
                  <el-form-item label="责任人" prop="manager">
                    <el-input v-model="dataForm.manager" placeholder="责任人"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="地址" prop="address">
                    <el-input v-model="dataForm.address" placeholder="地址"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="电话" prop="tel">
                    <el-input v-model="dataForm.tel" placeholder="电话"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="产出量" prop="output">
                    <el-input v-model="dataForm.output" placeholder="预计产出量"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="清运方式">
                    <dict-select v-model="dataForm.cleanType" :dictType="'cleanType'" @change="changeCleanType"></dict-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item label="垃圾运向" prop="output">
                    <div style="display:flex">
                        <worktarget-type-select v-model="dataForm.cleanToWorktargetTypeId" @changeWorktargetType="changeWorktargetType"></worktarget-type-select>
                        <span style="width:10px;"></span>
                        <worktarget-select :worktargetTypeId="dataForm.cleanToWorktargetTypeId" :worktargetId="dataForm.cleanToWorktargetId" @changeWorktarget="changeWorktarget"></worktarget-select>
                    </div>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item label="备注" prop="description">
                    <el-input v-model="dataForm.description" placeholder="备注"></el-input>
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
      <div class="dustbinpoint-form-map">
            <div id="dustbinpoint-edit-container" class="dustbinpoint-edit-map">
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
import dustbinpointEdited from '@/assets/img/dustbinpointEdited.png'
import dustbinpointEditing from '@/assets/img/dustbinpointEditing.png'
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
        worktargetTypeId: '21',
        orgId: '',
        lat: '',
        lng: '',
        plftype: '1',
        manager: '',
        tel: '',
        output: '',
        status: '',
        cleanToWorktargetTypeId: '',
        cleanToWorktargetId: '',
        cleanToRelationid: ''
      },
      dragging: false,
      editAmap: '',
      markerEditor: {},
      markerObj: {},
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
  components: {
  },
  computed: {
    dataRule () {
      return {
        worktargetTypeId: [{ required: true, message: this.$t('validate.required'), trigger: 'blur,change' }],
        code: [{ required: true, message: this.$t('validate.required'), trigger: 'blur' }],
        name: [{ required: true, message: this.$t('validate.required'), trigger: 'blur' }],
        address: [{ required: true, message: this.$t('validate.required'), trigger: 'blur' }],
        orgId: [{ required: true, message: this.$t('validate.required'), trigger: 'blur,change' }]
      }
    },
    markerImg () {
      return () => {
        return this.dragging ? dustbinpointEditing : dustbinpointEdited
      }
    },
    showMarker () {
      console.log(this.marker.position)
      return this.marker.position.length == 2
    }
  },
  methods: {
    initMap () {
      var editAmap = new AMap.Map('dustbinpoint-edit-container', {
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
        if (this.dataForm.id) {
          this.getInfo()
        }
      })
    },
    addMarker (lng, lat) {
      if (!this.marker) {
        this.createMarker(lng, lat)
      }
    },
    // 获取信息
    getInfo () {
      this.$http.get('/worktarget/twgtdustbinpoint/' + this.dataForm.id).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.dataForm = {
          ...this.dataForm,
          ...res.data
        }
        if (!this.marker) {
          this.marker = {}
        }
        this.marker.position = [res.data.lng, res.data.lat]
        this.createMarker(this.marker.position[0], this.marker.position[1])
      }).catch(() => {})
    },
    changeOrg (org) {
      this.dataForm.orgId = org.id
    },
    changeCleanType (cleanType) {
      this.dataForm.cleanType = cleanType.dictValue
    },
    changeWorktarget (worktarget) {
      if (worktarget) {
        this.dataForm.cleanToWorktargetId = worktarget.id
      } else {
        this.dataForm.cleanToWorktargetId = ''
      }
    },
    changeWorktargetType (worktargetType) {
      if (worktargetType) {
        this.dataForm.cleanToWorktargetTypeId = worktargetType.id
      } else {
        this.dataForm.cleanToWorktargetTypeId = ''
      }
      this.dataForm.cleanToWorktargetId = ''
    },
    openDraw () {
      this.dragging = !this.dragging
      if (this.marker) {
        this.marker.setDraggable(true)
        this.marker.setIcon(dustbinpointEditing)
      }
    },
    closeDraw () {
      console.log(this.marker)
      this.markerObj.lat = this.marker.getPosition().lat
      this.markerObj.lng = this.marker.getPosition().lng
      this.dataForm.lng = this.marker.getPosition().lng
      this.dataForm.lat = this.marker.getPosition().lat
      this.marker.setDraggable(false)
      this.marker.setIcon(dustbinpointEdited)
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
    createMarker (lng, lat) {
      var marker = new AMap.Marker({
        icon: this.dragging ? dustbinpointEditing : dustbinpointEdited,
        position: [lng, lat],
        draggable: this.dragging,
        map: this.editAmap
      })
      marker.on('dblclick', () => {
        this.marker.setDraggable(false)
        this.closeDraw()
      })
      this.marker = marker
    },
    onDialogClose () {
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
        this.$http[!this.dataForm.id ? 'post' : 'put']('/worktarget/twgtdustbinpoint/', this.dataForm).then(({ data: res }) => {
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
.dustbinpoint-edit-mian {
  height: 100%;
  width: 100%;
  display: inline-flex;
}
.dustbinpoint-form-container {
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
.dustbinpoint-form-map {
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
.dustbinpoint-edit-map {
  width: 100%;
  height: 60vh;
}
.search-box {
  width: 120px;
  height: 20px;
}
</style>
