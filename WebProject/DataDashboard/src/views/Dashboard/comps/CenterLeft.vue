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
      <iframe v-show="!isLoading && isInMeeting" src="./xyLink/index.html" ref="iframeRef" frameborder="0" allowfullscreen @load="onLoad" @error="onError"></iframe>
      <div class="videoItem" v-show="!isInMeeting" v-for="item in videoList" :key="item.name">
        <div class="videoCon">
          <img :src="item.img" alt="">
        </div>
        <div class="videoName">{{item.name}}</div>
        <div class="callBtn" @click="startVideoCall(item)">发起呼叫</div>
      </div>
    </div>
    <!-- fixed Video Box -->
    <div 
      v-show="isShowFixedBox"
      ref="fixedVideoBoxRef"
      class="fixedVideoBox" 
      :class="{ 'hovered': isHovered, 'maximized': isMaxFixedBox }"
      :style="{ 
        transform: `translate(${dragState.offsetX}px, ${dragState.offsetY}px)`,
        cursor: dragState.isDragging ? 'grabbing' : 'default'
      }"
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
      @mousedown="handleMouseDown"
      @touchstart="handleTouchStart"
      @touchend="handleTouchEnd"
    >
      <div class="fixedHeader">
        <div class="headerTitle"></div>
        <div class="fixedOpt">
          <div class="iconOpt minBtn" title="最小化" v-show="isMaxFixedBox" @click="minimizeVideoBox" @mousedown.stop>
            <img src="@/assets/icons/min.png" alt="最小化">
          </div>
          <div class="iconOpt maxBtn" title="最大化" v-show="!isMaxFixedBox" @click="maximizeVideoBox" @mousedown.stop>
            <img src="@/assets/icons/max.png" alt="最大化">
          </div>
          <div class="iconOpt closeBtn" title="关闭" @click="closeVideoStream" @mousedown.stop>
            <img src="@/assets/icons/close.png" alt="关闭">
          </div>
        </div>
      </div>
      <div class="videoCon">
        <video ref="videoRef" class="video-element" muted autoplay playsinline></video>
      </div>
    </div>
    
  </div>
</template>

<script setup lang="ts">
import Message from '@/utils/message';
import { defineComponent, onMounted, ref, onBeforeUnmount } from 'vue';
import config from '@/config/index'
import flvjs from 'flv.js';
import v01 from '@/assets/images/v01.png'
import v02 from '@/assets/images/v02.png'
import v03 from '@/assets/images/v03.png'
import v04 from '@/assets/images/v04.png'
import v05 from '@/assets/images/v05.png'
import v06 from '@/assets/images/v06.png'
import v07 from '@/assets/images/v07.png'
import v08 from '@/assets/images/v08.png'
import v09 from '@/assets/images/v09.png'
import v10 from '@/assets/images/v10.png'
import v11 from '@/assets/images/v11.png'
import v12 from '@/assets/images/v12.png'

const FlvUrl = "http://192.168.19.127:8080/live/live200.flv"

