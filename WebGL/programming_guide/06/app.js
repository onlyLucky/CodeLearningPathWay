import initShaders from "./initShader.js";
let canvas = document.getElementById("webgl")
let gl = canvas.getContext("webgl")

if (!gl) {
  console.error('WebGL not supported, falling back on experimental-webgl');
  gl = canvas.getContext('experimental-webgl');
}
if (!gl) {
  alert('Your browser does not support WebGL');
}

// shader glsl
let vertexSource = `
attribute vec2 a_position;
attribute vec3 a_color;
varying vec3 v_color;
void main(){
  v_color = a_color;
  gl_Position = vec4(a_position,0.0,1.0);
}
`
let fragmentSource = `
precision mediump float;
varying vec3 v_color;

void main(){
  gl_FragColor = vec4(v_color,1.0);
}
`

initShaders(gl,vertexSource,fragmentSource);

// 清空屏幕
gl.clearColor(0.0,0.0,0.0,1.0);
gl.clear(gl.COLOR_BUFFER_BIT)

let vertices = [
  -0.7,-0.5, 1.0,0.0,0.0,// 第一个点 坐标颜色信息
  0.7,-0.5,  0.0,1.0,0.0,// 第二个点 坐标颜色信息
  0, 0.5,    0.0,0.0,1.0,// 第三个点 坐标颜色信息
]
vertices = new Float32Array(vertices)
// 每个数组项占据的字节数 
/* 
int8 Uint8          （1）
int16 Uint16        （2）
int32 Uint32 Float32（4）
Float64             （8）
*/
let F_SIZE = vertices.BYTES_PER_ELEMENT
console.log(F_SIZE)

// 1. 创建buffer
let buffer = gl.createBuffer()
// 2.绑定
gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
// 3.设置数据
gl.bufferData(gl.ARRAY_BUFFER,vertices,gl.STATIC_DRAW)
// 4.把带有数据的buffer赋值给attribute
let a_position = gl.getAttribLocation(gl.program, "a_position");
let a_color = gl.getAttribLocation(gl.program, "a_color");
gl.vertexAttribPointer(
  a_position, // location： vertexShader 里面attribute变量的location
  2,          // size：attribute变量的长度
  gl.FLOAT,   // type：buffer变量的类型
  false,      // normalized： 是否正交化。[1,2] => [1/根号5， 2/根号5] 两个数平方相加等于1
  5*F_SIZE,          // stride：每个点的信息所占的bytes
  0,
)

gl.vertexAttribPointer(
  a_color,
  3,
  gl.FLOAT,
  false,
  5*F_SIZE,
  2*F_SIZE,
)

// 5.确认使用变量赋值
gl.enableVertexAttribArray(a_position)
gl.enableVertexAttribArray(a_color)
// 渐变的颜色内容是由 差值计算生成的。
gl.drawArrays(gl.TRIANGLES, 0, 3)




