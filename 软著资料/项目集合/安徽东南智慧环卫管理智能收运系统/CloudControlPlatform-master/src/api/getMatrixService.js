import request from '@/utils/request'

export function get(query) {
  return request({
    url: 'vehicle/management',
    method: 'post',
    data: {
        action: "inquireVehicle",
        data: query
    }
  })
}
