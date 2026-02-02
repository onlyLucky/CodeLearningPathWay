<template>
  <div class="centerRight">
    <div class="topInfo">
      <!-- 战场实况 -->
      <div class="infoItem">
        <div class="dashboardTitle">
          <div class="titleName">战场实况</div>
          <div class="more">
            <p>查看更多</p>
            <img src="@/assets/icons/t_right.png" alt="">
          </div>
        </div>
        <!-- 监控画面 -->
        <div class="monitorScreen">
          <div class="monitorItem" v-for="(item,index) in monitorList" :key="index" @click="tapMonitor(index)">
            <p class="monitorTitle">{{item.title}}</p>
            <div class="monitorCon">
              <img :src="item.img" alt="">
            </div>
          </div>
          
        </div>
      </div>
      <!-- 数据统计 -->
      <div class="infoItem">
        <div class="dashboardTitle">
          <div class="titleName">数据统计</div>
        </div>
        <div class="dataScreen">
          <div class="dataItem">
            <img src="@/assets/images/r2_1.png" alt="">
            <div class="dataInfo">
              <p class="dataDesc">累计参战人数</p> 
              <p class="dataNum">{{ participantCount }}<span class="numUnit">人</span></p>
            </div>
          </div>
          <div class="dataItem">
            <img src="@/assets/images/r2_2.png" alt="">
            <div class="dataInfo">
              <p class="dataDesc">大型对抗次数</p>
              <p class="dataNum">{{ battleCount }}<span class="numUnit">次</span></p>
            </div>
          </div>
          <div class="dataItem">
            <img src="@/assets/images/r2_3.png" alt="">
            <div class="dataInfo">
              <p class="dataDesc">阵亡人数</p>
              <p class="dataNum">{{ deathCount }}<span class="numUnit">人</span></p>
            </div>
          </div>
          <div class="dataItem">
            <img src="@/assets/images/r2_4.png" alt="">
            <div class="dataInfo">
              <p class="dataDesc">战况反馈次数</p>
              <p class="dataNum">{{ feedbackCount }}<span class="numUnit">次</span></p>
            </div>
          </div>
        </div>
        <div class="infoHeader">
          <img src="@/assets/images/itemTitle.png" alt="">
          <div class="titleName">
            <p>攻防转换率</p>
          </div>
        </div>
        <div class="formValue">
          <div class="lineBar">
            <GradientGridProgress 
            :progress="attackDefenseRatio" 
            start-color="#4992FF" 
            end-color="#4FDFFF" 
            bg-color="#1B2A40"
            ></GradientGridProgress>
          </div>
          <div class="bar"></div>
          <div class="dataValue" :style="{left:attackDefenseRatio+'%'}">
            <img class="topPoly" src="@/assets/images/polygon1.png" alt="">
            <p class="dataNum">{{attackDefenseRatio}}%</p>
          </div>
        </div>
      </div>

    </div>
    <div class="bottomInfo">
      <!-- 战场形势分析 -->
      <div class="infoItem">
        <div class="dashboardTitle">
          <div class="titleName">战场形势分析</div>
        </div>
        <div class="scrollTab">
          <div class="tabItem" :class="{'active':currentTab==0}" @click="handleTabClick(0)">波动和走势</div>
          <div class="tabItem" :class="{'active':currentTab==1}" @click="handleTabClick(1)">新增作战量和幅度</div>
        </div>
        <div class="charsCon" @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave">
          <AreaChart v-if="currentTab==0" :data="areaChartData1" :titles="areaChartTitles"></AreaChart>
          <AreaChart v-if="currentTab==1" :data="areaChartData2" :titles="areaChartTitles"></AreaChart>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineComponent, ref, onMounted, onUnmounted, inject } from 'vue';
import { gsap } from 'gsap';
import GradientGridProgress from '@/components/GradientGridProgress.vue'
import AreaChart from '@/components/AreaChart.vue'

