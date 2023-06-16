import request from '@/utils/request.js'

// 获取作业类型
export const getDeptVehicleTreeByWorktype = (data) => {
  return request({
    method: 'get',
    url: '/vehwork/tvehvehicleinfo/getDeptVehicleTreeByWorktype?worktypeCode='+data.activeName
  })
}
