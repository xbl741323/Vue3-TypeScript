<template>
  <el-dialog :visible.sync="visible" :title="!dataForm.id ? $t('add') : $t('update')" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmitHandle()" :label-width="$i18n.locale === 'en-US' ? '120px' : '120px'">
        <el-row>
          <el-col :span="12">
            <el-form-item label="姓名" prop="name">
              <el-input v-model="dataForm.name" placeholder="姓名"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
             <el-form-item label="身份证号" prop="identification">
              <el-input v-model="dataForm.identification" placeholder="身份证号"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
             <el-form-item label="部门" prop="departId">
              <dept-tree v-model="dataForm.departId"></dept-tree>
            </el-form-item>
            </el-col>
          <el-col :span="12">
            <el-form-item label="人员类型" prop="type">
              <worker-type-select v-model="dataForm.type" @changeWorkerType="changeWorkerType"></worker-type-select>
            </el-form-item>
             </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="性别" prop="sex">
              <el-radio-group v-model="dataForm.sex">
                <el-radio :label="0">女</el-radio>
                <el-radio :label="1">男</el-radio>
              </el-radio-group>
            </el-form-item>
           </el-col>
          <el-col :span="12">
            <el-form-item label="电话" prop="telephone">
              <el-input v-model="dataForm.telephone" placeholder="电话"></el-input>
            </el-form-item>
             </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="年龄" prop="age">
              <el-input v-model="dataForm.age" placeholder="年龄"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="紧急联系电话" prop="urgenttel">
              <el-input v-model="dataForm.urgenttel" placeholder="紧急联系电话"></el-input>
            </el-form-item>
            </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="民族" prop="nation">
              <el-input v-model="dataForm.nation" placeholder="民族"></el-input>
            </el-form-item>
            </el-col>
          <el-col :span="12">
            <el-form-item label="入职日期" prop="entrydate">
              <el-date-picker
                style="width:160px;"
                v-model="dataForm.entrydate"
                value-format="yyyy-MM-dd"
                type="date"
                placeholder="选择日期">
              </el-date-picker>
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
      dataForm: {
        id: '',
        name: '',
        departId: '',
        telephone: '',
        type: '',
        sex: '',
        identification: '',
        age: '',
        urgenttel: '',
        nation: '',
        entrydate: '',
        creator: '',
        createDate: '',
        updater: '',
        updateDate: ''
      }
    }
  },
  computed: {
    dataRule () {
      return {
        departId: [{ required: true, message: this.$t('validate.required'), trigger: 'blur,change' }],
        type: [{ required: true, message: this.$t('validate.required'), trigger: 'blur' }],
        name: [{ required: true, message: this.$t('validate.required'), trigger: 'blur' }]
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
      this.$http.get('/zhhw-worker/twkrworker/' + this.dataForm.id).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.dataForm = {
          ...this.dataForm,
          ...res.data
        }
      }).catch(() => {})
    },
    changeWorkerType (workerType) {
      if (workerType) {
        this.dataForm.type = workerType.id
      } else {
        this.dataForm.type = ''
      }
    },
    // 表单提交
    dataFormSubmitHandle: debounce(function () {
      this.$refs['dataForm'].validate((valid) => {
        if (!valid) {
          return false
        }
        this.$http[!this.dataForm.id ? 'post' : 'put']('/zhhw-worker/twkrworker/', this.dataForm).then(({ data: res }) => {
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
