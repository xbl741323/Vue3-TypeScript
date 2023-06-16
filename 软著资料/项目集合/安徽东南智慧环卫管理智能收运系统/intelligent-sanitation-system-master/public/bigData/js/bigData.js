var baseUrl = 'http://49.4.92.83:8080';
var userid="0";
var yscartypeList=[];
var yscarTotal=0;
var map;

var ysworkertypeList=[];
// 右下角人员违规类型
var yxrywglxList=[];
// 右下角人员违规值
var yxrywgzList=[];
// 人员违规总数
var yxrywgcount=0;

// 右下角车辆违规类型
var yxvehwglxList=[];
// 右下角车违规值
var yxvehwgzList=[];
// 车辆违规总数
var yxvehwgcount=0;
// 获取左上角车辆和人员总数等
getVehWorkBigData();
getWorkerNormBigData();
//中心数据
getCenterBigData();
// 车辆工作量
getVehWorkNormBigData();
// 车辆类型
getVehWorkNormBigData4Type();
// 人员违规统计
getWorkerBigData();
// 人员类型到岗
getWorkerMoreNormBigData();

// 右下角  车辆违规统计
getvehweiguiBigData();
let cluster;
let oneCluster;
let toCluster;
let threeCluster;
let stopCluster;
let markers = [];
let stopMarkers = [];

$(function (){
     map = new AMap.Map('container', {
        resizeEnable: true,
        zoom:12,
        center: [121.667855,42.027915],
        mapStyle:'amap://styles/0af85191d2fcc7470c215f1de631f008'
        //前往创建自定义地图样式：https://lbs.amap.com/dev/mapstyle/index
    });
    cluster = new AMap.MarkerClusterer(map, markers, {gridSize: 80});
    stopCluster = new AMap.MarkerClusterer(map, stopMarkers, {gridSize: 80});
    oneCluster = new AMap.MarkerClusterer(map, markers, {gridSize: 80});
    toCluster = new AMap.MarkerClusterer(map, markers, {gridSize: 80});
    threeCluster = new AMap.MarkerClusterer(map, markers, {gridSize: 80});
    $("#carMistake").hide();
    $("#workTarget").hide();
});
// 获取左上角车辆和人员总数等
function getVehWorkBigData() {

    $.ajax({
        headers: {
            "token":$.cookie('token') //此处放置请求到的用户token
        },
        url: baseUrl+"/vehwork-old/bigdata/getVehWorkBigData",
        type: "get",
        contentType: "application/x-www-form-urlencoded;charset=utf-8",
        crossDomain:true,
        data: {userid: userid},
        xhrFields: {
            withCredentials: true //允许跨域带Cookie
        },
        success: function (json) {
            console.log(json);
            if(json.data !=null)
            {
                carCount=json.data.carCount+'';
                workerTotal=json.data.workerTotal+'';
                travelSumMileage=json.data.travelSumMileage+'';
                workSumMileage=json.data.workSumMileage+'';
                qinyunSumMileage=json.data.qinyunSumMileage+'';
                youhao=json.data.youhao+'';
                workerTotal=json.data.workerTotal+'';
                xunchaSumMileage=json.data.xunchaSumMileage+'';
                xunchaTime=json.data.xunchaTime+'';

                try {
                    carCount=Math.round(carCount);
                    workerTotal=Math.round(workerTotal);
                    travelSumMileage=Math.round(travelSumMileage);
                    workSumMileage=Math.round(workSumMileage);
                    qinyunSumMileage=Math.round(qinyunSumMileage);
                    youhao=Math.round(youhao);
                    workerTotal=Math.round(workerTotal);
                    xunchaSumMileage=Math.round(xunchaSumMileage);
                    xunchaTime=Math.round(xunchaTime);

                } catch(err){
                    console.error(err)
                }
                $("#carCount").html(carCount);
               // $("#workerTotal").html(workTotal);
                $("#travelSumMileage").html(travelSumMileage);
                $("#workSumMileage").html(workSumMileage);
                $("#qinyunSumMileage").html(qinyunSumMileage);
                $("#youhao").html(youhao);
                $("#xunchaSumMileage").html(xunchaSumMileage);
                $("#xunchaTime").html(xunchaTime);
            }
 else{
                $("#carCount").html('114');
                $("#workerTotal").html('34');
                $("#travelSumMileage").html('783456');
                $("#workSumMileage").html('65678');
                $("#qinyunSumMileage").html('245641');
                $("#youhao").html('3533');
                $("#xunchaSumMileage").html('57532');
                $("#xunchaTime").html('37823');

            }


        }
    });

}

// 获取到岗数等
function getWorkerNormBigData() {

    $.ajax({
        headers: {
            "token":$.cookie('token') //此处放置请求到的用户token
        },
        url: baseUrl+"/vehwork-old/bigdata/getWorkerNormBigData",
        type: "get",
        contentType: "application/x-www-form-urlencoded;charset=utf-8",
        crossDomain:true,
        data: {userid: userid},
        xhrFields: {
            withCredentials: true //允许跨域带Cookie
        },
        success: function (json) {
            console.log(json);
            weiDaoGang=json.data.weiDaoGang+'';
            toGangDay=json.data.toGangDay+'';
            workTotal=json.data.workTotal+'';
            try {
                weiDaoGang=Math.round(weiDaoGang);
                toGangDay=Math.round(toGangDay);
                workTotal=Math.round(workTotal);

            } catch(err){
                console.error(err)
            }
            $("#weiDaoGang").html(weiDaoGang);
            $("#toGangDay").html(toGangDay);
            $("#workTotal").html(workTotal);
            $("#workerTotal").html(workTotal);


        }
    });

}

