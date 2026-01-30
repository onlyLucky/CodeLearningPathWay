<template>
  <!-- 左侧视频会议 -->
  <div class="centerLeft">
    <div class="dashboardTitle">
      <div class="titleName">指挥部</div>
    </div>
    <div class="videoListBox" id="container" >
      <div v-if="isLoading" class="loading-overlay">
        <div class="loading-spinner"></div>
        <div class="loading-text">正在加载视频会议...</div>
      </div>
      <iframe v-show="!isLoading && isInMeeting" src="/xyLink/index.html" ref="iframeRef" frameborder="0" allowfullscreen @load="onLoad" @error="onError"></iframe>
      <div class="videoItem" v-show="!isInMeeting" v-for="item in videoList" :key="item.name">
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
import Message from '@/utils/message';
import { defineComponent, onMounted, ref } from 'vue';

const iframeRef = ref(null)
const isLoading = ref(true)
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

// iframe 加载完成回调
const onLoad = ()=>{
  // iframe 加载完成后隐藏 loading
  setTimeout(()=>{
    isLoading.value = false;
  },3000)
  console.log('视频会议 iframe 加载完成');
}

// 处理 iframe 加载错误
const onError = () => {
  isLoading.value = false;
  Message({ message: '视频会议加载失败，请稍后重试', type: 'error' });
  console.error('视频会议 iframe 加载失败');
}

let isInMeeting = ref(true);
const sendMessageToIframe = (message: any) => {
  if (iframeRef.value) {
    if(message.type === 'startMeet'){
      isInMeeting.value = true;
    }
    if(message.type === 'stopMeet'){
      isInMeeting.value = false;
    }
    (iframeRef.value as any).contentWindow!.postMessage(message, '*');
  }
}

// 暴露方法给父组件
defineExpose({
  sendMessageToIframe
})

onMounted(()=>{
})

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
  .videoListBox{
    width: 100%;
    height: calc(100% - px2rem(44));
    display: flex;
    flex-wrap: wrap;
    align-content: flex-start;
    overflow-y: auto;
    position: relative;
    iframe{
      width: 100%;
      height: 100%;
    }

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
    .videoItem:nth-child(2n+1){ 
      margin-right: 0;
    }
  }
  .loading-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 10;
  }
  
  .loading-spinner {
    width: 40px;
    height: 40px;
    border: 4px solid rgba(255, 255, 255, 0.3);
    border-top: 4px solid #B0D8F5;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
  
  .loading-text {
    margin-top: 16px;
    color: #B0D8F5;
    font-size: 14px;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
}
</style>