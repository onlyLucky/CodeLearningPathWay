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
attribute float a_size;
void main(){
  gl_Position = vec4(a_position,0.0,1.0);
  gl_PointSize = a_size;
}
`
let fragmentSource = `
  void main(){
    gl_FragColor = vec4(1.0,0.0,0.0,1.0);
  }
`

initShaders(gl,vertexSource,fragmentSource);



// 清空屏幕
gl.clearColor(0.0,0.0,0.0,1.0);
gl.clear(gl.COLOR_BUFFER_BIT)

let x = 0;
let y = 0;
let n = 10000;

for(let i = 0; i<n; i++){
  let r = i/1000;
  x = r * Math.cos(i)
  y = r * Math.sin(i)

  // 使用attribute 将js中的数据传入 vertex shader中
  let a_position = gl.getAttribLocation(gl.program, "a_position")
  gl.vertexAttrib2f(a_position, x,y)

  let a_size = gl.getAttribLocation(gl.program, "a_size")
  gl.vertexAttrib1f(a_size, r*5)

  gl.drawArrays(gl.POINTS, 0, 1)
}
