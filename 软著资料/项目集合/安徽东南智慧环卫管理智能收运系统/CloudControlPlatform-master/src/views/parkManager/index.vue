<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.parkName"
        placeholder="请输入园区名称"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-button
        v-waves
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >
        {{ $t("搜索") }}
      </el-button>
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="goCreatePark"
      >
        {{ $t("添加") }}
      </el-button>
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-delete"
        @click="handleDelete"
      >
        {{ $t("删除") }}
      </el-button>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      ref="parkTable"
      :data="list"
      :border="false"
      :stripe="true"
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column type="selection" width="55"> </el-table-column>
      <el-table-column :label="$t('园区名称')" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.parkName }}</span>
        </template>
      </el-table-column>

      <el-table-column :label="$t('园区属性')" align="center">
        <template slot-scope="{ row }">
          <span>{{ parkProperty[row.parkProperty] }}</span>
        </template>
      </el-table-column>

      <el-table-column :label="$t('创建用户')" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.createUserName }}</span>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />
  </div>
</template>

<script>
import { inquirePark, createPark, deletedPark } from "@/api/park";
import waves from "@/directive/waves"; // waves directive
import { parseTime } from "@/utils";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
import { Message } from "element-ui";

export default {
  name: "park",
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true, //改
      listQuery: {
        page: 1,
        pageSize: 20,
        parkName: undefined
      },
      parkProperty: ["", "开放园区", "封闭园区"]
    };
  },
  created() {
    this.getList();
  },
  methods: {
    //获取列表数据
    getList() {
      this.listLoading = false;
      inquirePark(this.listQuery).then(response => {
        this.list = response.data.parks;
        this.total = response.data.count;
      });
    },
    handleFilter() {
      this.listQuery.page = 1;
      this.getList();
    },

    //跳转新增
    goCreatePark() {
      this.$router.push({ name: "createPark" });
    },
    //删除园区
    handleDelete(row, index) {
      
      const data = [];
      const selectedData = this.$refs.parkTable.selection;
      if(selectedData.length<1){
         Message({
            message: "请选择要删除的作业园区",
            type: "error",
            duration: 3000
          });
          return 
      }
      for (let item of selectedData) {
        data.push(item.parkName);
      }
      const sendData = { parkName: data.join(',')};
      deletedPark(sendData).then(response => {
        if (response.code == 200) {
          this.getList();
           Message({
            message: "删除成功",
            type: "error",
            duration: 2000
          });
        } else {
          Message({
            message: response.message,
            type: "error",
            duration: 2000
          });
        }
      });
    }
  }
};
</script>
