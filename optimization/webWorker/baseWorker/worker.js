// 接收主线程消息
self.onmessage = (e) => {
  const { type, data } = e.data;
  if (type === 'start') {
    // 模拟计算密集型任务（如求和、排序、复杂运算）
    const result = data.reduce((acc, cur) => acc + cur, 0);
    console.log("worker onmessage",result)
    // 向主线程发送结果
    self.postMessage(result);
    // 关闭自身
    self.close();
  }
};