const iframeRef = ref(null)
const fixedVideoBoxRef = ref(null)
// eslint-disable-next-line no-undef
const videoRef = ref<HTMLVideoElement | null>(null)
const isLoading = ref(true)
const videoList = ref([
  {
    name: '一团一营',
    img: v01,
    rtmpUrl: 'rtmp://example.com/live/yituyiying', // 示例RTMP地址
  },
  {
    name: '一团二营',
    img: v02,
    rtmpUrl: 'rtmp://example.com/live/yituerying',
  },
  {
    name: '一团三营',
    img: v03,
    rtmpUrl: 'rtmp://example.com/live/yitusanying',
  },
  {
    name: '一团四营',
    img: v04,
    rtmpUrl: 'rtmp://example.com/live/yitusiying',
  },

  {
    name: '二团一营',
    img: v05,
    rtmpUrl: 'rtmp://example.com/live/ertuyiying',
  },
  {
    name: '二团二营',
    img: v06,
    rtmpUrl: 'rtmp://example.com/live/ertuerying',
  },
  {
    name: '二团三营',
    img: v07,
    rtmpUrl: 'rtmp://example.com/live/ertusanying',
  },
  {
    name: '二团四营',
    img: v08,
    rtmpUrl: 'rtmp://example.com/live/ertusiying',
  },

  {
    name: '三团一营',
    img: v09,
    rtmpUrl: 'rtmp://example.com/live/santuyiying',
  },
  {
    name: '三团二营',
    img: v10,
    rtmpUrl: 'rtmp://example.com/live/santuerying',
  },
  {
    name: '三团三营',
    img: v11,
    rtmpUrl: 'rtmp://example.com/live/santusanying',
  },
  {
    name: '三团四营',
    img: v12,
    rtmpUrl: 'rtmp://example.com/live/santusiying',
  },

  {
    name: '四团一营',
    img: v08,
    rtmpUrl: 'rtmp://example.com/live/situyiying',
  },
  {
    name: '四团二营',
    img: v01,
    rtmpUrl: 'rtmp://example.com/live/situerying',
  },
  {
    name: '四团三营',
    img: v05,
    rtmpUrl: 'rtmp://example.com/live/situsanying',
  },
  {
    name: '四团四营',
    img: v03,
    rtmpUrl: 'rtmp://example.com/live/situsiying',
  },
])

const isShowFixedBox = ref(false);
const isMaxFixedBox = ref(false);
const isHovered = ref(false);
let hoverTimeout: ReturnType<typeof setTimeout> | null = null;

// 拖动功能相关变量
const dragState = ref({
  isDragging: false,
  startX: 0,
  startY: 0,
  offsetX: 300,
  offsetY: 330
});

// 最大化/最小化前保存原始状态
const originalPosition = ref({
  x: 12, // 默认位置
  y: 12,
  width: 400,
  height: 240
});

// 获取窗口边界限制
const getWindowBounds = () => {
  // 动态获取fixedVideoBox的尺寸
  let fixedVideoBoxWidth = isMaxFixedBox.value ? window.innerWidth : 400; // 默认值
  let fixedVideoBoxHeight = isMaxFixedBox.value ? window.innerHeight - 42 : 240; // 默认值，减去header高度

  
  if (fixedVideoBoxRef.value && !isMaxFixedBox.value) {
    const computedStyle = window.getComputedStyle(fixedVideoBoxRef.value);
    fixedVideoBoxWidth = parseFloat(computedStyle.width) || 400;
    fixedVideoBoxHeight = parseFloat(computedStyle.height) || 240;
  } else if (!isMaxFixedBox.value){
    // 如果无法获取DOM元素，则尝试通过查询选择器获取
    const element = document.querySelector('.fixedVideoBox');
    if (element) {
      const computedStyle = window.getComputedStyle(element);
      fixedVideoBoxWidth = parseFloat(computedStyle.width) || 400;
      fixedVideoBoxHeight = parseFloat(computedStyle.height) || 240;
    }
  }
  
  return {
    minX: 0,
    minY: 0,
    maxX: window.innerWidth - fixedVideoBoxWidth,
    maxY: window.innerHeight - fixedVideoBoxHeight
  };
};

// 最大化功能
const maximizeVideoBox = () => {
  // 保存当前位置和大小
  originalPosition.value.x = dragState.value.offsetX;
  originalPosition.value.y = dragState.value.offsetY;
  
  if (fixedVideoBoxRef.value) {
    const computedStyle = window.getComputedStyle(fixedVideoBoxRef.value);
    originalPosition.value.width = parseFloat(computedStyle.width) || 400;
    originalPosition.value.height = parseFloat(computedStyle.height) || 240;
  } else {
    const element = document.querySelector('.fixedVideoBox');
    if (element) {
      const computedStyle = window.getComputedStyle(element);
      originalPosition.value.width = parseFloat(computedStyle.width) || 400;
      originalPosition.value.height = parseFloat(computedStyle.height) || 240;
    }
  }
  
  // 设置为全屏
  isMaxFixedBox.value = true;
  // 在最大化状态下，强制显示header
  isHovered.value = true;
  if (hoverTimeout) {
    clearTimeout(hoverTimeout);
    hoverTimeout = null;
  }
  dragState.value.offsetX = 0;
  dragState.value.offsetY = 0;
};