// 获取不同人员类型的到岗数等--
function getWorkerMoreNormBigData() {

    $.ajax({
        headers: {
            "token":$.cookie('token') //此处放置请求到的用户token
        },
        url: baseUrl+"/vehwork-old/bigdata/getWorkerMoreNormBigData",
        type: "get",
        contentType: "application/x-www-form-urlencoded;charset=utf-8",
        crossDomain:true,
        data: {userid: userid},
        xhrFields: {
            withCredentials: true //允许跨域带Cookie
        },
        success: function (json) {
            console.log(json);
            var datalist=json.data

            ysworkertypeList=[];
            for(var index in datalist)
            {

                ysworkertypeList.push({name:datalist[index].typeName ,value:datalist[index].toGangDay,notWork:datalist[index].weiDaoGang,
                    daoGangLV:datalist[index].daoGangLV,workTotal:datalist[index].workTotal,workNum:datalist[index].toGangDay})
            }

            rydgChar();
        }
    });

}
// 获取中心上方数据
function getCenterBigData() {

    $.ajax({
        headers: {
            "token":$.cookie('token') //此处放置请求到的用户token
        },
        url: baseUrl+"/vehwork-old/bigdata/getCenterBigData",
        type: "get",
        contentType: "application/x-www-form-urlencoded;charset=utf-8",
        crossDomain:true,
        data: {userid: userid},
        xhrFields: {
            withCredentials: true //允许跨域带Cookie
        },
        success: function (json) {
            console.log(json);

            if(json.data !=null)
            {

                ctravelSumMileage=json.data.travelSumMileage+'';
                cxunchaSumMileage=json.data.xunchaSumMileage+'';
                cyouhao=json.data.youhao+'';
                try {
                    ctravelSumMileage=Math.round(ctravelSumMileage);
                    cxunchaSumMileage=Math.round(cxunchaSumMileage);
                    cyouhao=Math.round(cyouhao);

                } catch(err){
                    console.error(err)
                }
                $("#ctravelSumMileage").html(ctravelSumMileage);
                $("#cxunchaSumMileage").html(cxunchaSumMileage);
                $("#cyouhao").html(cyouhao);
            }
            else
            {

                $("#ctravelSumMileage").html('532');
                $("#cxunchaSumMileage").html('137');
                $("#cyouhao").html('0.7');

            }


        }
    });

}
// 右上角出车数
function getVehWorkNormBigData() {
console.log("走吗 getVehWorkNormBigData");
    $.ajax({
        headers: {
            "token":$.cookie('token') //此处放置请求到的用户token
        },
        url: baseUrl+"/vehwork-old/bigdata/getVehWorkNormBigData",
        type: "get",
        contentType: "application/x-www-form-urlencoded;charset=utf-8",
        crossDomain:true,
        data: {userid: userid},
        xhrFields: {
            withCredentials: true //允许跨域带Cookie
        },
        success: function (json) {
            if(json.data)
            {
                yscarTotal=json.data.carTotal+'';
                yscarWorkNum=json.data.carWorkNum+'';
                ysnotWork=json.data.notWork+'';
                try {
                    yscarTotal=Math.round(yscarTotal);
                    yscarWorkNum=Math.round(yscarWorkNum);
                    ysnotWork=Math.round(ysnotWork);

                } catch(err){
                    console.error(err)
                }
                $("#yscarTotal").html(yscarTotal);
                $("#yscarWorkNum").html(yscarWorkNum);
                $("#ysnotWork").html(ysnotWork);

            }

        }
    });

}

// 右上角出按类型的车数
function getVehWorkNormBigData4Type() {

    $.ajax({
        headers: {
            "token":$.cookie('token') //此处放置请求到的用户token
        },
        url: baseUrl+"/vehwork-old/bigdata/getVehWorkMoreBigData",
        type: "get",
        contentType: "application/x-www-form-urlencoded;charset=utf-8",
        crossDomain:true,
        data: {userid: userid},
        xhrFields: {
            withCredentials: true //允许跨域带Cookie
        },
        success: function (json) {
            console.log(json);
            datalist=json.data

            typehtmls='';
            yscartypeList=[];
            var shownum=0
            for(var index in datalist)
            {
                let ifshow=false;
               // let a=datalist[index].carWorkNum/datalist[index].carTotal;
               // console.log(  a >0.06);
                shownum=shownum+1;
                if (shownum<=4 )
                {
                    ifshow=true;
                }
                yscartypeList.push({name:datalist[index].cartype ,value:datalist[index].carWorkNum,notWork:datalist[index].notWork,
                    labelLine:{show:ifshow},label:{show:ifshow},

                carLV:datalist[index].carLV,carTotal:datalist[index].carTotal,carWorkNum:datalist[index].carWorkNum})
            }

            clccChar();
        }
    });

}

// 右下角 人员 违规统计
function getWorkerBigData() {

    $.ajax({
        headers: {
            "token":$.cookie('token') //此处放置请求到的用户token
        },
        url: baseUrl+"/vehwork-old/bigdata/getWorkerBigData",
        type: "get",
        contentType: "application/x-www-form-urlencoded;charset=utf-8",
        crossDomain:true,
        data: {userid: userid},
        xhrFields: {
            withCredentials: true //允许跨域带Cookie
        },
        success: function (json) {

            returndatalist=json.data

            typehtmls='';
            yxrywglxList=[];
            yxrywgzList=[];
            for(var index in returndatalist)
            {

                yxrywglxList.push(returndatalist[index].typeName   );
                yxrywgzList.push(returndatalist[index].typeCount);
                yxrywgcount =yxrywgcount +Number.parseInt(returndatalist[index].typeCount);

            }

            $("#yxrywgcount").html(yxrywgcount);
            wgtjChars();
        }
    });

}

