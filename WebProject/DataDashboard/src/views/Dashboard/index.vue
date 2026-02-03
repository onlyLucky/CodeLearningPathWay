<template>
  <div class="dashboard">
    <DashboardHeader></DashboardHeader>
    <div class="dashboardCon">
      <div class="conBox">
        <div class="dashboardCenter">
          <CenterLeft ref="centerLeftRef"></CenterLeft>
          <div class="MapCon">
            <MapComps ref="mapCompsRef"></MapComps>
            <!-- <TMapCon></TMapCon> -->
            <div class="topTab">
              <div class="teamItem" :class="{'active':teamTabCurrent==index}" v-for="(item,index) in teamTab" :key="index" @click="changeTeamTab(index)">
                <div class="activeLine"></div>
                <p>{{item.name}}</p>
              </div>
            </div>
            <div class="leftStatic">
              <div class="staticItem type01">
                <div class="staticTitle">部署区域<span class="unit">（个）</span></div>
                <p>{{static01}}</p>
              </div>
              <div class="staticItem type02">
                <div class="staticTitle">正在作战区域<span class="unit">（个）</span></div>
                <p>{{static02}}</p>
              </div>
            </div>
            <div class="leftBottom">
              <div class="statusItem status04">
                <div class="statusIcon"></div>
                <p>紧急目标</p>
              </div>
              <div class="statusItem status03">
                <div class="statusIcon"></div>
                <p>重点目标</p> 
              </div>
              <div class="statusItem status02">
                <div class="statusIcon"></div>
                <p>后续目标</p>
              </div>
              <div class="statusItem status01">
                <div class="statusIcon"></div>
                <p>伺机目标</p>
              </div> 
            </div>
            <div class="bottomTab">
              <div class="tabItem" :class="{'active':bottomTabCurrent==index}" v-for="(item,index) in bottomTab" :key="index" @click="changeBottomTab(index)">
                <img class="activeBg" src="@/assets/images/cb_active.png" alt="">
                <img class="tabIcon" :src="item.icon" alt="">
                <p class="tabTitle">{{item.name}}</p>
              </div>
            </div>
            <!-- 详情 -->
            <div class="monitorDiv" v-if="isShowMonitor">
              <div class="monitorMask" @click="onCloseMonitor"></div>
              <div class="monitorDetail" v-show="monitorIndex==index" v-for="(item,index) in monitorDetails" :key="index">
                <div class="mDetailTitle">
                  <p>{{item.name}}详情</p>
                </div>
                <div class="mDetailInfoBox">
                  <div class="mDetailInfoItem">
                    <div class="itemTitle">
                      基础信息
                    </div> 
                    <div class="detailValue">
                      <div class="valueItem">
                        <p class="itemValue">{{item.baseInfo.type}}</p>
                        <p class="itemLabel">兵种</p>
                      </div>
                      <div class="valueItem">
                        <p class="itemValue">{{item.baseInfo.progress}}<span class="unit">%</span></p>
                        <p class="itemLabel">任务进度</p>
                      </div>
                      <div class="valueItem">
                        <p class="itemValue">{{item.baseInfo.count}}<span class="unit">人</span></p>
                        <p class="itemLabel">步兵人数</p>
                      </div>
                      <div class="valueItem">
                        <p class="itemValue">{{item.baseInfo.deadNum}}<span class="unit">人</span></p>
                        <p class="itemLabel">阵亡人数</p>
                      </div>
                      <div class="valueItem">
                        <p class="itemValue">{{item.baseInfo.sourceNum}}<span class="unit">%</span></p>
                        <p class="itemLabel">资源消耗</p>
                      </div>
                      <div class="valueItem">
                        <p class="itemValue">{{item.baseInfo.supplyNum}}<span class="unit">辆</span></p>
                        <p class="itemLabel">补给车</p>
                      </div>
                      <div class="valueItem">
                        <p class="itemValue">{{item.baseInfo.doctorNum}}<span class="unit">人</span></p>
                        <p class="itemLabel">队医</p>
                      </div>
                      <div class="valueItem">
                        <p class="itemValue">{{item.baseInfo.speed}}<span class="unit">km/h</span></p>
                        <p class="itemLabel">机动速度</p>
                      </div>
                    </div>
                  </div>
                  <div class="mDetailInfoItem">
                    <div class="itemTitle">
                      其它信息
                    </div>
                    <div class="otherInfoBox">
                      <div class="otherLeftBox">
                        <div class="otherItem">
                          <p class="otherLabel">地理位置：</p>
                          <p class="otherValue">{{item.otherInfo.location}}</p>
                        </div>
                        <div class="otherItem">
                          <p class="otherLabel">营长：</p>
                          <p class="otherValue">{{item.otherInfo.position}}</p>
                        </div>
                        <div class="otherItem">
                          <p class="otherLabel">战备状态：</p>
                          <p class="otherValue" :class="`status${item.otherInfo.status}`">{{item.otherInfo.statusTxt}}</p>
                        </div>
                        <div class="otherItem">
                          <p class="otherLabel">弹药储备：</p>
                          <p class="otherValue" :class="`status${item.otherInfo.store}`">{{item.otherInfo.storeTxt}}</p>
                        </div>
                      </div>
                      <div class="otherRightBox">
                        <div class="otherItem">
                          <p class="otherLabel">累计演练：</p>
                          <p class="otherValue">{{item.otherInfo.workTime}}h</p>
                        </div>
                        <div class="otherItem">
                          <p class="otherLabel">后勤保障：</p>
                          <p class="otherValue">{{item.otherInfo.desc1}}</p>
                        </div>
                        <div class="otherItem">
                          <p class="otherLabel">作战能力：</p>
                          <p class="otherValue">{{item.otherInfo.desc2}}</p>
                        </div>
                        <div class="otherItem">
                          <p class="otherLabel">生存能力：</p>
                          <p class="otherValue">{{item.otherInfo.desc3}}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="mDetailInfoItem">
                    <div class="itemTitle">
                      当前任务
                    </div>
                    <div class="workListBox">
                      <div class="workItem">
                        <h3>一、完成对A目标区域的打击</h3>
                        <div class="workInfo">
                          <div class="otherItem">
                            <p class="otherLabel">任务状态：</p>
                            <p class="otherValue status0">进攻中</p>
                          </div>
                          <div class="otherItem">
                            <p class="otherLabel">任务进度：</p>
                            <p class="otherValue">10%</p>
                          </div>
                          <div class="otherItem">
                            <p class="otherLabel">任务描述：</p>
                            <p class="otherValue">配合其他营完成对A目标区域的占领</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="mDetailBottomBtn">
                  <div class="btnItem" @click="goYunDeskTop">远程桌面</div>
                </div>
              </div>
            </div>
          </div>
          <CenterRight ref="centerRightRef"></CenterRight>
        </div>
        
        <DashboardFooter ref="footerRef"></DashboardFooter>
      </div>
    </div>
    <!-- 云桌面 -->
    <div class="yunDeskTop" v-if="isShowYun">
      <iframe src="https://chat.baidu.com/" frameborder="0"></iframe>
      <div class="closeBtn" @click="closeYunDeskTop" @touchend="closeYunDeskTop">
        <img src="@/assets/icons/close.png" alt="">
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import MapComps from '@/components/MapComps/index.vue'
import DashboardFooter from './comps/Footer.vue'
import DashboardHeader from './comps/Header.vue'
import CenterLeft from './comps/CenterLeft.vue'
import CenterRight from './comps/CenterRight.vue'
import TMapCon from '@/components/MapComps/TMapCon.vue'
import gsap from 'gsap'

