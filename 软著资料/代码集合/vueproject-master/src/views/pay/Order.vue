/**
 * 订单管理 交易订单
 */
<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">环卫人员管理</el-breadcrumb-item>
      <el-breadcrumb-item>人员信息管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索筛选 -->
    <el-form :inline="true" :model="formInline" class="user-search">
      <el-form-item label="搜索：">
        <el-input size="small" v-model="formInline.machineNo" placeholder="请输入姓名"></el-input>
      </el-form-item>
      <el-form-item>
        <el-select size="small" v-model="formInline.orderNo" placeholder="请选择性别"></el-select>
      </el-form-item>
      <el-form-item>
        <el-select size="small" v-model="formInline.transId" placeholder="请选择工作状态"></el-select>
      </el-form-item>

      <el-form-item>
        <el-button size="small" type="primary" icon="el-icon-search" @click="search">搜索</el-button>
        <el-button size="small" type="primary" icon="el-icon-plus" @click="addVisiable = true">添加</el-button>
      </el-form-item>
    </el-form>

    <el-table size="small" :data="listData" highlight-current-row v-loading="loading" border element-loading-text="拼命加载中" style="width: 100%;">
      <el-table-column align="center" type="index" width="60">
      </el-table-column>
      <el-table-column sortable prop="name" label="姓名" show-overflow-tooltip>
      </el-table-column>
      <el-table-column sortable prop="address" label="地址" show-overflow-tooltip>
      </el-table-column>
      <el-table-column sortable prop="gender" label="性别" show-overflow-tooltip>
      </el-table-column>
      <el-table-column sortable prop="age" label="年龄" show-overflow-tooltip>
      </el-table-column>
      <el-table-column sortable prop="workStatus" label="工作状态" show-overflow-tooltip>
      </el-table-column>
      <el-table-column sortable prop="createTime" label="创建时间" show-overflow-tooltip>
      </el-table-column>
      
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="addVisiable = true">编辑</el-button>
          <el-button size="mini" type="danger" @click="deleteUser(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <Pagination v-bind:child-msg="pageparm" @callFather="callFather"></Pagination>
    <!-- 编辑界面 -->
    <el-dialog title="环卫人员编辑" :visible.sync="addVisiable" width="30%" @click="closeDialog">
      <el-form label-width="120px" :model="addForm" :rules="rules" ref="editForm">
        <el-form-item label="姓名" prop="name">
          <el-input size="small" v-model="addForm.name" auto-complete="off" placeholder="请输入姓名"></el-input>
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input size="small" v-model="addForm.address" auto-complete="off" placeholder="请输入居住地址"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-select size="small" v-model="addForm.gender" auto-complete="off" placeholder="请选择性别">
            <el-option label="男" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="年龄" prop="age">
          <el-input size="small" v-model="addForm.age" auto-complete="off" placeholder="请输入年龄"></el-input>
        </el-form-item>
        <el-form-item label="工作状态" prop="status">
          <el-select size="small" v-model="addForm.status" auto-complete="off" placeholder="请选择工作状态">
              <el-option label="休息中" value="1"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="closeDialog">取消</el-button>
        <el-button size="small" type="primary" :loading="loading" class="title" @click="submitForm('editForm')">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { OrderList, OrderRefund, OrderDelete } from '../../api/payMG'
