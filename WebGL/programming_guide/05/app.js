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
void main(){
  gl_Position = vec4(a_position,0.0,1.0);
}
`
let fragmentSource = `
precision mediump float;
void main(){
  gl_FragColor = vec4(1.0,0.0,0.0,1.0);
}
`

initShaders(gl,vertexSource,fragmentSource);

// 清空屏幕
gl.clearColor(0.0,0.0,0.0,1.0);
gl.clear(gl.COLOR_BUFFER_BIT)

let vertices = [
  -0.7,-0.5,
  0.7,-0.5,
  0, 0.5
]
vertices = new Float32Array(vertices)

// 1. 创建buffer
let buffer = gl.createBuffer()
// 2.绑定
gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
// 3.设置数据
gl.bufferData(gl.ARRAY_BUFFER,vertices,gl.STATIC_DRAW)
// 4.把带有数据的buffer赋值给attribute
let a_position = gl.getAttribLocation(gl.program, "a_position")
gl.vertexAttribPointer(
  a_position,
  2,
  gl.FLOAT,
  false,
  0,
  0,
)
// 5.确认使用变量赋值
gl.enableVertexAttribArray(a_position)

gl.drawArrays(gl.TRIANGLES, 0, 3)




