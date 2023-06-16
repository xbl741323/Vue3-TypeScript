import Vue from 'vue'
import Element from 'element-ui'
import App from '@/App'
import i18n from '@/i18n'
import router from '@/router'
import store from '@/store'
import '@/icons'
import '@/element-ui/theme/index.css'
import '@/assets/scss/aui.scss'
import http from '@/utils/request'
import renRadioGroup from '@/components/ren-radio-group'
import renSelect from '@/components/ren-select'
import renProcessMultiple from '@/components/ren-process-multiple'
import renProcessStart from '@/components/ren-process-start'
import renProcessRunning from '@/components/ren-process-running'
import renProcessDetail from '@/components/ren-process-detail'
import renDeptTree from '@/components/ren-dept-tree'
import renRegionTree from '@/components/ren-region-tree'
import DeptTree from '@/components/dept-tree'
import WorktargetSelect from '@/components/worktarget-select'
import DeviceSelect from '@/components/device-select'
import DictSelect from '@/components/dict-select'
import VehicleTypeSelect from '@/components/vehicle-type-select'
import VehicleSelect from '@/components/vehicle-select'
import DeviceTypeSelect from '@/components/device-type-select'
import WorkerTypeSelect from '@/components/worker-type-select'
import WorktypeCodeSelect from '@/components/worktype-code-select'
import WorktypeRadioGroup from '@/components/worktype-radio-group'
import WorkStandardSelect from '@/components/work-standard-select'
import WorkTimeSelect from '@/components/work-time-select'
import WorktargetTypePanel from '@/components/worktargettype-panel'
import FrameworkWorktypeSelect from '@/components/framework-worktype-select'
import FrameworkIndicatorSelect from '@/components/framework-indicator-select'
import VehicleTransfer from '@/components/vehicle-transfer'
import CleanWorktargetTransfer from './components/clean-worktarget-transfer'
import WorktargetTypeSelect from './components/worktarget-type-select'
import WorktargetTypeCheckboxGroup from '@/components/worktarget-type-checkbox-group'
import WorktargetTransfer from './components/worktarget-transfer'
import WorkerWorktargetTransfer from './components/worker-worktarget-transfer'
import { hasPermission, getDictLabel } from '@/utils'
import cloneDeep from 'lodash/cloneDeep'
import * as echarts from 'echarts'
Vue.prototype.$echarts = echarts
import Tinymce from '@/components/tinymce/index.vue'
Vue.component('tinymce', Tinymce)

import '@/utils/form-generator/styles/index.scss'
import SvgIcon from '@/utils/form-generator/components/SvgIcon'
Vue.component('svg-icon', SvgIcon)

import 'xe-utils'
import VXETable from 'vxe-table'
import 'vxe-table/lib/index.css'
import AMap from 'vue-amap'
import iView from 'iview'
import 'iview/dist/styles/iview.css'

Vue.use(VXETable)

Vue.config.productionTip = false

Vue.use(iView)
Vue.use(renRadioGroup)
Vue.use(renSelect)
Vue.use(renDeptTree)
Vue.use(renRegionTree)
Vue.use(renProcessMultiple)
Vue.use(renProcessStart)
Vue.use(renProcessRunning)
Vue.use(renProcessDetail)
Vue.use(DeptTree)
Vue.use(AMap)
Vue.use(VehicleTypeSelect)
Vue.use(VehicleSelect)
Vue.use(DeviceTypeSelect)
Vue.use(DeviceSelect)
Vue.use(WorkerTypeSelect)
Vue.use(WorktargetSelect)
Vue.use(CleanWorktargetTransfer)
Vue.use(DictSelect)
Vue.use(FrameworkWorktypeSelect)
Vue.use(FrameworkIndicatorSelect)
Vue.use(WorktypeCodeSelect)
Vue.use(WorktargetTypePanel)
Vue.use(WorktypeRadioGroup)
Vue.use(WorkStandardSelect)
Vue.use(WorkTimeSelect)
Vue.use(VehicleTransfer)
Vue.use(WorktargetTypeCheckboxGroup)
Vue.use(WorkerWorktargetTransfer)
Vue.use(WorktargetTypeSelect)
Vue.use(Element, {
    size: 'small',
    i18n: (key, value) => i18n.t(key, value)
})

AMap.initAMapApiLoader({
    // 高德key
    key: '593675a63b9f1f240d4a82210582a31c',
    // 插件集合 （插件按需引入）
    plugin: ['AMapManager', 'AMap.Autocomplete', 'AMap.PlaceSearch', 'AMap.Scale', 'AMap.OverView', 'AMap.ToolBar', 'AMap.MapType', 'AMap.PolyEditor', 'AMap.CircleEditor','AMap.Geocoder','Geolocation', 'AMap.MarkerClusterer','AMap.PolyEditor', 'AMap.CircleEditor', 'AMap.MouseTool', 'AMap.Driving', 'AMap.CitySearch', 'AMap.InfoWindow', 'AMap.LngLat', 'AMap.DistrictSearch', 'AMap.TileLayer.Traffic', 'AMap.Heatmap', 'AMap.Autocomplete', 'AMap.PlaceSearch'],
    uiVersion: '1.0',
    v: '1.4.4'
});
// 挂载全局
Vue.prototype.$http = http
Vue.prototype.$hasPermission = hasPermission
Vue.prototype.$getDictLabel = getDictLabel

// 保存整站vuex本地储存初始状态
window.SITE_CONFIG['storeState'] = cloneDeep(store.state)

new Vue({
    i18n,
    router,
    store,
    render: h => h(App)
}).$mount('#app')
