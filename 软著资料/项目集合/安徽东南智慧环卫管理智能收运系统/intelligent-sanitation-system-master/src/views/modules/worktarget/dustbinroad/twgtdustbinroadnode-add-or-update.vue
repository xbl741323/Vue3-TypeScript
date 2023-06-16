<template>
  <el-dialog :visible.sync="visible" :title="!dataForm.id ? $t('add') : $t('update')" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmitHandle()" :label-width="$i18n.locale === 'en-US' ? '120px' : '80px'">
            <el-form-item label="id" prop="id">
              <el-input v-model="dataForm.id" placeholder="id"></el-input>
            </el-form-item>
            <el-form-item label="路线id" prop="roadId">
              <el-input v-model="dataForm.roadId" placeholder="路线id"></el-input>
            </el-form-item>
            <el-form-item label="作业对象类型id" prop="worktargetTypeId">
              <el-input v-model="dataForm.worktargetTypeId" placeholder="作业对象类型id"></el-input>
            </el-form-item>
            <el-form-item label="节点序号" prop="nodeIndex">
              <el-input v-model="dataForm.nodeIndex" placeholder="节点序号"></el-input>
            </el-form-item>
            <el-form-item label="节点类型(0:起点，1:中间节点，2:终点)" prop="nodeType">
              <el-input v-model="dataForm.nodeType" placeholder="节点类型(0:起点，1:中间节点，2:终点)"></el-input>
            </el-form-item>
            <el-form-item label="前节点id" prop="prefixNodeId">
              <el-input v-model="dataForm.prefixNodeId" placeholder="前节点id"></el-input>
            </el-form-item>
            <el-form-item label="后节点id" prop="subfixNodeId">
              <el-input v-model="dataForm.subfixNodeId" placeholder="后节点id"></el-input>
            </el-form-item>
            <el-form-item label="作业对象id" prop="worktargetId">
              <el-input v-model="dataForm.worktargetId" placeholder="作业对象id"></el-input>
            </el-form-item>
            <el-form-item label="创建人" prop="creator">
              <el-input v-model="dataForm.creator" placeholder="创建人"></el-input>
            </el-form-item>
            <el-form-item label="创建时间" prop="createDate">
              <el-input v-model="dataForm.createDate" placeholder="创建时间"></el-input>
            </el-form-item>
            <el-form-item label="修改人" prop="updater">
              <el-input v-model="dataForm.updater" placeholder="修改人"></el-input>
            </el-form-item>
            <el-form-item label="修改时间" prop="updateDate">
              <el-input v-model="dataForm.updateDate" placeholder="修改时间"></el-input>
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
        roadId: '',
        worktargetTypeId: '',
        nodeIndex: '',
        nodeType: '',
        prefixNodeId: '',
        subfixNodeId: '',
        worktargetId: '',
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
      this.$http.get('/worktarget/twgtdustbinroadnode/' + this.dataForm.id).then(({ data: res }) => {
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
        this.$http[!this.dataForm.id ? 'post' : 'put']('/worktarget/twgtdustbinroadnode/', this.dataForm).then(({ data: res }) => {
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