//
// 右下角  车辆违规统计
function getvehweiguiBigData() {

    $.ajax({
        headers: {
            "token":$.cookie('token') //此处放置请求到的用户token
        },
        url: baseUrl+"/vehwork-old/bigdata/getCarBigData",
        type: "get",
        contentType: "application/x-www-form-urlencoded;charset=utf-8",
        crossDomain:true,
        data: {userid: userid},
        xhrFields: {
            withCredentials: true //允许跨域带Cookie
        },
        success: function (json) {

            console.log(json);
            returndatalist=json.data

            typehtmls='';
            yxvehwglxList=[];
            yxvehwgzList=[];
            for(var index in returndatalist)
            {

                yxvehwglxList.push(returndatalist[index].typeName   );

                console.log(returndatalist[index].typeCount+"车辆违规统计"+returndatalist[index].typeName  );
                yxvehwgzList.push(returndatalist[index].typeCount);
                yxvehwgcount =yxvehwgcount +Number.parseInt(returndatalist[index].typeCount);

            }

            $("#yxvehwgcount").html(yxvehwgcount);
            wgvehtjChars();
        }
    });

}
$(function() {
	$('#wgtjTopChangeItem1').css("color", "#D5E5FF");
	$('#wgtjTopChangeItem2').css("color", "#0F88FB");
	$('#middle_bottom_left_item1').css("color", "#DCDCDC");
	$('#bingDetails1').css("display", "none");
	$('#bingDetails2').css("display", "none");
});
function sbxf(type){
	if(type=='1'){
		$('#bingDetails1').css("display", "block");
	}else{
		$('#bingDetails2').css("display", "block");
	}
}
function sbyc(type){
	if(type=='1'){
		$('#bingDetails1').css("display", "none");
	}else{
		$('#bingDetails2').css("display", "none");
	}
}
function middlecenterChange(type) {
    cluster.clearMarkers();
    oneCluster.clearMarkers();
    toCluster.clearMarkers();
    threeCluster.clearMarkers();
    stopCluster.clearMarkers();
    markers=[];
    stopMarkers=[];
    clearPolygon();
    $(":checkbox").prop("checked", false);
	if (type == '1') {//人员
		$('#middle_bottom_left_item1').css("color", "#DCDCDC");
		$('#middle_bottom_left_item2').css("color", "#0F88FB");
		$('#middle_bottom_left_item3').css("color", "#0F88FB");
        $("#carMistake").hide();
        $("#workTarget").hide();
        $("#personMistake").show();
	} else if (type == '2') {//车辆
		$('#middle_bottom_left_item2').css("color", "#DCDCDC");
		$('#middle_bottom_left_item1').css("color", "#0F88FB");
		$('#middle_bottom_left_item3').css("color", "#0F88FB");
        $("#personMistake").hide();
        $("#workTarget").hide();
        $("#carMistake").show();
	} else {//设施
		$('#middle_bottom_left_item3').css("color", "#DCDCDC");
		$('#middle_bottom_left_item1').css("color", "#0F88FB");
		$('#middle_bottom_left_item2').css("color", "#0F88FB");
        $("#personMistake").hide();
        $("#carMistake").hide();
        $("#workTarget").show();
	}
}

//获取车辆违规
function carMistake(mistakeType,e,type){
    console.log(mistakeType)
    if(e.checked == true){
        stopMarkers = [];
        $.ajax({
            headers: {
                "token":$.cookie('access_token'), //此处放置请求到的用户token
                "Authorization": "Bearer "+$.cookie('access_token')
            },
            url: baseUrl+"/zhhwmonitor/carMonitor/getMistakeInfoList?mistaketype="+mistakeType,
            type: "get",
            contentType: "application/x-www-form-urlencoded;charset=utf-8",
            data:{

            },
            crossDomain:true,
            xhrFields: {
                withCredentials: true //允许跨域带Cookie
            },
            success: function (json) {
                let listData = json.data;
                for (let i=0;i<listData.length;i++){
                    let icon = "http://121.36.213.139/m/missdata.png";
                    if(listData[i].mistaketype=="停车点"){
                        icon = "http://121.36.213.139/m/exceedStop.png";
                    }
                    if(listData[i].mistaketype=="超速点" || listData[i].mistaketype=="慢速作业"){
                        icon = "http://121.36.213.139/m/exceedSpeed.png";
                    }
                    if(listData[i].mistaketype=="油量异常减少"){
                        icon = "http://121.36.213.139/m/oilConsumption.png";
                    }
                    let marker = new AMap.Marker({
                        icon: icon,
                        position: [listData[i].xcd,listData[i].ycd],
                        extData : {
                            "id":listData[i].id
                        }
                    });
                    marker.on('click', function (e){
                        markerMistakeClick(listData[i]);
                    });
                    stopMarkers.push(marker);
                }
                if(type==1){
                    stopCluster.addMarkers(stopMarkers);
                }
                if(type==2){
                    oneCluster.addMarkers(stopMarkers);
                }
                if(type==3){
                    toCluster.addMarkers(stopMarkers);
                }
                if(type==4){
                    threeCluster.addMarkers(stopMarkers);
                }
                if(listData.length > 0){
                    this.map.setCenter([listData[0].xcd,listData[0].ycd]);
                }
            }
        });
    }else {
        if(type==1){
            stopCluster.clearMarkers();
        }
        if(type==2){
            oneCluster.clearMarkers();
        }
        if(type==3){
            toCluster.clearMarkers();
        }
        if(type==4){
            threeCluster.clearMarkers();
        }
    }
}

