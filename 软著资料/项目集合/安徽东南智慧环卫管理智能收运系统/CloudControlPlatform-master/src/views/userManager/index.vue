<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.username"
        :placeholder="$t('userTable.username')"
        style="width: 200px"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-button
        v-waves
        class="filter-item"
        style="margin-left: 10px"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >
        {{ $t("userTable.search") }}
      </el-button>
      <el-button
        class="filter-item"
        style="margin-left: 10px"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >
        {{ $t("userTable.add") }}
      </el-button>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      stripe
      fit
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column
        :label="$t('userTable.username')"
        width="110px"
        align="center"
      >
        <template slot-scope="{ row }">
          <span class="link-type" @click="handleUpdate(row)">{{
            row.username
          }}</span>
        </template>
      </el-table-column>

      <el-table-column
        :label="$t('userTable.realName')"
        align="center"
        min-width="110px"
      >
        <template slot-scope="{ row }">
          <span>{{ row.realName }}</span>
        </template>
      </el-table-column>

      <el-table-column
        :label="$t('userTable.phoneNum')"
        align="center"
        min-width="110px"
      >
        <template slot-scope="{ row }">
          <span>{{ row.phoneNum }}</span>
        </template>
      </el-table-column>

      <el-table-column
        :label="$t('userTable.email')"
        align="center"
        min-width="200px"
      >
        <template slot-scope="{ row }">
          <span>{{ row.email }}</span>
        </template>
      </el-table-column>

      <el-table-column
        :label="$t('userTable.createTime')"
        min-width="150px"
        align="center"
      >
        <template slot-scope="{ row }">
          <span>{{ row.createTime | parseTime("{y}-{m}-{d} {h}:{i}") }}</span>
        </template>
      </el-table-column>

      <el-table-column
        :label="$t('userTable.alterTime')"
        align="center"
        min-width="150px"
      >
        <template slot-scope="{ row }">
          <span v-if="row.alterTime">{{ row.alterTime }}</span>
          <span v-else>0</span>
        </template>
      </el-table-column>

      <el-table-column
        :label="$t('userTable.userStatus')"
        class-name="status-col"
        min-width="100px"
      >
        <template slot-scope="{ row }">
          {{ row.userStatus == 0 ? "激活" : "禁用" }}
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('userTable.actions')"
        align="center"
        min-width="300px"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{ row, $index }">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            {{ $t("userTable.edit") }}
          </el-button>
          <el-button
            v-if="row.userStatus != '0'"
            size="mini"
            type="success"
            @click="handleModifyStatus(row, 0)"
          >
            {{ $t("激活") }}
          </el-button>
          <el-button
            v-if="row.userStatus != '1'"
            size="mini"
            @click="handleModifyStatus(row, 1)"
          >
            {{ $t("禁用") }}
          </el-button>
          <el-button
            v-if="row.userStatus != 'deleted'"
            size="mini"
            type="danger"
            @click="handleDelete(row, $index)"
          >
            {{ $t("userTable.delete") }}
          </el-button>
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

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="90px"
        style="width: 400px; margin-left: 50px"
      >
        <el-form-item :label="$t('userTable.username')" prop="username">
          <el-input
            nput
            v-model="temp.username"
            :disabled="dialogStatus === 'create' ? false : true"
          />
        </el-form-item>
        <el-form-item
          :label="$t('userTable.password')"
          :required="dialogStatus === 'create' ? true : false"
        >
          <el-input type="password" v-model="temp.password" />
        </el-form-item>
        <el-form-item :label="$t('userTable.realName')" prop="realName">
          <el-input v-model="temp.realName" />
        </el-form-item>
        <el-form-item :label="$t('userTable.email')" prop="email">
          <el-input type="email" v-model="temp.email" />
        </el-form-item>
        <el-form-item :label="$t('userTable.phoneNum')" prop="phoneNum">
          <el-input type="text" v-model="temp.phoneNum" />
        </el-form-item>
        <el-form-item :label="$t('userTable.orgId')" prop="orgId">
          <el-select
            v-model="temp.orgId"
            class="filter-item"
            placeholder="请选择组织"
          >
            <el-option
              v-for="item in calendarTypeOptions"
              :key="item.key"
              :label="item.display_name"
              :value="item.key"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          {{ $t("userTable.cancel") }}
        </el-button>
        <el-button
          type="primary"
          @click="dialogStatus === 'create' ? createData() : updateData()"
        >
          {{ $t("userTable.confirm") }}
        </el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogPvVisible" title="Reading statistics">
      <el-table
        :data="pvData"
        border
        fit
        highlight-current-row
        style="width: 100%"
      >
        <el-table-column prop="key" label="Channel" />
        <el-table-column prop="pv" label="Pv" />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false">{{
          $t("userTable.confirm")
        }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  fetchList,
  deletedUser,
  createUser,
  updateUser,
} from "@/api/userManager";
import waves from "@/directive/waves"; // waves directive
import { parseTime } from "@/utils";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
import { Message } from "element-ui";