// 最小化功能（恢复到原始大小和位置）
const minimizeVideoBox = () => {
  // 恢复原始位置和大小
  isMaxFixedBox.value = false;
  dragState.value.offsetX = originalPosition.value.x;
  dragState.value.offsetY = originalPosition.value.y;
  
  // 重置悬停状态，以便正常显示header
  setTimeout(() => {
    isHovered.value = false;
  }, 2000); // 2秒后隐藏header，与原来的逻辑一致
};

// 窗口大小改变时重新计算位置，防止超出边界
const handleResize = () => {
  const bounds = getWindowBounds();
  dragState.value.offsetX = Math.max(bounds.minX, Math.min(bounds.maxX, dragState.value.offsetX));
  dragState.value.offsetY = Math.max(bounds.minY, Math.min(bounds.maxY, dragState.value.offsetY));
};



// 悬停相关函数
const handleMouseEnter = () => {
  isHovered.value = true;
  // 如果有悬停计时器，则清除它
  if (hoverTimeout) {
    clearTimeout(hoverTimeout);
    hoverTimeout = null;
  }
};

const handleMouseLeave = () => {
  // 设置一个延迟，2秒后隐藏header
  hoverTimeout = setTimeout(() => {
    isHovered.value = false;
  }, 2000);
};

// 拖动相关函数
const handleMouseDown = (e: MouseEvent) => {
  // 如果是最大化状态，则不执行拖动操作
  if (isMaxFixedBox.value) {
    return;
  }
  
  // 当拖动时，也要清除悬停状态
  isHovered.value = true;
  dragState.value.isDragging = true;
  dragState.value.startX = e.clientX - dragState.value.offsetX;
  dragState.value.startY = e.clientY - dragState.value.offsetY;
  
  document.addEventListener('mousemove', handleMouseMove);
  document.addEventListener('mouseup', handleMouseUp);
};

// 触摸事件支持
const handleTouchStart = (e: any) => {
  // 如果是最大化状态，则不执行拖动操作
  if (isMaxFixedBox.value) {
    return;
  }
  
  // 触摸开始时显示header
  isHovered.value = true;
  if (hoverTimeout) {
    clearTimeout(hoverTimeout);
    hoverTimeout = null;
  }
  
  dragState.value.isDragging = true;
  const touch = e.touches[0];
  dragState.value.startX = touch.clientX - dragState.value.offsetX;
  dragState.value.startY = touch.clientY - dragState.value.offsetY;
  
  document.addEventListener('touchmove', handleTouchMove, { passive: false });
  document.addEventListener('touchend', handleTouchEnd);
};

const handleTouchEnd = () => {
  // 触摸结束后开始计时，2秒后隐藏header
  hoverTimeout = setTimeout(() => {
    isHovered.value = false;
  }, 2000);
  
  dragState.value.isDragging = false;
  document.removeEventListener('touchmove', handleTouchMove);
  document.removeEventListener('touchend', handleTouchEnd);
};

const handleMouseMove = (e: MouseEvent) => {
  if (!dragState.value.isDragging) return;
  
  let newX = e.clientX - dragState.value.startX;
  let newY = e.clientY - dragState.value.startY;
  
  // 应用边界限制
  const bounds = getWindowBounds();
  newX = Math.max(bounds.minX, Math.min(bounds.maxX, newX));
  newY = Math.max(bounds.minY, Math.min(bounds.maxY, newY));
  
  dragState.value.offsetX = newX;
  dragState.value.offsetY = newY;
};