let teamTabCurrent = ref(0)
/* 监控画面 */
const monitorList = ref([
  {
    title: '监控画面1',
    img: 'https://img.js.design/assets/img/6968a8b5d7769eec3e3493fd.png#97b30edc9dcf2f6f8176dda7cbe328f0',
  },
  {
    title: '监控画面2',
    img: 'https://img.js.design/assets/img/6968a8b5d7769eec3e3493fd.png#97b30edc9dcf2f6f8176dda7cbe328f0',
  },
])

// 注入父组件提供的方法
const triggerChangeMonitorIndex = inject('triggerChangeMonitorIndex');

const tapMonitor = (index: number) => {
  if(triggerChangeMonitorIndex){
    (triggerChangeMonitorIndex as Function)(index)
  }
}

/* 攻防转换率 */
const attackDefenseRatio = ref(40)

let ratioTimeline: gsap.core.Timeline | null = null

var ratioTimeList = [
  {start: 48, end: 63},
  {start: 25, end: 52},
  {start: 32, end: 68},
  {start: 46, end: 54},
  {start: 62, end: 70},
  {start: 32, end: 38},
]

const startRatioAnimation = () => {
  if (ratioTimeline) {
    ratioTimeline.kill()
  }
  
  ratioTimeline = gsap.timeline({ repeat: -1, repeatDelay: 0.5 })
  
  const generateRandomValue = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }
  
  const generateRandomDuration = (min: number, max: number) => {
    return Math.random() * (max - min) + min
  }
  
  let currentValue = 40
  
  for (let i = 0; i < 20; i++) {
    const {start, end} = ratioTimeList[teamTabCurrent.value]
    const nextValue = generateRandomValue(start, end)
    const duration = generateRandomDuration(2, 4)
    
    ratioTimeline.to(attackDefenseRatio, {
      value: nextValue,
      duration: duration,
      ease: 'power2.inOut',
      snap: { value: 1 }
    })
    
    currentValue = nextValue
  }
}

const stopRatioAnimation = () => {
  if (ratioTimeline) {
    ratioTimeline.kill()
    ratioTimeline = null
  }
}

/* 战场形势分析 */
var currentTab = ref(0)
const areaChartTitles = ref(['08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00'])
const areaChartData1 = ref<number[]>([])
const areaChartData2 = ref<number[]>([])

const areaChartData1List = [
  [900,820,930,600,850,890,560,630,830,990,850,780,650],
  [400,520,380,310,400,510,320,350,260,196,256,347,412],
  [234,431,402,321,392,220,126,295,302,285,310,218,128],
  [302,502,308,103,204,201,230,315,206,169,265,437,241],
  [209,205,312,301,240,150,203,305,206,296,456,430,421],
  [311,320,180,110,300,410,326,530,360,296,356,302,403],
]

const areaChartData2List = [
  [8,10,9,12,18,19,13,13,8,9,11,7,10],
  [3,2,3,5,10,10,6,6,4,2,1,1,2],
  [4,6,6,5,3,6,5,5,4,6,3,4,5],
  [2,2,3,4,5,3,2,3,4,3,5,6,5],
  [3,5,6,8,6,5,6,7,5,7,8,3,2],
  [6,3,2,5,6,3,4,6,7,8,4,3,2],
]

areaChartData1.value = areaChartData1List[teamTabCurrent.value] as number[]
areaChartData2.value = areaChartData2List[teamTabCurrent.value] as number[]

// 自动切换tab
let tabSwitchTimer: number | null = null
const startTabAutoSwitch = () => {
  const switchTab = () => {
    currentTab.value = currentTab.value === 0 ? 1 : 0
  }
  
  tabSwitchTimer = window.setInterval(switchTab, 5000)
}

const stopTabAutoSwitch = () => {
  if (tabSwitchTimer !== null) {
    // eslint-disable-next-line no-undef
    clearInterval(tabSwitchTimer)
    tabSwitchTimer = null
  }
}

const handleTabClick = (index: number) => {
  currentTab.value = index
  stopTabAutoSwitch()
  startTabAutoSwitch()
}

const handleMouseEnter = () => {
  stopTabAutoSwitch()
}

const handleMouseLeave = () => {
  startTabAutoSwitch()
}

/* 数据统计 */
const participantCount = ref(0)
const battleCount = ref(0)
const deathCount = ref(0)
const feedbackCount = ref(0)


