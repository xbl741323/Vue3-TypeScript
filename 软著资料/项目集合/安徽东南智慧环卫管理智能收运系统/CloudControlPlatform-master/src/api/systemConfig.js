import request from '@/utils/request'

export function modifyDatabase(data) {
  return request({
    url: 'system/management',
    method: 'post',
    data: {
      action: "modifyDatabase",
      data: data
    }
  })
}

export function modifyVideo(data) {
  return request({
    url: 'system/management',
    method: 'post',
    data: {
      action: "modifyVideo",
      data: data
    }
  })
}


export function modifyWebConfig(data) {
  return request({
    url: 'system/management',
    method: 'post',
    data: {
      action: "modifyWebConfig",
      data: data
    }
  })
}


export function modifyMatrixConfig(data) {
  return request({
    url: 'system/management',
    method: 'post',
    data: {
      action: "modifyMatrixConfig",
      data: data
    }
  })
}



export function inquireWebsiteConfig(data) {
  return request({
    url: 'system/management',
    method: 'post',
    data: {
      action: "inquireWebsiteConfig",
      data: data
    }
  })
}


export function inquireVideoAddress(data) {
  return request({
    url: 'system/management',
    method: 'post',
    data: {
      action: "inquireVideoAddress",
      data: data
    }
  })
}


export function inquireMapAddress(data) {
  return request({
    url: 'system/management',
    method: 'post',
    data: {
      action: "inquireMapAddress",
      data: data
    }
  })
}

export function inquireMatrixInfo(data) {
  return request({
    url: 'system/management',
    method: 'post',
    data: {
      action: "inquireMatrixInfo",
      data: data
    }
  })
}

export function inquireDBInfo(data) {
  return request({
    url: 'system/management',
    method: 'post',
    data: {
      action: "inquireDBInfo",
      data: data
    }
  })
}

export function testVideo(data) {
  return request({
    url: 'system/management',
    method: 'post',
    data: {
      action: "testVideo",
      data: data
    }
  })
}