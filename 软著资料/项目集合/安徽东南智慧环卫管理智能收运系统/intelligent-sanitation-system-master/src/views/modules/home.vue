<template>
    <el-card shadow="never" class="aui-card--fill">
        <!--  <carMonitoring></carMonitoring> -->
        <div class="mod-home">
            <iframe
                    id="iframeId" src="http://119.3.242.199:7080/cas/login?userName=admin&pwd=666666&service=http%3A%2F%2F119.3.242.199%3A7080%2Fdsp-vehiclesupervise-uiNew%2Fvehiclemonitor%2Fallvehiclemonitorsynew.zul%3Fid%3Dsenyuan" frameborder="0" class="iframe2"  scrolling="auto"
            >


            </iframe>
        </div>
    </el-card>
</template>

<script>
    ///:pageNumber=allvehmonitor_1
    //  import carMonitoring from "./monitoring/carmonitoring";

    export default {
        name: "home",
        data() {
            return {

            };
        },
        components: {
            //  carMonitoring
        },

    }
</script>
<style >
    .iframe2 {
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        width: 100%;
        height: 100%;
        background: #fff;
        overflow-y: hidden;
    }
    body .el-table th.gutter{
        display: table-cell!important;
    }

    body .el-table colgroup.gutter{
        display: table-cell!important;
    }
</style>