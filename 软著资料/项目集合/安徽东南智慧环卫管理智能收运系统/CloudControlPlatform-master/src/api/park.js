import request from '@/utils/request'

export function inquirePark(query) {
  return request({
    url: 'park/management',
    method: 'post',
    data: {
        action: "inquirePark",
        data: query
    }
  })
}

export function addPark(data) {
  return request({
    url: 'park/management',
    method: 'post',
    data: {
        action: "addPark",
        data: data
    }
  })
}


export function deletedPark(data) {
    return request({
      url: 'park/management',
      method: 'post',
      data: {
          action: "deletePark",
          data: data
      }
    })
  }