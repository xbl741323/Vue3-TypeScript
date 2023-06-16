import request from '@/utils/request'

//创建作业区域或路线
export function addJobArea(data) {
  return request({
    url: 'job/area',
    method: 'post',
    data: {
      action: "addJobArea",
      data: data
    }
  })
}
//查询作业区域或路线
export function inquireJobArea(data) {
  return request({
    url: 'job/area',
    method: 'post',
    data: {
      action: "inquireJobArea",
      data: data
    }
  })
}
//删除作业区域或路线
export function deleteJobArea(data) {
  return request({
    url: 'job/area',
    method: 'post',
    data: {
      action: "deleteJobArea",
      data: data
    }
  })
}


//创建作业计划
export function addJobPlan(data) {
  return request({
    url: 'job/plan',
    method: 'post',
    data: {
      action: "addJobPlan",
      data: data
    }
  })
}
//查询作业计划
export function inquireJobPlan(data) {
  return request({
    url: 'job/plan',
    method: 'post',
    data: {
      action: "inquireJobPlan",
      data: data
    }
  })
}
//删除作业计划
export function deleteJobPlan(data) {
  return request({
    url: 'job/plan',
    method: 'post',
    data: {
      action: "deleteJobPlan",
      data: data
    }
  })
}
//启动作业计划
export function startJobPlan(data) {
  return request({
    url: 'job/plan',
    method: 'post',
    data: {
      action: "startJobPlan",
      data: data
    }
  })
}
//停止作业计划
export function stopJobPlan(data) {
  return request({
    url: 'job/plan',
    method: 'post',
    data: {
      action: "stopJobPlan",
      data: data
    }
  })
}
//作废作业计划
export function abolishJobPlan(data) {
  return request({
    url: 'job/plan',
    method: 'post',
    data: {
      action: "abolishJobPlan",
      data: data
    }
  })
}

//暂停任务
export function pauseTask(data) {
  return request({
    url: 'task/management',
    method: 'post',
    data: {
      action: "pauseTask",
      data: data
    }
  })
}
//继续任务
export function continueTask(data) {
  return request({
    url: 'task/management',
    method: 'post',
    data: {
      action: "continueTask",
      data: data
    }
  })
}
//取消任务
export function cancelTask(data) {
  return request({
    url: 'task/management',
    method: 'post',
    data: {
      action: "cancelTask",
      data: data
    }
  })
}
//查询任务
export function inquireTask(data) {
  return request({
    url: 'task/management',
    method: 'post',
    data: {
      action: "inquireTask",
      data: data
    }
  })
}
//获取历史轨迹
export function historyTrack(data) {
  return request({
    url: 'history/video',
    method: 'post',
    data: {
      action: "historyTrack",
      data: data
    }
  })
}

//获取历史视频
export function historyMonitor(data) {
  return request({
    url: 'history/video',
    method: 'post',
    data: {
      action: "historyMonitor",
      data: data
    }
  })
}