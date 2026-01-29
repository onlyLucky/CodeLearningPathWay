<template>
  <div class="dashboard">
    <DashboardHeader></DashboardHeader>
    <div class="dashboardCon">
      <div class="conBox">
        <div class="dashboardCenter">
          <CenterLeft></CenterLeft>
          <div class="MapCon">
            <MapComps></MapComps>
            <div class="topTab">
              <div class="teamItem" :class="{'active':teamTabCurrent==index}" v-for="(item,index) in teamTab" :key="index" @click="teamTabCurrent=index">
                <div class="activeLine"></div>
                <p>{{item.name}}</p>
              </div>
            </div>
            <div class="leftStatic">
              <div class="staticItem type01">
                <div class="staticTitle">部署区域<span class="unit">（个）</span></div>
                <p>15</p>
              </div>
              <div class="staticItem type02">
                <div class="staticTitle">正在作战区域<span class="unit">（个）</span></div>
                <p>7</p>
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
              <div class="tabItem" :class="{'active':bottomTabCurrent==index}" v-for="(item,index) in bottomTab" :key="index" @click="bottomTabCurrent=index">
                <img class="activeBg" src="@/assets/images/cb_active.png" alt="">
                <img class="tabIcon" :src="item.icon" alt="">
                <p class="tabTitle">{{item.name}}</p>
              </div>
            </div>
          </div>
          <CenterRight></CenterRight>
        </div>
        
        <DashboardFooter></DashboardFooter>
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

import { defineComponent, ref } from 'vue';

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

defineComponent({
  components: {
    MapComps,
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
        }
      }
    }
    // background-color: lightblue;
  }
}
</style>