import { defineComponent, ref, provide, onMounted } from 'vue';

// 创建一个引用，用于访问 CenterLeft 组件实例
const centerLeftRef = ref();
const centerRightRef = ref();
const footerRef = ref();
const mapCompsRef = ref();


// 提供一个方法给子组件使用
const triggerSendMessageToIframe = (message: any) => {
  console.log(message)
  if (centerLeftRef.value && typeof centerLeftRef.value.sendMessageToIframe === 'function') {
    centerLeftRef.value.sendMessageToIframe(message);
  }
};

provide('triggerSendMessageToIframe', triggerSendMessageToIframe);

const teamTabCurrent = ref(0)
const teamTab = ref([
  {
    name: "全部"
  },
  {
    name: "一团"
  },
  {
    name: "二团"
  },
  {
    name: "三团"
  },
  {
    name: "四团"
  },
  {
    name: "五团"
  },
])

const static01 = ref(0)
const static01List = [28,12,8,5,9,10]
const static02 = ref(0)
const static02List = [16,4,3,5,6,4]

const updateStaticData = ()=>{
  static01.value = 0
  static02.value = 0
  const targetStatic01 = static01List[teamTabCurrent.value]
  const targetStatic02 = static02List[teamTabCurrent.value]
  gsap.to(static01, {
    value: targetStatic01,
    duration: 2,
    ease: 'power2.out',
    snap: { value: 1 }
  })
  gsap.to(static02, {
    value: targetStatic02,
    duration: 2,
    ease: 'power2.out',
    snap: { value: 1 }
  })
}


