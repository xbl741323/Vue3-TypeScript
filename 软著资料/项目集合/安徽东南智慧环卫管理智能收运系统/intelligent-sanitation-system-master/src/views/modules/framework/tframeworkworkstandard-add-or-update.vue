<template>
  <el-dialog :visible.sync="visible" :title="!dataForm.id ? $t('add') : $t('update')" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmitHandle()" :label-width="$i18n.locale === 'en-US' ? '120px' : '80px'">
           
       
            <el-form-item label="标准名称" prop="workStandardName">
              <el-input v-model="dataForm.workStandardName" placeholder="作业标准名称"></el-input>
            </el-form-item>
			<el-form-item label="作业类型" prop="workTypeCode">
			   <framework-worktype-select v-model="dataForm.workTypeCode" @changeWorkType="changeWorkType"></framework-worktype-select>
			</el-form-item>
			<el-form-item label="标准类型" prop="standardType">
			  <el-select v-model="dataForm.standardType" placeholder="请选择">
			      <el-option
			        v-for="item in options"
			        :key="item.value"
			        :label="item.label"
			        :value="item.value">
			      </el-option>
			    </el-select>
			</el-form-item>
            <el-form-item label="备注" prop="remark">
              <el-input v-model="dataForm.remark" placeholder=""></el-input>
            </el-form-item>      
    </el-form>
	<el-card>
	  <el-table :data="standardItem" :stripe="true" :border="true">
	    <el-table-column label="指标名称" align="center">
	      <template slot-scope="scope">
	        <framework-indicator-select v-model="scope.row.indicatorCode" @changeFrameworkIndicator="changeFrameworkIndicator($event,scope.row)"></framework-indicator-select>
	      </template>
	    </el-table-column>
		<el-table-column label="参数1单位" align="center">
		  <template slot-scope="scope">
			  <el-input
			    placeholder=""
			    v-model="scope.row.param1Name + '('+ scope.row.param1Unit + ')'"
			    :disabled="true">
			  </el-input>
		  </template>
		</el-table-column>
	    <el-table-column label="判定值" align="center">
				  <template slot-scope="scope">
			   <el-input v-model="scope.row.param1Value" placeholder=""></el-input>
	      </template>
	    </el-table-column>
		<el-table-column label="判定条件" align="center">
		  <template slot-scope="scope">
