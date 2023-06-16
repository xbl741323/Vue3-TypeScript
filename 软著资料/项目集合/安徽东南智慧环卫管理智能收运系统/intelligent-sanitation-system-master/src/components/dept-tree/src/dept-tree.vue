<template>
  <div>
    <el-popover v-model="deptListVisible" ref="deptListPopover" placement="bottom-start" trigger="click">
        <el-tree :data="deptList" :props="deptProps" node-key="id" ref="deptTree" :highlight-current="true" :expand-on-click-node="false" accordion @current-change="deptListTreeCurrentChangeHandle"></el-tree>
    </el-popover>
    <el-input v-model="deptName"
    v-popover:deptListPopover
    :readonly="true"
    :placeholder="placeholder" >
      <i v-if="showIcon" slot="append" class="el-icon-circle-close" @click="doClear"></i>
    </el-input>
  </div>
</template>
<script>
export default {
  name: 'DeptTree',
  data () {
    return {
      deptProps: { label: 'name', children: 'children' },
      deptList: [],
      deptListVisible: false,
      deptId: '',
      deptName: ''
    }
  },
  props: {
    value: [Number, String],
    placeholder: String
  },
  computed: {
    showIcon () {
      var showIcon = !!this.deptName
      return showIcon
    }
  },
  watch: {
    value (val, oldVal) {
      if (!val) {
        this.deptName = ''
      }
      this.confirmDept(val, this.deptList)
    }
  },
  mounted () {
    this.getDeptList()
  },
  methods: {
    getDeptList () {
      return this.$http
        .get('/sys/dept/list', { params: { } })
        .then(({ data: res }) => {
          if (res.code != 0) {
            return this.$message.error(res.msg)
          }
          this.deptList = res.data
        })
        .catch(() => {})
    },
    doClear () {
      this.$refs.deptTree.setCurrentKey(null)
      this.deptId = ''
      this.deptName = ''
      this.$emit('input', this.deptId)
      this.$emit('change', null)
    },
    // 所属部门树, 选中
    deptListTreeCurrentChangeHandle (data, node) {
      this.deptId = data.id
      this.deptName = data.name
      this.deptListVisible = false
      this.$emit('input', this.deptId)
      this.$emit('change', data)
    },
    confirmDept (val, subDetpList) {
      if (subDetpList && subDetpList.length > 0) {
        for (var i = 0; i < subDetpList.length; i++) {
          var deptInfo = subDetpList[i]
          if (deptInfo.id == val) {
            this.deptName = deptInfo.name
          } else {
            this.confirmDept(val, deptInfo.children)
          }
        }
      }
    }
  }
}
</script>
