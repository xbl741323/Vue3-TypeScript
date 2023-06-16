<template>
    <el-card shadow="never" class="aui-card--fill">
        <el-container>
            <el-aside width="200px">Aside</el-aside>
            <el-main>全部视频监控</el-main>
        </el-container>
    </el-card>
</template>
<script>
export default {
    data() {
        return {
        };
    },
};
</script>
<style>
.aui-content>.el-tabs>.el-tabs__content {
    padding: 0px !important;
}

.el-card__body {
    padding: 0px !important;
}

.el-tabs--card {
    height: 100%;
}

.el-main {
    padding: 0px !important;
}

.container {
    height: 89vh;
}
</style>