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
void main(){
  gl_Position = vec4(0.0,0.0,0.0,1.0);
  gl_PointSize = 10.0;
}
`
let fragmentSource = `
  void main(){
    gl_FragColor = vec4(1.0,0.0,0.0,1.0);
  }
`

let vertexShader = gl.createShader(gl.VERTEX_SHADER)
let fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)

gl.shaderSource(vertexShader,vertexSource)
gl.shaderSource(fragmentShader,fragmentSource)

gl.compileShader(vertexShader)
gl.compileShader(fragmentShader)

// program
let program = gl.createProgram()
gl.attachShader(program,vertexShader)
gl.attachShader(program,fragmentShader)
gl.linkProgram(program)
gl.useProgram(program)

// 清空屏幕
gl.clearColor(0.0,0.0,0.0,1.0);
gl.clear(gl.COLOR_BUFFER_BIT)

gl.drawArrays(gl.POINTS, 0, 1)