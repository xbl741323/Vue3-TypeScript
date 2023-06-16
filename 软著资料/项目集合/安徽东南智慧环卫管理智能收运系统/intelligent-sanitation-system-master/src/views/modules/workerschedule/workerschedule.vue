<template>
	<el-card shadow="never" class="aui-card--fill">
		<el-container style="height: 75vh">
			<el-aside :style="{width: asideWidth+'vw'}" class="left-div">
				<div @mouseover="worktypeShow" @mouseleave="worktypeHiden" :class="worktypeClass">
					<worktype-radio-group workMainBody="worker" @changeWorktype="changeWorktype"></worktype-radio-group>
				</div>
				<div style="margin-top: 50px;background-color: white;">
					<el-tree default-expand-all highlight-current :data="worktargetTree" :props="defaultProps"
						@current-change="changeNode">
						<span class="custom-tree-node" slot-scope="{ node, data }">
							<span :class="treeNodeClass(node, data)">

								<span v-if="data.nodeType=='SysDeptDTO'" style="color: black;">
									<i class="el-icon-notebook-2"></i><span style="color: green;">{{ data.name }}</span>
								</span>
								<span v-if="data.nodeType=='worker'">
									<i class="el-icon-truck" style="color: green;"></i>
									<span style="color: green;">{{ data.name }}
										<i class="el-icon-plus" @click.stop="add(node,data)"></i>
									</span>

								</span>


							</span>
						</span>
					</el-tree>
				</div>
			</el-aside>
			<el-main>
				<el-table v-loading="dataListLoading" :data="dataList" border
					@selection-change="dataListSelectionChangeHandle" style="width: 100%;">
					<el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
					<el-table-column prop="name" label="姓名" header-align="center" align="center"></el-table-column>
					<el-table-column prop="typeName" label="人员类型" header-align="center" align="center">
					</el-table-column>
					<el-table-column prop="departName" label="作业部门" header-align="center" align="center">
					</el-table-column>
					<el-table-column prop="timesPerDay" label="作业次数" header-align="center" align="center">
					</el-table-column>
					<el-table-column prop="workTimeIds" label="作业时间" header-align="center" align="center">
					</el-table-column>
					<el-table-column prop="worktargetName" label="作业对象" header-align="center" align="center">
					</el-table-column>
					<el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center"
						width="120">
						<template slot-scope="scope">
							<el-button v-if="$hasPermission('wkr:twkrworkschedule:update')" type="text" size="small"
								@click="update(scope.row)">{{ $t('update') }}</el-button>
							<el-button v-if="$hasPermission('wkr:twkrworkschedule:delete')" type="text" size="small"
								@click="deleteHandle(scope.row.id)">{{ $t('delete') }}</el-button>
						</template>
					</el-table-column>
				</el-table>
			</el-main>
		</el-container>
		<add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
		<workstandard-info v-if="workstandardVisible" ref="workstandardInfo"></workstandard-info>
	</el-card>
</template>

