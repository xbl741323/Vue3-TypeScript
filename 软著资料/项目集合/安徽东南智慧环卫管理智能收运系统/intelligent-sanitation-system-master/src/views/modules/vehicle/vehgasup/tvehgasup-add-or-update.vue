<template>
	<el-dialog :visible.sync="visible" :title="!dataForm.id ? $t('add') : $t('update')" :close-on-click-modal="false"
		:close-on-press-escape="false">
		<el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmitHandle()"
			:label-width="$i18n.locale === 'en-US' ? '120px' : '80px'">
			<el-form-item label="部门">
			  <ren-dept-tree v-model="dataForm.orgId" :placeholder="$t('dept.title')" :query="true"></ren-dept-tree>
			</el-form-item>
			<el-form-item label="车辆类型">
			  <el-select
			    v-model="dataForm.vehicleTypeId"
			    placeholder="请选择">
			    <el-option
			      v-for="item in cartypeList"
			      :key="item.id"
			      :label="item.typeName"
			      :value="item.id">
			    </el-option>
			  </el-select>
			</el-form-item>
			<el-form-item label="车牌号">
			  <el-select
			    v-model="dataForm.vehicleId"
			    placeholder="请选择">
			    <el-option
			      v-for="item in carinfoList"
			      :key="item.id"
			      :label="item.vehicleNum"
			      :value="item.id">
			    </el-option>
			  </el-select>
			</el-form-item>
			<el-form-item label="加油量" prop="gasupNumber">
				<el-input v-model="dataForm.gasupNumber" placeholder="加油量"></el-input>
			</el-form-item>
			<el-form-item label="开始日期" prop="gasupTime">
			  <el-date-picker
			    style="width:160px;"
			    v-model="dataForm.gasupTime"
			    value-format="yyyy-MM-dd HH:mm:ss"
			    type="date"
			    placeholder="选择日期">
			  </el-date-picker>
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
	import mixinViewModule from '@/mixins/view-module'
	import AddOrUpdate from './tvehgasup-add-or-update'
	import DateUtil from '@/utils/dateUtil.js'
	import { GETCARTYPELISTV3 } from '@/api/cartype/cartype.js'
	export default {
		data() {
			return {
				visible: false,
				dataForm: {
					id: '',
					orgId: '',
					vehicleTypeId: '',
					gasupNumber: '',
					vehicleId: '',
					gasupTime: '',
					creator: '',
					createDate: '',
					updater: '',
					updateDate: '',
				},
				cartypeList: [],
				carinfoList: []
			}
		},
		computed: {
			vehicleTypeId () {
			  return this.dataForm.vehicleTypeId
			},
			orgId () {
			  return this.dataForm.orgId
			} ,
			dataRule() {
				return {
					gasupNumber: [{ required: true, message: this.$t('validate.required'), trigger: 'blur' }],
					vehicleId: [{ required: true, message: this.$t('validate.required'), trigger: 'blur' }],
					gasupTime: [{ required: true, message: this.$t('validate.required'), trigger: 'blur' }]
				}
			}
		},
		watch: {
		  vehicleTypeId (val) {
				this.dataForm.vehicleTypeId = val;
		    this.getCarinfo()
		  },
		  orgId (val) {
				this.dataForm.orgId = val;
		    this.getCarinfo()
		  }
		},
		mounted () {
		  this.getCartype()
		  this.getCarinfo()
		},
		methods: {
			getCartype () {
			 GETCARTYPELISTV3({}).then(({ data: res }) => {
			   if (res.code === 0) {
			 	this.cartypeList = res.data
			   }
			 })
			},
			getCarinfo () {
			  this.$http
			    .get('/vehwork/tvehvehicleinfo/getList', {params: { ...this.dataForm } })
			    .then(({ data: res }) => {
			      if (res.code != 0) {
			        return this.$message.error(res.msg)
			      }
			      this.carinfoList = res.data
			     
			    })
			    .catch(() => {})
			},
			init() {
				this.visible = true
				this.$nextTick(() => {
					this.$refs['dataForm'].resetFields()
					if (this.dataForm.id) {
						this.getInfo()
					}
				})
			},
			// 获取信息
			getInfo() {
				this.$http.get('/vehwork/tvehgasup/' + this.dataForm.id).then(({
					data: res
				}) => {
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
			dataFormSubmitHandle: debounce(function() {
				this.$refs['dataForm'].validate((valid) => {
					if (!valid) {
						return false
					}
					this.$http[!this.dataForm.id ? 'post' : 'put']('/vehwork/tvehgasup/', this.dataForm)
						.then(({
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
