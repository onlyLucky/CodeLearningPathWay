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
uniform float u_size;
varying vec2 v_xx;

void main(){
  v_xx = a_position;
  gl_Position = vec4(a_position,0.0,1.0);
  gl_PointSize = u_size;
}
`
let fragmentSource = `
  precision mediump float;
  varying vec2 v_xx;

  uniform vec3 u_color;
  void main(){
    // gl_FragColor = vec4(u_color,1.0);
    gl_FragColor = vec4(v_xx,0.0,1.0);
  }
`

initShaders(gl,vertexSource,fragmentSource);



// 清空屏幕
gl.clearColor(0.0,0.0,0.0,1.0);
gl.clear(gl.COLOR_BUFFER_BIT)

// 1. attribute (vertexShader) 将js中的数据传入 vertex shader中
let a_position = gl.getAttribLocation(gl.program, "a_position")
gl.vertexAttrib2f(a_position, 0.5,0.5)

// 2.Uniform (vertexShader/fragmentShader) 将js中的数据传入 vertexShader 或 fragmentShader中
let u_color = gl.getUniformLocation(gl.program, "u_color")
gl.uniform3f(u_color, 0.0,1.0,0.0)

let u_size = gl.getUniformLocation(gl.program, "u_size")
gl.uniform1f(u_size, 30.0)

// 3.Varying: 将vertexShader 中的数据传递给fragmentShader


gl.drawArrays(gl.POINTS, 0, 1)
