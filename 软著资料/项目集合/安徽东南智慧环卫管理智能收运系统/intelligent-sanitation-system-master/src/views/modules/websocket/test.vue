<template>
    <div class="box">
        websocket:{{newMessage}}
    </div>
</template>
<script>
    const heartCheck = {
        timeout: 60 * 1000,
        timer: null,
        serverTimer: null,
        reset() {
            this.timer && clearTimeout(this.timer)
            this.serverTimer && clearTimeout(this.serverTimer)
        },
        start(ws) {
            this.reset()
            this.timer = setTimeout(() => {
                // console.log('发送心跳,后端收到后，返回一个心跳消息')
                // onmessage拿到返回的心跳就说明连接正常
                ws.send(JSON.stringify({ heart: 1 }))
                this.serverTimer = setTimeout(() => {
                    // 如果超过一定时间还没响应(响应后触发重置)，说明后端断开了
                    ws.close()
                }, this.timeout)
            }, this.timeout)
        }
    }
    export default {
        name: 'Websocket',
        data() {
            return {
                newMessage:'',
                wsuri: 'ws://127.0.0.1:8080/websocket/websocket/myname', // ws wss
                lockReconnect: false, // 连接失败不进行重连
                maxReconnect: 23, // 最大重连次数，若连接失败
                socket: null
            }
        },
        mounted() {
           // this.initWebSocket()
        },
        created () { // 页面创建生命周期函数
            this.initWebSocket()
        },
        destroyed () { // 离开页面生命周期函数
            this.websocketclose()
        },
        methods: {
            reconnect() {
                console.log('尝试重连')
                if (this.lockReconnect || this.maxReconnect <= 0) {
                    return
                }
                setTimeout(() => {
                    // this.maxReconnect-- // 不做限制 连不上一直重连
                    console.log('看看调用几次A')
                    this.initWebSocket()
                }, 60 * 1000)
            },
            initWebSocket() {
                console.log('看看调用几次B')
                try {
                    if ('WebSocket' in window) {
                        this.socket = new WebSocket(this.wsuri)
                    } else {
                        console.log('您的浏览器不支持websocket')
                    }
                    this.socket.onopen = this.websocketonopen
                    this.socket.onerror = this.websocketonerror
                    this.socket.onmessage = this.websocketonmessage
                    this.socket.onclose = this.websocketclose
                } catch (e) {
                    console.log(' 出错重新链接' )
                    console.log(e )
                    this.reconnect()
                }
            },
            websocketonopen() {
                console.log('WebSocket连接成功', this.socket.readyState)
                heartCheck.start(this.socket)
                // this.socket.send('发送数据')
                this.websocketsend()

            },
            websocketonerror(e) {
                console.log('WebSocket连接发生错误', e)
                this.reconnect()
            },
            // 获取消息
            websocketonmessage(e) {
               this.newMessage= this.newMessage +"\n"+e.data

                console.log('得到响应', e.data)

                // 消息获取成功，重置心跳
                heartCheck.start(this.socket)
            },
            websocketclose(e) {
                console.log('connection closed (' + e  + ')')
                this.reconnect()
            },
            // 发送消息
            websocketsend() {
                let data = { id: '大家好' }
                this.socket.send(JSON.stringify(data))

            }
        },
        destroyed() {
            this.socket.close()
        }
    }
</script>
<style lang="scss" scoped></style>