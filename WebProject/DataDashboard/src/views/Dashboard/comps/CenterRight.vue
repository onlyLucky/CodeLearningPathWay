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
      </div>
    </div>
    <div class="bottomInfo"></div>
  </div>
</template>

<script setup lang="ts">
import { defineComponent, ref } from 'vue';

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
  width: px2rem(260);
  height: 100%;
  .topInfo{
    width: 100%;
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
        height: px2rem(90);
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
              color: #fff;
              margin-bottom: px2rem(4);
            }
            .dataNum{
              font-size: px2rem(14);
              line-height: px2rem(20);
              color: #fff;
            }
            .numUnit{
              font-size: px2rem(10);
              line-height: px2rem(14);
              color: #fff;
            }
          }
        }
        .dataItem:nth-child(2n){
          margin-right: 0;
        }
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