import cb01Png from "@/assets/images/cb_01.png"
import cb02Png from "@/assets/images/cb_02.png"
import cb03Png from "@/assets/images/cb_03.png"
import cb04Png from "@/assets/images/cb_04.png"
import cb05Png from "@/assets/images/cb_05.png"

const bottomTabCurrent = ref(0)
const bottomTab = ref([
  {
    icon: cb01Png,
    name: "作战指挥"
  },
  {
    icon: cb02Png,
    name: "情报侦察"
  },
  {
    icon: cb03Png,
    name: "火力控制"
  },
  {
    icon: cb04Png,
    name: "后勤支援"
  },
  {
    icon: cb05Png,
    name: "决策辅助"
  }
]);

var isShowMonitor = ref(false)
var monitorIndex = ref(0)
const monitorData = [
  {
    name: "二团四营",
    baseInfo: {
      type: '步兵',
      progress: 0,
      targetProgress: 33,
      count: 0,
      targetCount: 200,
      deadNum: 0,
      targetDeadNum: 20,
      sourceNum: 0,
      targetSourceNum: 20,
      supplyNum: 0,
      targetSupplyNum: 20,
      doctorNum: 0,
      targetDoctorNum: 2,
      speed: 0,
      targetSpeed: 30,
    },
    otherInfo: {
      location: "A1001-1区域",
      position: "白居易",
      workTime: 1320,
      status: 1,
      statusTxt: "紧急",
      store: 0,
      storeTxt: "充足",
      desc1: "日供餐300人、卫生员10人、救护车2辆",
      desc2: "可承担主攻任务",
      desc3: "单兵防护装备配发率100%",
    },
    workList: [
      {
        title: "一、完成对A目标区域的打击",
        status: 0,
        statusTxt: "进攻中",
        progress: 0,
        targetProgress: 10,
        desc: "配合其他营完成对A目标区域的占领"
      },
      {
        title: "二、完成对A目标区域的物资打扫",
        status: 2,
        statusTxt: "未开始",
        progress: 0,
        targetProgress: 0,
        desc: "配合其他营完成对A目标区域的物资打扫工作"
      }
    ]
  },
  {
    name: "一团三营",
    baseInfo: {
      type: '步兵',
      progress: 0,
      targetProgress: 33,
      count: 0,
      targetCount: 200,
      deadNum: 0,
      targetDeadNum: 20,
      sourceNum: 0,
      targetSourceNum: 20,
      supplyNum: 0,
      targetSupplyNum: 20,
      doctorNum: 0,
      targetDoctorNum: 2,
      speed: 0,
      targetSpeed: 30,
    },
    otherInfo: {
      location: "A1001-1区域",
      position: "白居易",
      workTime: 1320,
      status: 1,
      statusTxt: "紧急",
      store: 0,
      storeTxt: "充足",
      desc1: "日供餐300人、卫生员10人、救护车2辆",
      desc2: "可承担主攻任务",
      desc3: "单兵防护装备配发率100%",
    },
    workList: [
      {
        title: "一、完成对A目标区域的打击",
        status: 0,
        statusTxt: "进攻中",
        progress: 0,
        targetProgress: 10,
        desc: "配合其他营完成对A目标区域的占领"
      },
      {
        title: "二、完成对A目标区域的物资打扫",
        status: 2,
        statusTxt: "未开始",
        progress: 0,
        targetProgress: 0,
        desc: "配合其他营完成对A目标区域的物资打扫工作"
      }
    ]
  },
]
var monitorDetails = ref<any[]>([])
monitorDetails.value = monitorData

