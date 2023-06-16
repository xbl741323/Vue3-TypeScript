<template>
  <el-dialog :visible.sync="visible" :title="!dataForm.id ? $t('add') : $t('update')" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmitHandle()" :label-width="$i18n.locale === 'en-US' ? '120px' : '100px'">
        <el-row>
          <el-col :span="12">
            <el-form-item label="名称" prop="name">
              <el-input v-model="dataForm.name" placeholder="名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
             <el-form-item label="所属部门" prop="orgId">
              <ren-dept-tree v-model="dataForm.orgId" :deptName="dataForm.orgName" :placeholder="$t('dept.title')" :query="true"></ren-dept-tree>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="建造单位" prop="buildUnit">
              <el-input v-model="dataForm.buildUnit" placeholder="建造单位"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="地址" prop="address">
              <el-input v-model="dataForm.address" placeholder="地址"></el-input>
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
            <el-form-item label="联系人电话" prop="contactTel">
              <el-input v-model="dataForm.contactTel" placeholder="联系人电话"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="管理者" prop="managername">
              <el-input v-model="dataForm.managername" placeholder="管理者"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="管理者电话" prop="managertel">
              <el-input v-model="dataForm.managertel" placeholder="管理者电话"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="公厕类型" prop="type">
              <!-- <el-input v-model="dataForm.type" placeholder="公厕类型"></el-input> -->
              <el-select v-model="dataForm.type" placeholder="请选择">
                <el-option v-for="item in toiletTypeList" :key="item.dictLabel" :label="item.dictLabel" :value="item.dictLabel"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="公厕样式" prop="style">
              <!-- <el-input v-model="dataForm.style" placeholder="公厕样式"></el-input> -->
              <el-select v-model="dataForm.style" placeholder="请选择">
                <el-option v-for="item in toiletStyleList" :key="item.dictLabel" :label="item.dictLabel" :value="item.dictLabel"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="男蹲位" prop="gentsquatcount">
              <el-input v-model="dataForm.gentsquatcount" placeholder="男蹲位"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="站位数" prop="erectcount">
              <el-input v-model="dataForm.erectcount" placeholder="站位数"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="女蹲位" prop="ladysquatcount">
              <el-input v-model="dataForm.ladysquatcount" placeholder="女蹲位"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="面积" prop="area">
              <el-input v-model="dataForm.area" placeholder="面积"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
    </el-form>
    <template slot="footer">
      <el-button @click="visible = false">{{ $t('cancel') }}</el-button>
      <el-button type="primary" @click="dataFormSubmitHandle()">{{ $t('confirm') }}</el-button>
    </template>
  </el-dialog>
</template>

<script>
import debounce from 'lodash/debounce'
export default {
  data () {
    return {
      visible: false,
      toiletTypeList: [],
      toiletStyleList: [],
      dataForm: {
        id: '',
        name: '',
        worktargetTypeId: '2',
        address: '',
        lng: '',
        lat: '',
        area: '',
        geoinfo: '',
        orgId: '',
        orgName: '',
        districtCode: '',
        buildUnit: '',
        contacts: '',
        contactTel: '',
        managername: '',
        managertel: '',
        type: '',
        style: '',
        gentsquatcount: '',
        erectcount: '',
        ladysquatcount: '',
        deviceCode: ''
      }
    }
  },
  computed: {
    dataRule () {
      return {
        name: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        address: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        orgId: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    init () {
      this.visible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        if (this.dataForm.id) {
          this.getInfo()
        }
      })
    },
    // 获取信息
    getInfo () {
      this.$http.get('/worktarget/publictoilet/' + this.dataForm.id).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.dataForm = {
          ...this.dataForm,
          ...res.data
        }
      }).catch(() => {})
    },
    // 表单提交
    dataFormSubmitHandle: debounce(function () {
      this.$refs['dataForm'].validate((valid) => {
        if (!valid) {
          return false
        }
        this.$http[!this.dataForm.id ? 'post' : 'put']('/worktarget/publictoilet/', this.dataForm).then(({ data: res }) => {
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
    }, 1000, { 'leading': true, 'trailing': false }),
    getDictTypeList () {
      this.$http.get('/sys/dict/data/getDictData4DictType', { params: { dictType: 'toiletType' } }).then(({ data: res }) => {
        if (res.code === 0) {
          this.toiletTypeList = res.data
        }
      })
    },
    getDictStyleList () {
      this.$http.get('/sys/dict/data/getDictData4DictType', { params: { dictType: 'toiletStyle' } }).then(({ data: res }) => {
        if (res.code === 0) {
          this.toiletStyleList = res.data
        }
      })
    }
  },
  mounted () {
    this.getDictTypeList()
    this.getDictStyleList()
  }
}
</script>