import Pagination from '../../components/Pagination'
export default {
  data() {
    return {
      addVisiable: false,
      addForm:{
       name:'xxx',
       address:'安徽合肥xxx',
       gender:'1',
       age:'50',
       status:'1'
      },
      rules: {
        name: [
          { required: true, message: '请输入部门名称', trigger: 'blur' }
        ],
        address: [
          { required: true, message: '请输入部门名称', trigger: 'blur' }
        ],
        gender: [
          { required: true, message: '请输入部门名称', trigger: 'blur' }
        ],
        age: [
          { required: true, message: '请输入部门名称', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '请输入部门名称', trigger: 'blur' }
        ],
      },
      loading: false, //是显示加载
      editFormVisible: false, //控制编辑页面显示与隐藏
      title: '预览',
      payType: [
        { key: '请选择', value: 0 },
        { key: '现金', value: 1 },
        { key: '支付宝', value: 2 },
        { key: '微信', value: 3 },
        { key: 'POS通', value: 4 },
        { key: '闪付', value: 5 },
        { key: 'POS通C扫B', value: 6 },
        { key: '银联二维码', value: 8 },
        { key: '会员余额支付', value: 9 }
      ],
      payway: [
        { key: '请选择', value: 0 },
        { key: '初始化', value: 1 },
        { key: '已支付', value: 2 },
        { key: '出货成功', value: 3 },
        { key: '出货失败', value: 4 },
        { key: '订单超时', value: 5 },
        { key: '退款初始化', value: 11 },
        { key: '退款进行中', value: 12 },
        { key: '退款成功', value: 13 },
        { key: '退款失败', value: 14 },
        { key: '订单处理中', value: 10 }
      ],
      editForm: {
        id: '',
        name: '',
        payType: 1,
        partner: '',
        subMchId: '',
        appid: '',
        notifyUrl: '',
        signType: '',
        partnerKey: '',
        sellerUserId: '',
        certPath: '',
        certPassword: '',
        rsaKey: '',
        token: localStorage.getItem('logintoken')
      },
      formInline: {
        page: 1,
        limit: 10,
        machineNo: '',
        orderNo: '',
        transId: '',
        payType: 0,
        orderStatus: 0,
        token: localStorage.getItem('logintoken')
      },
      // 删除部门
      seletedata: {
        ids: '',
        token: localStorage.getItem('logintoken')
      },
      userparm: [], //搜索权限
      listData: [], //用户数据
      // 分页参数
      pageparm: {
        currentPage: 1,
        pageSize: 10,
        total: 10
      }
    }
  },
  // 注册组件
  components: {
    Pagination
  },
  /**
   * 数据发生改变
   */

  /**
   * 创建完毕
   */
  created() {
    this.getdata(this.formInline)
  },

  /**
   * 里面的方法只有被调用才会执行
   */
  methods: {
    // 获取公司列表
    getdata(parameter) {
      this.loading = true
      // 模拟数据开始
      let res = {
        code: 0,
        msg: null,
        count: 23,
        data: [
          {
            name:'xxx',
            address:"安徽合肥xxx",
            gender:'男',
            age: 50,
            workStatus:"休息中",
            createTime: "2020-08-12"
          },
          {
            name:'xxx',
            address:"安徽芜湖xxx",
            gender:'男',
            age: 50,
            workStatus:"休息中",
            createTime: "2022-10-12"
          },
          {
            name:'xxx',
            address:"安徽合肥xxx",
            gender:'男',
            age: 55,
            workStatus:"休息中",
            createTime: "2022-01-12"
          },
          {
            name:'xxx',
            address:"安徽合肥xxx",
            gender:'女',
            age: 40,
            workStatus:"工作中",
            createTime: "2022-10-12"
          },
          {
            name:'xxx',
            address:"安徽滁州xxx",
            gender:'男',
            age: 50,
            workStatus:"休息中",
            createTime: "2021-10-12"
          },
          {
            name:'xxx',
            address:"安徽合肥xxx",
            gender:'男',
            age: 44,
            workStatus:"休息中",
            createTime: "2022-10-12"
          },
          {
            name:'xxx',
            address:"安徽合肥xxx",
            gender:'男',
            age: 50,
            workStatus:"工作中",
            createTime: "2022-10-12"
          },
          {
            name:'xxx',
            address:"安徽合肥xxx",
            gender:'男',
            age: 50,
            workStatus:"工作中",
            createTime: "2022-10-12"
          },
          {
            name:'xxx',
            address:"安徽合肥xxx",
            gender:'男',
            age: 50,
            workStatus:"工作中",
            createTime: "2022-10-12"
          },
          {
            name:'xxx',
            address:"安徽合肥xxx",
            gender:'男',
            age: 50,
            workStatus:"工作中",
            createTime: "2022-10-12"
          },
        ]
      }
      this.loading = false
      this.listData = res.data
      this.pageparm.currentPage = this.formInline.page
      this.pageparm.pageSize = this.formInline.limit
      this.pageparm.total = res.count
      // 模拟数据结束

      /***
       * 调用接口，注释上面模拟数据 取消下面注释
       */

      // OrderList(parameter)
      //   .then(res => {
      //     this.loading = false
      //     if (res.success == false) {
      //       this.$message({
      //         type: 'info',
      //         message: res.msg
      //       })
      //     } else {
      //       this.listData = res.data
      //       // 分页赋值
      //       this.pageparm.currentPage = this.formInline.page
      //       this.pageparm.pageSize = this.formInline.limit
      //       this.pageparm.total = res.count
      //     }
      //   })
      //   .catch(err => {
      //     this.loading = false
      //     this.$message.error('菜单加载失败，请稍后再试！')
      //   })
    },
    // 分页插件事件
    callFather(parm) {
      this.formInline.page = parm.currentPage
      this.formInline.limit = parm.pageSize
      this.getdata(this.formInline)
    },
    // 搜索事件
    search() {
      this.getdata(this.formInline)
    },
    //显示编辑界面
    handleEdit: function(index, row) {
      this.editFormVisible = true
      this.editForm = row
    },
    // 编辑、增加页面保存方法
    submitForm(editData) {
      this.$refs[editData].validate(valid => {
        if (valid) {
          ConfigSave(this.editForm)
            .then(res => {
              this.editFormVisible = false
              this.loading = false
              if (res.success) {
                this.getdata(this.formInline)
                this.$message({
                  type: 'success',
                  message: '公司保存成功！'
                })
              } else {
                this.$message({
                  type: 'info',
                  message: res.msg
                })
              }
            })
            .catch(err => {
              this.editFormVisible = false
              this.loading = false
              this.$message.error('支付配置信息保存失败，请稍后再试！')
            })
        } else {
          return false
        }
      })
    },
    // 删除公司
    deleteUser(index, row) {
      this.$confirm('确定要删除吗?', '信息', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          ConfigDelete(row.deptId)
            .then(res => {
              if (res.success) {
                this.$message({
                  type: 'success',
                  message: '公司已删除!'
                })
                this.getdata(this.formInline)
              } else {
                this.$message({
                  type: 'info',
                  message: res.msg
                })
              }
            })
            .catch(err => {
              this.loading = false
              this.$message.error('支付配置信息删除失败，请稍后再试！')
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 关闭编辑、增加弹出框
    closeDialog(formName) {
      this.editFormVisible = false
      this.$refs[formName].resetFields()
    }
  }
}
</script>

<style scoped>
.user-search {
  margin-top: 20px;
}
.userRole {
  width: 100%;
}
</style>

 
 

 