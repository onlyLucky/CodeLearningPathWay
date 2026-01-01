// 导入 xlsx 库 from https://cdn.sheetjs.com/xlsx-0.20.3/xlsx-0.20.3.tgz
importScripts('xlsx.full.min.js');

self.onmessage = (e) => {
  const { type, data } = e.data;
  if (type === 'parse') {
    try {
      // 解析 Excel 文件
      const workbook = XLSX.read(data, { type: 'array' });
      // 发送进度
      self.postMessage({ type: 'progress', progress: 50 });
      // 获取第一个工作表数据
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      // 发送最终结果
      self.postMessage({ type: 'result', data: jsonData });
    } catch (error) {
      console.error('解析失败：', error);
    } finally {
      self.close();
    }
  }
};