const calendarTypeOptions = [{ key: "1", display_name: "根组织" }];

// arr to obj, such as { CN : "China", US : "USA" }
const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name;
  return acc;
}, {});

export default {
  name: "ComplexTable",
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: "success",
        draft: "info",
        deleted: "danger",
      };
      return statusMap[status];
    },
    typeFilter(type) {
      return calendarTypeKeyValue[type];
    },
  },
  data() {
    const validatePassword = (rule, value, callback) => {
      var reg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[A-Za-z0-9]{8,20}$/;
      if (this.dialogStatus == "create") {
        if (!reg.test(value)) {
          callback(new Error("密码必须包含大小写字母和数字，且为8-20位"));
        } else {
          callback();
        }
      }
    };
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        pageSize: 10,
        username: undefined,
        orgId: 1,
      },
      calendarTypeOptions,
      temp: {
        username: "",
        password: "",
        realName: "",
        email: "",
        phoneNum: "",
        orgId: "",
      },
      dialogFormVisible: false,
      dialogStatus: "",
      textMap: {
        update: "修改用户",
        create: "新增用户",
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
        ],
        password: [{ trigger: "blur", validator: validatePassword }],
        realName: [
          { required: true, message: "请输入真实姓名", trigger: "blur" },
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          {
            type: "email",
            message: "请输入正确的邮箱地址",
            trigger: ["blur", "change"],
          },
        ],
        phoneNum: [
          { required: true, message: "请输入联系方式", trigger: "blur" },
        ],
        orgId: [{ required: true, message: "请选择组织", trigger: "blur" }],
      },
      downloadLoading: false,
    };
  },
  created() {
    this.getList();
  },
  methods: {
    //获取列表数据
    getList() {
      this.listLoading = true;
      fetchList(this.listQuery).then((response) => {
        this.list = response.data.users;
        this.total = response.data.count;

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false;
        }, 0);
      });
    },
    handleFilter() {
      this.listQuery.page = 1;
      this.getList();
    },
    //重置
    resetTemp() {
      this.temp = {
        id: undefined,
        username: "",
        password: "",
        realName: "",
        phoneNum: "",
        orgId: "",
      };
    },
    handleCreate() {
      this.resetTemp();
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    //新增
    createData() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          createUser(this.temp).then((response) => {
            this.dialogFormVisible = false;
            if (response.code == 200) {
              Message({
                message: response.message,
                type: "success",
                duration: 3000,
              });
              this.getList();
            } else {
              Message({
                message: response.message,
                type: "error",
                duration: 3000,
              });
            }
          });
        }
      });
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row); // copy obj
      this.dialogStatus = "update";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    //更新
    updateData() {
      console.log(this.temp);
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          console.log(22);
          const tempData = Object.assign({}, this.temp);
          tempData.timestamp = +new Date(tempData.timestamp); // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          updateUser(tempData).then((response) => {
            const index = this.list.findIndex((v) => v.id === this.temp.id);
            this.list.splice(index, 1, this.temp);
            this.dialogFormVisible = false;
            if (response.code == 200) {
              Message({
                message: "更新成功",
                type: "success",
                duration: 3000,
              });
              this.getList();
            } else {
              Message({
                message: response.message,
                type: "error",
                duration: 3000,
              });
            }
          });
        }
      });
    },
    //禁用启用用户
    handleModifyStatus(row, status) {
      const tempData = Object.assign({}, row);
      const data = { username: tempData.username, userStatus: status };
      updateUser(data).then((response) => {
        if (response.code == 200) {
          Message({
            message: "操作成功",
            type: "success",
            duration: 3000,
          });
        } else {
          Message({
            message: "操作失败",
            type: "error",
            duration: 3000,
          });
        }
      });
      row.userStatus = status;
    },
    //删除用户
    handleDelete(row, index) {
      const tempData = Object.assign({}, row);
      const data = { username: tempData.username };
      deletedUser(data).then((response) => {
        if (response.code == 200) {
          this.getList();
          Message({
            message: "删除成功",
            type: "success",
            duration: 3000,
          });
        } else {
          Message({
            message: "删除失败",
            type: "error",
            duration: 3000,
          });
        }
      });
    },
  },
};
</script>
