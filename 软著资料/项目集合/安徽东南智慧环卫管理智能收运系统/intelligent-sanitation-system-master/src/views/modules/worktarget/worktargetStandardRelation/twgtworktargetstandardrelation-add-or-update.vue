<template>
  <el-dialog :visible.sync="visible" :title="!dataForm.id ? $t('add') : $t('update')" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmitHandle()" :label-width="$i18n.locale === 'en-US' ? '120px' : '80px'">
        <el-row>
          <el-col :span="12">
            <el-form-item label="设施类型" prop="workTargetTypeId">
              <el-input v-model="worktargetInfo.worktargetTypeName" :readonly="true" placeholder="作业对象类型"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="设施名称" prop="workTargetId">
               <el-input v-model="worktargetInfo.name" :readonly="true" placeholder="作业对象名称"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="作业类型" prop="workTypeCode">
              <worktype-code-select :disabled="true" :worktypeCode="dataForm.workTypeCode"></worktype-code-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="作业标准" prop="workStandardId">
              <work-standard-select v-model="dataForm.workStandardId" :worktypeCode="dataForm.worktypeCode" @changeWorkStandard="changeWorkStandard"></work-standard-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="作业时间" prop="workTimeId">
              <work-time-select v-model="dataForm.workTimeId" @changeWorkTime="changeWorkTime"></work-time-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
             <el-form-item label="作业部门" prop="workDeptId">
              <dept-tree v-model="dataForm.workDeptId" @change="changeOrg" placeholder="请选择"></dept-tree>
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
      worktargetInfo: {},
      dataForm: {
        id: '',
        workTargetTypeId: '',
        workTargetId: '',
        workTypeCode: '',
        workStandardId: '',
        workTimeId: '',
        workDeptId: '',
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
        workTimeId: [{ required: true, message: this.$t('validate.required'), trigger: 'change' }],
        workStandardId: [{ required: true, message: this.$t('validate.required'), trigger: 'change' }],
        workDeptId: [{ required: true, message: this.$t('validate.required'), trigger: 'change' }]
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
        this.getWorktargetInfo()
      })
    },
    // 获取信息
    getInfo () {
      console.log(this.dataForm.id)
      this.$http.get('/worktarget/twgtworktargetstandardrelation/' + this.dataForm.id).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.dataForm = {
          ...this.dataForm,
          ...res.data
        }
        this.getWorktargetInfo()
      }).catch(() => {})
    },
    getWorktargetInfo () {
      if (this.dataForm.workTargetId && this.dataForm.workTargetTypeId) {
        this.$http.get('/worktarget/baseworktarget/getWorktargetInfo',
          { params: { worktargetTypeId: this.dataForm.workTargetTypeId,
            worktargetId: this.dataForm.workTargetId } })
          .then(({ data: res }) => {
            if (res.code !== 0) {
              return this.$message.error(res.msg)
            }
            this.worktargetInfo = {
              ...this.worktargetInfo,
              ...res.data
            }
          }).catch(() => {})
      }
    },
    changeWorkStandard (workStandard) {
      if (workStandard) {
        this.dataForm.workStandardId = workStandard.id
      } else {
        this.dataForm.workStandardId = ''
      }
    },
    changeWorkTime (workTime) {
      if (workTime) {
        this.dataForm.workTimeId = workTime.id
      } else {
        this.dataForm.workTimeId = ''
      }
    },
    changeOrg (org) {
      this.dataForm.workDeptId = org.id
    },
    // 表单提交
    dataFormSubmitHandle: debounce(function () {
      this.$refs['dataForm'].validate((valid) => {
        if (!valid) {
          return false
        }
        this.$http[!this.dataForm.id ? 'post' : 'put']('/worktarget/twgtworktargetstandardrelation/', this.dataForm).then(({ data: res }) => {
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
