<template>
    <el-card shadow="never" class="aui-card--fill">
        <div class="div-inline">
            <div style="width: 300px;float:left;">
                <el-container>
                    <el-header>
 监控对象设置2
                        <!-- @tab-click="handleClick" -->
                    </el-header>
                    <el-main>

                        <el-tabs v-model="activeName" @tab-click="tabhandleClick">
                            <el-tab-pane label="监控地图" name="monitorMap" >
                                <el-tree ref="tree1"
                                         :data="monitorObjectTree"

                                         node-key="id"

                                         @node-click="handleTreeClick"
                                         :props="defaultProps">
                                </el-tree>
                            </el-tab-pane>

                            <el-tab-pane label="监控列表" name="monitorList">
                                <el-tree ref="tree2"
                                         :data="monitorObjectTree"

                                         node-key="id"

                                         @node-click="handleTreeClick"
                                         :props="defaultProps">
                                </el-tree>
                            </el-tab-pane>
                            <el-tab-pane label="轨迹回放" name="traceReplay">
                                <el-tree ref="tree3"
                                         :data="monitorObjectTree"

                                         node-key="id"

                                         @node-click="handleTreeClick"
                                         :props="defaultProps">
                                </el-tree>
                            </el-tab-pane>
                            <el-tab-pane label="统计报表" name="统计报表"  key="statisReport">
                                <el-tree ref="tree4"
                                         :data="monitorObjectTree"

                                         node-key="id"

                                         @node-click="handleTreeClick"
                                         :props="defaultProps">
                                </el-tree>
                            </el-tab-pane>
                        </el-tabs>

                        <!-- 弹窗, 新增 / 修改
                        <AddOrUpdate v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></AddOrUpdate>-->

                    </el-main>
                </el-container>

            </div>

            <div style="width: 350px;float:left;">
                <el-container>
                    <el-header>
                        基础数据

                    </el-header>
                    <el-main>
                        <el-table ref="basedataTable" :data="basedataList" border style="width: 300px;" @selection-change="dataListSelectionChangeHandle1">
                            <el-table-column type="selection" header-align="center" align="center" width="10"  ></el-table-column>
                            <el-table-column prop="fieldName" label="字段名" header-align="center" align="center"  ></el-table-column>


                        </el-table>

                    </el-main>
                </el-container>
            </div>
            <div style="width: 350px;float:left;">
                <el-container>
                    <el-header>
                        终端设备数据
                    </el-header>
                    <el-main>
                        <el-table ref="devicedataTable" :data="devicedataList" border style="width: 300px;"  @selection-change="dataListSelectionChangeHandle2">
                            <el-table-column type="selection" header-align="center" align="center" width="10"></el-table-column>
                            <el-table-column prop="fieldName" label="字段名" header-align="center" align="center"  ></el-table-column>


                        </el-table>

                    </el-main>
                </el-container>
            </div>
            <div style="width: 350px;float:left;">
                <el-container>
                    <el-header>
                        作业数据
                    </el-header>
                    <el-main>
                        <el-table  ref="workdataTable"  :data="workdataList" border style="width: 300px;"  @selection-change="dataListSelectionChangeHandle3">
                            <el-table-column type="selection" header-align="center" align="center" width="10"></el-table-column>
                            <el-table-column prop="fieldName" label="字段名" header-align="center" align="center"  ></el-table-column>


                        </el-table>

                    </el-main>
                </el-container>
            </div>
            <div style="width: 350px;float:left;">
                <el-container>
                    <el-header>
                        操作项
                    </el-header>
                    <el-main>
                        <el-table ref="operatedataTable" :data="operatedataList" border style="width: 300px;"  @selection-change="dataListSelectionChangeHandle4">
                            <el-table-column type="selection" header-align="center" align="center" width="10"></el-table-column>
                            <el-table-column prop="fieldName" label="字段名" header-align="center" align="center"  ></el-table-column>


                        </el-table>

                    </el-main>
                </el-container>
            </div>

        </div>
        <div style="width: 800px ">   <el-button @click="saveData()"> 保存</el-button></div>
    </el-card>
