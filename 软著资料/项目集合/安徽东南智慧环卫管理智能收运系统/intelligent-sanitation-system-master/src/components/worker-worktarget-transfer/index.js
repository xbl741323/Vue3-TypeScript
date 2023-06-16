import WorkerWorktargetTransfer from './src/worker-worktarget-transfer'

WorkerWorktargetTransfer.install = function (Vue) {
  Vue.component(WorkerWorktargetTransfer.name, WorkerWorktargetTransfer)
}

export default WorkerWorktargetTransfer
