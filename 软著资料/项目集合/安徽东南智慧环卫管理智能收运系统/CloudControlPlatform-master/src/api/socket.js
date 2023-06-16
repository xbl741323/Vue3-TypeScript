import request from '@/utils/request'

export function getConnectInfo(data) {
  return request({
    url: 'getConnectInfo',
    method: 'post',
    data: {
      action: "",
      data: data
    }
  })
}