const handleTouchMove = (e: any) => {
  if (!dragState.value.isDragging) return;
  
  const touch = e.touches[0];
  let newX = touch.clientX - dragState.value.startX;
  let newY = touch.clientY - dragState.value.startY;
  
  // 应用边界限制
  const bounds = getWindowBounds();
  newX = Math.max(bounds.minX, Math.min(bounds.maxX, newX));
  newY = Math.max(bounds.minY, Math.min(bounds.maxY, newY));
  
  dragState.value.offsetX = newX;
  dragState.value.offsetY = newY;
  
  // 阻止默认行为以避免滚动
  e.preventDefault();
};

const handleMouseUp = () => {
  dragState.value.isDragging = false;
  document.removeEventListener('mousemove', handleMouseMove);
  document.removeEventListener('mouseup', handleMouseUp);
};



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

// RTMP流播放相关变量
const flvPlayer = ref<any>(null);
let isInMeeting = ref(false);
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

// 播放RTMP流
const playRTMPStream = async (streamUrl: string) => {
  if (!flvjs.isSupported()) {
    console.error('flv.js 不支持当前浏览器');
    return;
  }

  try {
    // 销毁现有的播放器实例
    if (flvPlayer.value) {
      flvPlayer.value.pause();
      flvPlayer.value.unload();
      flvPlayer.value.detachMediaElement();
      flvPlayer.value.destroy();
      flvPlayer.value = null;
    }
    
    // 确保视频元素存在
    if (!videoRef.value) {
      console.error('视频元素不存在');
      return;
    }

    // 创建新的播放器实例
    const player = flvjs.createPlayer({
      type: 'flv',
      url: streamUrl,
    }, {
      enableWorker: false, // 禁用worker以避免错误
      lazyLoadMaxDuration: 3 * 60,
      seekType: 'range',
      enableStashBuffer: true,          // 启用缓存
      stashInitialSize: 1024 * 16,      // 初始缓存大小（字节）
      isLive: true, // 标识为直播流
    });
    
    // 绑定视频元素
    player.attachMediaElement(videoRef.value);
    player.load();
    
    // 等待元数据加载后再播放
    await new Promise<void>((resolve, reject) => {
      const onLoadedMetadata = () => {
        videoRef.value?.removeEventListener('loadedmetadata', onLoadedMetadata);
        resolve();
      };
      
      // eslint-disable-next-line no-undef
      const onError = (e: Event) => {
        videoRef.value?.removeEventListener('error', onError);
        reject(new Error('视频元数据加载失败'));
      };
      
      videoRef.value?.addEventListener('loadedmetadata', onLoadedMetadata);
      videoRef.value?.addEventListener('error', onError);
    });
    
    // 尝试播放
    const playPromise = videoRef.value.play();
    if (playPromise !== undefined) {
      await playPromise.catch(error => {
        console.warn('自动播放被阻止，等待用户交互:', error);
        // 如果自动播放失败，可以显示提示让用户手动点击播放
      });
    }
    
    flvPlayer.value = player;
    
    // 监听播放器事件
    player.on(flvjs.Events.ERROR, (errType: any, errDetail: any) => {
      console.error('FLV播放器错误:', errType, errDetail);
      Message({ message: '视频播放出错', type: 'error' });
    });
    
    player.on(flvjs.Events.STATISTICS_INFO, (statInfo: any) => {
      // 可以在这里获取播放统计信息
      console.log('播放统计:', statInfo);
    });
  } catch (error: any) {
    console.error('播放失败:', error);
    Message({ message: '视频播放失败: ' + error.message, type: 'error' });
  }
};

// 停止播放
const stopRTMPStream = () => {
  if (flvPlayer.value) {
    flvPlayer.value.pause();
    flvPlayer.value.unload();
    flvPlayer.value.detachMediaElement();
    flvPlayer.value.destroy();
    flvPlayer.value = null;
  }
};

// 开始视频呼叫
const startVideoCall = (item: any) => {
  // 播放对应的RTMP流
  item.rtmpUrl = config.flvUrl || FlvUrl
  if (item.rtmpUrl) {
    playRTMPStream(item.rtmpUrl);
    // 显示固定视频框
    isShowFixedBox.value = true;
  } else {
    Message({ message: '未配置该视频源的RTMP地址'});
  }
};

