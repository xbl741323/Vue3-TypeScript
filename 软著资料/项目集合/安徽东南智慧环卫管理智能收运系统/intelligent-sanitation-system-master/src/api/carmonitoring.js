import request from '@/utils/request.js'
import req from '@/utils/req.js'
import datasource from "../views/modules/devtools/datasource";
// import { data } from 'vue-echarts';

/**
 * 权限相关内容
 **/
export const getListByPageNumber = (pageNumber) => {
    return request({
        method: 'get',
        url: '/monitorconfig/monitorobjecttypeconfig/getListbyPageNumber?pageNumber=' + pageNumber
    })
}

export const getVehicleTypeList = (pageNumber) => {
    return request({
        method: 'get',
        url: '/monitorconfig/monitorobjecttypeconfig/getVehicleTypeList?pageNumber=' + pageNumber
    })
}

export const getWorkerTypeList = (pageNumber) => {
    return request({
        method: 'get',
        url: '/monitorconfig/monitorobjecttypeconfig/getWorkerTypeList?pageNumber=' + pageNumber
    })
}

export const getWorkTargetTypeList = (pageNumber) => {
    return request({
        method: 'get',
        url: '/monitorconfig/monitorobjecttypeconfig/getWorktargetTypeList?pageNumber=' + pageNumber
    })
}

export const getEventTypeTree = (pageNumber) => {
    return request({
        method: 'get',
        url: '/monitorconfig/monitorobjectdetailtypeconfig/getList?pageNumber=' + pageNumber + '&bigTypeCode=event'
    })
}

export const getFieldListByCode = (pageNumber, objectTypeCode, componentTypeCode) => {
    return request({
        method: 'get',
        url: '/monitorconfig/pagecomponentfield/getFieldListbyCode?pageNumber=' + pageNumber + '&objectTypeCode=' + objectTypeCode + '&componentTypeCode=' + componentTypeCode
    })
}


/**
 * 车辆菜单相关内容
 **/

export const getCommonTreeListByType = (date) => {
    return request({
        method: 'get',
        url: '/zhhwmonitor/carMonitor/getCommonTreeListByType?status=' + date.status + '&carTypeIds=' + date.carTypeIds + '&onlineStatus=' + date.onlineStatus,
    })
}

export const getCommonTreeListByTypeVideo = () => {
    return request({
        method: 'get',
        url: '/zhhwmonitor/carMonitor/getCommonTreeListByTypeVideo',
    })
}

export const getVehWorkNormBigDataType = () => {
    return request({
        method: 'get',
        url: "/vehwork-old/bigdata/getVehWorkMoreBigData",
        // params:{userid: "0"}
    })
}
//获取所有车辆list
export const getCarAlls = (date) => {
    return request({
        method: 'get',
        url: "/vehwork-old/adptCarinfo/queryListbyStatus",
        params: date
    })
}
export const getCarType = () => {
    return request({
        method: 'get',
        url: '/zhhwmonitor/carMonitor/getCarType'
    })
}

export const getAdapterWorkWorkload = (tableQueryParams) => {
    return request({
        method: 'get',
        url: '/zhhwmonitor/carMonitor/getAdapterWorkWorkload',
        params: tableQueryParams
    })
}

export const getCurrentPositionStatusList = (queryParams) => {
    return request({
        method: 'get',
        url: '/zhhwmonitor/carMonitor/getCurrentPositionStatusList',
        params: queryParams
    })
}

export const getPositionStatusList = (queryParams) => {
    return request({
        method: 'get',
        url: '/zhhwmonitor/carMonitor/getPositionStatusList',
        params: queryParams
    })
}

export const getMistakeInfoList = (queryParams) => {
    return request({
        method: 'get',
        url: '/zhhwmonitor/carMonitor/getMistakeInfoList',
        params: queryParams
    })
}

export const getMistakeInfoVehTree = (queryParams) => {
    return request({
        method: 'get',
        url: '/zhhwmonitor/carMonitor/getMistakeInfoVehTree',
        params: queryParams
    })
}

