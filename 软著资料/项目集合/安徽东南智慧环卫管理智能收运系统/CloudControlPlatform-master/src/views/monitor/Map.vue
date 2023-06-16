<template>
  <div>
    <div id="map" class="map">
    </div>
  </div>
</template>
<script>
// 映入css文件、
import "ol/ol.css";
import "@/utils/openlayers/css/OverviewMap.css";
import Map from "ol/Map.js";
import Overlay from "ol/Overlay";
import View from "ol/View.js";
import TileLayer from "ol/layer/Tile.js";
import XYZ from "ol/source/XYZ";
// 比例尺
import ScaleLine from "ol/control/ScaleLine";
// import CustomControls from "ol/control/ol.control.Draw.js";
// 地图服务
import {
  tiandituVetorMap,
  tiandituImgMap
} from "@/utils/openlayers/js/mapServer";

export default {
  props: ["zoom", "center", "isShowBaseMap", "isScaleLine"],
  data() {
    return {
      map: null
    };
  },
  mounted() {
    this.initMap();
    // this.showuCstomControls()
    // //获取html可视区域高度：
    var clientHeight = document.body.clientHeight
    console.log(clientHeight)
    // //动态设置元素高度：
    // this.$refs["map"].style.height = clientHeight + "px"; //动态设置HTML元素高度
    document.getElementById('map').style.height = clientHeight + 'px'
  },
  methods: {
    initMap() {
      this.map = new Map({
        target: "map",
        view: new View({
          projection: "EPSG:4326",
          center: this.center || [0, 0],
          zoom: this.zoom || 2,
        })
      });


      var point_overlay = new Overlay({
        positioning: "center-center"
      });
      this.map.addOverlay(point_overlay);
      point_overlay.setPosition([108.939621, 34.343147]);

      if (this.isShowBaseMap) tiandituVetorMap(this.map);
      // this.showTianDiTu();
      if (this.isScaleLine) this.showScaleLine();
    },
    // 显示比例尺
    showScaleLine: function() {
      //实例化比例尺控件（ScaleLine）
      var scaleLineControl = new ScaleLine({
        //设置比例尺单位，degrees、imperial、us、nautical、metric（度量单位）
        units: "metric"
      });
      this.map.addControl(scaleLineControl);
    },
    showuCstomControls: function() {
      //实例化比例尺控件（ScaleLine）
      var customControls = new CustomControls({
        //设置比例尺单位，degrees、imperial、us、nautical、metric（度量单位）
        // units: "metric"
      });
      this.map.addControl(customControls);
    }
    
  }
};
</script>
<style>
.map {
  width: 100%;
  height: 700px;
}
@keyframes myfirst {
  to {
    transform: scale(2);
    background: rgba(0, 0, 0, 0);
  }
}
.font {
  position: absolute;
  top: 15px;
  left: 14px;
}
</style>
