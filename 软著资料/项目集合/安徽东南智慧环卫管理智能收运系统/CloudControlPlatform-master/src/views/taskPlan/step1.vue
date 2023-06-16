<template>
  <div>
    <el-form
      :model="jobArea"
      :rules="jobAreaRules"
      ref="jobArea"
      status-icon
      label-position="left"
      label-width="100px"
      class="step1-style"
    >
      <el-form-item :label="$t('作业园区')" class="select-style" prop="parkName">
        <el-select
          v-model="jobArea.parkName"
          clearable
          class="select-width"
          placeholder="请选择作业园区"
          @change="parkChange"
        >
          <el-option
            v-for="item in parkOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item :label="$t('作业区域')" class="select-style" prop="areaNumber">
        <el-select
          v-model="jobArea.areaNumber"
          clearable
          class="select-width"
          placeholder="请选择作业区域编号"
        >
          <el-option
            v-for="item in jobAreaOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option> </el-select
        ><br />
      </el-form-item>
    </el-form>

    <el-button type="primary" class="next-style" @click="next"
      >下一步</el-button
    >
  </div>
</template>

<script>
import router, { resetRouter } from "@/router";
import axios from "axios";
import { inquirePark } from "@/api/park";
import { inquireJobArea } from "@/api/operationalPlanning";

export default {
  name: "taskPlan1",
  components: {},
  data() {
    return {
      parkOptions: [],
      jobAreaOptions: [],
      jobArea: {
        parkName: "",
        areaNumber: "", 
      },
      step1_status: true,
      jobAreaRules: {
        parkName: [
          { required: true, message: "请选择作业园区", trigger: "blur" }
        ],
        areaNumber: [
          { required: true, message: "请选择作业区域编号", trigger: "blur" }
        ],
      }
    };
  },
  mounted() {
    this.getParkData()
    
  },
  methods: {
    //下一步事件：
    next() {
      this.$refs["jobArea"].validate(valid => {
        if (valid) {
          this.$emit("event_stepinfo", "next",1, this.jobArea);
        }
      });
    },
    //获取园区数据
    getParkData() {
      inquirePark({}).then(response => {
        for(let item of response.data.parks){
          this.parkOptions.push({
            value:item.parkName,
            label:item.parkName
          })
        }
      });
    },
    //获取作业区域数据
    parkChange(e) {
      if(e){
        this.jobAreaOptions = [];
        inquireJobArea({parkName:e}).then(response =>{
        for(let item of response.data.jobAreas){
          this.jobAreaOptions.push({
            value:item.areaNumber,
            label:item.areaNumber
          })
        }
      });
      }
      
    }
  }
};
</script>
<style lang="scss">
/* reset element-ui css */

.step1-style {
  display: block;
  margin: 0 auto;
  width: 60%;
  margin-top: 30px;
  margin-bottom: 30px;
}
.next-style {
  float: right;
  margin-top: -20px;
  margin-left: 10px;
}
.select-style {
  margin-top: 30px;
}
.select-width {
  width: 80%;
}
</style>
