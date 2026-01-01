let ports = [];
let count = 0; // 共享计数器

self.onconnect = (e) => {
  const port = e.ports[0];
  ports.push(port);
  port.start();

  // 初始化：发送当前计数
  port.postMessage({ type: 'count', data: count });

  port.onmessage = (msg) => {
    if (msg.data.type === 'increment') {
      count++; // 增加计数
      broadcast({ type: 'count', data: count }); // 广播更新
    }
    console.log('share worker:', msg)
  };
  // 清理失效端口
  port.onmessageerror = () => {
    ports = ports.filter(p => p !== port);
  };
};

// 广播消息到所有连接的页面
function broadcast(msg) {
  ports.forEach(port => port.postMessage(msg));
}