function markerMistakeClick(e) {
    let driverName = e.driverName != null ? e.driverName : "";
    let infoWindow = new AMap.InfoWindow({offset: new AMap.Pixel(0, -30),closeWhenClickMap:true});
    let html = '<div class="middle_center"><div style="font-size: 1.6vh;text-align: center;">车辆违规</div><img src="image/图层%201075@2x.png"/>' +
        '<div class="flex-row align-center" style="font-size: 1.4vh;">所属部门：<div style="color: #00CBF7;">'+e.deptName+'</div></div>' +
        '<div class="flex-row align-center" style="font-size: 1.4vh;">车辆编号：<div style="color: #00CBF7;">'+e.plateNumber+'</div></div>' +
        '<div class="flex-row align-center" style="font-size: 1.4vh;">司&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;机：<div style="color: #00CBF7;">'+driverName+'</div></div>' +
        '<div class="flex-row align-center" style="font-size: 1.4vh;">车辆类型：<div style="color: #00CBF7;">'+e.carTypeName+'</div></div>' +
        '<div class="flex-row align-center" style="font-size: 1.4vh;">时&nbsp;&nbsp;间&nbsp;段：<div style="color: #00CBF7;">'+e.parkingtime +'</div></div>' +
        '<div class="flex-row align-center" style="font-size: 1.4vh;">违规类型：<div style="color: #00CBF7;">'+e.mistaketype+'</div></div>' +
        '<div class="flex-row align-center" style="font-size: 1.4vh;">违规时间：<div style="color: #00CBF7;">'+e.date +'</div></div>' +
        '</div>';
    infoWindow.setContent(html);
    infoWindow.open(this.map, [e.xcd,e.ycd]);
}

//绘制人员信息
function drawPerson(e){
    if(e.checked == true){
        markers=[];
        $.ajax({
            headers: {
                "token":$.cookie('access_token'), //此处放置请求到的用户token
                "Authorization": "Bearer "+$.cookie('access_token')
            },
            url: baseUrl+"/zhhwmonitor/workerMonitor/getWorkerCurrentStatusListByType",
            type: "get",
            contentType: "application/x-www-form-urlencoded;charset=utf-8",
            data:{

            },
            crossDomain:true,
            xhrFields: {
                withCredentials: true //允许跨域带Cookie
            },
            success: function (json) {
                let listData = json.data;
                console.log(listData,"人员人员人员");
                for (let i=0;i<listData.length;i++){
                    let marker = new AMap.Marker({
                        icon: new AMap.Icon({
                            size: new AMap.Size(51, 51),
                            image: "http://121.36.213.139/m/personRun.png",
                            imageSize: new AMap.Size(51, 51)
                        }),
                        position: [listData[i].xcd,listData[i].ycd],
                        extData : {
                            "id":parseInt(listData[i].workerId)
                        }
                    });

                    marker.on('click', function (e){
                        markerWorkerClick(listData[i]);
                    });
                    markers.push(marker);
                }
                cluster.addMarkers(markers);
                if(markers.length > 0){
                    map.setCenter([listData[0].xcd,listData[0].ycd]);
                }
            }
        });
    }else {
        cluster.clearMarkers();
    }
}

function workMistake(mistakeType,e,type){
    console.log(mistakeType)
    if(e.checked == true){
        stopMarkers = [];
        $.ajax({
            headers: {
                "token":$.cookie('access_token'), //此处放置请求到的用户token
                "Authorization": "Bearer "+$.cookie('access_token')
            },
            url: baseUrl+"/zhhwmonitor/workerMonitor/getPersonEventByIds?eventType="+mistakeType,
            type: "get",
            contentType: "application/x-www-form-urlencoded;charset=utf-8",
            data:{

            },
            crossDomain:true,
            xhrFields: {
                withCredentials: true //允许跨域带Cookie
            },
            success: function (json) {
                let listData = json.data;
                for (let i=0;i<listData.length;i++){
                    let iconImg = 'http://121.36.213.139/m/chidao.png';
                    if(listData[i].eventType=='越界'){
                        iconImg = 'http://121.36.213.139/m/yuejie.png';
                    }
                    if(listData[i].eventType=='滞留'){
                        iconImg = 'http://121.36.213.139/m/zhiliu.png';
                    }
                    if(listData[i].eventType=='脱岗'){
                        iconImg = 'http://121.36.213.139/m/tuogang.png';
                    }
                    if(listData[i].eventType=='早退'){
                        iconImg = 'http://121.36.213.139/m/zaotui.png';
                    }
                    let marker = new AMap.Marker({
                        icon: new AMap.Icon({
                            image:iconImg,
                            size:new AMap.Size(50, 50),//设置icon的大小
                            imageSize: new AMap.Size(50,50)
                        }),
                        position: [listData[i].xcd,listData[i].ycd],
                        extData : {
                            "id":listData[i].id
                        }
                    });
                    marker.on('click', function (e){
                        markerWorkerMistakeClick(listData[i]);
                    });
                    stopMarkers.push(marker);
                }
                if(type==1){
                    stopCluster.addMarkers(stopMarkers);
                }
                if(type==2){
                    oneCluster.addMarkers(stopMarkers);
                }
                if(type==3){
                    toCluster.addMarkers(stopMarkers);
                }
                if(type==4){
                    threeCluster.addMarkers(stopMarkers);
                }
                if(listData.length > 0){
                    // this.map.setCenter([listData[0].xcd,listData[0].ycd]);
                }
            }
        });
    }else {
        if(type==1){
            stopCluster.clearMarkers();
        }
        if(type==2){
            oneCluster.clearMarkers();
        }
        if(type==3){
            toCluster.clearMarkers();
        }
        if(type==4){
            threeCluster.clearMarkers();
        }
    }
}

