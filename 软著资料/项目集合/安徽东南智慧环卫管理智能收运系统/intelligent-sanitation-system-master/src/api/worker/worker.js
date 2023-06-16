import request from '@/utils/request.js'

// 获取人员类型
export const GETWORKERTYPELIST = (data) => {
  return request({
    method: 'get',
    url: '/wkr-old/workertypeadapter/viewList',
    params: data
  })
}

// 获取人员类型
export const GETWORKERTYPELISTV3 = (data) => {
    return request({
        method: 'get',
        url: '/zhhw-worker/twkrworkertype/getList',
        params: data
    })
}

// 获取人员事件类型
export const GETWORKER_EVENTTYPE_LIST_V3 = (data) => {
    return request({
        method: 'get',
        url: '/zhhw-worker/twkreventtype/getList',
        params: data
    })
}
