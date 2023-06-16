import request from '@/utils/request.js'

// 获取作业类型
export const getFrameWorkTypeList = (data) => {
  return request({
    method: 'get',
    url: '/framework/tframeworkworktype/getList',
    params: data
  })
}
