import request from '@/utils/request'

// 获取监控对象配置list
export const GET_MONITOR_OBJECTTYPE_TREE = (data) => {
    return request({
        url: "/monitorconfig/monitorobjectdetailtypeconfig/getTree",
        method: "get",
        params: data,
    });
};
// 获取字段基础信息和已经设置的信息
export const GET_LIST_BYOBJECTTYPECODE = (data) => {
    return request({

        url: "/monitorconfig/pagecomponentfield/getFieldListAndConfig",
        method: "get",
        params: data,
    });
};
// 保存组件的字段
export const SAVEUPDATE_COM_FIELDS = (data) => {
    return request({
        url: "/monitorconfig/pagecomponentfield/saveOrUpdate",
        method: "post",
        data: data,
    });
};

// 获页面信息list
export const GETPAGELIST = (data) =>
    request({
        url: '/monitorconfig/monitorpageinfo/getList',
        method: 'get'

    })

// 添加页面信息
export const SAVE_OR_UPDATE_MONITOR_OBJECT = (data) =>
    request({
        url: '/monitorconfig/monitorobjecttypeconfig/saveOrUpdate',
        method: 'post',
        data
    })

//获取车辆类型
export const GET_VEHICLETYPE_LIST = (data) =>
    request({
        url: '/monitorconfig/yhtmonitorobjecttypeconfig/getVehicleTypeList',
        method: 'get'

    })


// 获取车辆类型信息和已设置信息
export const GET_VEHICLETYPE_AND_SET_LIST = (params) =>
request({
    url: '/monitorconfig/monitorobjecttypeconfig/getVehicleTypeList',
    method: 'get',
    params
})

// 获取作业对象类型（设施类型）信息和已设置信息  
export const GET_WORKTAEGETETYPE_AND_SET_LIST = (params) =>
    request({
        url: '/monitorconfig/monitorobjecttypeconfig/getWorktargetTypeList',
        method: 'get',
        params
    })


// 获取作业人员类型 信息和已设置信息
export const GET_WORKERETYPE_AND_SET_LIST = (params) =>
request({
    url: '/monitorconfig/monitorobjecttypeconfig/getWorkerTypeList',
    method: 'get',
    params
})
// 获取事件类型
export const GET_EVENTTYPETREE = (params) =>
    request({
        url: '/monitorconfig/monitorobjecttypeconfig/getEventTypeTree',
        method: 'get',
        params
    })

// 获取已经设置的事件类型
export const GET_EVENTTYPESET = (params) =>
    request({
        url: '/monitorconfig/monitorobjecttypeconfig/getEventTypeDefaultKeys',
        method: 'get',
        params
    })