<!-- 			   <el-input v-model="scope.row.param1Comparison" placeholder=""></el-input> -->			
			<dict-select v-model="scope.row.param1Comparison" :dictType="'paramComparison'"  @change="changeParamComparisonType1($event,scope.row)"></dict-select>
		  </template>
		</el-table-column>
		<el-table-column label="参数2单位" align="center">
		  <template slot-scope="scope">
			  <el-input
			    placeholder=""
			    v-model="scope.row.param2Name+'('+scope.row.param2Unit+')'"
			    :disabled="true">
			  </el-input>
		  </template>
		</el-table-column>
		<el-table-column label="判定值" align="center">
		  <template slot-scope="scope">
			   <el-input v-model="scope.row.param2Value" placeholder=""></el-input>
		  </template>
		</el-table-column>
		<el-table-column label="判定条件" align="center">
		  <template slot-scope="scope">
			  <dict-select v-model="scope.row.param2Comparison" :dictType="'paramComparison'"  @change="changeParamComparisonType($event,scope.row)"></dict-select>
			<!--   <el-input v-model="scope.row.param2Comparison" placeholder=""></el-input> -->
		  </template>
		</el-table-column>
	    <el-table-column label="操作" :render-header="renderHeader" align="center">
	      <template slot-scope="scope">
	        <el-button
	          size="mini"
	          @click="handleDelete(scope.$index, scope.row)">删除</el-button>
	      </template>
	    </el-table-column>
	  </el-table>
	</el-card>
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
		   options: [{
		            value: 1,
		            label: '质量标准'
		          }, {
		            value: 2,
		            label: '考勤行为标准'
		          }],
        visible: false,
		standardItem: [
		],
        dataForm: {
      id: '',
      tenantCode: '',
      workStandardName: '',
      workTypeCode: '',
      workFrequency: '',
	  standardType: '',
      workNum: '',
      remark: '',
      creator: '',
      createDate: '',
      updater: '',
      updateDate: '',
	  standardItemDTOList: []
    }
    }
    },
 computed: {
    dataRule () {
      return {
        workStandardName: [{ required: true, message: this.$t('validate.required'), trigger: 'blur,change' }],
        workTypeCode: [{ required: true, message: this.$t('validate.required'), trigger: 'blur' }],
        workFrequency: [{ required: true, message: this.$t('validate.required'), trigger: 'blur' }],
        workNum: [{ required: true, message: this.$t('validate.required'), trigger: 'blur' }]
      }
    }
  },
    methods: {
      init () {
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
		  this.standardItem = []
          if (this.dataForm.id) {
            this.getInfo()
          }
        })
      },
      // 获取信息
      getInfo () {
        this.$http.get('/framework/tframeworkworkstandard/' + this.dataForm.id).then(({ data: res }) => {
          if (res.code !== 0) {
            return this.$message.error(res.msg)
          }
          this.dataForm = {
            ...this.dataForm,
            ...res.data
          }
		   if (this.dataForm.standardItemDTOList) {
		    for (var i = 0; i < this.dataForm.standardItemDTOList.length; i++) {
		      var standarditem = this.dataForm.standardItemDTOList[i]
		      var standarditemObj = {
		        id: standarditem.id, indicatorCode: standarditem.indicatorCode, param2Comparison: standarditem.param2Comparison, param1Comparison: standarditem.param1Comparison, param1Value: standarditem.param1Value, param2Value: standarditem.param2Value,param1Name: standarditem.param1Name,param2Name: standarditem.param1Name,param1Unit: standarditem.param1Unit,param2Unit: standarditem.param2Unit
		      }
		      this.standardItem.push(standarditemObj)
		    }
		  } 
        }).catch(() => {})
      },
	  handleAdd () {
		this.standardItem.push({ indicatorCode: '',param2Comparison: '',param1Comparison: '',param1Name: '',param1Value: '', param2Value: '',param2Name: '',param1Unit: '',param2Unit: ''})
	  },
	  handleDelete (index, row) {
	    console.log(index)
	    this.standardItem.splice(index, 1)
	  },
	  changeFrameworkIndicator (frameworkIndicator, row) {
		row.indicatorCode=frameworkIndicator.code
	    row.param1Name = frameworkIndicator.param1Name
		row.param2Name = frameworkIndicator.param2Name
		row.param1Unit = frameworkIndicator.param1Unit
		row.param2Unit = frameworkIndicator.param2Unit
	  },
	  changeWorkType (workType) {
	    this.dataForm.workTypeCode = workType.code
	  },
	  changeStandType (item)
	  {
		 this.dataForm.standardType = item.value;
	  },
	  changeParamComparisonType1 (paramComparison,row) {
	   row.param1Comparison = paramComparison.dictValue
	  },
	  changeParamComparisonType (paramComparison,row) {
	   row.param2Comparison = paramComparison.dictValue
	  },
	  renderHeader (h, { column }) {
	    return h('div', [
	      h('span', column.label),
	      h('span', ' '),
	      h('el-button', {
	        props: {
	          type: 'success',
	          // icon: 'el-icon-circle-plus-outline',
	          plain: true
	        },
	        on: {
	          click: this.handleAdd
	        }
	      }, '新增标准')
	    ])
	  },
      // 表单提交
      dataFormSubmitHandle: debounce(function () {
        this.$refs['dataForm'].validate((valid) => {
          if (!valid) {
            return false
          }
		  
		  this.dataForm.standardItemDTOList = []
		  if (this.standardItem.length > 0) {
		    for (var i = 0; i < this.standardItem.length; i++) {
		      var standitem = this.standardItem[i]
		      this.dataForm.standardItemDTOList.push(standitem)
		    }
		  }
		  
          this.$http[!this.dataForm.id ? 'post' : 'put']('/framework/tframeworkworkstandard/', this.dataForm).then(({ data: res }) => {
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
