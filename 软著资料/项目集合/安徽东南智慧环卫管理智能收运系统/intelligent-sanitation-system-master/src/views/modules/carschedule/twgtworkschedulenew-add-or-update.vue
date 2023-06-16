<template>
	<el-dialog  :visible.sync="visible" :title="!dataForm.id ? $t('add') : $t('update')"
		:close-on-click-modal="false" :close-on-press-escape="false"  @close="resetForm('dataForm')">
		<el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmitHandle()"
			:label-width="$i18n.locale === 'en-US' ? '120px' : '80px'">
			<el-row>
				<el-col :span="12">
					<el-form-item label="车牌号" prop="plateNnumber1">
			
						<el-input v-model="dataForm.plateNnumber">
						</el-input>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="出车次数" prop="workFrequency">
				
						<!-- <dict-select v-model="dataForm.workFrequencyName" :dictType="'workFrequency'" @change="changeCleanType"></dict-select> -->
						<el-input v-model="dataForm.workFrequency" placeholder="出车次数" maxlength="3">
							<template slot="append">天</template>
						</el-input>
					</el-form-item>
				</el-col>
			</el-row>
			
			<el-row>
				<el-col :span="12">
					<el-form-item label="作业次数" prop="workNum">
						<el-input v-model="dataForm.workNum" placeholder="输入次数" maxlength="3">
							<template slot="append">次</template>
						</el-input>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="出车时间" prop="value1">
						<!-- <work-time-select v-model="dataForm.workTimeIds" @changeWorkTime="changeWorkTime"></work-time-select> -->
						<el-select multiple v-model="value1" placeholder="请选择">
							<el-option v-for="item in workTimeList" :key="item.id" :label="item.label" :value="item.id">
							</el-option>
						</el-select>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col :span="12">
					<el-form-item label="作业类型" prop="workTypeCode">
						<worktype-code-select :disabled="true" :worktypeCode.sync="dataForm.workTypeCode">
						</worktype-code-select>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="作业对象类型" prop="workTargetTypeId" >
						<el-select multiple v-model="value2" placeholder="请选择" >
							<el-option v-for="item in worktargetTypeList" :key="item.id" :label="item.worktargetTypeName" :value="item.id">
							</el-option>
						</el-select>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
			<el-col :span="24">
				<worktarget-transfer :codetype.sync="dataForm.workTypeCode" :worktargetType.sync="this.value2"
				:worktargetInfos.sync="dataForm.worktargetInfos" style="width: fit-content;"></worktarget-transfer>
				</el-col>
			</el-row>
		</el-form>
		<template slot="footer">
			<el-button @click="dataFormCancel()">{{ $t('cancel') }}</el-button>
			<el-button type="primary" @click="dataFormSubmitHandle()">{{ $t('confirm') }}</el-button>
		</template>
	</el-dialog>
