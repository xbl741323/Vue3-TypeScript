<style>
    .div-inline{display: inline;width:300px}
</style>

<template>
    <div style="display:block;overflow:auto;width:2020px;">


        <div class="div-inline">
            <div style="width: 300px;float:left;">
                <el-container>
                    <el-header>
                        系统监控页面  <el-button type="primary" @click="addOrUpdateHandle()">添加</el-button>
                    </el-header>
                    <el-main>

                        <el-table :data="pageinfolist" border style="width: 300px;">

                            <el-table-column prop="pageName" label="页面名称" header-align="center" align="center" @click="changePageSet(scope.row.pageNumber)"></el-table-column>

                            <el-table-column label="操作" fixed="right" header-align="center" align="center" width="150">
                                <template slot-scope="scope">
                                    <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">修改</el-button>
                                   <el-button type="text" size="small" @click="deleteHandle(scope.row.id)">删除</el-button>
                                  <el-button type="text" size="small" @click="changePageSet(scope.row.pageNumber)">监控对象设置</el-button>

                                    <router-link :to="{path:'/pagecomponentconfigtree',query:{pageNumber:scope.row.pageNumber}}">
                                        <button>监控字段设置</button>
                                    </router-link>
                              </template>
                          </el-table-column>
                      </el-table>

                      <!-- 弹窗, 新增 / 修改 -->
                        <AddOrUpdate v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></AddOrUpdate>

                    </el-main>
                </el-container>

            </div>

            <div style="width: 250px;float:left;">
                <el-container>
                    <el-header>
                        车辆列表
                    </el-header>
                    <el-main>
                        <el-table ref="vehicleTable" :data="vehicleTypeList" border style="width: 200px;" @selection-change="dataListSelectionChangeHandle">
                            <el-table-column type="selection" header-align="center" align="center" width="10"></el-table-column>
                            <el-table-column prop="detailTypeName" label="车辆类型" header-align="center" align="center"  ></el-table-column>

                            <el-table-column label="操作" fixed="right" header-align="center" align="center" width="50">
                                <template slot-scope="scope">

                                </template>
                            </el-table-column>
                        </el-table>

                    </el-main>
                </el-container>
            </div>
            <div style="width: 250px;float:left;">
                <el-container>
                    <el-header>
                        人员列表
                    </el-header>
                    <el-main>
                        <el-table  ref="workerTable"  :data="workerTypeList" border style="width: 200px;" @selection-change="workerListSelectionChangeHandle">
                            <el-table-column type="selection" header-align="center" align="center" width="10"></el-table-column>
                            <el-table-column prop="detailTypeName" label="人员类型" header-align="center" align="center"  ></el-table-column>

                            <el-table-column label="操作" fixed="right" header-align="center" align="center" width="50">
                                <template slot-scope="scope">

                                </template>
                            </el-table-column>
                        </el-table>

                    </el-main>
                </el-container>
            </div>
            <div style="width: 250px;float:left;">
                <el-container>
                    <el-header>
                        设施列表
                    </el-header>
                    <el-main>
                        <el-table  ref="worktargetTable" :data="worktargetTypeList" border style="width: 200px;" @selection-change="worktargetListSelectionChangeHandle">
                            <el-table-column type="selection" header-align="center" align="center" width="10"></el-table-column>
                            <el-table-column prop="detailTypeName" label="设施类型" header-align="center" align="center"   ></el-table-column>

                            <el-table-column label="操作" fixed="right" header-align="center" align="center" width="50">
                                <template slot-scope="scope">

                                </template>
                            </el-table-column>
                        </el-table>

                    </el-main>
                </el-container>
            </div>



            <div style="width: 250px;float:left;">
                <el-container>
                    <el-header>
                         事件列表
                    </el-header>
                    <el-main>
                        <el-tree ref="eventtree"
                                 :data="eventTypeTree"

                                 node-key="id"
                                 show-checkbox
                                 :default-checked-keys="eventTypeSet"
                                 @check-change="treecurrentChecked"

                                 :props="defaultProps">
                        </el-tree>
                       <!-- <el-table  ref="vehEventTable" :data="vehEvenntTypeList" border style="width: 300px;" @selection-change="vehEvenntListSelectionChangeHandle">
                            <el-table-column type="selection" header-align="center" align="center" width="10"></el-table-column>
                            <el-table-column prop="detailTypeName" label="设施类型" header-align="center" align="center"   ></el-table-column>


                        </el-table> -->

                    </el-main>
                </el-container>
            </div>
         <!--   <div class="app-container post_type_list" style="width: 800px ">
                <el-container class="container_wrap">

                </el-container>

            </div>  -->

        </div>
        <div style="width: 800px ">   <el-button @click="saveData()"> 保存</el-button></div>


    </div>
