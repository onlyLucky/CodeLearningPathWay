import initShaders from "./initShader.js";
let canvas = document.getElementById('webgl');
let gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
if (!gl) alert('浏览器不支持 WebGL');

// 1. 封装 Shader 函数（复用前文逻辑）

// 2. 着色器代码（支持旋转矩阵）
const vsSource = `
  attribute vec2 a_position;
  uniform mat4 u_matrix;
  
  void main() {
    gl_Position = u_matrix * vec4(a_position, 0.0, 1.0); // 应用旋转
  }
`;
const fsSource = `
  precision mediump float;
  void main() {
    gl_FragColor = vec4(0.0,1.0,0.0, 1.0);
  }
`;

// 3. 初始化着色器程序
initShaders(gl, vsSource, fsSource);

// 4. 准备三角形顶点数据（位置+颜色）
const vertices = new Float32Array([
  -0.3, -0.2,
  0.3,  -0.2,
  0.0,  0.3,
]);

let FSIZE = vertices.BYTES_PER_ELEMENT

const vbo = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

// 配置位置属性
const a_position = gl.getAttribLocation(gl.program,'a_position');
gl.vertexAttribPointer(a_position, 2, gl.FLOAT, false, 2*FSIZE, 0);
gl.enableVertexAttribArray(a_position);

// 矩阵在数组上面显示为 数学公式里面一行， 在代码中为一列

// 缩放矩阵
let Sx = 2, Sy = 1, Sz=1
let scale_matrix = [
  Sx, 0, 0, 0,
  0, Sy, 0, 0,
  0, 0, Sz, 0,
  0, 0, 0, 1,
]

// 平移
let Tx = 0.5, Ty = 0, Tz = 0
let translate_matrix = [
  1, 0, 0, 0,
  0, 1, 0, 0,
  0, 0, 1, 0,
  Tx,Ty,Tz,1,
]

// 旋转
let deg = 10
let cos = Math.cos(deg / 180 * Math.PI)
let sin = Math.sin(deg / 180 * Math.PI)
let rotate_matrix = [
  cos, sin, 0, 0,
  -sin,cos, 0, 0,
  0,   0,   1, 0,
  0,   0,   0, 1,
]

const u_matrix = gl.getUniformLocation(gl.program,'u_matrix');
// gl.uniformMatrix4fv(u_matrix, false, new Float32Array(scale_matrix))
// gl.uniformMatrix4fv(u_matrix, false, new Float32Array(translate_matrix))
gl.uniformMatrix4fv(u_matrix, false, new Float32Array(rotate_matrix))




gl.clearColor(0.1, 0.1, 0.1, 1.0);
gl.clear(gl.COLOR_BUFFER_BIT);

// 5. 重新绘制三角形
gl.drawArrays(gl.TRIANGLES, 0, 3);
