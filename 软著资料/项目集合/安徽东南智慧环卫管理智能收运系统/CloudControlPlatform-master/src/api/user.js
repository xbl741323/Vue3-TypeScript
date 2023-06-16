import request from '@/utils/request'

export function login(data) {

  console.log(data)
  return request({
    url: '/usr/login',
    method: 'post',
    data:{
      "action":"login",
      "data":data
    }
  })
}

export function getInfo(token) {
  return request({
    url: '/vue-element-admin/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: 'usr/login',
    method: 'post',
    data:{
      "action":"logout",
      "data":{}
    }
  })
}

//找回密码
export function findPassword(data) {
  console.log(data)
  return request({
    url: 'usr/login',
    method: 'post',
    data:{
      "action":"find_password",
      "data":data
    }
  })
}

//重置密码
export function resetPassword(data) {
  return request({
    url: 'usr/login',
    method: 'post',
    data:{
      "action":"reset_password",
      "data":data
    }
  })
}

//重置密码token验证
export function resetPasswordCheck(data) {
  return request({
    url: 'usr/login',
    method: 'post',
    data:{
      "action":"rest_password_check",
      "data":data
    }
  })
}