const staticCountData = [
  {
    participantCount: 4396,
    battleCount: 120,
    deathCount: 360,
    feedbackCount: 560,
  },
  {
    participantCount: 925,
    battleCount: 26,
    deathCount: 40,
    feedbackCount: 105,
  },
  {
    participantCount: 1023,
    battleCount: 29,
    deathCount: 46,
    feedbackCount: 112,
  },
  {
    participantCount: 1040,
    battleCount: 30,
    deathCount: 52,
    feedbackCount: 108,
  },
  {
    participantCount: 1003,
    battleCount: 32,
    deathCount: 48,
    feedbackCount: 113,
  },
  {
    participantCount: 989,
    battleCount: 29,
    deathCount: 35,
    feedbackCount: 101,
  },
]

const updateCountDataFunc = ()=>{
  const staticValue = staticCountData[teamTabCurrent.value]
  gsap.to(participantCount, {
    value: staticValue.participantCount,
    duration: 2,
    ease: 'power2.out',
    snap: { value: 1 }
  })
  
  gsap.to(battleCount, {
    value: staticValue.battleCount,
    duration: 1.5,
    ease: 'power2.out',
    delay: 0.2,
    snap: { value: 1 }
  })
  
  gsap.to(deathCount, {
    value: staticValue.deathCount,
    duration: 1.8,
    ease: 'power2.out',
    delay: 0.4,
    snap: { value: 1 }
  })
  
  gsap.to(feedbackCount, {
    value: staticValue.feedbackCount,
    duration: 1.6,
    ease: 'power2.out',
    delay: 0.6,
    snap: { value: 1 }
  })
}

const tabDataChangeFunc = (index: number) => {
  teamTabCurrent.value = index
  updateCountDataFunc()
  areaChartData1.value = areaChartData1List[index] as number[]
  areaChartData2.value = areaChartData2List[index] as number[]

  startRatioAnimation()
}

onMounted(() => {
  updateCountDataFunc()
  startTabAutoSwitch()
  startRatioAnimation()
})

onUnmounted(() => {
  stopTabAutoSwitch()
  stopRatioAnimation()
})

defineExpose({
  tabDataChangeFunc
})