export const getWorkScheduleRoadIdsByVehId = (queryParams) => {
    return request({
        method: 'get',
        url: '/zhhwmonitor/carMonitor/getWorkScheduleRoadIdsByVehId',
        params: queryParams
    })
}

export const getOilMonitoringList = (queryParams) => {
    return request({
        method: 'get',
        url: '/vehwork-old/adapterOilmonitoring/getOilmonitoringList',
        params: queryParams
    })
}
//油量
export const getOilByPositionId = (queryParams) => {
    return req({
        method: 'get',
        url: `/vehwork-old/adaperpositionstatus/getOilByPositionId?positionId=${queryParams.positionId}&startDate=${queryParams.startDate}&endDate=${queryParams.endDate}`,
        params: queryParams
    })
}

/**
 * 人员菜单相关内容
 **/

export const getMotionAll = () => {
    return request({
        method: 'get',
        url: "/vehwork-old/bigdata/getWorkerNormBigData"
    })
}
export const getManAll = () => {
    return request({
        method: 'get',
        url: '/vehwork-old/bigdata/getWorkerMoreNormBigData'
    })
}
export const getManAll2 = () => {
    return request({
        method: 'get',
        url: 'vehwork-old/bigdata/getWorkerOnlineData'
    })
}
export const getWorkerCommonTreeListByType = (date) => {
    return request({
        method: 'get',
        url: '/zhhwmonitor/workerMonitor/getCommonTreeListByType?status=' + date.status + '&deptIds=' + date.deptIdList + '&workerTypeIds=' + date.workerTypeIds + '&onlineStatus=' + date.onlineStatus,
    })
}

export const getWorkerType = () => {
    return request({
        method: 'get',
        url: '/zhhwmonitor/workerMonitor/getWorkerType'
    })
}

export const getAdapterWorkerWorkload = (tableQueryParams) => {
    return request({
        method: 'get',
        url: '/zhhwmonitor/workerMonitor/getAdapterWorkerWorkload',
        params: tableQueryParams
    })
}

//获取所有人员list
export const getWorkerCurrentStatusListByType = (queryParams) => {
    return request({
        method: 'get',
        url: '/zhhwmonitor/workerMonitor/getWorkerCurrentStatusListByType',
        params: queryParams
    })
}

export const getWorkerCurrentStatusListByTypePage = (queryParams) => {
    return request({
        method: 'get',
        url: '/zhhwmonitor/workerMonitor/getWorkerCurrentStatusListByTypePage',
        params: queryParams
    })
}

export const getPositionStatusList4Datetime = (queryParams) => {
    return request({
        method: 'get',
        url: '/zhhwmonitor/workerMonitor/getPositionStatusList',
        params: queryParams
    })
}
export const getPersonEventWorkerTree = (queryParams) => {
    return request({
        method: 'get',
        url: '/zhhwmonitor/workerMonitor/getPersonEventWorkerTree',
        params: queryParams
    })
}


export const getPersonEventByIds = (queryParams) => {
    return request({
        method: 'get',
        url: '/zhhwmonitor/workerMonitor/getPersonEventByIds',
        params: queryParams
    })
}
/**
 * 设施菜单相关内容
**/
export const getWorkTargetViewList = (queryParams) => {
    return request({
        method: 'get',
        url: '/zhhwmonitor/workTargetMonitor/getViewList',
        params: queryParams
    })
}

export const workTargetPage = (queryParams) => {
    return request({
        method: 'get',
        url: '/zhhwmonitor/workTargetMonitor/workTargetPage',
        params: queryParams
    })
}

export const getWorkTargetTreeListByType = (queryParams) => {
    return request({
        method: 'get',
        url: '/zhhwmonitor/workTargetMonitor/getWorkTargetTreeListByType',
        params: queryParams
    })
}

export const getListRoadSectionById = (queryParams) => {
    return request({
        method: 'get',
        url: '/zhhwmonitor/workTargetMonitor/getListRoadSectionById',
        params: queryParams
    })
}

//公厕设施相关
export const getPublicToiletTree = (queryParams) => {
    return request({
        method: 'get',
        url: '/zhhwmonitor/publicToilet/getPublicToiletTree',
        params: queryParams
    })
}