function markerWorkerMistakeClick(e) {
    let infoWindow = new AMap.InfoWindow({offset: new AMap.Pixel(0, -30),closeWhenClickMap:true});
    let html = '<div class="middle_center"><div style="font-size: 1.6vh;text-align: center;">车辆违规</div><img src="image/图层%201075@2x.png"/>' +
        '<div class="flex-row align-center" style="font-size: 1.4vh;">所属部门：<div style="color: #00CBF7;">'+e.deptName+'</div></div>' +
        '<div class="flex-row align-center" style="font-size: 1.4vh;">人员姓名：<div style="color: #00CBF7;">'+e.workerName+'</div></div>' +
        '<div class="flex-row align-center" style="font-size: 1.4vh;">时&nbsp;&nbsp;间&nbsp;&nbsp;段：<div style="color: #00CBF7;">'+e.parkingTime+'</div></div>' +
        '<div class="flex-row align-center" style="font-size: 1.4vh;">违规时长：<div style="color: #00CBF7;">'+e.eventLong+'</div></div>' +
        '<div class="flex-row align-center" style="font-size: 1.4vh;">违规类型：<div style="color: #00CBF7;">'+e.eventType +'</div></div>' +
        '<div class="flex-row align-center" style="font-size: 1.4vh;">违规时间：<div style="color: #00CBF7;">'+e.createDate+'</div></div>' +
        '<div class="flex-row align-center" style="font-size: 1.4vh;">违规地点：<div style="color: #00CBF7;">'+e.eventPlace +'</div></div>' +
        '</div>';
    infoWindow.setContent(html);
    infoWindow.open(this.map, [e.xcd,e.ycd]);
}

function markerWorkerClick(e){
    let infoWindow = new AMap.InfoWindow({offset: new AMap.Pixel(0, -30),closeWhenClickMap:true});
    let location = e.location == undefined ? '' : e.location;
    let html = '<div class="middle_center"><div style="font-size: 1.6vh;text-align: center;">人员信息</div><img src="image/图层%201075@2x.png"/>' +
        '<span class="particularsClass">所属部门：'+e.deptName+'</span><br/>' +
        '<span class="particularsClass">人员类型：'+e.workerTypename+'</span><br/>' +
        '<span class="particularsClass">人员姓名：'+e.name+'</span><br/>' +
        '<span class="particularsClass">速&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;度：'+e.speed +'</span><br/>' +
        // '<span class="lab">里&nbsp;&nbsp;&nbsp;&nbsp;程：</span><span>'+travelMileage +'</span><br/>' +
        '<span class="particularsClass">最后在线时间：'+e.lastChangeDate+'</span><br/>' +
        '<span class="lab">最后位置：</span><span>'+location+'</span>' +
        '</div>';
    infoWindow.setContent(html);
    infoWindow.open(this.map, [e.xcd,e.ycd]);
}

//绘制车辆信息
function drawCar(e){
    if(e.checked == true) {
        markers=[];
        $.ajax({
            headers: {
                "token": $.cookie('access_token'), //此处放置请求到的用户token
                "Authorization": "Bearer " + $.cookie('access_token')
            },
            url: baseUrl + "/zhhwmonitor/carMonitor/getCurrentPositionStatusList",
            type: "get",
            contentType: "application/x-www-form-urlencoded;charset=utf-8",
            crossDomain: true,
            xhrFields: {
                withCredentials: true //允许跨域带Cookie
            },
            success: function (json) {
                let listData = json.data;
                for (let i = 0; i < listData.length; i++) {
                    let marker = new AMap.Marker({
                        icon: "https://a.amap.com/jsapi_demos/static/demo-center-v2/car.png",
                        position: [listData[i].xcd, listData[i].ycd],
                        extData: {
                            "id": listData[i].carid
                        }
                    });

                    marker.on('click', function (e) {
                        markerClick(listData[i]);
                    });
                    markers.push(marker);
                }
                cluster.addMarkers(markers);
                if (markers.length > 0) {
                    map.setCenter([listData[0].xcd, listData[0].ycd]);
                }
            }
        });
    }else {
        cluster.clearMarkers();
    }
}
function markerClick(e){
    let infoWindow = new AMap.InfoWindow({offset: new AMap.Pixel(0, -30),closeWhenClickMap:true});
    let driverName = e.driverName != null ? e.driverName : '--';
    let travelMileage = e.travelMileage != null ? e.travelMileage : '--';
    let worktTime = e.worktTime != null ? e.worktTime : '--';
    let html = '<div class="middle_center"><div style="font-size: 1.6vh;text-align: center;">车辆信息</div><img src="image/图层%201075@2x.png"/>' +
        '<div class="flex-row align-center" style="font-size: 1.4vh;">所属部门：<div style="color: #00CBF7;">'+e.deptName+'</div></div>' +
        '<div class="flex-row align-center" style="font-size: 1.4vh;">车辆类型：<div style="color: #00CBF7;">'+e.carTypeName+'</div></div>' +
        '<div class="flex-row align-center" style="font-size: 1.4vh;">车牌号：<div style="color: #00CBF7;">'+e.plateNumber+'</div></div>' +
        '<div class="flex-row align-center" style="font-size: 1.4vh;">司机：<div style="color: #00CBF7;">'+ driverName +'</div></div>' +
        '<div class="flex-row align-center" style="font-size: 1.4vh;">速度：<div style="color: #00CBF7;">'+e.carspeed +'</div></div>' +
        '<div class="flex-row align-center" style="font-size: 1.4vh;">里程：<div style="color: #00CBF7;">'+travelMileage +'</div></div>' +
        '<div class="flex-row align-center" style="font-size: 1.4vh;">出收车时间：<div style="color: #00CBF7;">'+worktTime +'</div></div>' +
        '<div class="flex-row align-center" style="font-size: 1.4vh;">最后在线时间：<div style="color: #00CBF7;">'+e.lastupdatetime+'</div></div>' +
        '<div class=" align-center" style="font-size: 1.4vh;">车辆位置：<div style="color: #00CBF7;">'+e.location+'</div></div>';
    html +='</div>';
    infoWindow.setContent(html);
    infoWindow.open(this.map, [e.xcd,e.ycd]);
}

