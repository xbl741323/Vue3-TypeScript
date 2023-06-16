<template>
  <el-card shadow="never" class="aui-card--fill">
	  <el-container >
	    <el-aside :style="{width: asideWidth+'vw'}">
	      <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
	        <el-tab-pane :key="index"
			v-for="(item, index) in workTypeDataList"
			:label="item.name"
			:name="item.code" >
	          <div style="margin-top: 50px;background-color: white;">
	            <el-tree
	           	                :data="data"
	           	                node-key="id"
	           	                ref="carTree"
	           	                show-checkbox
	           	                highlight-current
	           	                @check="getCheckedNodes"
	           	                style="height: 68vh;overflow: auto;"
	           	                :filter-node-method="filterNode"
	           	                :props="defaultProps">
	           	         <span class="custom-tree-node" slot-scope="{ node, data }">
							 <span v-if="data.nodeType=='SysDeptDTO'"  style="color: black;">
							   <i class="el-icon-notebook-2"></i><span style="color: green;">{{ data.name }}</span>
							   </span>
	           	        	                <span v-if="data.nodeType=='vehicle'">
	           	        	                  <i class="el-icon-truck" style="color: green;"></i>
	           	        	                  <span style="color: green;">{{ data.plateNumber }}
											  <i class="el-icon-plus" @click.stop="add(node,data)"></i>
											  </span>
	           	        	      
	           	        	                </span>
	           	        	              </span>
	           	            </el-tree>
	          </div>
	        </el-tab-pane>
	      </el-tabs>
	    </el-aside>
	    <el-container>
	      <el-footer :style="{height: footerHeight+'vh', position: 'absolute',bottom: '-1vh',width: footerWidth+'%'}">
	        <div >
	          <el-table :data="dataList" class="show_table" style="width: 100%;" >
	            <el-table-column prop="deptName" label="所属部门" width="180" header-align="center" align="center"></el-table-column>
	            <el-table-column prop="plateNumber" label="车牌号" header-align="center" align="center"></el-table-column>
	            <el-table-column prop="carTypeName" label="车辆类型" header-align="center" align="center"></el-table-column>
	            <el-table-column prop="workttime" label="出车时间" header-align="center" align="center"></el-table-column>
	            <el-table-column prop="travelmileage" label="行驶里程" header-align="center" align="center"></el-table-column>
	            <el-table-column prop="overspeed" label="超速违规次数" header-align="center" align="center"></el-table-column>
	            <el-table-column prop="parkviolations" label="停车违规次数" header-align="center" align="center"></el-table-column>
	            <el-table-column prop="oilabnormal" label="油量异常次数" header-align="center" align="center"></el-table-column>
	          </el-table>
	          
	        </div>
	      </el-footer>
	    </el-container>
	  </el-container>
    <div class="mod-vehicle__tvehworkschedule">
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
        <el-form-item>
          <el-button @click="getDataList()">{{ $t('query') }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="info" @click="exportHandle()">{{ $t('export') }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button v-if="$hasPermission('vehicle:tvehworkschedule:save')" type="primary" @click="addOrUpdateHandle()">{{ $t('add') }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button v-if="$hasPermission('vehicle:tvehworkschedule:delete')" type="danger" @click="deleteHandle()">{{ $t('deleteBatch') }}</el-button>
        </el-form-item>
      </el-form>
      <el-table v-loading="dataListLoading" :data="dataList" border @selection-change="dataListSelectionChangeHandle" style="width: 100%;">
        <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
        <el-table-column prop="id" label="" header-align="center" align="center"></el-table-column>
        <el-table-column prop="workVehicleId" label="作业车辆id" header-align="center" align="center"></el-table-column>
        <el-table-column prop="workTypeCode" label="作业类型" header-align="center" align="center"></el-table-column>
        <el-table-column prop="workFrequency" label="作业频率" header-align="center" align="center"></el-table-column>
        <el-table-column prop="workNum" label="作业遍数(次数)" header-align="center" align="center"></el-table-column>
        <el-table-column prop="workTimeIds" label="" header-align="center" align="center"></el-table-column>
        <el-table-column prop="status" label="0 不生效。1生效" header-align="center" align="center"></el-table-column>
        <el-table-column prop="creator" label="创建人" header-align="center" align="center"></el-table-column>
        <el-table-column prop="createDate" label="创建时间" header-align="center" align="center"></el-table-column>
        <el-table-column prop="updater" label="更新人" header-align="center" align="center"></el-table-column>
        <el-table-column prop="updateDate" label="更新时间" header-align="center" align="center"></el-table-column>
        <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">
          <template slot-scope="scope">
            <el-button v-if="$hasPermission('vehicle:tvehworkschedule:update')" type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">{{ $t('update') }}</el-button>
            <el-button v-if="$hasPermission('vehicle:tvehworkschedule:delete')" type="text" size="small" @click="deleteHandle(scope.row.id)">{{ $t('delete') }}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        :current-page="page"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="limit"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="pageSizeChangeHandle"
        @current-change="pageCurrentChangeHandle">
      </el-pagination>
      <!-- 弹窗, 新增 / 修改 -->
      <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
    </div>
  </el-card>
</template>

<script>
import { getFrameWorkTypeList } from "@/api/framework/framework";
import { getDeptVehicleTreeByWorktype } from "@/api/vehicle/vehicle";

import mixinViewModule from '@/mixins/view-module'
import AddOrUpdate from './tvehworkschedule-add-or-update'
export default {
  mixins: [mixinViewModule],
  data () {
    return {
		asideWidth:20,
		asideShow:true,
		footerHeight:0,
		footerShow:true,
		footerWidth:77,
		footerBottom:35,
		activeName: 'first',
		workTypeDataList:[],
		data: [],
		defaultProps: {
		  children: 'children',
		  label: 'label'
		},
		queryParams:{
		  activeName:'',
		  status:-1,
		  carTypeIds:[],
		  carIds:[],
		  deptId:[],
		  page:1,
		  limit:5,
		  total:1,
		  deptIds:'',
		  vehicleIds:''
		},
      mixinViewModuleOptions: {
        getDataListURL: '/vehwork/tvehworkschedule/page',
        getDataListIsPage: true,
        exportURL: '/vehwork/tvehworkschedule/export',
        deleteURL: '/vehwork/tvehworkschedule',
        deleteIsBatch: true
      },
      dataForm: {
      }
    }
  },
  created () {
	  // 绑定tabs
	  getFrameWorkTypeList().then(response => {
	    this.workTypeDataList = response.data.data;
	    }
	  );
	},
  watch: {
  },
  components: {
    AddOrUpdate
  },
  methods: {
	  handleClick(tab, event) {
	    let name = tab.name;
		this.activeName = name;
		this.queryParams.activeName = name;
		console.log(name);
		this.initCarTree();
	  },
	  initCarTree(){
	    let that = this;
	    getDeptVehicleTreeByWorktype(that.queryParams).then(response => {
			console.log(response);
	      that.data = response.data.data;
	    });
	  },
	  filterNode(value, data) {
	    if (!value) return true;
	    return data.label.indexOf(value) !== -1;
	  },
	  getCheckedNodes() {
	    /* cluster.clearMarkers();
	    let nodesList = this.$refs.carTree.getCheckedNodes();
	    this.queryParams.carIds = [];
	    this.queryParams.deptId = [];
	    this.queryParams.vehicleIds='';
	    this.queryParams.deptIds='';
	    let deptWhetherInclude = true;
	    let index =0;
	    for (let i=0;i<nodesList.length;i++){
	      if(nodesList[i].nodeType == "dept"){
	        this.queryParams.deptId[index]=nodesList[i].id;
	        deptWhetherInclude = false;
	        index++;
	      }
	    }
	    if(deptWhetherInclude){
	      this.queryParams.carIds = this.$refs.carTree.getCheckedKeys();
	    }
	    if(this.queryParams.carIds.length > 0 || this.queryParams.deptId.length > 0){
	      this.markersClusterer();
	      this.queryWhereJoint();
	      this.queryParams.carIds = [];
	      this.queryParams.deptId=[];
	      this.initTable();
	    }else{
	      this.dataList=[];
	      this.queryParams.total=0;
	    } */
	  }
	  }
}
</script>
