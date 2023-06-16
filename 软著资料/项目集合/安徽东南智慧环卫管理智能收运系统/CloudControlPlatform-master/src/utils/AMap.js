export default function MapLoader() { // <-- 原作者这里使用的是module.exports
  return new Promise((resolve, reject) => {
    if (window.AMap) {
      resolve(window.AMap)
    } else {
      console.log("7edd9b98f3f0ebfa66a42d8056604db6");
      var script = document.createElement('script')
      script.type = 'text/javascript'
      script.async = true
      script.src = 'http://webapi.amap.com/maps?v=1.4.15&key=7edd9b98f3f0ebfa66a42d8056604db6&plugin=AMap.MapType ,AMap.Geocoder'
      // script.src = 'http://webapi.amap.com/maps?v=1.3&key=2e891893cb36dc27d6d552130d044402&plugin=AMap.ToolBar,AMap.Geocoder'
      script.onerror = reject
      document.head.appendChild(script)
    }
    window.initAMap = () => {
      resolve(window.AMap)
    }
  })
}

