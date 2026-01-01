// 创建 Worker 实例（指定 Worker 脚本文件）
const worker = new Worker('./baseWorker/worker.js');
console.log("worker",worker)
// 向 Worker 发送数据
worker.postMessage({ type: 'start', data: [1, 2, 3, 4, 5] });

// 接收 Worker 消息
worker.onmessage = (e) => {
  console.log('主线程接收结果:', e.data);
  // 关闭 Worker（任务完成后）
  worker.terminate();
};

// 监听错误
worker.onerror = (error) => {
  console.error(`Worker 错误: ${error.message} (行: ${error.lineno})`);
};