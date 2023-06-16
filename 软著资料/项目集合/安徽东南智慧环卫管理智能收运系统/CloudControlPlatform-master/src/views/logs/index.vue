<template>
  <div class="app-container">
    <div class="filter-container">
      <el-date-picker
        class="time-stlye"
        v-model="timeValue"
        type="datetimerange"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        value-format="yyyy-MM-dd HH:mm:ss"
      >
      </el-date-picker>
      <el-input
        v-model="listQuery.username"
        placeholder="请输入用户名"
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
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      ref="logTable"
      :data="list"
      :border="false"
      :stripe="true"
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column :label="$t('用户名')" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.username }}</span>
        </template>
      </el-table-column>

      <el-table-column :label="$t('操作描述')" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.operation_details }}</span>
        </template>
      </el-table-column>

      <el-table-column :label="$t('操作时间')" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.operation_time }}</span>
        </template>
      </el-table-column>

      <el-table-column :label="$t('操作IP')" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.ip }}</span>
        </template>
      </el-table-column>
    </el-table>

   <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.page"
      :pageSize.sync="listQuery.pageSize"
      @pagination="getList"
    />
  </div>
</template>

<script>
import { inquireLog } from "@/api/logs";
import waves from "@/directive/waves"; // waves directive
import { parseTime } from "@/utils";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
import { Message } from "element-ui";

export default {
  watch: {
    timeValue(newVal, oldVal) {
      console.log(newVal, oldVal);
      if(newVal==null){
        this.timeValue=[]
      }
    },
    immediate: true,
    deep: true
  },
  name: "log",
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true, //改
      timeValue: [],
      listQuery: {
        page: 1,
        pageSize: 10,
        username: undefined,
        startTime: undefined,
        endTime: undefined
      },
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    //获取列表数据
    getList() {
      this.listLoading = false;
      if (this.timeValue.length > 0) {
        this.listQuery.startTime = this.timeValue[0].replace(/\-| |:/g, "");
        this.listQuery.endTime = this.timeValue[1].replace(/\-| |:/g, "");
      }
      inquireLog(this.listQuery).then(response => {
        this.list = response.data.logs;
        this.total = response.data.count;
      });
    },
    handleFilter() {
      this.listQuery.page = 1;
      this.getList();
    },
    
  }
};
</script>
<style scoped>
.filter-item {
  width: 150px;
}
.time-stlye {
  margin-bottom: 10px;
  display: inline-block;
  vertical-align: middle;
}

</style>