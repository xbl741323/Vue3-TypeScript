import request from '@/utils/request.js'

// 获取车辆类型
export const GETCARTYPELIST = (data) => {
  return request({
    method: 'get',
    url: '/vehwork-old/adapterworkworkload/viewList',
    params: data
  })
}
// 获取车辆类型 新表v3.0
export const GETCARTYPELISTV3 = (data) => {
    return request({
        method: 'get',
        url: '/vehwork/tvehvehicletype/getList',
        params: data
    })
}

// 获取保洁车辆类型 新表v3.0
export const GETMACHINECLEAN_CARTYPELIST = (data) => {
    return request({
        method: 'get',
        url: '/vehwork/tvehvehicletype/getMachineCleanTypeList',
        params: data
    })
}
