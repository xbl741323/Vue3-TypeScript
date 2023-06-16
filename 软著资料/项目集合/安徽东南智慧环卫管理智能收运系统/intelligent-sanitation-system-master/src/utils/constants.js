
const Constants = {
  searchOption: {
    city: '杭州',
    citylimit: true
  }
}
/**
 * websocket 配置
 */
const WebSockConfig = {
  serviceURL: '',
  userName: '',
  userPassword: ''
}

const ActiveMQConfig = {
  // serviceURL: 'ws://127.0.0.1:61616',
  serviceURL: 'ws://49.4.92.83:61614',
    userName: 'zhhw',
    userPassword: 'qihang2022',
  topic: '/topic/ztTopic'
}
export default Constants
export { WebSockConfig, ActiveMQConfig }
