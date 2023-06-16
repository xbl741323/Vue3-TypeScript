import request from '@/utils/request'

export function inquireLog(query) {
  return request({
    url: 'logs/management',
    method: 'post',
    data: {
        action: "inquireLog",
        data: query
    }
  })
}