defineComponent({
  name: 'CenterRight',
  updateCountDataFunc,
})
</script>
<style scoped lang="scss">
.centerRight{
  width: px2rem($center-right-width);
  height: 100%;
  overflow: hidden;
  .topInfo{
    width: 100%;
    height: px2rem(440);
    .infoItem{
      width: 100%;
      margin-bottom: px2rem(20);
      .monitorScreen{
        width: 100%;
        height: px2rem(90);
        display: flex;
        flex-wrap: wrap;
        align-content: flex-start;
        position: relative;
        .monitorItem{
          width: calc((100% - px2rem(8))/2);
          height: px2rem(90);
          margin-right: px2rem(8);
          background-color: rgba(22, 75, 118, 0.3);
          padding: px2rem(6);
          box-sizing: border-box;
          cursor: pointer;
          .monitorTitle{
            font-size: px2rem(10);
            line-height: px2rem(14);
            width: 100%;
            text-align: left;
            color: #fff;
            margin-bottom: px2rem(4);             
          }
          .monitorCon{
            width: 100%;
            height: px2rem(60);
            overflow: hidden;
            position: relative;
            img{
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              height: auto;
            }
          }
        }
        .monitorItem:nth-child(2n){
          margin-right: 0;
        }
      }

      .dataScreen{
        width: 100%;
        height: px2rem(120);
        display: flex;
        flex-wrap: wrap;
        align-content: flex-start;
        .dataItem{
          width: calc((100% - px2rem(10))/2);
          height: px2rem(50);
          margin: 0 px2rem(10) px2rem(10) 0;
          background: linear-gradient(90deg, rgba(8, 75, 128, 0.5) 0%, rgba(8, 75, 128, 0) 100%);
          padding: px2rem(10);
          box-sizing: border-box;
          display: flex;
          align-items: center;
          img{
            width: px2rem(30);
            height: px2rem(30);
            margin-right: px2rem(8);  
          }
          .dataInfo{
            width: 100%;
            height: px2rem(30);
            .dataDesc{
              font-size: px2rem(10);
              line-height: px2rem(14);
              width: 100%;
              text-align: left;
              color: #99B3C8;
              margin-bottom: px2rem(4);
            }
            .dataNum{
              font-size: px2rem(14);
              line-height: px2rem(20);
              font-weight: bolder;
              color: #B0D8F5;
              display: flex;
              align-items: flex-end;
              .numUnit{
                font-size: px2rem(8);
                line-height: px2rem(16);
                color: #99B3C8;
                margin-left: px2rem(4);
              }
            }
            
          }
        }
        .dataItem:nth-child(2n){
          margin-right: 0;
        }
      }
      
      .infoHeader{
        width: 100%;
        height: px2rem(34);
        display: flex;
        align-items: center;
        margin-bottom: px2rem(10);
        img{
          width: px2rem(38);
          height: px2rem(34);
        }
        .titleName{
          width: calc(100% - px2rem(38));
          height: 100%;
          background: linear-gradient(90deg, rgba(8, 83, 106, 0.4) 0%, rgba(13, 78, 99, 0.02) 100%);
          p{
            font-size: px2rem(12);
            line-height: px2rem(34);
            padding-left: px2rem(10);
            font-weight: bolder;
            color: #B0D8F5;
          }
        }
      }

      .formValue{
        width: 100%;
        height: px2rem(58);
        position: relative;
        .lineBar{
          width: 100%;
          height: px2rem(18);
          // background: linear-gradient(90deg, rgba(73, 146, 255, 1) 0%, rgba(79, 223, 255, 1) 66.23%, rgba(27, 42, 64, 1) 67.23%);
          margin-bottom: px2rem(10);
        }
        .bar{
          width: 100%;
          height: px2rem(6);
          background: #1B2940;
        }
        .dataValue{
          position: absolute;
          top: px2rem(19);
          left: 50%;
          width: px2rem(50);
          transform: translateX(-50%);
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-start;
          img{
            width: px2rem(6);
            height: px2rem(18);
          }
          p{
            width: px2rem(50);
            text-align: center;
            font-size: px2rem(14);
            line-height: px2rem(20);
            font-weight: bolder;
            color: #4EDFFF;
            text-shadow: 0px 0px 8px  #4EDFFF;
          }
        }
      }


    }
  }
  .bottomInfo{
    width: 100%;
    height: calc(100% - px2rem(440));
    .infoItem{
      width: 100%;
      height: 100%;
      .scrollTab{
        width: 100%;
        height: px2rem(34);
        margin-bottom: px2rem(16);
        font-size: px2rem(10);
        line-height: px2rem(14);
        display: flex;
        .tabItem{
          width: auto;
          height: 100%;
          cursor: pointer;
          margin-right: px2rem(10);
          padding: 0 px2rem(12);
          box-sizing: border-box;
          background: linear-gradient(180deg, #0C356F 0%, #0C356F 100%);
          border: px2rem(1) solid #1760AE;
          line-height: px2rem(30);
          color: #B0D8F5;
          font-size: px2rem(10);
          opacity: 0.5;
        }
        .tabItem.active{
          opacity: 1;
        }
      }
      .charsCon{
        width: 100%;
        height: calc(100% - px2rem(94));
        background-color: rgba(13, 48, 99, 0.5);
      }
    }
  }
}

.dashboardTitle{
  width: 100%;
  height: px2rem(36);
  margin-bottom: px2rem(8);
  padding: 0 px2rem(12);
  box-sizing: border-box;
  background-color: rgba(13, 48, 99, 0.5);
  border-left: px2rem(4) solid #12539D;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .titleName{
    font-size: px2rem(16);
    font-weight: bolder;
    color: #B0D8F5;
    text-shadow: 0 px2rem(4) px2rem(16)  #3F91D8;
  }
  .more{
    display: flex;
    align-items: center;
    p{
      font-size: px2rem(10);
      color: #00F2FF;
      margin-right: px2rem(2);
    }
    img{
      width: px2rem(12);
      height: px2rem(12);
    }
  }
}
</style>