const onCloseMonitor = ()=>{
  monitorDetails.value = monitorData
  isShowMonitor.value = false
}

const updataMonitorAnimate = ()=>{
  // 为当前显示的监控详情中的所有基础信息字段添加动画
  const currentDetail = monitorDetails.value[monitorIndex.value];
  if (currentDetail) {
    // 为进度字段添加动画
    gsap.to(currentDetail.baseInfo, {
      progress: currentDetail.baseInfo.targetProgress,
      duration: 2,
      ease: 'power2.out',
      onUpdate: () => {
        // 确保数值保留适当的小数位
        currentDetail.baseInfo.progress = Math.round(currentDetail.baseInfo.progress);
      }
    });

    // 为其他数值字段也添加动画
    gsap.to(currentDetail.baseInfo, {
      count: currentDetail.baseInfo.targetCount,
      duration: 2,
      delay: 0.1,
      ease: 'power2.out',
      onUpdate: () => {
        currentDetail.baseInfo.count = Math.round(currentDetail.baseInfo.count);
      }
    });

    gsap.to(currentDetail.baseInfo, {
      deadNum: currentDetail.baseInfo.targetDeadNum,
      duration: 2,
      delay: 0.15,
      ease: 'power2.out',
      snap: { value: 1 },
      onUpdate: () => {
        currentDetail.baseInfo.deadNum = Math.round(currentDetail.baseInfo.deadNum);
      }
    });

    gsap.to(currentDetail.baseInfo, {
      sourceNum: currentDetail.baseInfo.targetSourceNum,
      duration: 2,
      delay: 0.2,
      ease: 'power2.out',
      onUpdate: () => {
        currentDetail.baseInfo.sourceNum = Math.round(currentDetail.baseInfo.sourceNum);
      }
    });

    gsap.to(currentDetail.baseInfo, {
      supplyNum: currentDetail.baseInfo.targetSupplyNum,
      duration: 2,
      delay: 0.25,
      ease: 'power2.out',
      onUpdate: () => {
        currentDetail.baseInfo.supplyNum = Math.round(currentDetail.baseInfo.supplyNum);
      }
    });

    gsap.to(currentDetail.baseInfo, {
      doctorNum: currentDetail.baseInfo.targetDoctorNum,
      duration: 2,
      delay: 0.3,
      ease: 'power2.out',
      onUpdate: () => {
        currentDetail.baseInfo.doctorNum = Math.round(currentDetail.baseInfo.doctorNum);
      }
    });

    gsap.to(currentDetail.baseInfo, {
      speed: currentDetail.baseInfo.targetSpeed,
      duration: 2,
      delay: 0.35,
      ease: 'power2.out',
      onUpdate: () => {
        currentDetail.baseInfo.speed = Math.round(currentDetail.baseInfo.doctorNum);
      }
    });

    // 为工作列表中的任务进度也添加动画
    if (currentDetail.workList && Array.isArray(currentDetail.workList)) {
      currentDetail.workList.forEach((workItem: any, index: number) => {
        if (typeof workItem.targetProgress !== 'undefined') {
          gsap.to(workItem, {
            progress: workItem.targetProgress,
            duration: 2,
            delay: 0.4 + (index * 0.1),
            ease: 'power2.out',
            onUpdate: () => {
              workItem.progress = Math.round(workItem.progress);
            }
          });
        }
      });
    }
  }
};


const triggerChangeMonitorIndex = (index: number) => {
  monitorIndex.value = index
  isShowMonitor.value = true
  updataMonitorAnimate()
};

const changeTeamTab = (index: number) => {
  teamTabCurrent.value = index
  if (centerRightRef.value && typeof centerRightRef.value.tabDataChangeFunc === 'function') {
    centerRightRef.value.tabDataChangeFunc(index);
  }
  updateStaticData()
  if (footerRef.value && typeof footerRef.value.tabDataChangeFunc === 'function') {
    footerRef.value.tabDataChangeFunc(index);
  }
}

