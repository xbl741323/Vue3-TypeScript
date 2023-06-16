<style>
    .div-inline{display: inline;width:300px}
</style>

<template>
    <div style="display:block;overflow:auto;">


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
                                    <!--<el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">删除</el-button> -->
                                  <el-button type="text" size="small" @click="changePageSet(scope.row.pageNumber)">监控对象设置</el-button>

                                    <router-link :to="{path:'pagecomponentconfigtree',query:{setid:123456}}">
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

            <div style="width: 350px;float:left;">
                <el-container>
                    <el-header>
                        车辆列表
                    </el-header>
                    <el-main>
                        <el-table ref="vehicleTable" :data="vehicleTypeList" border style="width: 300px;" @selection-change="dataListSelectionChangeHandle">
                            <el-table-column type="selection" header-align="center" align="center" width="10"></el-table-column>
                            <el-table-column prop="detailTypeName" label="车辆类型" header-align="center" align="center"  ></el-table-column>

                            <el-table-column label="操作" fixed="right" header-align="center" align="center" width="150">
                                <template slot-scope="scope">

                                </template>
                            </el-table-column>
                        </el-table>

                    </el-main>
                </el-container>
            </div>
            <div style="width: 350px;float:left;">
                <el-container>
                    <el-header>
                        人员列表
                    </el-header>
                    <el-main>
                        <el-table  ref="workerTable"  :data="workerTypeList" border style="width: 300px;" @selection-change="workerListSelectionChangeHandle">
                            <el-table-column type="selection" header-align="center" align="center" width="10"></el-table-column>
                            <el-table-column prop="detailTypeName" label="人员类型" header-align="center" align="center"  ></el-table-column>

                            <el-table-column label="操作" fixed="right" header-align="center" align="center" width="150">
                                <template slot-scope="scope">

                                </template>
                            </el-table-column>
                        </el-table>

                    </el-main>
                </el-container>
            </div>
            <div style="width: 350px;float:left;">
                <el-container>
                    <el-header>
                        设施列表
                    </el-header>
                    <el-main>
                        <el-table  ref="worktargetTable" :data="worktargetTypeList" border style="width: 300px;" @selection-change="worktargetListSelectionChangeHandle">
                            <el-table-column type="selection" header-align="center" align="center" width="10"></el-table-column>
                            <el-table-column prop="detailTypeName" label="设施类型" header-align="center" align="center"   ></el-table-column>

                            <el-table-column label="操作" fixed="right" header-align="center" align="center" width="150">
                                <template slot-scope="scope">

                                </template>
                            </el-table-column>
                        </el-table>

                    </el-main>
                </el-container>
            </div>
            <div class="app-container post_type_list" style="width: 800px ">
                <el-container class="container_wrap">

                </el-container>

            </div>

        </div>
        <div style="width: 800px ">   <el-button @click="saveData()"> 保存</el-button></div>


    </div>
</template>

<script>
    import { GETPAGELIST, GET_VEHICLETYPE_LIST, SAVE_OR_UPDATE_MONITOR_OBJECT, GET_VEHICLETYPE_AND_SET_LIST,GET_WORKTAEGETETYPE_AND_SET_LIST,GET_WORKERETYPE_AND_SET_LIST }  from "@/api/monitorconfig";
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

                dataListSelections: [], // 车辆数据列表，多选项
                workerListSelections: [], // 作业人员数据列表，多选项
                worktargetListSelections: [], //作业对象数据列表，多选项
                addOrUpdateVisible: false, // 新增／更新，弹窗visible状态

                monitorObjectInfoRequestDTO: {
                    pageNumber: '',
                    subObjectList: []
                },
                dataForm: {
                    id: ''
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


            changePageSet(pageNumber) {
                this.monitorObjectInfoRequestDTO.pageNumber = pageNumber
                this.monitorObjectInfoRequestDTO.subObjectList = []

                this.getVehicleTypeList();
                this.getWorktargetTypeList();
                this.getWorkerTypeList();
            },

            saveData() {
                // 车辆
                var vehicleType = {}
                vehicleType.objectTypeCode = 'vehicle'
                vehicleType.typeInfoList = this.dataListSelections

                this.monitorObjectInfoRequestDTO.subObjectList.push(vehicleType);

                 // 作业对象

                var worktargetType = {}
                worktargetType.objectTypeCode = 'worktarget'
                worktargetType.typeInfoList = this.worktargetListSelections

                this.monitorObjectInfoRequestDTO.subObjectList.push(worktargetType);
                // 人员
                var workerType = {}
                workerType.objectTypeCode = 'worker'
                workerType.typeInfoList = this.workerListSelections

                this.monitorObjectInfoRequestDTO.subObjectList.push(workerType);
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
            }

        },


    }
</script>