function clearPolygon(){
    let polygons = map.getAllOverlays('polygon');
    let polyLines = map.getAllOverlays('polyline');

    map.remove(polyLines);
    map.remove(polygons);
}

//绘制设施信息
function drawFacility(type,targetName,e){
    if (e.checked == true){
        $.ajax({
            headers: {
                "token": $.cookie('access_token'), //此处放置请求到的用户token
                "Authorization": "Bearer " + $.cookie('access_token')
            },
            url: baseUrl + "/zhhwmonitor/workTargetMonitor/getViewList?worktargetTypeId="+type,
            type: "get",
            contentType: "application/x-www-form-urlencoded;charset=utf-8",
            crossDomain: true,
            xhrFields: {
                withCredentials: true //允许跨域带Cookie
            },
            success: function (json) {
                let listData = json.data;
                let polygons = [];
                let path = [];
                let icon = "http://121.36.213.139/m/jiashuidian.png";
                if (type == 13) {
                    icon = "http://121.36.213.139/m/tingchechang.png";
                }
                if (type == 30) {
                    icon = "http://121.36.213.139/m/tingchechang.png";
                }
                if (type == 10) {
                    icon = "http://121.36.213.139/m/zhongzhuanzhan.png";
                }
                if (type == 18) {
                    icon = "http://121.36.213.139/m/dustbin.png";
                }
                // cluster.clearMarkers();
                markers = [];
                for (let i = 0; i < listData.length; i++) {
                    if (listData[i].geoinfo != null) {
                        path = [];
                        let geoinfo = listData[i].geoinfo.split('P');
                        for (let j = 0; j < geoinfo.length; j++) {
                            if (geoinfo[j].length > 0) {
                                let latLng = geoinfo[j].split('_');
                                path.push([latLng[1] * 1, latLng[0] * 1]);
                            }
                        }
                        if (geoinfo.length < 1) {
                            path.push([listData[i].lng, listData[i].lat]);
                        }
                        if (path.length > 0) {
                            let address = listData[i].address != null ? listData[i].address : '';
                            let html = '<div class="middle_center"><div style="font-size: 1.6vh;text-align: center;">设施信息</div><img src="image/图层%201075@2x.png"/>' +
                                '<div class="flex-row align-center" style="font-size: 1.4vh;">设施名称：<div style="color: #00CBF7;">' + listData[i].name + '</div></div>' +
                                '<div class="flex-row align-center" style="font-size: 1.4vh;">设施类型：<div style="color: #00CBF7;">' + targetName + '</div></div>' +
                                '<div class="flex-row align-center" style="font-size: 1.4vh;">地址：<div style="color: #00CBF7;">' + address + '</div></div>' +
                                '</div>';
                            if (type == 18) {
                                let marker = new AMap.Marker({
                                    icon: icon,
                                    position: path[0],
                                    extData: {
                                        "id": listData[i].id
                                    }
                                });
                                marker.on('click', function (e) {
                                    let infoWindow = new AMap.InfoWindow({
                                        offset: new AMap.Pixel(0, -30),
                                        closeWhenClickMap: true
                                    });

                                    infoWindow.setContent(html);
                                    infoWindow.open(map, [e.lnglat.R, e.lnglat.Q]);
                                });
                                markers.push(marker);
                            }
                            let polygon = new AMap.Polygon({
                                path: path,
                                strokeColor: "#2a85d5",
                                fillColor: '#2a85d5',
                                extData: {
                                    "id": listData[i].id,
                                    "type": type
                                }
                            });
                            polygon.on('click', function (e) {
                                let infoWindow = new AMap.InfoWindow({
                                    offset: new AMap.Pixel(0, -30),
                                    closeWhenClickMap: true
                                });
                                infoWindow.setContent(html);
                                infoWindow.open(map, [e.lnglat.R, e.lnglat.Q]);
                            });
                            polygons.push(polygon);
                        }
                    }
                }
                if(type == 18){
                    cluster.addMarkers(markers);
                }
                if (polygons.length > 0) {
                    map.add(polygons);
                    // that.map.setFitView();
                    map.setCenter(path[0]);
                }
            }
        });
    }else{
        let polygons = map.getAllOverlays('polygon');
        let removePolygons = [];
        for (let i=0;i<polygons.length;i++){
            if(polygons[i].De.extData.type==type){
                removePolygons.push(polygons[i]);
            }
        }
        map.remove(removePolygons);
    }
}