</template>
<script>
	import debounce from 'lodash/debounce'
	export default {
		data() {
			return {
				visible: false,
				workTimeList: [],
				value1: [],
				value2: [],
				worktargetTypeList: [],
				
				dataForm: {
					id: '',
					workVehicleId: '',
					plateNnumber: '',
					plateNnumber1: '',
					workFrequency: '',
					workFrequencyName: '',
					workNum: '',
					workTargetTypeId: '',
					workTargetId: '',
					workTypeCode: '',
					workStandardId: '',
					workTimeIds: '',
					workDeptId: '',
					creator: '',
					createDate: '',
					updater: '',
					updateDate: '',
					worktargetInfos: []
				}
			}
		},
		mounted() {
			this.getworkTimeList()
		},
		computed: {
			dataRule() {
				return {
					workTimeId: [{
						required: true,
						message: this.$t('validate.required'),
						trigger: 'change'
					}],
					workStandardId: [{
						required: true,
						message: this.$t('validate.required'),
						trigger: 'change'
					}]
				}
			}
		},
		methods: {
			init() {
				this.visible = true
				
				console.log("A "+this.dataForm.plateNnumber)
				this.$nextTick(() => {
					console.log("B "+this.dataForm.plateNnumber)
					this.$refs['dataForm'].resetFields()
					console.log("C "+this.dataForm.plateNnumber)
					console.log(this.dataForm.workTypeCode)
					this.getworktargetTypeList();
					if (this.dataForm.id) {
						this.getInfo()
					}
				})
			},
			getworktargetTypeList() {
				 this.$http
					.get('/worktarget/cleanworktarget/getWorktargetTypeList', {
						 params: {worktypeCode:this.dataForm.workTypeCode }
					})
					.then(({
						data: res
					}) => {
						if (res.code != 0) {
							return this.$message.error(res.msg)
						}
						
						this.worktargetTypeList = res.data
					})
					.catch(() => {})
			},
			getworkTimeList() {
				 this.$http
					.get('/framework/tframeworkworktime/getList', {
						params: {}
					})
					.then(({
						data: res
					}) => {
						if (res.code != 0) {
							return this.$message.error(res.msg)
						}
						for (var i = 0; i < res.data.length; i++) {
							var workTime = res.data[i]
							workTime.label = workTime.beginTime + '-' + workTime.endTime
						}
						this.workTimeList = res.data
					})
					.catch(() => {})
			},
			// 获取信息
			getInfo() {
				console.log(this.dataForm.id)
				this.$http.get('/vehwork/tvehworkschedule/' + this.dataForm.id).then(({
					data: res
				}) => {
					if (res.code !== 0) {
						return this.$message.error(res.msg)
					}
					this.dataForm = {
						...this.dataForm,
						...res.data
					}
					//this.dataForm.workFrequencyName = this.dataForm.workFrequency
					
					this.value1 = this.getLstInteger(this.dataForm.workTimeIds)
				}).catch(() => {})
			},
			getLstInteger(str) {
				let strTemp = [];
				str.split(',').map(u => {
					strTemp.push(u)
				});
				return strTemp;
			},
			refreshWorktarget() {
				this.dataForm.workTargetTypeId = this.value2.toString();
				console.log("changeworktarget==="+ this.dataForm.workTargetTypeId)
			},
			changeCleanType(cleanType) {
				this.dataForm.workFrequencyName = cleanType.dictValue
				this.dataForm.workFrequency = cleanType.dictTypeId
			},
			changeWorkStandard(workStandard) {
				if (workStandard) {
					this.dataForm.workStandardId = workStandard.id
				} else {
					this.dataForm.workStandardId = ''
				}
			},
			changeWorkTime(workTime) {
				if (workTime) {
					this.dataForm.workTimeIds = workTime.id
				} else {
					this.dataForm.workTimeIds = ''
				}
			},
			changeOrg(org) {
				this.dataForm.workDeptId = org.id
			},
			dataFormCancel() {
				this.dataForm.id = '';
				this.value1 = [];
				this.value2 = [];
				this.dataForm.workVehicleId ='';
				this.dataForm.plateNnumber ='';
				this.dataForm.workFrequencyName = '';
				this.dataForm.workFrequency = '';
				this.dataForm.workNum = '';
				this.dataForm.workTargetTypeId = '';
				this.dataForm.workTargetId = '';
				this.dataForm.workTypeCode = '';
				this.dataForm.workStandardId = '';
				this.dataForm.workTimeIds = '';
				// this.dataForm.workDeptId =  '';
				this.dataForm.creator = '';
				this.dataForm.createDate = '';
				this.dataForm.updater = '';
				this.dataForm.updateDate = '';
				this.dataForm.worktargetInfos = [];
				this.visible = false;
			},
			// 点击关闭时清空form表格的数据
			    resetForm (form) {
			      this.$refs[form].resetFields()
				  this.dataFrom={}
				  console.log("dddd="+this.dataForm.plateNnumber)
			    },
			// 表单提交
			dataFormSubmitHandle: debounce(function() {
				this.$refs['dataForm'].validate((valid) => {
					if (!valid) {
						return false
					}
					this.dataForm.workTimeIds = this.value1.toString();
					this.$http[!this.dataForm.id ? 'post' : 'put']('/vehwork/tvehworkschedule/', this
						.dataForm).then(({
						data: res
					}) => {
						if (res.code !== 0) {
							return this.$message.error(res.msg)
						}
						this.$message({
							message: this.$t('prompt.success'),
							type: 'success',
							duration: 500,
							onClose: () => {
								this.visible = false
								//this.$refs['dataForm'].resetFields()
								// var data = this.dataForm
								this.dataForm.id = '';
								this.value1 = [];
								this.value2 = [];
								this.dataForm.workVehicleId ='';
								this.dataForm.plateNnumber ='';
								//this.dataForm.workVehicleId = '';
								this.dataForm.workFrequencyName = '';
								this.dataForm.workFrequency = '';
								this.dataForm.workNum = '';
								this.dataForm.workTargetTypeId = '';
								this.dataForm.workTargetId = '';
								this.dataForm.workTypeCode = '';
								this.dataForm.workStandardId = '';
								this.dataForm.workTimeIds = '';
								// this.dataForm.workDeptId =  '';
								this.dataForm.creator = '';
								this.dataForm.createDate = '';
								this.dataForm.updater = '';
								this.dataForm.updateDate = '';
								this.dataForm.worktargetInfos = [];

								this.$emit('refreshDataList')
							}
						})
					}).catch(() => {})
				})
			}, 1000, {
				'leading': true,
				'trailing': false
			})
		}
	}
</script>
