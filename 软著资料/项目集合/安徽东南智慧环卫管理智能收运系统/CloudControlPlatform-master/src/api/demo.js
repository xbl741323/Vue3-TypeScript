import request from '@/utils/request'
//路径下发
export function pathIssued(data) {
  return request({
    url: 'remoteControl',
    method: 'post',
    data: {
        action: "VehicleNavigation",
        data: data
    }
  })
}
//车辆控制
export function vehicleControl(data) {
  return request({
    url: 'remoteControl',
    method: 'post',
    data: {
        action: "VehicleProcessControl",
        data: data
    }
  })
}
//音视频实时传输请求
export function videoAudioRequest(data) {
  return request({
    url: 'current/monitor',
    method: 'post',
    data: {
        action: "currentMonitor",
        data: data
    }
  })
}