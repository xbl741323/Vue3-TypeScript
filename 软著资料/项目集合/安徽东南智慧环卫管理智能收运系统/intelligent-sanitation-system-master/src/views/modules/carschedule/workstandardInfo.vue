<template>
  <el-dialog :visible.sync="visible" width="80%" title="作业标准信息" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form :model="dataForm" ref="dataForm" :label-width="$i18n.locale === 'en-US' ? '120px' : '80px'">
        <el-row>
          <el-col :span="12" prop="workStandardName">
            <el-form-item label="标准名称">
              <el-input v-model="dataForm.workStandardName" :readonly="true" placeholder="作业对象类型"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="作业类型" prop="workTypeName">
               <el-input v-model="dataForm.workTypeName" :readonly="true" placeholder="作业对象名称"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="作业频率" prop="workFrequency">
              <el-input v-model="dataForm.workFrequency" :readonly="true" placeholder="作业对象名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="作业标准" prop="workNum">
              <el-input v-model="dataForm.workNum" :readonly="true" placeholder="作业对象名称"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
    </el-form>
    <el-table v-loading="dataListLoading" :data="dataForm.standardItemDTOList" border style="width: 100%;">
        <el-table-column prop="indicatorCode" label="指标code" header-align="center" align="center"></el-table-column>
        <el-table-column prop="param1Name" label="判定参数1名称" header-align="center" align="center"></el-table-column>
        <el-table-column prop="param1Comparison" label="参数1比较关系" header-align="center" align="center"></el-table-column>
        <el-table-column prop="param1Value" label="判定参数1值" header-align="center" align="center"></el-table-column>
        <el-table-column prop="param2Name" label="判定参数2名称" header-align="center" align="center"></el-table-column>
        <el-table-column prop="param2Comparison" label="参数2比较关系" header-align="center" align="center"></el-table-column>
        <el-table-column prop="param2Value" label="判定参数2值" header-align="center" align="center"></el-table-column>
      </el-table>
  </el-dialog>
</template>

<script>
import debounce from 'lodash/debounce'
export default {
  data () {
    return {
      visible: false,
      dataListLoading: false,
      dataForm: {
        id: '',
        workStandardName: '',
        workTypeName: '',
        workFrequency: '',
        workNum: '',
        standardItemDTOList: []
      }
    }
  },
  computed: {
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
      this.$http.get('/framework/tframeworkworkstandard/getWorkstandardInfo', { params: { id: this.dataForm.id } }).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.dataForm = {
          ...this.dataForm,
          ...res.data
        }
        this.dataListLoading = false
      }).catch(() => {})
    }
  }
}
</script>
