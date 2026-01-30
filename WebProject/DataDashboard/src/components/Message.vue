<template>
  <div class="message-container" :class="{ 'message-container--vertical': messages.some(m => m.vertical) }">
    <transition-group name="message-fade" tag="div" class="message-wrapper">
      <div
        v-for="message in messages"
        :key="message.id"
        class="message-item"
        :class="[`message--${message.type}`, { 'message--center': message.center }]"
        :style="{ zIndex: message.zIndex }"
      >
        <div class="message-icon">
          <svg v-if="message.type === 'success'" class="icon" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
            <path fill="currentColor" d="M414.375138 659.474802l326.932742-326.932742a28.04842 28.04842 0 0 1 39.666211 0l39.666211 39.66621a28.04842 28.04842 0 0 1 0 39.666211L478.906234 743.408264a56.09684 56.09684 0 0 1-79.332422 0L264.907598 608.74205a28.04842 28.04842 0 0 1 0-39.666211l39.666211-39.66621a28.04842 28.04842 0 0 1 39.66621 0z"/>
            <path fill="currentColor" d="M512 896a384 384 0 1 0 0-768 384 384 0 0 0 0 768zm0-44.332422a339.667578 339.667578 0 1 1 0-679.335156 339.667578 339.667578 0 0 1 0 679.335156z"/>
          </svg>
          <svg v-if="message.type === 'warning'" class="icon" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
            <path fill="currentColor" d="M512 64a448 448 0 1 0 0 896 448 448 0 0 0 0-896zm0 768a36 36 0 1 1 0-72 36 36 0 0 1 0 72zm36-484h-72V436h72v112z"/>
          </svg>
          <svg v-if="message.type === 'error'" class="icon" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
            <path fill="currentColor" d="M512 64a448 448 0 1 0 0 896 448 448 0 0 0 0-896zm0 768a36 36 0 1 1 0-72 36 36 0 0 1 0 72zm36-484h-72V436h72v112z"/>
          </svg>
          <svg v-if="message.type === 'info'" class="icon" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
            <path fill="currentColor" d="M512 64a448 448 0 1 0 0 896 448 448 0 0 0 0-896zm0 768a36 36 0 1 1 0-72 36 36 0 0 1 0 72zm-40-526h80a32 32 0 0 1 32 32v264a32 32 0 0 1-32 32h-80a32 32 0 0 1-32-32V332a32 32 0 0 1 32-32zm-32-160a32 32 0 1 1 64 0 32 32 0 0 1-64 0z"/>
          </svg>
        </div>
        <div class="message-content">
          <span>{{ message.message }}</span>
        </div>
        <div v-if="message.showClose" class="message-close" @click="close(message.id)">
          <svg class="icon" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
            <path fill="currentColor" d="M563.8 512l266.1-266.1c12.5-12.5 12.5-32.8 0-45.3-12.5-12.5-32.8-12.5-45.3 0L512.5 466.8 246.4 200.7c-12.5-12.5-32.8-12.5-45.3 0-12.5 12.5-12.5 32.8 0 45.3L467.2 512 201.1 778.1c-12.5 12.5-12.5 32.8 0 45.3 12.5 12.5 32.8 12.5 45.3 0L512.5 557.3l266.1 266.1c12.5 12.5 32.8 12.5 45.3 0 12.5-12.5 12.5-32.8 0-45.3L563.8 512z"/>
          </svg>
        </div>
      </div>
    </transition-group>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { gsap } from 'gsap';

interface Message {
  id: string;
  message: string;
  type: 'success' | 'warning' | 'info' | 'error';
  duration: number;
  showClose: boolean;
  center: boolean;
  vertical: boolean;
  onClose?: () => void;
  zIndex: number;
}

const messages = ref<Message[]>([]);
const seed = Date.now();
let zIndex = 2000;

const addMessage = (options: Partial<Message>) => {
  const id = `message_${seed}_${messages.value.length}`;
  const message: Message = {
    id,
    message: options.message || '',
    type: options.type || 'info',
    duration: options.duration ?? 3000,
    showClose: options.showClose ?? false,
    center: options.center ?? false,
    vertical: options.vertical ?? false,
    onClose: options.onClose,
    zIndex: zIndex++
  };

  messages.value.push(message);

  // 如果duration大于0，自动关闭消息
  if (message.duration > 0) {
    setTimeout(() => {
      close(id);
    }, message.duration);
  }
};

const close = (id: string) => {
  const index = messages.value.findIndex(msg => msg.id === id);
  if (index !== -1) {
    const message = messages.value[index];
    if (message.onClose) {
      message.onClose!();
    }
    messages.value.splice(index, 1);
  }
};

// 为组件实例添加方法，供外部调用
defineExpose({
  addMessage,
  close,
  success: (message: string, options?: Partial<Message>) => addMessage({ message, type: 'success', ...options }),
  warning: (message: string, options?: Partial<Message>) => addMessage({ message, type: 'warning', ...options }),
  info: (message: string, options?: Partial<Message>) => addMessage({ message, type: 'info', ...options }),
  error: (message: string, options?: Partial<Message>) => addMessage({ message, type: 'error', ...options })
});

// 监听键盘事件，ESC键关闭所有消息
const handleKeydown = (e: any) => {
  if (e.key === 'Escape') {
    messages.value = [];
  }
};

onMounted(() => {
  document.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown);
});
</script>

<style scoped lang="scss">
.message-container {
  position: fixed;
  top: px2rem(20);
  right: px2rem(20);
  z-index: 2000;
  pointer-events: none;

  &.message-container--vertical {
    top: px2rem(20);
    left: 50%;
    transform: translateX(-50%);
    right: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
}

.message-wrapper {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.message-item {
  display: flex;
  align-items: center;
  min-width: px2rem(380);
  padding: px2rem(15) px2rem(15) px2rem(15) px2rem(20);
  margin-bottom: px2rem(10);
  box-shadow: 0 px2rem(4) px2rem(12) rgba(0, 0, 0, 0.12);
  pointer-events: auto;
  transition: opacity 0.3s, transform 0.3s;
  border-left: px2rem(5) solid #12539D;
  background: #193c64;
  color: #b8c2ca;
  font-size: px2rem(18);

  /* &.message--success {
    background-color: #f0f9ff;
    color: #67c23a;
  }

  &.message--warning {
    background-color: #fdf6ec;
    border: 1px solid #faecd8;
    color: #e6a23c;
  }

  &.message--info {
    background-color: #f4f4f5;
    border: 1px solid #e9e9eb;
    color: #909399;
  }

  &.message--error {
    background-color: #fef0f0;
    border: 1px solid #fedddd;
    color: #f56c6c;
  } */

  &.message--center {
    justify-content: center;
  }
}

.message-icon {
  margin-right: px2rem(10);
  width: px2rem(24);
  height: px2rem(24);
  display: none;
  position: relative;

  .icon {
    width: px2rem(24);
    height: px2rem(24);
    position: absolute;
  }
}

.message-content {
  flex: 1;
  font-size: px2rem(14);
  line-height: 1.4;
}

.message-close {
  cursor: pointer;
  margin-left: px2rem(10);
  padding: px2rem(5);
  border-radius: px2rem(4); 
  transition: background-color 0.2s;

  &:hover {
    background-color: rgba(0, 0, 0, 0.1);
  }

  .icon {
    width: px2rem(16);
    height: px2rem(16);
  }
}

/* 动画效果 */
.message-fade-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.message-fade-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

.message-fade-move {
  transition: transform 0.3s;
}
</style>