<template>
  <el-dialog :visible.sync="visible" :title="!dataForm.id ? $t('add') : $t('update')" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmitHandle()" :label-width="$i18n.locale === 'en-US' ? '120px' : '80px'">

            <el-form-item label="字段名" prop="fieldName" labelWidth="150px">
              <el-input v-model="dataForm.fieldName" placeholder="字段名"></el-input>
            </el-form-item>
            <el-form-item label="字段code" prop="fieldCode" labelWidth="150px">
              <el-input v-model="dataForm.fieldCode" placeholder="字段code"></el-input>
            </el-form-item>
            <el-form-item label="所属对象类型code" prop="objectTypeCode" labelWidth="150px">

                <select style="width:200px" v-model="dataForm.objectTypeCode">
                    <option   value="vehicle"  key="vehicle"  >车辆</option>
                    <option   value="worker"  key="worker"  >工作人员</option>

                    <option   value="worktarget"  key="worktarget"  >设施</option>
                    <option   value="carpark"  key="carpark"  >停车场</option>
                    <option   value="waterpoint"  key="waterpoint"  >加水点</option>
                    <option   value="transferstation"  key="transferstation"  >中转站</option>
                    <option   value="road"  key="road"  >道路</option>
                    <option   value="publictoilet"  key="publictoilet"  >公厕</option>
                </select>

            </el-form-item>
            <el-form-item label="指标类型code" prop="quotaTypeCode" labelWidth="150px">
                <select style="width:200px" v-model="dataForm.quotaTypeCode">
                    <option   value="basedata"  key="basedata"  >基本数据</option>
                    <option   value="workdata"  key="workdata"  >作业数据</option>
                    <option   value="devicedata"  key="devicedata"  >设备数据</option>
                    <option   value="operatedata"  key="operatedata"  >操作数据</option>
                </select>


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
      fieldName: '',
      fieldCode: '',
      objectTypeCode: '',
      quotaTypeCode: '',
      creator: '',
      createDate: '',
      updateBy: '',
      updateTime: '',
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
        this.$http.get('/monitorconfig/basefieldinfo/' + this.dataForm.id).then(({ data: res }) => {
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
          this.$http[!this.dataForm.id ? 'post' : 'put']('/monitorconfig/basefieldinfo/', this.dataForm).then(({ data: res }) => {
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
