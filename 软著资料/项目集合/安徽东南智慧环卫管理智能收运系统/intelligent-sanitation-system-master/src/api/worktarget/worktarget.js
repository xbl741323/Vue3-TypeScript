import request from '@/utils/request.js'

// 获取作业类型
export const getWorkTypeList = (data) => {
  return request({
    method: 'get',
    url: '/worktarget/worktargettype/getList',
    params: data
  })
}