// 关闭视频流
const closeVideoStream = () => {
  stopRTMPStream();
  isShowFixedBox.value = false;
};

// 暴露方法给父组件
defineExpose({
  sendMessageToIframe
})

onMounted(()=>{
  window.addEventListener('resize', handleResize);
})

// 在组件卸载时移除事件监听器
onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize);
  // 移除可能仍然存在的文档级事件监听器
  document.removeEventListener('mousemove', handleMouseMove);
  document.removeEventListener('mouseup', handleMouseUp);
  document.removeEventListener('touchmove', handleTouchMove);
  document.removeEventListener('touchend', handleTouchEnd);
  
  // 销毁播放器实例
  if (flvPlayer.value) {
    flvPlayer.value.pause();
    flvPlayer.value.unload();
    flvPlayer.value.detachMediaElement();
    flvPlayer.value.destroy();
    flvPlayer.value = null;
  }
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
    &::-webkit-scrollbar {
      display: none; /* Chrome, Safari, Opera */
    }
    
    -ms-overflow-style: none;  /* IE 和 Edge */
    scrollbar-width: none;  /* Firefox */
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
        cursor: pointer;
        background-color: rgba(11, 32, 67, 0.9);
      }
    }
    .videoItem:nth-child(2n+1){ 
      margin-right: 0;
    }
  }
  .fixedVideoBox{
    position: fixed;
    top: 0;
    left: 0;
    width: px2rem(480);
    height: px2rem(300);
    background-color: rgba(0,0,0);
    z-index: 20;
    transition: none; /* 确保没有过渡效果干扰拖动 */
    user-select: none; /* 防止拖动时选中文本 */
    overflow: hidden;
    &.maximized {
      top: 0 !important;
      left: 0 !important;
      width: 100vw !important;
      height: 100vh !important;
      transform: translate(0, 0) !important; /* 确保最大化时没有偏移 */
    }
    &.maximized .fixedHeader {
      top: 0 !important; /* 最大化时始终显示头部 */
    }
    .fixedHeader{
      width: 100%;
      height: px2rem(42);
      padding: 0 px2rem(12);
      box-sizing: border-box;
      background-color: rgba(0, 0, 0, 0.8);
      display: flex;
      align-items: center;
      justify-content: space-between;
      position: absolute;
      top: -#{px2rem(42)}; /* 初始位置在上方隐藏 */
      left: 0;
      cursor: grab; /* 显示可拖动光标 */
      transition: top 0.3s ease; /* 添加过渡效果 */
      z-index: 21; /* 确保头部在视频层之上 */
      &.visible {
        top: 0; /* 悬停时显示位置 */
      }
      .headerTitle{
        font-size: px2rem(16);
        font-weight: bolder;
        color: #ffffff;
      }
      .fixedOpt{
        display: flex;
        align-items: center;
        justify-content: center;
        width: auto;
        height: 100%;
        cursor: pointer;
        .iconOpt{
          width: px2rem(42);
          height: px2rem(42);
          padding: px2rem(10);
          box-sizing: border-box;
          margin-left: px2rem(10);
          display: flex;
          align-items: center;
          justify-content: center;
          img{
            width: 100%;
            height: 100%;
          }
        }
      }

    }
    .videoCon {
      width: 100%;
      height: 100%; /* 不用减去头部高度 */
      .video-element {
        width: 100%;
        height: 100%;
        object-fit: cover; /* 确保视频填满容器但保持比例 */
      }
    }
    .fixedOpt{
      width: 100%;
    }
  }
  
  /* 悬停时显示header */
  .fixedVideoBox.hovered .fixedHeader {
    top: 0;
  }
  
  /* 最大化且悬停时保持header显示 */
  .fixedVideoBox.maximized.hovered .fixedHeader,
  .fixedVideoBox.maximized:not(.hovered) .fixedHeader {
    top: 0 !important; /* 最大化时始终显示header */
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