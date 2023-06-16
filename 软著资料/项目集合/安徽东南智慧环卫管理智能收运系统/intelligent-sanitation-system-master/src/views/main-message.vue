<template>
  <div>
<!--    <el-badge :value="messageCount" :hidden="hiddenBadge">-->
<!--      <i class="el-icon-info mesage-info" :style="themeColor" @click="showDrawer"></i>-->
<!--    </el-badge>-->
    <el-drawer
        title="消息"
        :append-to-body="true"
        size="50%"
        :visible.sync="drawer">
        <el-tabs>
            <el-tab-pane :v-if="showVehicle">
              <span slot="label">
                 <el-badge :value="vehicleCount" :hidden="vehicleCount < 1">
                   车辆消息
                 </el-badge>
              </span>
              <el-table :data="vehilceMessage" border>
                <el-table-column label="消息类型" prop="msgType" header-align="center" align="center"></el-table-column>
                <el-table-column label="消息内容" prop="msgContent" header-align="center" align="center"></el-table-column>
                <el-table-column label="消息时间" prop="msgTime" header-align="center" align="center"></el-table-column>
                <el-table-column label="操作" header-align="center" align="center">
                  <template slot-scope="scope">
                    <el-link type="primary"
                      @click.native.prevent="deleteVehicle(scope.$index, scope.row)">
                      详情
                    </el-link>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
            <el-tab-pane :v-if="showPerson">
              <span slot="label">
                 <el-badge :value="personCount" :hidden="personCount < 1">
                   人员消息
                 </el-badge>
              </span>
              <el-table :data="personMessage" border>
                <el-table-column label="消息类型" prop="msgType" header-align="center" align="center"></el-table-column>
                <el-table-column label="消息内容" prop="msgContent" header-align="center" align="center"></el-table-column>
                <el-table-column label="消息时间" prop="msgTime" header-align="center" align="center"></el-table-column>
                <el-table-column label="操作" header-align="center" align="center">
                  <template slot-scope="scope">
                    <el-link type="primary"
                      @click.native.prevent="deletePerson(scope.$index, scope.row)">
                      详情
                    </el-link>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
            <el-tab-pane :v-if="showWorktarget">
              <span slot="label">
                <el-badge :value="worktargetCount" :hidden="worktargetCount < 1">
                    设施消息
                </el-badge>
               </span>
              <el-table :data="worktargetMessage" border>
                <el-table-column label="消息类型" prop="msgType" header-align="center" align="center"></el-table-column>
                <el-table-column label="消息内容" prop="msgContent" header-align="center" align="center"></el-table-column>
                <el-table-column label="消息时间" prop="msgTime" header-align="center" align="center"></el-table-column>
                <el-table-column label="操作" header-align="center" align="center">
                  <template slot-scope="scope">
                    <el-link type="primary"
                      @click.native.prevent="deleteWorktarget(scope.$index, scope.row)">
                      详情
                    </el-link>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
            <el-tab-pane :v-if="showEvent">
              <span slot="label">
                 <el-badge :value="eventCount" :hidden="eventCount < 1">
                   事件消息
                 </el-badge>
              </span>
              <el-table :data="eventMessage" border>
                <el-table-column label="消息类型" prop="msgType" header-align="center" align="center"></el-table-column>
                <el-table-column label="消息内容" prop="msgContent" header-align="center" align="center"></el-table-column>
                <el-table-column label="消息时间" prop="msgTime" header-align="center" align="center"></el-table-column>
                <el-table-column label="操作" header-align="center" align="center">
                  <template slot-scope="scope">
                    <el-link type="primary"
                      @click.native.prevent="deleteEvent(scope.$index, scope.row)">
                      详情
                    </el-link>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
        </el-tabs>
    </el-drawer>
  </div>
</template>

<script>
import Cookies from 'js-cookie'
import ActiveMQ from '@/utils/activemq'
import { ActiveMQConfig } from '@/utils/constants'
export default {
  data () {
    return {
      drawer: false,
      color: 'turquoise',
      messageCount: 0,
      vehilceMessage: [],
      personMessage: [],
      worktargetMessage: [],
      eventMessage: []
    }
  },
  computed: {
    themeColor () {
      return 'color:' + this.color
    },
    hiddenBadge () {
      return this.messageCount == 0
    },
    vehicleCount () {
      return this.vehilceMessage.length
    },
    personCount () {
      return this.personMessage.length
    },
    worktargetCount () {
      return this.worktargetMessage.length
    },
    eventCount () {
      return this.eventMessage.length
    },
    showVehicle () {
      return this.vehilceMessage.length > 0
    },
    showPerson () {
      return this.personMessage.length > 0
    },
    showWorktarget () {
      return this.worktargetMessage.length > 0
    },
    showEvent () {
      return this.eventMessage.length > 0
    }
  },
  mounted () {
    var themeColor = Cookies.get('themeColor')
    if (themeColor) {
      this.color = themeColor
    }
    var selector = ActiveMQ.selector()
    console.log(selector)
    ActiveMQ.init((e) => {
      ActiveMQ.subscribe(ActiveMQConfig.topic, (data) => {
        var dataInfo = JSON.parse(data.body)

        this.messageCount = this.messageCount + 1
        if (dataInfo.scope == 'vehicle') {
          this.vehilceMessage.push(dataInfo)
        } else if (dataInfo.scope == 'person') {
          this.personMessage.push(dataInfo)
        } else if (dataInfo.scope == 'worktarget') {
          this.worktargetMessage.push(dataInfo)
        } else if (dataInfo.scope == 'worktarget') {
          this.eventMessage.push(dataInfo)
        }
        const h = this.$createElement
        const colorStyle = 'color: ' + this.color
        console.log(colorStyle)
        this.$notify({
          title: '提醒',
          type: 'warning',
          duration: 5000,
          position: 'bottom-right',
          message: h('i', { style: colorStyle }, dataInfo.msgContent)
        })
      }, selector)
    }, (e) => {
      console.log(e)
    })
  },
  methods: {
    showDrawer () {
      if (!this.drawer) {
        this.drawer = true
      }
    },
    deleteVehicle (index, row) {
      this.vehilceMessage.splice(index, 1)
      this.messageCount = this.messageCount - 1
    },
    deletePerson (index, row) {
      this.personMessage.splice(index, 1)
      this.messageCount = this.messageCount - 1
    },
    deleteWorktarget (index, row) {
      this.worktargetMessage.splice(index, 1)
      this.messageCount = this.messageCount - 1
    },
    deleteEvent (index, row) {
      this.eventMessage.splice(index, 1)
      this.messageCount = this.messageCount - 1
    }
  },
  destroyed () {
    ActiveMQ.disconnect(() => {
      console.log('disconnect')
    })
  }
}
</script>

<style lang="scss">
    .el-tabs__item span .el-badge sup {
      margin-top: 10px;
    }
    .mesage-info {
      font-size: 30px;
      color: 'turquoise';
    }
</style>
