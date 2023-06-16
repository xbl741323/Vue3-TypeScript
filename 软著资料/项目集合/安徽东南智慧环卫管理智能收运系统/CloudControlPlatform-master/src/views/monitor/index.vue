<template>
  <div id="monitor">
    <Map
      class="map"
      ref="map"
      zoom="12"
      :center="center"
      :isShowBaseMap="true"
      :isScaleLine="true"
    />
  </div>
</template>

<script>
import Map from "@/views/monitor/Map";
import {
  inquireVehicle,
} from "@/api/vehicles";
export default {
  name: "monitor",
  data() {
    return {
      center: [108.939621, 34.343147],
      map: null,
      layer: null,
      eventKey: null,
      path: "ws://172.16.6.146:9014",
      socket: "",
      vehicles: []
    };
  },
  components: {
    Map
  },

  mounted() {
    this.getVehiclesVin();
    this.map = this.$refs.map.map;
    // this.init();
  },
  methods: {
    init: function() {
      if (typeof WebSocket === "undefined") {
        alert("您的浏览器不支持socket");
      } else {
        // 实例化socket
        this.socket = new WebSocket(this.path);
        // 监听socket连接
        this.socket.onopen = this.open;
        // 监听socket错误信息
        this.socket.onerror = this.error;
        // 监听socket消息
        this.socket.onmessage = this.getMessage;
      }
    },
    open: function() {
      console.log("socket连接成功");
      //鉴权
      var sendData = JSON.stringify({
        service_name: "AUTHENTICATION",
        action_name: "LOGIN_REQ",
        client_id: "8626FE0E38C24928AE2D282459611C7C",
        data: {}
      });
      this.socket.send(sendData);
    },
    error: function() {
      console.log("连接错误");
    },
    getMessage: function(msg) {
      const resultData = eval("(" + msg.data + ")");
      console.log(resultData);
      if (resultData.action_name == "LOGIN_RSP") {
        var dataInfo = resultData;
        //鉴权成功
        if (dataInfo.data.status == "200") {
          console.log("鉴权成功");
          //发送订阅数据
          var sendData = JSON.stringify({
            service_name: "GPS_SERVICE",
            action_name: "VEH_REAL_DATA_SUB_REQ",
            client_id: "8626FE0E38C24928AE2D282459611C7C",
            data: { vins: this.vehicles }
          });
          console.log(sendData)
          this.socket.send(sendData);
        } else if (dataInfo.data.status == "500") {
          //鉴权失败
          console.log("鉴权失败");
          this.socket.onclose = this.close();
        } else {
          //鉴权返回值有误
          console.log("WebSocket Server 返回错误鉴权值");
          this.socket.onclose = this.close();
        }
      } else {
      }
    },
    send: function() {
      this.socket.send(params);
    },
    close: function() {
      console.log("socket已经关闭");
    },
    //获取车辆VIN
    getVehiclesVin() {
      inquireVehicle({}).then(response => {
        for(let item of response.data.vehicles){
          this.vehicles.push(item.vin17)
        }
      });
    }
  },
  destroyed() {
    // 销毁监听
    this.socket.onclose = this.close;
  }
};
</script>

<style>
html,
body,
#monitor {
  height: 100%;
  width: 100%;
  margin: 0px;
  padding: 0px;
}

#monitor {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100%;
  width: 100%;
  /* margin-top: 60px; */
}
.monitor {
  height: 100%;
  width: 100%;
}
</style>