const changeBottomTab = (index: number) => {
  bottomTabCurrent.value = index
  if (mapCompsRef.value && typeof mapCompsRef.value.renderMapDataChange === 'function') {
    mapCompsRef.value.renderMapDataChange(index);
  }
}

let isShowYun = ref<boolean>(false)
const goYunDeskTop = ()=>{
  // window.open('https://www.baidu.com','_blank')
  isShowYun.value = true
}

const closeYunDeskTop = ()=>{
  isShowYun.value = false
}



onMounted(()=>{
  updateStaticData()
})

provide('triggerChangeMonitorIndex', triggerChangeMonitorIndex);

defineComponent({
  components: {
    MapComps,
    // TMapCon,
    DashboardFooter,
    DashboardHeader,
    CenterLeft,
    CenterRight,
  }
})
</script>

<style scoped lang="scss">
.dashboard {
  width: 100%;
  height: 100%;
  background:url("@/assets/images/bg.png") no-repeat center center;
  background-size: cover;
  overflow: hidden;
  .dashboardCon{
    width: 100%;
    height: calc(100% - px2rem(88));
    padding: px2rem(8) px2rem(20) px2rem(20) px2rem(20);
    box-sizing: border-box;
    background: linear-gradient(180deg, rgba(7, 14, 28, 1) 0%, rgba(7, 14, 28, 0) 0%, rgba(7, 14, 28, 0.63) 20.83%, rgba(7, 14, 28, 0.79) 100%, rgba(7, 14, 28, 0.7) 100%);
    .conBox{
      width: 100%;
      height: 100%;
      overflow: hidden;
      .dashboardCenter{
        width: 100%;
        height: calc(100% - px2rem(256));
        margin-bottom: px2rem(20);
        display: flex;
        .MapCon{
          width: calc(100% - px2rem($center-left-width+40+$center-right-width));
          margin: 0 px2rem(20);
          position: relative;
          .topTab{
            position: absolute;
            top: px2rem(45);
            left: 0;
            width: 100%;
            height: px2rem(20);
            display: flex;
            align-items: center;
            justify-content: center;
            .teamItem{
              position: relative;
              width: px2rem(80);
              font-size: px2rem(16);
              line-height: px2rem(20);
              color: #99B3C8;
              text-align: center;
              margin: 0 px2rem(10);
              cursor: pointer;
              .activeLine{
                display: none;
                width: 100%;
                height: px2rem(12);
                background: linear-gradient(180deg, rgba(63, 145, 216, 0.1) 0%, rgba(63, 145, 216, 0.5) 100%);
                font-weight: bold;
                filter: blur(2px);
                position: absolute;
                bottom: px2rem(-4);
                left: 0;
              }
              &.active{
                color: #09DFEB;
                font-weight: bolder;
                text-shadow: 0px 4px 16px  #3F91D8;
                .activeLine{
                  display: block;
                }
                &::after{
                  content: "";
                  position: absolute;
                  left: px2rem(10);
                  top: 50%;
                  transform: translateY(-50%);
                  width: px2rem(6);
                  height: px2rem(6);
                  background: #EAB309;
                  border-radius: 50%;
                }
                &::before{
                  content: "";
                  position: absolute;
                  right: px2rem(10);
                  top: 50%;
                  transform: translateY(-50%);
                  width: px2rem(6);
                  height: px2rem(6);
                  background: #EAB309;
                  border-radius: 50%;
                }
              }
            }
          }
          .leftStatic{
            width: px2rem(120);
            height: auto;
            position: absolute;
            top: px2rem(106);
            left: 0;
            .staticItem{
              width: 100%;
              height: px2rem(48);
              display: flex;
              flex-direction: column;
              justify-content: center;
              margin-bottom: px2rem(10);
              border-left: px2rem(5) solid #09DFEB;
              padding: 0 px2rem(10);
              background: linear-gradient(90deg, rgba(1, 196, 236, 0.5) 0%, rgba(1, 196, 236, 0.01) 100%);
              .staticTitle{
                font-size: px2rem(12);
                line-height: px2rem(16);
                color: #99B3C8;
                margin-right: px2rem(6);
                margin-bottom: px2rem(4);
                .unit{
                  font-size: px2rem(10);
                  line-height: px2rem(14);
                  color: #99B3C8;
                }
              }
              p{
                font-size: px2rem(16);
                font-weight: bolder;
                line-height: px2rem(20);
                color: #99B3C8;
              }
            }
            .staticItem.type01{
              background: linear-gradient(90deg, rgba(1, 196, 236, 0.5) 0%, rgba(1, 196, 236, 0.01) 100%);
              border-left: px2rem(5) solid #09DFEB;
            }
            .staticItem.type02{
              background: linear-gradient(90deg, rgba(17, 112, 221, 0.5) 0%, rgba(17, 112, 221, 0.01) 100%);
              border-left: px2rem(5) solid #12539D;
            }
          }
          .leftBottom{
            position: absolute;
            bottom: 0;
            left: 0;
            width: px2rem(90);
            height: px2rem(128);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            background: rgb(0.5, 13, 48, 99);
            .statusItem{
              margin-bottom: px2rem(10);
              display: flex;
              align-items: center;
              font-size: px2rem(10);
              line-height: px2rem(16);
              color: #99B3C8;
              .statusIcon{
                width: px2rem(10);
                height: px2rem(10);
                border-radius: px2rem(2);
                margin-right: px2rem(8);
              }
            }
            .statusItem.status01{
              .statusIcon{
                background: #60FF2B;
              }
            }
            .statusItem.status02{
              .statusIcon{
                background: #05C5FF;
              }
            }
            .statusItem.status03{
              .statusIcon{
                background: #FF852E;
              }
            }
            .statusItem.status04{
              .statusIcon{
                background: #FF2F00;
              }
            }
          }
          .bottomTab{
            position: absolute;
            bottom: px2rem(20);
            left: 0;
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            .tabItem{
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              margin: 0 px2rem(32);
              position: relative;
              cursor: pointer;
              .activeBg{
                display: none;
                width: px2rem(110);
                height: px2rem(60);
                position: absolute;
                top: px2rem(24);
                left: px2rem(-28);
              }
              .tabIcon{
                width: px2rem(48);
                height: px2rem(48);
                margin-bottom: px2rem(4);
              }
              .tabTitle{
                font-size: px2rem(14);
                line-height: px2rem(20);
                color: #fff;
                position: relative;
                z-index: 1;
              }
              &.active{
                .activeBg{
                  display: block;
                }
              }
            }
          }
          .monitorDiv{
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 10;
            .monitorMask{
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              background-color: transparent;
            }
            .monitorDetail{
              position: absolute;
              top: px2rem(135);
              right: px2rem(360);
              width: px2rem(410);
              height: px2rem(480);
              background: url("@/assets/images/detailConBg.png") no-repeat center center;
              background-size: cover;
              .mDetailTitle{
                width: px2rem(120);
                height: px2rem(30);
                padding: px2rem(0) px2rem(10);
                box-sizing: border-box;
                font-size: px2rem(14);
                line-height: px2rem(18);
                font-weight: bolder;
                font-style: italic;
                text-shadow: 0 px2rem(2) 0  #000817;
                background: url("@/assets/images/detailTitleBg.png") no-repeat center center;
                background-size: cover;
                color: #fff;
                position: absolute;
                top: 0;
                left: 0;
                display: flex;
                align-items: center;
                justify-content: flex-start;
              }
              .mDetailInfoBox{
                width: 100%;
                height: calc(100% - px2rem(60));
                padding: px2rem(48) px2rem(16) px2rem(0) px2rem(16);
                box-sizing: border-box;
                overflow-y: auto;
                .mDetailInfoItem{
                  width: 100%;
                  height: auto;
                  margin-bottom: px2rem(16);
                  .itemTitle{
                    width: 100%;
                    height: px2rem(18);
                    font-size: px2rem(12);
                    line-height: px2rem(18);
                    font-weight: 500;
                    margin-bottom: px2rem(8);
                    color: #fff;
                    position: relative;
                    padding-left: px2rem(6);
                    &::before{
                      content: '';
                      display: inline-block;
                      width: px2rem(2);
                      height: px2rem(12);
                      background: #09DFEB;
                      position: absolute;
                      top: px2rem(2);
                      left: px2rem(0);
                    }
                  }
                  .detailValue{
                    width: 100%;
                    height: px2rem(40);
                    font-size: px2rem(12);
                    line-height: px2rem(18);
                    font-weight: bold;
                    color: #fff;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    flex-wrap: nowrap;
                    overflow: hidden;
                    .valueItem{
                      width: px2rem(40);
                      height: px2rem(40);
                      display: flex;
                      flex-direction: column;
                      align-items: center;
                      justify-content: center;
                      background: rgba(255,255,255,0.05);
                      .itemValue{
                        font-size: px2rem(10);
                        line-height: px2rem(14);
                        font-weight: 500;
                        color: #fff;
                        .unit{
                          display: inline-block;
                          font-size: px2rem(6);
                          line-height: px2rem(14);
                          margin-left: px2rem(2);
                        }
                      }
                      .itemLabel{
                        font-size: px2rem(8);
                        line-height: px2rem(12);
                        color: rgba(255,255,255,0.5);
                      }
                    }
                  }
                  .otherInfoBox{
                    width: 100%;
                    height: auto;
                    display: flex;
                    flex-wrap: wrap;
                    align-items: center;
                    .otherLeftBox{
                      width: px2rem(120);
                      height: auto;
                      margin-right: px2rem(10);
                    }
                    .otherRightBox{
                      width: calc(100% - px2rem(130));
                      height: auto;
                    }
                  }
                  .workListBox{
                    width: 100%;
                    height: auto;
                    .workItem{
                      width: 100%;
                      height: auto;
                      margin-bottom: px2rem(14);
                      h3{
                        width: 100%;
                        height: px2rem(15);
                        font-size: px2rem(12);
                        line-height: px2rem(15);
                        font-weight: 500;
                        margin-bottom: px2rem(8);
                        color: #fff;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                      }
                      .workInfo{
                        width: 100%;
                        height: auto;
                      }
                    }
                  }
                  .otherItem{
                    width: 100%;
                    height: px2rem(16);
                    margin-bottom: px2rem(8);
                    display: flex;
                    align-items: center;
                    .otherLabel{
                      width: px2rem(50);
                      font-size: px2rem(8);
                      line-height: px2rem(16);
                      color: rgba(255,255,255,0.6);
                      white-space: pre;
                      text-align-last: justify;
                      text-align: justify; 
                      flex-shrink: 0;
                    }
                    .otherValue{
                      width: calc(100% - px2rem(50));
                      font-size: px2rem(8);
                      line-height: px2rem(16);
                      color: #fff;
                      overflow: hidden;
                      text-overflow: ellipsis;
                      white-space: nowrap;
                      flex-shrink: 0;
                    }
                    .otherValue.status2{
                      color: #EB9809;
                    }
                    .otherValue.status1{
                      color: #FF2626;
                    }
                    .otherValue.status0{
                      color: #09DFEB;
                    }
                  }
                }
              }
              .mDetailBottomBtn{
                width: 100%;
                height: px2rem(60);
                display: flex;
                align-items: center;
                justify-content: center;
                overflow: hidden;
                .btnItem{
                  width: px2rem(160);
                  height: px2rem(32);
                  background-color: #006FFF;
                  font-size: px2rem(12);
                  line-height: px2rem(30);
                  font-weight: bold;
                  color: #fff;
                  text-align: center;
                  cursor: pointer;
                }
              }
            }
          }
          

        }
      }
    }
    // background-color: lightblue;
  }
  .yunDeskTop{
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    z-index: 12;
    iframe{
      width: 100%;
      height: 100%;
      z-index: 1;
      position: relative;
    }
    .closeBtn{
      position: absolute;
      top: px2rem(30);
      right: px2rem(30);
      width: px2rem(54);
      height: px2rem(54);
      background: rgba(0,0,0,0.5);
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 2; /* 确保关闭按钮在顶层 */
      img{
        width: px2rem(26);
        height: auto;
      }
    }
  }
}
</style>
