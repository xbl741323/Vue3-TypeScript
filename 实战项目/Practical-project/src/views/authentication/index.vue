<template>
  <div class="auth-frame">
    <el-image src="@/assets/images/me_icon_hui@2x.png" />
    <div>
      <span class="title-auth">请确定店铺类型</span>
      <div class="shop-type">
        <div :class="active == 1 ? 'active-type': 'type-box'" @click="changeType(1)">
          <p>个体</p>
          <p>个体工商户入驻，提供身份证、营业执照等即可开店</p>
        </div>
        <div :class="active == 2 ? 'active-type': 'type-box'" @click="changeType(2)">
          <p>企业</p>
          <p>有营业执照，想以企业为主体开店</p>
        </div>
      </div>
      <span class="title-auth">基本信息</span>
      <el-form label-width="14rem">
        <el-form-item label="店铺名称：">
          <el-input placeholder="请输入店铺名称" />
        </el-form-item>
        <el-form-item label="主营类目：">
          <el-input placeholder="请输入主营类目" />
        </el-form-item>
        <el-form-item label="店铺介绍：">
          <el-input placeholder="请输入店铺介绍" />
        </el-form-item>
        <el-form-item label="管理员姓名：">
          <el-input placeholder="请输入管理员姓名" />
        </el-form-item>
        <el-form-item label="管理员手机号：">
          <el-input placeholder="请输入管理员手机号" />
        </el-form-item>
      </el-form>

      <!-- 组织信息 -->
      <span class="title-auth">组织信息</span>
      <el-form label-width="14rem">
        <el-form-item label="企业名称：">
          <el-input placeholder="请输入企业名称" maxlength="30" />
        </el-form-item>
        <el-form-item label="统一社会信用代码：">
          <el-input placeholder="请输入92开头的18位阿拉伯数字或大写英文字母" />
        </el-form-item>
        <el-form-item label="营业执照有效期：">
          <el-date-picker
            type="date"
            placeholder="营业执照有效期"
          />
          <el-checkbox class="unlimited" label="无限期" size="large" />
        </el-form-item>
      </el-form>

      <span class="title-auth">法人信息</span>
      <el-form label-width="14rem">
        <el-form-item label="法人信息：">
          <el-input placeholder="请输入法人姓名" />
        </el-form-item>
        <el-form-item label="法人身份证号：">
          <el-input placeholder="请输入法人的身份证号码" />
        </el-form-item>
        <el-form-item label="身份证有效期：">
          <el-input placeholder="身份证有效期" />
        </el-form-item>
        <el-form-item label="法人手机号：">
          <el-input placeholder="请输入法人的手机号" />
        </el-form-item>
        <el-form-item label="法人信息：">
          <el-input placeholder="请输入法人姓名" />
        </el-form-item>
        <el-form-item>
          <el-input placeholder="输入验证码" />
          <el-button>获取验证码</el-button>
        </el-form-item>
      </el-form>
      <div>
        <el-checkbox>已阅读并同意以下协议</el-checkbox>
      </div>

      <el-button>提 交</el-button>
      <el-button>取 消</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const active = ref<Number>(1)

const changeType = (val: Number)=>{//切换商户类型
  active.value = val;
}
</script>

<style lang="scss" scoped>
.auth-frame{
  width: 1200px;
  margin: 0 auto;
   &::v-deep .el-input{
    width: 30rem;
  }
  .unlimited{
    margin-left: 1rem;
  }
  .title-auth{
    padding-left: .5rem;
    border-left: .5rem solid #1890FF;
  }
  .shop-type{
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 1rem;
    width: 50rem;
    margin: 1rem 0 1rem 1rem;
    .type-box{
      cursor: pointer;
      padding: 1rem;
      width: 20rem;
      height: 10rem;
      color: #333333;
      border: .1rem solid #333333;
      border-radius: .4rem;
    }
    .active-type{
      cursor: pointer;
      padding: 1rem;
      width: 20rem;
      height: 10rem;
      background: #1890FF;
      color: #FFFFFF;
      border: .1rem solid #1890FF;
      border-radius: .4rem;
    }
  }
}
</style>

