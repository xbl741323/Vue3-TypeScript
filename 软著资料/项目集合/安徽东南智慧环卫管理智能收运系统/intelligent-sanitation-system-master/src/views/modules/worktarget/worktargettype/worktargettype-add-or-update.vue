<template>
  <el-dialog :visible.sync="visible" width="50%" :title="!dataForm.id ? $t('add') : $t('update')" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmitHandle()" :label-width="$i18n.locale == 'en-US' ? '160px' : '120px'">
            <el-form-item label="类型名称" prop="worktargetTypeName">
              <el-input v-model="dataForm.worktargetTypeName" placeholder="类型名称"></el-input>
            </el-form-item>
            <!-- <el-form-item label="父类型id" prop="parentTypeId">
              <el-input v-model="dataForm.parentTypeId" placeholder="父类型id"></el-input>
            </el-form-item> -->
            <el-form-item label="地理信息类型" prop="plftype">
              <el-input v-model="dataForm.plftype" placeholder="地理信息类型"></el-input>
            </el-form-item>
            <el-form-item label="备注" prop="description">
              <el-input v-model="dataForm.description" placeholder="备注"></el-input>
            </el-form-item>
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
        worktargetTypeName: '',
        parentTypeId: '',
        plftype: '',
        description: '',
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
      this.$http.get('/worktarget/worktargettype/' + this.dataForm.id).then(({ data: res }) => {
        if (res.code != 0) {
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
        this.$http[!this.dataForm.id ? 'post' : 'put']('/worktarget/worktargettype/', this.dataForm).then(({ data: res }) => {
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
    }, 1000, { 'leading': true, 'trailing': false })
  }
}
</script>
