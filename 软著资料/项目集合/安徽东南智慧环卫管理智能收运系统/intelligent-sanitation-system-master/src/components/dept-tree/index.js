import DeptTree from './src/dept-tree'

DeptTree.install = function (Vue) {
  Vue.component(DeptTree.name, DeptTree)
}

export default DeptTree