function drawRoad(targetName,e){
    if (e.checked == true){
        $.ajax({
            headers: {
                "token": $.cookie('access_token'), //此处放置请求到的用户token
                "Authorization": "Bearer " + $.cookie('access_token')
            },
            url: baseUrl + "/zhhwmonitor/workTargetMonitor/getViewList?worktargetTypeId=1",
            type: "get",
            contentType: "application/x-www-form-urlencoded;charset=utf-8",
            crossDomain: true,
            xhrFields: {
                withCredentials: true //允许跨域带Cookie
            },
            success: function (json) {
                let listData = json.data;
                let polygons = [];
                let path = [];
                markers = [];
                for(let i=0;i<listData.length;i++){
                    if(listData[i].geoinfo != null){
                        path = [];
                        let geoinfo = listData[i].geoinfo.split('P');
                        for (let j=0;j<geoinfo.length;j++){
                            if(geoinfo[j].length > 0){
                                let latLng = geoinfo[j].split('_');
                                path.push([latLng[1]*1,latLng[0]*1]);
                            }
                        }
                        if(path.length > 0){
                            let polygon = new AMap.Polyline({
                                path: path,
                                strokeColor: "green",
                                strokeWeight: 6,
                                strokeOpacity: 0.9,
                                zIndex: 50,
                                bubble: true,
                                extData : {
                                    "id":listData[i].id
                                }
                            });
                            polygon.on('click',  function (e){
                                let infoWindow = new AMap.InfoWindow({offset: new AMap.Pixel(0, -30),closeWhenClickMap:true});
                                let address = listData[i].address != null ? listData[i].address : '';
                                let html = '<div class="middle_center"><div style="font-size: 1.6vh;text-align: center;">设施信息</div><img src="image/图层%201075@2x.png"/>' +
                                    '<div class="flex-row align-center" style="font-size: 1.4vh;">设施名称：<div style="color: #00CBF7;">' + listData[i].name + '</div></div>' +
                                    '<div class="flex-row align-center" style="font-size: 1.4vh;">设施类型：<div style="color: #00CBF7;">作业道路</div></div>' +
                                    '<div class="flex-row align-center" style="font-size: 1.4vh;">地址：<div style="color: #00CBF7;">' + address + '</div></div>' +
                                    '</div>';
                                infoWindow.setContent(html);
                                infoWindow.open(map, [e.lnglat.R,e.lnglat.Q]);
                            });
                            polygons.push(polygon);
                        }
                    }
                }
                if(polygons.length > 0){
                    map.add(polygons);
                    cluster.addMarkers(markers);
                    map.setCenter(path[path.length-1]);
                }
            }
        });
    }else {
        let polyLines = map.getAllOverlays('polyline');

        map.remove(polyLines);
    }
}

function wgtjTopChange(type) {
	if (type == '1') {
		$('#wgtjTopChangeItem1').css("color", "#D5E5FF");
		$('#wgtjTopChangeItem2').css("color", "#0F88FB");
		$('#wgtjTopChangeItem1>img').attr("src", "image/6-1员工@2x%20(1).png");
		$('#wgtjTopChangeItem2>img').attr("src", "image/车辆违规管理-01@2x.png");
		$('#wgtjCharsTitle').html("人员违规管理");
		$('#danwei').html("人(单位)");
		// 调用 隐藏div

        document.getElementById("wgtjChars").style.display="block";//显示
        document.getElementById("wgtjChars2").style.display="none";//隐藏
	} else {
		$('#wgtjTopChangeItem2').css("color", "#D5E5FF");
		$('#wgtjTopChangeItem1').css("color", "#0F88FB");
		$('#wgtjTopChangeItem1>img').attr("src", "image/6-1员工@2x.png");
		$('#wgtjTopChangeItem2>img').attr("src", "image/车辆违规管理-01 拷贝@2x.png");
		$('#wgtjCharsTitle').html("车辆违规管理");
		$('#danwei').html("辆(单位)");
        document.getElementById("wgtjChars").style.display="none";//隐藏
        document.getElementById("wgtjChars2").style.display="block";//显示
	}
}


// 人员类型到岗情况
function rydgChar() {
	var myCharts = echarts.init(document.getElementById('rydgChar'));
	window.addEventListener('resize', function() {
		myCharts.resize();
	});
	var option = {
        tooltip: {
            trigger: 'item',
            formatter:function (parms){
                console.log("什么值");
                console.log(parms);

                var str =  ""+ parms.name+":"+parms.data.workTotal+"</br>"+
                    "到岗数："+ parms.data.workNum+"</br>"+
                    "未到岗数："+ parms.data.notWork+"</br>"+
                    "到岗率："+ parms.data.daoGangLV;
                return  str ;
            }
        },
		series: [{
			name: 'Nightingale Chart',
			type: 'pie',
			radius: ['20%', '85%'],
			center: ['50%', '50%'],
			roseType: 'area',
			itemStyle: {
				borderRadius: 8
			},
			data:  ysworkertypeList
		}],
		color: ['#118CFF', '#1DE190', '#94E5FF', '#0B70D0', '#39D9D6']
	};
	myCharts.setOption(option);
}

// 按车辆类型统计出车数
function clccChar() {
	var myCharts = echarts.init(document.getElementById('clccChar'));
	window.addEventListener('resize', function() {
		myCharts.resize();
	});
	var option = {
        tooltip: {
            trigger: 'item',
            formatter:function (parms){

                console.log(parms);
                var str =  ""+ parms.name+":"+parms.data.carTotal+"</br>"+
                    "出车数："+ parms.data.carWorkNum+"</br>"+
                    "未出车数："+ parms.data.notWork+"</br>"
                return  str ;
            }
        },

		series: [{
			name: 'Access From',
			type: 'pie',
			radius: ['40%', '70%'],
			avoidLabelOverlap: true,
            label: {

                normal: {

                    show:false,

                }

            },
            labelLine: {

                normal: {

                    show:false

                }

            },
			data:yscartypeList

		}],
		color: ['#C3B800', '#00C9ED', '#116CFD', '#0065C3']
	};
	myCharts.setOption(option);
}


// 人员违规统计


