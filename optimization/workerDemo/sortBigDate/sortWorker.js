self.onmessage = (e) => {
  const { type, data } = e.data;
  if (type === 'sort') {
    const startTime = performance.now();
    // 执行排序（耗时操作）
    const sortedData = data.sort((a, b) => a - b);
    const endTime = performance.now();
    
    // 发送结果到主线程
    self.postMessage({
      type: 'sorted',
      result: sortedData,
      time: Math.round(endTime - startTime)
    });
    // 关闭自身
    self.close();
  }
};