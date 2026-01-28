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
          <div class="monitorItem" v-for="(item,index) in monitorList" :key="index">
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
              <p class="dataNum">4396<span class="numUnit">人</span></p>
            </div>
          </div>
          <div class="dataItem">
            <img src="@/assets/images/r2_1.png" alt="">
            <div class="dataInfo">
              <p class="dataDesc">大型对抗次数</p>
              <p class="dataNum">120<span class="numUnit">次</span></p>
            </div>
          </div>
          <div class="dataItem">
            <img src="@/assets/images/r2_1.png" alt="">
            <div class="dataInfo">
              <p class="dataDesc">阵亡人数</p>
              <p class="dataNum">360<span class="numUnit">人</span></p>
            </div>
          </div>
          <div class="dataItem">
            <img src="@/assets/images/r2_1.png" alt="">
            <div class="dataInfo">
              <p class="dataDesc">战况反馈次数</p>
              <p class="dataNum">560<span class="numUnit">次</span></p>
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
            :progress="65" 
            start-color="#4992FF" 
            end-color="#4FDFFF" 
            bg-color="#1B2A40"
            ></GradientGridProgress>
          </div>
          <div class="bar"></div>
          <div class="dataValue">
            <img class="topPoly" src="@/assets/images/polygon1.png" alt="">
            <p class="dataNum">65%</p>
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
          <div class="tabItem active">波动和走势</div>
          <div class="tabItem">新增作战量和幅度</div>
        </div>
        <div class="charsCon"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineComponent, ref } from 'vue';
import GradientGridProgress from '@/components/GradientGridProgress.vue'

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

defineComponent({
  name: 'CenterRight',
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
        .monitorItem{
          width: calc((100% - px2rem(8))/2);
          height: px2rem(90);
          margin-right: px2rem(8);
          background-color: rgba(22, 75, 118, 0.3);
          padding: px2rem(6);
          box-sizing: border-box;
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