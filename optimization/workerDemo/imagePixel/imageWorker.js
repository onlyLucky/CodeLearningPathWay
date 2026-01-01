self.onmessage = (e) => {
  const { type, data } = e.data;
  if (type === 'grayscale') {
    const pixels = data.data;
    // 遍历像素，转换为灰度
    for (let i = 0; i < pixels.length; i += 4) {
      const gray = 0.299 * pixels[i] + 0.587 * pixels[i + 1] + 0.114 * pixels[i + 2];
      pixels[i] = gray;     // 红
      pixels[i + 1] = gray; // 绿
      pixels[i + 2] = gray; // 蓝
      // 透明度不变
    }
    // 发送处理后的像素数据
    self.postMessage(data);
    self.close();
  }
};