<template>
    <el-card shadow="never" class="aui-card--fill">
        <el-container>
            <el-aside width="15vw">
                <div style="margin-bottom: 10px;">
                    <el-button>全部</el-button>
                    <el-button type="success">在线</el-button>
                    <el-button type="info">离线</el-button>
                </div>
                <div style="margin-top: 10px;">
                    <el-input placeholder="输入关键字进行过滤" v-model="filterText">
                    </el-input>
                    <el-tree node-key="id" :data="treeData" :props="defaultProps" default-expand-all
                        :filter-node-method="filterNode" ref="tree">
                        <div slot-scope="{node,data}" style="font-size: 14px;">
                            <span v-if="data.st === undefined">
                                {{ data.label }}
                            </span>
                            <span v-if="data.st === 1" style="color:blue;">
                                {{ data.label }}
                            </span>
                            <span v-if="data.st === 0" style="color:#aaa;">
                                {{ data.label }}
                            </span>
                        </div>
                    </el-tree>
                </div>
            </el-aside>
            <el-main>
                <div class="main">
                    <div>
                        <el-row>
                            <el-col :span="5">
                                <label>录像类型</label>
                                <el-select v-model="params.type" placeholder="请选择录像类型">
                                    <el-option v-for="item in typeOptions" :key="item.value" :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-col>
                            <el-col :span="5">
                                <label>查询位置</label>
                                <el-select v-model="params.mode" placeholder="请选择查询位置">
                                    <el-option v-for="item in modeOptions" :key="item.value" :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-col>
                            <el-col :span="5">
                                <label>开始时间</label>
                                <el-date-picker v-model="params.st" type="datetime" placeholder="选择开始时间">
                                </el-date-picker>
                            </el-col>
                            <el-col :span="5">
                                <label>结束时间</label>
                                <el-date-picker v-model="params.et" type="datetime" placeholder="选择结束时间">
                                </el-date-picker>
                            </el-col>
                            <el-col :span="4">
                                <el-button style="margin-left: 10px;" type="primary" @click="getRecord">查询</el-button>
                            </el-col>
                        </el-row>
                    </div>
                </div>
            </el-main>
        </el-container>
    </el-card>
</template>
<script>
import axios from 'axios'
axios.defaults.baseURL = 'http://dy.qc-online.net:9000' // 根路径
export default {
    data() {
        return {
            filterText: '', // 树节点过滤
            treeData: [], // 左侧树形数据
            keepaliveTimer: null, // 保活的定时器
            jsession: '', // 会话id
            defaultProps: {
                children: 'children',
                label: 'label'
            },
            params: { // 查询条件
                id: undefined, // 设备id
                st: undefined, // 开始时间
                et: undefined, // 结束时间
                type: 255, // 录像类型，0=定时录像，1=移动侦测录像，2=告警录像，255=全部录像
                mode: 0, // 查询位置, 0=从前端查询，1=从中心查询 
            },
            typeOptions: [ // 录像类型选项
                {
                    label: '全部录像',
                    value: 255
                },
                {
                    label: '定时录像',
                    value: 0
                },
                {
                    label: '移动侦测录像',
                    value: 1
                },
                {
                    label: '告警录像',
                    value: 2
                },
            ],
            modeOptions: [ // 查询位置选项
                {
                    label: '前端设备',
                    value: 0
                },
                {
                    label: '中心设备',
                    value: 1
                },
            ],
            record: [], // 录像数据列表
        };
    },
    watch: {
        filterText(val) {
            this.$refs.tree.filter(val);
        }
    },
    methods: {
        // 树节点搜索
        filterNode(value, data) {
            if (!value) return true;
            return data.label.indexOf(value) !== -1;
        },
        // 获取左侧树形数据
        async getTreeData() {
            const { data } = await axios.get('/OpenApi/service/devlist', { params: { jsession: this.jsession } })
            // 处理数据为树形结构
            this.treeData = data.domain.reduce((arr, item) => {
                let obj = {
                    label: item.dn,
                    id: item.did,
                    children: []
                }
                obj.children = data.devices.reduce((arr1, item1) => {
                    if (item1.did === item.did) {
                        let obj1 = {
                            label: item1.nm,
                            id: item1.id,
                            st: item1.st,
                            children: []
                        }
                        obj1.children = Object.keys(item1.video).reduce((arr2, item2) => {
                            let obj2 = {
                                label: item1.video[item2].name,
                                id: item1.id + item2,
                                st: item1.video[item2].status
                            }
                            arr2.push(obj2)
                            return arr2
                        }, [])
                        arr1.push(obj1)
                    }
                    return arr1
                }, [])
                arr.push(obj)
                return arr
            }, [])
            console.log(this.treeData)
        },
        // 登录保活
        async loginAndKeepalive() {
            const data = await axios.get('/OpenApi/service/login?account=test&password=test')
            this.jsession = data.data.jsession
            this.keepaliveTimer = setInterval(async () => {
                const data = await axios.get('/OpenApi/service/login?account=test&password=test')
                this.jsession = data.data.jsession
            }, 1000 * 60 * 3)
        },
        // 获取录像数据列表
        async getRecord() {
            if (!this.params.st) {
                return this.$message.warning('请选择开始时间！')
            }
            if (!this.params.et) {
                return this.$message.warning('请选择结束时间！')
            }
        }
    },
    async mounted() {
        await this.loginAndKeepalive()
        this.getTreeData()
    },
    beforeDestroy() {
        clearInterval(this.keepaliveTimer)
    }
};
</script>
<style scoped>
.el-aside {
    box-sizing: border-box;
    padding: 10px;
}

.main {
    padding: 10px;
}

label {
    font-size: 14px;
    margin: 0 10px;
}

.el-select,
.el-date-editor {
    width: calc(100% - 80px);
}
</style>
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