</template>
<script>
    import { GET_MONITOR_OBJECTTYPE_TREE,GET_LIST_BYOBJECTTYPECODE  ,SAVEUPDATE_COM_FIELDS} from "@/api/monitorconfig";
    export default {
        data() {
            return {
                activeName:"",
                pageNumber:"",
                // 详细类型配置
                detailTypeConfigId:"",
                // 大类型配置
                objectTypeConfigId:"",
                currentdetailTypeId:0,
                // 增加详细类型code
                currentdetailTypeCode:"",
                currentbigTypeCode:"",
                // 当前tab 的类型
                componentTypeCode:"",
                dataListSelections:[],
                basedataSelections:[],
                workdataSelections:[],
                operatedataSelections:[],
                devicedataSelections:[],

                basedataList:[],
                workdataList:[],
                devicedataList:[],
                operatedataList:[],
                defaultProps: {
                    children: 'children',
                    label: 'label'
                },
                monitorObjectTree: []
            };
        },
        methods: {
            getObjectTypeTree() {
                GET_MONITOR_OBJECTTYPE_TREE({
                    pageNumber: this.pageNumber,

                })
                    .then((res) => {
                       console.log(" 对象树 "+res.data.data);
                        this.monitorObjectTree=res.data.data
                    })
                    .catch();
            },
            // 树节点点击
            handleTreeClick(data, node, vuecomponent) {
                console.log(   data );
                if(data.pid!=0)
                {
                    this.detailTypeConfigId=data.id;
                    this.objectTypeConfigId=data.pid;
                    this.currentdetailTypeId=data.obj.detailTypeId;
                    this.currentbigTypeCode=data.obj.bigTypeCode;
                    this.currentdetailTypeCode= data.code;
                    console.log('.pid!=00 data.currentdetailTypeCode:',  data.obj.currentdetailTypeCode,'\n');
                    console.log('.pid!=00 data.code:',  data.code,'\n');
                    // 取消已选择，从新加载设置的字段
                   // this.dataListSelections=[];
                   // this.$refs.basedataTable.clearSelection();

                    //获取点击类的 四种数据和选中状态。
                }
                else if (data.pid==0)
                {
                    // 大类

                    this.detailTypeConfigId=0;
                    this.objectTypeConfigId=data.id;
                    this.currentdetailTypeId=0;
                    this.currentbigTypeCode=data.obj.objectBigTypeCode;
                    this.currentdetailTypeCode='';
                    console.log('pid==0data.currentdetailTypeId:::',  this.currentdetailTypeId,'\n');
                }

                this.getListBasedata();
                this.getListWorkdata();
                this.getListDevicedata();
                this.getListOperatedata();
                console.log('data.currentdetailType关键Id:::',  this.currentdetailTypeId,'\n');
            },
            tabhandleClick(tab,event) {

                    this.componentTypeCode = tab.name;
                    console.log("this.componentTypeCode::"+this.componentTypeCode);
            },
            // 基本数据 ，带设置
            getListBasedata() {
                  this.basedataSelections=[]
                  this.$refs.basedataTable.clearSelection();
                GET_LIST_BYOBJECTTYPECODE({

                    detailTypeConfigId: this.detailTypeConfigId,
                     objectTypeConfigId:this.objectTypeConfigId,
                    objectTypeCode: this.currentbigTypeCode,
                    detailTypeCode: this.currentdetailTypeCode,
                    componentTypeCode:this.componentTypeCode,
                    quotaTypeCode: "basedata"

                })
                    .then((res) => {
                        console.log(res.data.data);
                        this.basedataList=res.data.data
                        this.$nextTick(() => {
                            for (let i = 0; i < this.basedataList.length; i++) {
                                if (this.basedataList[i].isSelected) {
                                    this.$refs.basedataTable.toggleRowSelection(this.basedataList[i], true)
                                }
                            }
                        })
                    })
                    .catch();
            },
            // 作业数据，带设置
            getListWorkdata() {
                    this.workdataSelections=[];
                    this.$refs.workdataTable.clearSelection();
                GET_LIST_BYOBJECTTYPECODE({
                    detailTypeConfigId: this.detailTypeConfigId,
                    objectTypeConfigId:this.objectTypeConfigId,
                    detailTypeCode: this.currentdetailTypeCode,
                    objectTypeCode: this.currentbigTypeCode,
                    componentTypeCode:this.componentTypeCode,
                    quotaTypeCode: "workdata"

                })
                    .then((res) => {

                        this.workdataList=res.data.data
                        this.$nextTick(() => {
                            for (let i = 0; i < this.workdataList.length; i++) {
                                if (this.workdataList[i].isSelected) {
                                    this.$refs.workdataTable.toggleRowSelection(this.workdataList[i], true)
                                }
                            }
                        })
                    })
                    .catch();
            },
            // 设备数据，带设置
            getListDevicedata() {

                 this.devicedataSelections =[]
                this.$refs.devicedataTable.clearSelection();
                GET_LIST_BYOBJECTTYPECODE({
                    detailTypeConfigId: this.detailTypeConfigId,
                    objectTypeConfigId:this.objectTypeConfigId,
                    detailTypeCode: this.currentdetailTypeCode,
                    objectTypeCode: this.currentbigTypeCode,
                    componentTypeCode:this.componentTypeCode,
                    quotaTypeCode: "devicedata"

                })
                    .then((res) => {

                        this.devicedataList=res.data.data

                        this.$nextTick(() => {
                            for (let i = 0; i < this.devicedataList.length; i++) {
                                if (this.devicedataList[i].isSelected) {
                                    this.$refs.devicedataTable.toggleRowSelection(this.devicedataList[i], true)
                                }
                            }
                        })
                    })
                    .catch();
            },


            // 操作数据，带设置
            getListOperatedata() {
                this.operatedataSelections=[]
                this.$refs.operatedataTable.clearSelection();
                GET_LIST_BYOBJECTTYPECODE({
                    detailTypeConfigId: this.detailTypeConfigId,
                    objectTypeConfigId:this.objectTypeConfigId,
                    detailTypeCode: this.currentdetailTypeCode,
                    objectTypeCode: this.currentbigTypeCode,
                    componentTypeCode:this.componentTypeCode,
                    quotaTypeCode: "operatedata"

                })
                    .then((res) => {

                        this.operatedataList=res.data.data
                        this.$nextTick(() => {
                            for (let i = 0; i < this.operatedataList.length; i++) {
                                if (this.operatedataList[i].isSelected) {
                                    this.$refs.operatedataTable.toggleRowSelection(this.operatedataList[i], true)
                                }
                            }
                        })
                    })
                    .catch();
            },

            // 多选-基础
            dataListSelectionChangeHandle1(val) {
                this.basedataSelections = val
            },
            // 多选-作业
            dataListSelectionChangeHandle2(val) {
                this.workdataSelections = val
            },
            // 多选-操作
            dataListSelectionChangeHandle3(val) {
                this.operatedataSelections = val
            },
            // 多选- 设备
            dataListSelectionChangeHandle4(val) {
                this.devicedataSelections = val
            },
            // 保存数据
            saveData() {
                var pageComponentFieldRequestDTO = {}

                pageComponentFieldRequestDTO.objectTypeConfigId=this.objectTypeConfigId

                pageComponentFieldRequestDTO.objectDetailTypeConfigId=this.detailTypeConfigId
                pageComponentFieldRequestDTO.componentTypeCode=this.componentTypeCode
                pageComponentFieldRequestDTO.bigObjectTypeCode=this.currentbigTypeCode
                pageComponentFieldRequestDTO.detailTypeCode= this.currentdetailTypeCode,
                this.dataListSelections = this.basedataSelections.concat(this.workdataSelections).concat(this.operatedataSelections).concat(this.devicedataSelections);
                pageComponentFieldRequestDTO.fieldDTOList = this.dataListSelections

                SAVEUPDATE_COM_FIELDS(pageComponentFieldRequestDTO).then(({ data: res }) => {
                    if (res.code !== 0) {
                        return this.$message.error(res.msg)
                    }
                    this.dataListSelections=[];
                    this.$message({
                        message: '保存成功',
                        type: 'success',
                        duration: 500
                    })
                })
            }
        },


        activated () {
            this.pageNumber =  this.$route.query.pageNumber ;

            this.currentConfigId=0;
            this.getObjectTypeTree();

        },


    };
</script>