<script>
	import mixinViewModule from '@/mixins/view-module'
	import AddOrUpdate from './workerschedule-add-or-update'
	import WorkstandardInfo from './workstandardInfo'
	export default {
		mixins: [mixinViewModule],
		data() {
			return {
				addOrUpdateVisible: false,
				workstandardVisible: false,
				mixinViewModuleOptions: {
					getDataListURL: '/worker/twkrworkschedule/getListPage',
					exportURL: '/worker/twkrworkschedule/export',
					deleteURL: '/worker/twkrworkschedule',
					getDataListIsPage: true,
					deleteIsBatch: true,
					createdIsNeed: false,
					activatedIsNeed: false
				},
				dataForm: {
					orgId: '',
					orgIds: '',
					worktypeCode: '',
					name: '',
					workerId: ''
				},
				viewWorktimeMap: new Map(),
				worktargetTypeIds: '',
				asideWidth: 20,
				worktypeStatus: '0',
				worktypeCode: '',
				worktargetTree: [],
				defaultProps: {
					children: 'children',
					label: 'name'
				}
			}
		},
		mounted () {
			this.getworkTimeList();
			  // this.getViewWorktargetInfoList()
		},
		watch: {
			worktypeCode(val) {
				this.getWorktargetTree4Worktype()
			},
			dataList() {
				this.getWorktargetTree4Worktype()
			}
		},
		components: {
			AddOrUpdate,
			WorkstandardInfo
		},
		computed: {
			worktypeClass() {
				return this.worktypeStatus == '0' ? 'worktype-hiden' : 'worktype-show'
			},
			treeNodeClass() {
				return (node, data) => {
					var nodeClass = ''
					if (data.nodeType != 'SysDeptDTO') {
						if (data.extendData) {
							nodeClass = 'scheduled-node '
						} else {
							nodeClass = 'unschedule-node '
						}
					}
					if (node.expanded || node.checked || node.indeterminate) {
						return nodeClass + 'icon-select'
					} else {
						return nodeClass + ''
					}
				}
			},
			treeNodeSvg() {
				return (node, data) => {
					if (data.nodeType == 'SysDeptDTO') {
						return '#icon-env-dept'
					} else if (data.nodeType == 'ViewWorktargetInfoDTO' && data.worktargetTypeId == 10) {
						return '#icon-env-transferstation'
					} else if (data.nodeType == 'ViewWorktargetInfoDTO' && data.worktargetTypeId == 1) {
						return '#icon-env-transferstation'
					} else if (data.nodeType == 'ViewWorktargetInfoDTO' && data.worktargetTypeId == 2) {
						return '#icon-env-transferstation'
					}
					return ''
				}
			},
			treeOperateShow() {
				return (node, data) => {
					if (data.nodeType != 'SysDeptDTO') {
						if (data.extendData) {
							return false
						} else {
							return true
						}
					}
					return false
				}
			}

		},
		methods: {
			changeWorktype(worktype) {
				if (worktype) {
					this.worktargetTypeIds = worktype.worktargetTypeIds
					this.worktypeCode = worktype.code
					this.dataForm.worktypeCode = worktype.code
					this.query()
				}
			},
			worktypeShow() {
				this.worktypeStatus = '1'
			},
			worktypeHiden() {
				this.worktypeStatus = '0'
			},
			getWorktargetTree4Worktype() {
				this.$http.get('/worker/twkrworker/getDeptWorkerTreeByWorktypeCode', {
						params: {
							worktypeCode: this.worktypeCode
						}
					})
					.then(({
						data: res
					}) => {
						this.worktargetTree = res.data
					})
			},
			changeNode(data, node) {
				if (data.nodeType == 'SysDeptDTO') {
					this.dataForm.workDeptId = data.id
				} else {
					//this.dataForm.typeAndId = data.worktargetTypeId + ':' + data.id
					//根据车辆查询
					this.dataForm.workDeptId = data.deptId;
					this.dataForm.workerId = data.workerId;
					this.dataForm.name = data.name;
				}
				this.query()
			},
			add(node, data) {
				this.addOrUpdateVisible = true
				this.$nextTick(() => {
					console.log(this.$refs.addOrUpdate.dataForm)
					console.log(this.$refs.addOrUpdate.dataForm.workTypeCode)
					this.$refs.addOrUpdate.dataForm.id = '';
					this.$refs.addOrUpdate.value1 = [];
					this.$refs.addOrUpdate.value2 = [];
					this.$refs.addOrUpdate.dataForm.workerId = '';
					this.$refs.addOrUpdate.dataForm.name = '';
					this.$refs.addOrUpdate.dataForm.timesPerDay = '';

					this.$refs.addOrUpdate.dataForm.workTimeIds = '';
					this.$refs.addOrUpdate.dataForm.offExecuteTime = '';
					this.$refs.addOrUpdate.dataForm.onExecuteTime = '';
					this.$refs.addOrUpdate.dataForm.worktargetInfos = [];
					this.$refs.addOrUpdate.dataForm.workTypeCode = this.dataForm.worktypeCode;
					this.$refs.addOrUpdate.dataForm.workerId = data.id;
					this.$refs.addOrUpdate.dataForm.name = data.name;
					this.$refs.addOrUpdate.init()
				})
			},
			update(row) {

				this.addOrUpdateVisible = true
				this.$nextTick(() => {
					this.$refs.addOrUpdate.dataForm.id = '';
					this.$refs.addOrUpdate.value1 = [];
					this.$refs.addOrUpdate.value2 = [];
					this.$refs.addOrUpdate.dataForm.workerId = '';
					this.$refs.addOrUpdate.dataForm.name = '';
					this.$refs.addOrUpdate.dataForm.timesPerDay = '';
					
					this.$refs.addOrUpdate.dataForm.workTimeIds = '';
					
					this.$refs.addOrUpdate.dataForm.offExecuteTime = '';
					this.$refs.addOrUpdate.dataForm.onExecuteTime = '';
					
					this.$refs.addOrUpdate.dataForm.worktargetInfos = [];
					this.$refs.addOrUpdate.dataForm.id = row.id
					this.$refs.addOrUpdate.dataForm.name = row.name;
					this.$refs.addOrUpdate.dataForm.workTypeCode = this.dataForm.worktypeCode;
					console.log('444444444')
					console.log(row)
					this.$refs.addOrUpdate.init()
				})
			},
			getworkTimeList () {
			   this.$http
			    .get('/framework/tframeworkworktime/getList', { params: { } })
			    .then(({ data: res }) => {
			      if (res.code != 0) {
			        return this.$message.error(res.msg)
			      }
			      for (var i = 0; i < res.data.length; i++) {
			        var workTime = res.data[i]
			        workTime.label = workTime.beginTime + '-' + workTime.endTime
					this.viewWorktimeMap.set(workTime.id,  workTime.label)
			      }
				  console.log("timemap====")
				  console.log(this.viewWorktimeMap)
				   console.log("timemap=aaaa===")
			    })
			    .catch(() => {})
			},
			handleClick(row) {
				this.workstandardVisible = true
				console.log(this.$refs.workstandardInfo)
				this.$refs.workstandardInfo.dataForm.id = row.workStandardId
				this.$refs.workstandardInfo.init()
			}


		}
	}
</script>

<style>
	.left-div {
		border-style: solid;
		border-width: 1px;
	}

	.worktype-hiden {
		position: absolute;
		z-index: 0;
		width: calc(20vw - 3px);
		padding-top: 5px;
		height: 50px;
		overflow: hidden;
		background-color: white;
	}

	.worktype-show {
		position: absolute;
		z-index: 99;
		width: calc(20vw - 3px);
		padding-top: 5px;
		height: auto;
		background-color: white;
	}

	.scheduled-node {
		color: green;
	}

	.unschedule-node {
		color: black;
	}
</style>
