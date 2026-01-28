<template>
  <!-- 左侧视频会议 -->
  <div class="centerLeft">
    <div class="dashboardTitle">
      <div class="titleName">指挥部</div>
    </div>
    <div class="videoList">
      <div class="videoItem" v-for="item in videoList" :key="item.name">
        <div class="videoCon">
          <img :src="item.img" alt="">
        </div>
        <div class="videoName">{{item.name}}</div>
        <div class="callBtn">发起呼叫</div>
      </div>
      
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineComponent, ref } from 'vue';

const videoList = ref([
  {
    name: '一团一营',
    img: 'https://img.js.design/assets/img/696af0820aebe8c71f879e26.png#10403c7229bc59e49a02a54d2d839e95',
  },
  {
    name: '一团二营',
    img: 'https://img.js.design/assets/img/696af0890aebe8c71f879e90.png#25f84979980449e085754bc21004afb1',
  },
  {
    name: '一团三营',
    img: 'https://img.js.design/assets/img/696af0910aebe8c71f879ed6.png#b8f153aa9a8ab5b5c84626c729655295',
  },
  {
    name: '一团四营',
    img: 'https://img.js.design/assets/img/696af09981a6de7b918527a1.png#b7de9d5b523e7a6b5d0d163014279c0a',
  },

  {
    name: '二团一营',
    img: 'https://img.js.design/assets/img/696af0a4d7769eec3e592b65.png#75436ac2ef375cb853a79aeb1310c2e7',
  },
  {
    name: '二团二营',
    img: 'https://img.js.design/assets/img/696af0ba0aebe8c71f87a143.png#0ec9a6335e62f3fd49c5ff9053009d13',
  },
  {
    name: '二团三营',
    img: 'https://img.js.design/assets/img/696af0c2b5e8b987e59c6c34.png#3ad0afe7f8ad41ccf2057850f8184471',
  },
  {
    name: '二团四营',
    img: 'https://img.js.design/assets/img/696af0cabd7f77749ab5663c.png#c9fd292b5bea5cec57c712169f25a482',
  },

  {
    name: '三团一营',
    img: 'https://img.js.design/assets/img/696af0d0053c4e58a768222d.png#80c41b7d0558b0606b5c5b07642d7d29',
  },
  {
    name: '三团二营',
    img: 'https://img.js.design/assets/img/696af0d981a6de7b91852d8e.png#fa752c2d4147a47fe1f747bad99aa478',
  },
  {
    name: '三团三营',
    img: 'https://img.js.design/assets/img/696af0e3d7769eec3e592e6d.png#69897ff8e5a9d32f9c8ff0536e411c9e',
  },
  {
    name: '三团四营',
    img: 'https://img.js.design/assets/img/696af0efbd7f77749ab566ff.png#0266f5efaea321c018e023723f037cec',
  },

  {
    name: '四团一营',
    img: 'https://img.js.design/assets/img/696af0cabd7f77749ab5663c.png#c9fd292b5bea5cec57c712169f25a482',
  },
  {
    name: '四团二营',
    img: 'https://img.js.design/assets/img/696af0820aebe8c71f879e26.png#10403c7229bc59e49a02a54d2d839e95',
  },
  {
    name: '四团三营',
    img: 'https://img.js.design/assets/img/696af0a4d7769eec3e592b65.png#75436ac2ef375cb853a79aeb1310c2e7',
  },
  {
    name: '四团四营',
    img: 'https://img.js.design/assets/img/696af0910aebe8c71f879ed6.png#b8f153aa9a8ab5b5c84626c729655295',
  },
])

defineComponent({
  name: 'CenterLeft',
})
</script>
<style scoped lang="scss">
.centerLeft{
  width: px2rem($center-left-width);
  height: 100%;
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
  }
  .videoList{
    width: 100%;
    height: calc(100% - px2rem(44));
    display: flex;
    flex-wrap: wrap;
    align-content: flex-start;
    overflow-y: auto;

    .videoItem{
      width: calc((100% - px2rem(8))/2);
      height: px2rem(80);
      margin: 0 px2rem(8) px2rem(8) 0;
      display: flex;
      align-items: center;
      justify-content: space-between;
      background-color: rgba(0,0,0,0.5);
      font-size: px2rem(16);
      position: relative;
      .videoCon{
        width: 100%;
        height: 100%;
        overflow: hidden;
        position: absolute;
        top: 0;
        left: 0;
        img{
          width: 100%;
          height: 100%;
        }
      }
      .videoName{
        position: absolute;
        bottom: px2rem(6);
        left: px2rem(6);
        font-size: px2rem(8);
        line-height: px2rem(12);
        padding: px2rem(4);
        border-radius: px2rem(50);
        color: #fff;
      }
      .callBtn{
        position: absolute;
        top: px2rem(6);
        right: px2rem(6);
        font-size: px2rem(8);
        line-height: px2rem(12);
        padding: px2rem(4);
        border-radius: px2rem(4);
        color: #fff;
        background-color: rgba(11, 32, 67, 0.9);
      }
    }
    .videoItem:nth-child(2n){ 
      margin-right: 0;
    }
  }
}
</style>