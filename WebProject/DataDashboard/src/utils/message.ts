import { createVNode, render } from 'vue';
import MessageComponent from '../components/Message.vue';

// 消息类型定义
type MessageType = 'success' | 'warning' | 'info' | 'error';

// 消息选项接口
interface MessageOptions {
  message: string;
  type?: MessageType;
  duration?: number;
  showClose?: boolean;
  center?: boolean;
  vertical?: boolean;
  onClose?: () => void;
}

// 存储所有消息实例的容器
const instances: Array<{
  id: string;
  vnode: any;
  container: HTMLElement;
}> = [];

let seed = 1;

// 消息函数
const Message = (options: MessageOptions | string) => {
  if (typeof options === 'string') {
    options = { message: options, type: 'info', duration: 3000 };
  }

  const id = `message_${Date.now()}_${seed++}`;
  const container = document.createElement('div');
  document.body.appendChild(container);

  // 创建虚拟节点
  const vnode = createVNode(MessageComponent);
  render(vnode, container);

  // 获取组件实例
  const componentInstance = vnode.component;
  
  // 通过expose暴露的方法
  if (componentInstance && componentInstance.exposed) {
    const exposed = componentInstance.exposed;
    exposed.addMessage({
      ...options,
      id
    });

    // 保存实例信息
    instances.push({
      id,
      vnode,
      container
    });
  }

  return {
    close: () => {
      if (componentInstance && componentInstance.exposed) {
        const exposed = componentInstance.exposed;
        exposed.close(id);
      }
    }
  };
};

// 为不同类型的消息添加方法
(Message as any).success = (message: string, options?: Partial<MessageOptions>) => {
  return Message({ message, type: 'success', ...options });
};

(Message as any).warning = (message: string, options?: Partial<MessageOptions>) => {
  return Message({ message, type: 'warning', ...options });
};

(Message as any).info = (message: string, options?: Partial<MessageOptions>) => {
  return Message({ message, type: 'info', ...options });
};

(Message as any).error = (message: string, options?: Partial<MessageOptions>) => {
  return Message({ message, type: 'error', ...options });
};

// 清除所有消息
(Message as any).closeAll = () => {
  instances.forEach(({ container }) => {
    document.body.removeChild(container);
  });
  instances.length = 0;
};

export default Message;