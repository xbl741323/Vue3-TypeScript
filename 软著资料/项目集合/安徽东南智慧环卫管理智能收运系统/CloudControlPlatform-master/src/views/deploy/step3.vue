<template>
  <div style="display:block;margin:0 auto;width:60%">
    <el-form
      ref="rootForm"
      :model="rootForm"
      :rules="rootRules"
      label-width="80x"
      status-icon
    >
      <el-form-item
        label="公司名称"
        style="margin-top:30px"
        prop="organization"
      >
        <el-input v-model="rootForm.organization"></el-input>
      </el-form-item>
      <el-form-item label="超级用户名" prop="username">
        <el-input v-model="rootForm.username"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="rootForm.email"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="rootForm.password" type="password"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="checkPassword">
        <el-input v-model="rootForm.checkPassword" type="password"></el-input>
      </el-form-item>
    </el-form>
    <el-button style="margin-top: 12px;" @click="back">上一步</el-button>
    <el-button style="margin-top: 12px;float:right" @click="next">下一步</el-button>
  </div>
</template>

<script>
export default {
  name: "Step3",
  components: {},
  data() {
    const validatePassword = (rule, value, callback) => {
      var reg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[A-Za-z0-9]{8,20}$/;
      if (!reg.test(value)) {
        callback(new Error("密码必须包含大小写字母和数字，且为8-20位"));
      } else {
        callback();
      }
    };
    const validateCheckPassword = (rule, value, callback) => {
      if (this.rootForm.password != value) {
        callback(new Error("确认密码与密码不一致"));
      } else {
        callback();
      }
    };
    return {
      rootForm: {
        organization: "",
        email: "",
        checkPassword: "",
        username: "",
        password: "",
        step3_status: null
      },
      rootRules: {
        organization: [
          { required: true, message: "请输入公司名称", trigger: "blur" }
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          {
            type: "email",
            message: "请输入正确的邮箱地址",
            trigger: ["blur", "change"]
          }
        ],
        checkPassword: [
          { required: true, trigger: "blur", validator: validateCheckPassword }
        ],
        username: [
          { required: true, message: "请输入超级用户名", trigger: "blur" }
        ],
        password: [
          { required: true, trigger: "blur", validator: validatePassword }
        ]
      }
    };
  },
  updated() {
    this.$refs['rootForm'].validate(valid => {
      if (valid) {
        this.rootForm.step3_status = true;
      } else {
        this.rootForm.step3_status = false;
      }
    });
    this.$emit("event_stepinfo", 3, this.rootForm);
  },
  methods: {
   next() {
      if(this.rootForm.step3_status){
        this.$parent.next(3)
      }else{
        this.$notify({
          title: "提示",
          message: "请按提示内容填写信息",
          type: "warning",
          duration: 2000
        });
      }
    },
    back() {
      this.$parent.back(3)
    }
  }
};
</script>

<style scoped></style>
