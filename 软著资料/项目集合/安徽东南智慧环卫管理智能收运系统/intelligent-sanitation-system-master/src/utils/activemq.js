import Stomp from 'stompjs'
import { ActiveMQConfig } from './constants'
import store from '@/store'
export default {
  client: {},
  init (connectCallback, failCallback) {
    this.client = Stomp.client(ActiveMQConfig.serviceURL)
    this.client.heartbeat.outgoing = 0
    this.client.heartbeat.incoming = 5000
    var headers = {
      'login': ActiveMQConfig.userName,
      'passcode': ActiveMQConfig.userPassword
    }
    console.log('执行连接开始')
    this.client.connect(headers, connectCallback, failCallback)
    console.log('执行连接结束')
  },
  subscribe (topic, responseCallback, selector) {
    this.client.subscribe(topic, responseCallback, selector)
  },
  disconnect (disconnectCallback) {
    this.client.disconnect(disconnectCallback)
  },
  selector () {
    var deptIdList = store.state.user.deptIdList
    if (!deptIdList || deptIdList.length < 1) {
      return {}
    }
    var deptIdCondition = '(' + deptIdList.join() + ')'
    return {
      'selector': 'deptId in ' + deptIdCondition
    }
  }
}
