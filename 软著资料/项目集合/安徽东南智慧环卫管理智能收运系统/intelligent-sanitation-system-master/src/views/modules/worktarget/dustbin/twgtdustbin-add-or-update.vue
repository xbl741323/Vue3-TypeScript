<template>
  <el-dialog :visible.sync="visible" width="80%" :title="!dataForm.id ? $t('add') : $t('update')" :close-on-click-modal="false" :close-on-press-escape="false" @close="onDialogClose">
    <div class="dustbin-form-container">
       <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmitHandle()" :label-width="$i18n.locale == 'en-US' ? '80px' : '80px'">
            <el-row>
              <el-col :span="12">
                <el-form-item label="编号" prop="code">
                  <el-input v-model="dataForm.code" placeholder="编号"></el-input>
                </el-form-item>
               </el-col>
              <el-col :span="12">
                <!-- <el-form-item label="名称" prop="name">
                  <el-input v-model="dataForm.name" placeholder="名称"></el-input>
                </el-form-item> -->
                <el-form-item label="所属部门" prop="orgId">
                  <dept-tree v-model="dataForm.orgId" @change="changeOrg" placeholder="请选择"></dept-tree>
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
                <el-form-item label="责任人" prop="manager">
                  <el-input v-model="dataForm.manager" placeholder="责任人"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="容积" prop="capacity">
                  <el-input v-model="dataForm.capacity" placeholder="容积"></el-input>
                </el-form-item>
             </el-col>
              <el-col :span="12">
                <el-form-item label="IFID" prop="ifidCode">
                  <el-input v-model="dataForm.ifidCode" placeholder="电子标签号"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                 <el-form-item label="垃圾类型" prop="dusbinType">
                  <dict-select v-model="dataForm.dusbinType" :dictType="'dustbinType'" @change="changeDustbinType"></dict-select>
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
                <el-form-item label="放置位置">
                  <div style="display:flex">
                      <worktarget-type-select v-model="dataForm.layToWorktargetTypeId" @changeWorktargetType="changeWorktargetType"></worktarget-type-select>
                      <span style="width:10px;"></span>
                      <worktarget-select :worktargetTypeId="dataForm.layToWorktargetTypeId" :worktargetId="dataForm.layToWorktargetId" @changeWorktarget="changeWorktarget"></worktarget-select>
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
    <div class="dustbin-form-map">
          <div>
            <div class="text-btn">
              <el-button v-show="!dragging" type="text" size="small" @click="openDraw">
                开启定位
              </el-button>
              <el-button v-show="dragging" type="text" size="small" @click="closeDraw">
                关闭定位
              </el-button>
            </div>
          </div>
          <div id="dustbin-edit-container" class="dustbin-edit-map">
          </div>
        </div>
    <template slot="footer">
      <div style="height: 280px"></div>
    </template>
  </el-dialog>
</template>

<script>
import debounce from 'lodash/debounce'
import Constants from '@/utils/constants.js'
import AMap from 'AMap'
import dustbinEdited from '@/assets/img/dustbinEdited.gif'
import dustbinEditing from '@/assets/img/dustbinEditing.gif'
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
        worktargetTypeId: '18',
        orgId: '',
        manager: '',
        lat: '',
        lng: '',
        plftype: '1',
        ifidCode: '',
        capacity: '',
        dusbinType: '',
        layToWorktargetId: '',
        layToWorktargetTypeId: '',
        status: '',
        description: '',
        creator: '',
        createDate: '',
        updater: '',
        updateDate: ''
      },
      searchOption: Constants.searchOption,
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
        return this.dragging ? dustbinEditing : dustbinEdited
      }
    },
    showMarker () {
      console.log(this.marker.position)
      return this.marker.position.length == 2
    }
  },
  methods: {
    initMap () {
      var editAmap = new AMap.Map('dustbin-edit-container', {
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
    // 获取信息
    getInfo () {
      this.$http.get('/worktarget/twgtdustbin/' + this.dataForm.id).then(({ data: res }) => {
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
    openDraw () {
      this.dragging = !this.dragging
      if (this.marker) {
        this.marker.setDraggable(true)
        this.marker.setIcon(dustbinEditing)
      }
    },
    closeDraw () {
      console.log(this.marker)
      this.markerObj.lat = this.marker.getPosition().lat
      this.markerObj.lng = this.marker.getPosition().lng
      this.dataForm.lng = this.marker.getPosition().lng
      this.dataForm.lat = this.marker.getPosition().lat
      this.marker.setDraggable(false)
      this.marker.setIcon(dustbinEdited)
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
        icon: this.dragging ? dustbinEditing : dustbinEdited,
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
    changeCleanType (cleanType) {
      this.dataForm.cleanType = cleanType.dictValue
    },
    changeDustbinType (dustbinType) {
      this.dataForm.dustbinType = dustbinType.dictValue
    },
    changeWorktarget (worktarget) {
      if (worktarget) {
        this.dataForm.layToWorktargetId = worktarget.id
      } else {
        this.dataForm.layToWorktargetId = ''
      }
    },
    changeWorktargetType (worktargetType) {
      if (worktargetType) {
        this.dataForm.layToWorktargetTypeId = worktargetType.id
      } else {
        this.dataForm.layToWorktargetTypeId = ''
      }
      this.dataForm.layToWorktargetId = ''
    },
    // 表单提交
    dataFormSubmitHandle: debounce(function () {
      this.$refs['dataForm'].validate((valid) => {
        if (!valid) {
          return false
        }
        this.$http[!this.dataForm.id ? 'post' : 'put']('/worktarget/twgtdustbin/', this.dataForm).then(({ data: res }) => {
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
.dustbin-form-container {
  background-color: white;
  width: 60%;
  height: 280px;
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
.dustbin-form-map {
  float: left;
  width: 40%;
  height: 280px;
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
.dustbin-edit-map {
  float: left;
  width: 100%;
  height: 280px;
}
.search-box {
  width: 120px;
  height: 20px;
}
</style>