</template>

<script>
    import { GET_EVENTTYPETREE,GET_EVENTTYPESET,GETPAGELIST, GET_VEHICLETYPE_LIST, SAVE_OR_UPDATE_MONITOR_OBJECT, GET_VEHICLETYPE_AND_SET_LIST,GET_WORKTAEGETETYPE_AND_SET_LIST,GET_WORKERETYPE_AND_SET_LIST }  from "@/api/monitorconfig";
    import AddOrUpdate from './monitorpageinfo-add-or-update'

    export default {
        components: {

            AddOrUpdate
        },

        data () {
            return {
                pageinfolist: [], // 左侧监控页面list
                vehicleTypeList: [], // 车辆类型list
                workerTypeList: [], // 人员类型list
                worktargetTypeList: [], // 设施类型list
                //dataList: [],               // 数据列表
                eventTypeTree:[], // 事件类型树list
                eventTypeSet:[],
                dataListSelections: [], // 车辆数据列表，多选项
                workerListSelections: [], // 作业人员数据列表，多选项
                worktargetListSelections: [], //作业对象数据列表，多选项
                eventTypeSelections: [],// 事件类型多选项目
                addOrUpdateVisible: false, // 新增／更新，弹窗visible状态

                monitorObjectInfoRequestDTO: {
                    pageNumber: '',
                    subObjectList: []
                },
                dataForm: {
                    id: ''
                },
                defaultProps: {
                    children: 'children',
                    label: 'label'
                }
            }
        },
        created() {
            //this.getDataList()

        },
        mounted() {


        },
        activated() {

            this.getDataList();


        },

        methods: {
            // 新增 / 修改
            addOrUpdateHandle (id) {
                this.addOrUpdateVisible = true
                this.$nextTick(() => {
                    this.$refs.addOrUpdate.dataForm.id = id
                    this.$refs.addOrUpdate.init()
                })
            },

            // 获取信息
            getDataList () {
                GETPAGELIST().then(({ data: res }) =>{
                    console.log(res);
                    if (res.code !== 0) {
                        return this.$message.error(res.msg)
                    }
                    this.pageinfolist = res.data
                }).catch(() => {})
            },
            // 车辆多选
            dataListSelectionChangeHandle(val) {
                this.dataListSelections = val
            },
            // 人员多选
            workerListSelectionChangeHandle(val) {
                this.workerListSelections = val
            },
            // 设施多选
            worktargetListSelectionChangeHandle(val) {
                this.worktargetListSelections = val
            },
            // 获取车辆类型信息
            getVehicleTypeList() {
                if(this.monitorObjectInfoRequestDTO.pageNumber=='')
                {
                    return ;
                }
                var queryParams = {

                    pageNumber: this.monitorObjectInfoRequestDTO.pageNumber

                }
                GET_VEHICLETYPE_AND_SET_LIST(queryParams).then(( { data: res }) => {
                    if (res.code !== 0) {
                        return this.$message.error(res.msg)
                    }
                    this.vehicleTypeList = res.data
                    this.$nextTick(() => {
                        for (let i = 0; i < this.vehicleTypeList.length; i++) {

                            if (this.vehicleTypeList[i].isSelected) {
                                this.$refs.vehicleTable.toggleRowSelection(this.vehicleTypeList[i], true)

                            }
                        }
                    })
                }).catch(() => {})
            },
            // 获取worktarget类型信息
            getWorktargetTypeList() {
                if(this.monitorObjectInfoRequestDTO.pageNumber=='')
                {
                    return ;
                }
                var queryParams = {

                    pageNumber: this.monitorObjectInfoRequestDTO.pageNumber

                }
                GET_WORKTAEGETETYPE_AND_SET_LIST(queryParams).then(( { data: res }) => {
                    if (res.code !== 0) {
                        return this.$message.error(res.msg)
                    }
                    this.worktargetTypeList = res.data
                    this.$nextTick(() => {
                        for (let i = 0; i < this.worktargetTypeList.length; i++) {
                            if (this.worktargetTypeList[i].isSelected) {

                                this.$refs.worktargetTable.toggleRowSelection(this.worktargetTypeList[i], true)
                            }
                        }
                    })
                }).catch(() => {})
            },
            // 获取worker类型信息
            getWorkerTypeList() {
                if(this.monitorObjectInfoRequestDTO.pageNumber=='')
                {
                    return ;
                }
                var queryParams = {

                    pageNumber: this.monitorObjectInfoRequestDTO.pageNumber

                }
                GET_WORKERETYPE_AND_SET_LIST(queryParams).then(( { data: res }) => {
                    if (res.code !== 0) {
                        return this.$message.error(res.msg)
                    }
                    this.workerTypeList = res.data
                    this.$nextTick(() => {
                        for (let i = 0; i < this.workerTypeList.length; i++) {
                            if (this.workerTypeList[i].isSelected) {

                                this.$refs.workerTable.toggleRowSelection(this.workerTypeList[i], true)
                            }
                        }
                    })
                }).catch(() => {})
            },
            // 获取事件类型信息
            getEventTypeTree() {
                if(this.monitorObjectInfoRequestDTO.pageNumber=='')
                {
                    return ;
                }
                this.eventTypeTree=[];
                var queryParams = {

                    pageNumber: this.monitorObjectInfoRequestDTO.pageNumber

                }
                GET_EVENTTYPETREE(queryParams).then(( { data: res }) => {
                    if (res.code !== 0) {
                        return this.$message.error(res.msg)
                    }
                    this.eventTypeTree = res.data
//
        }).catch(() => {})
            },

            changePageSet(pageNumber) {
                this.monitorObjectInfoRequestDTO.pageNumber = pageNumber
                this.monitorObjectInfoRequestDTO.subObjectList = []

               this.getVehicleTypeList();
                this.getWorktargetTypeList();
               this.getWorkerTypeList();
                this.getEventTypeTree();
                this.getEventTypeSet();
            },
            // 删除
            deleteHandle (id) {

                this.$confirm('完成信息核对, 确认提交?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
            this.$http.delete('/monitorconfig/monitorpageinfo/',{'data': [id]}

                ).then(({ data: res }) => {
                if (res.code !== 0) {
                    return this.$message.error(res.msg)
                }
                this.$message({
                    message: this.$t('prompt.success'),
                    type: 'success',
                    duration: 500,
                    onClose: () => {
                        this.getDataList();
                    }
                })
            }).catch(() => {})
        }).catch(() => {})
    },

            saveData() {
                // 车辆
                if(this.dataListSelections.length>0)
                {
                    var vehicleType = {}
                    vehicleType.objectTypeCode = 'vehicle'
                    vehicleType.typeInfoList = this.dataListSelections

                    this.monitorObjectInfoRequestDTO.subObjectList.push(vehicleType);

                }

                 // 作业对象
                if(this.worktargetListSelections.length>0)
                {
                    var worktargetType = {}
                    worktargetType.objectTypeCode = 'worktarget'
                    worktargetType.typeInfoList = this.worktargetListSelections

                    this.monitorObjectInfoRequestDTO.subObjectList.push(worktargetType);
                }

                // 人员
                if(this.workerListSelections.length>0)
                {
                    var workerType = {}
                    workerType.objectTypeCode = 'worker'
                    workerType.typeInfoList = this.workerListSelections
                    console.log(" wei 人员类型" + workerType.objectTypeCode);
                    this.monitorObjectInfoRequestDTO.subObjectList.push(workerType);
                }

                // 事件
                if(this.eventTypeSelections.length>0)
                {
                    var eventType = {}
                    eventType.objectTypeCode = 'event'
                   eventType.typeInfoList = this.eventTypeSelections
                   // eventType.typeInfoList = this.eventTypeSet
                    console.log(" wei 事件类型  eventType.typeInfoList" +  eventType.typeInfoList);
                    this.monitorObjectInfoRequestDTO.subObjectList.push(eventType);

                }


                SAVE_OR_UPDATE_MONITOR_OBJECT(this.monitorObjectInfoRequestDTO).then(({ data: res }) => {
                    if (res.code !== 0) {
                        return this.$message.error(res.msg)
                    }
                    this.$message({
                        message: '保存成功',
                        type: 'success',
                        duration: 500
                    })
                    this.monitorObjectInfoRequestDTO.subObjectList = [];
                })
            },
            //获取事件已经设置的信息
            getEventTypeSet() {
                if(this.monitorObjectInfoRequestDTO.pageNumber=='')
                {
                    return ;
                }
                this.eventTypeSet=[];
                var queryParams = {

                    pageNumber: this.monitorObjectInfoRequestDTO.pageNumber

                }
                GET_EVENTTYPESET(queryParams).then(( { data: res }) => {
                    if (res.code !== 0) {
                        return this.$message.error(res.msg)
                    }
                    this.eventTypeSet = res.data
                    console.log( this.eventTypeSet);

                }).catch(() => {})

        },

            // 选中事件节点
            treecurrentChecked () {
                this.eventTypeSelections= this.$refs.eventtree.getCheckedNodes();

                console.log( this.eventTypeSelections)


                //console.log(SelectedObj.checkedNodes)  // 这是选中的节点数组
               // this.eventTypeSelections=SelectedObj.checkedKeys;
            },

            }

    }
</script>
