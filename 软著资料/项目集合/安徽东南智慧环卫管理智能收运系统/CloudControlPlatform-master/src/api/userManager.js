import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/usr/management',
    method: 'post',
    data: {
        action: "inquireUsers",
        data: query
    }
  })
}

export function createUser(data) {
  return request({
    url: 'usr/management',
    method: 'post',
    data: {
        action: "addUser",
        data: data
    }
  })
}

export function updateUser(data) {
  return request({
    url: 'usr/management',
    method: 'post',
    data: {
        action: "modifyUser",
        data: data
    }
  })
}

export function deletedUser(data) {
    return request({
      url: 'usr/management',
      method: 'post',
      data: {
          action: "deleteUser",
          data: data
      }
    })
  }