function wgtjChars() {
	var myCharts = echarts.init(document.getElementById('wgtjChars'));
	window.addEventListener('resize', function() {
		myCharts.resize();
	});
	let data=yxrywgzList;
	var option = {
		roam: false, // 禁止滚轮事件
		tooltip: {
			show: false,
		},
		textStyle: {
			color: 'white'
		},
		grid: {
			x: '0%', //距离左边
			x2: '0%', //距离右边
			y: '15%', // 上距离
			y2: '15%', // 下距离
		},
		xAxis: {
			axisLabel: {
				interval: 0, //横轴信息全部显示
				rotate: -30, //0度角倾斜显示
				show: true,
				textStyle: {
					color: 'white'
				},
			},
			axisLine: {
				lineStyle: {
					color: '#B6C1C4',
				},
			},
			axisTick: {
				show: false,
			},
			data: yxrywglxList
		},
		yAxis: {
			type: 'value',
			axisLine: {
				show: false,
				lineStyle: {
					color: '#B6C1C4',
				},
			},
			  axisLabel: {
				// 坐标轴的标签
				
				show: false, // 是否显示
				color:'white', // 默认轴线的颜色
				formatter: "{value}",
			  },
			splitLine: {
				show: false
			},
		},
		series: [{
			name: 'a',
			tooltip: {
				show: false
			},
			data: yxrywgzList,
			type: 'bar',
			barWidth: 10,
			barGap: 200,
			barCategoryGap: 200,
			label: {
				show: true, // 柱子顶部的数值
				position: 'top',
				top: 0,
				fontSize: 8,
				offset: [0, -10],
				formatter: function(val) {
				    console.log("显示次数---"+val.data );
                    console.log(val.data);
                    var percent=Number.parseInt(val.data*100 /yxrywgcount) ;
					return `${val.data}次\n占比:${percent}%`;
					

				},
			},
			itemStyle: {
				normal: {
					color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [{
						offset: 0,
						color: "#4729FB" // 0% 处的颜色
					}, {
						offset: 0.5,
						color: "#3077F7" // 50% 处的颜色
					}, {
						offset: 1,
						color: "#1FB0F4" // 100% 处的颜色
					}], false)
				}
			},
			// barGap: 0
		}, {
			type: 'bar',
			barWidth: 4,
			itemStyle: {
				normal: {
					color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [{
						offset: 0,
						color: "#235DFF" // 0% 处的颜色
					}, {
						offset: 0.5,
						color: "#59ACF7" // 50% 处的颜色
					}, {
						offset: 1,
						color: "#71CAFF" // 100% 处的颜色
					}], false)
				}
			},
			barGap: 0,
			//data: data.map(item => item + 4.5)
            data:yxrywgzList
		}, 
		{
			name: 'b',
			tooltip: {
				show: false
			},
			type: 'pictorialBar',
			itemStyle: {
				borderWidth: 0,
				borderColor: '#47A6FF',
				color: '#1AC0F4',
		
			},
			symbol: 'path://M 0,0 l 120,0 l -30,60 l -120,0 z',
			symbolSize: ['13', '3'],
			symbolOffset: ['-1', '-2'], // 左右 ，上下
			symbolRotate: 0,
			symbolPosition: 'end',
			data: data,
			z: 3
		}
		],
		

	};
	myCharts.setOption(option);
}
//  车辆违规信息
function wgvehtjChars() {
    var myCharts = echarts.init(document.getElementById('wgtjChars2'));
    window.addEventListener('resize', function() {
        myCharts.resize();
    });
    let data=yxvehwgzList;
    var option = {
        roam: false, // 禁止滚轮事件
        tooltip: {
            show: false,
        },
        textStyle: {
            color: 'white'
        },
        grid: {
            x: '0%', //距离左边
            x2: '0%', //距离右边
            y: '15%', // 上距离
            y2: '18%', // 下距离
        },
        xAxis: {
            axisLabel: {
                interval: 0, //横轴信息全部显示
                rotate: -25, //0度角倾斜显示
                show: true,
                textStyle: {
                    color: 'white'
                },
            },
            axisLine: {
                lineStyle: {
                    color: '#B6C1C4',
                },
            },
            axisTick: {
                show: false,
            },
            data: yxvehwglxList
        },
        yAxis: {
            type: 'value',
            axisLine: {
                show: false,
                lineStyle: {
                    color: '#B6C1C4',
                },
            },
            axisLabel: {
                // 坐标轴的标签

                show: false, // 是否显示
                color:'white', // 默认轴线的颜色
                formatter: "{value}",
            },
            splitLine: {
                show: false
            },
        },
        series: [{
            name: 'a',
            tooltip: {
                show: false
            },
            data: yxvehwgzList,
            type: 'bar',
            barWidth: 10,
            barGap: 200,
            barCategoryGap: 200,
            label: {
                show: true, // 柱子顶部的数值
                position: 'top',
                top: 0,
                fontSize: 8,
                offset: [0, -10],
                formatter: function(val) {
                    console.log("显示次数---"+val.data );
                    console.log(val.data);
                    var percent=Number.parseInt(val.data*100 /yxvehwgcount) ;
                    return `${val.data}次\n占比:${percent}%`;


                },
            },
            itemStyle: {
                normal: {
                    color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [{
                        offset: 0,
                        color: "#4729FB" // 0% 处的颜色
                    }, {
                        offset: 0.5,
                        color: "#3077F7" // 50% 处的颜色
                    }, {
                        offset: 1,
                        color: "#1FB0F4" // 100% 处的颜色
                    }], false)
                }
            },
            // barGap: 0
        }, {
            type: 'bar',
            barWidth: 4,
            itemStyle: {
                normal: {
                    color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [{
                        offset: 0,
                        color: "#235DFF" // 0% 处的颜色
                    }, {
                        offset: 0.5,
                        color: "#59ACF7" // 50% 处的颜色
                    }, {
                        offset: 1,
                        color: "#71CAFF" // 100% 处的颜色
                    }], false)
                }
            },
            barGap: 0,
            //data: data.map(item => item + 4.5)
            data:yxvehwgzList
        },
            {
                name: 'b',
                tooltip: {
                    show: false
                },
                type: 'pictorialBar',
                itemStyle: {
                    borderWidth: 0,
                    borderColor: '#47A6FF',
                    color: '#1AC0F4',

                },
                symbol: 'path://M 0,0 l 120,0 l -30,60 l -120,0 z',
                symbolSize: ['13', '3'],
                symbolOffset: ['-1', '-2'], // 左右 ，上下
                symbolRotate: 0,
                symbolPosition: 'end',
                data: data,
                z: 3
            }
        ],


    };
    myCharts.setOption(option);
}
