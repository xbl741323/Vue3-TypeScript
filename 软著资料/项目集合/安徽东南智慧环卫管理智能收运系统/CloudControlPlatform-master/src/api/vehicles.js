import request from '@/utils/request'

export function inquireVehicle(query) {
  return request({
    url: 'vehicle/management',
    method: 'post',
    data: {
        action: "inquireVehicle",
        data: query
    }
  })
}

export function createVehicles(data) {
  return request({
    url: 'vehicle/management',
    method: 'post',
    data: {
        action: "addVehicle",
        data: data
    }
  })
}


export function deletedVehicles(data) {
    return request({
      url: 'vehicle/management',
      method: 'post',
      data: {
          action: "deleteVehicle",
          data: data
      }
    })
  }