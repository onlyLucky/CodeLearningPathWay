import initShaders from "./initShader.js";
let canvas = document.getElementById('webgl');
let gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
if (!gl) alert('浏览器不支持 WebGL');

// 1. 封装 Shader 函数（复用前文逻辑）

// 2. 着色器代码（支持旋转矩阵）
const vsSource = `
  attribute vec2 aPosition;
  attribute vec3 aColor;
  varying vec3 vColor;
  uniform mat2 uRotationMatrix; // 旋转矩阵（uniform 变量，每帧更新）
  
  void main() {
    gl_Position = vec4(uRotationMatrix * aPosition, 0.0, 1.0); // 应用旋转
    vColor = aColor;
  }
`;
const fsSource = `
  precision mediump float;
  varying vec3 vColor;
  void main() {
    gl_FragColor = vec4(vColor, 1.0);
  }
`;

// 3. 初始化着色器程序
initShaders(gl, vsSource, fsSource);
const aPositionLoc = gl.getAttribLocation(gl.program,'aPosition');
const aColorLoc = gl.getAttribLocation(gl.program,'aColor');
const uRotationMatrixLoc = gl.getUniformLocation(gl.program,'uRotationMatrix');

// 4. 准备三角形顶点数据（位置+颜色）
const vertices = new Float32Array([
  -0.3, -0.2, 1.0, 0.0, 0.0,  // 红
  0.3,  -0.2, 0.0, 1.0, 0.0,  // 绿
  0.0,  0.3,  0.0, 0.0, 1.0   // 蓝
]);

// 5. 创建 VBO 并配置
const vbo = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

// 配置位置属性
gl.vertexAttribPointer(aPositionLoc, 2, gl.FLOAT, false, 5*4, 0);
gl.enableVertexAttribArray(aPositionLoc);

// 配置颜色属性
gl.vertexAttribPointer(aColorLoc, 3, gl.FLOAT, false, 5*4, 2*4);
gl.enableVertexAttribArray(aColorLoc);

// 6. 帧循环动画（核心）
let angle = 0; // 旋转角度（弧度）
function animate() {
  // 1. 清空画布
  gl.clearColor(0.1, 0.1, 0.1, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  // 2. 更新旋转角度（每帧增加 0.01 弧度）
  angle += 0.01;

  // 3. 计算旋转矩阵（2D 旋转矩阵公式）
  const cosA = Math.cos(angle);
  const sinA = Math.sin(angle);
  const rotationMatrix = [
    cosA, -sinA,
    sinA, cosA
  ];

  // 4. 传递旋转矩阵到 uniform 变量
  gl.uniformMatrix2fv(uRotationMatrixLoc, false, rotationMatrix);

  // 5. 重新绘制三角形
  gl.drawArrays(gl.TRIANGLES, 0, 3);

  // 6. 请求下一帧（循环执行）
  requestAnimationFrame(animate);
}

// 启动动画
animate();