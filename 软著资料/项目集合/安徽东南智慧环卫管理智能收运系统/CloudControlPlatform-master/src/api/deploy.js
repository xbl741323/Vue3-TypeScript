import request from '@/utils/request'
//安装
export function create(data) {
  return request({
    url: 'install',
    method: 'post',
    data: {
        action: "user_create",
        data: data
    }
  })
}
//数据库配置
export function dbTest(data) {
  return request({
    url: 'install',
    method: 'post',
    data: {
        action: "database_test",
        data: data
    }
  })
}
//Redis配置
export function redisTest(data) {
  return request({
    url: 'install',
    method: 'post',
    data: {
        action: "redis_test",
        data: data
    }
  })
}

//其他配置
export function otherTest(data) {
    return request({
      url: 'install',
      method: 'post',
      data: {
          action: "others_config",
          data: data
      }
    })
  }

  //检测是否部署过
  export function beforeInstall() {
    return request({
      url: 'beforeInstall',
      method: 'post',
    })
  }