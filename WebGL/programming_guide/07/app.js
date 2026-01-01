
import initShaders from './initShader.js'

let canvas = document.getElementById('webgl')
let gl = canvas.getContext('webgl')

// vertex shader
let vertexShader = `
attribute vec2 a_position;

void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
    gl_PointSize = 10.0;
}
`

// fragment shader
let fragmentShader = `
precision mediump float;

void main() {
    gl_FragColor = vec4(0.0,1.0,0.0, 1.0);
}
`
initShaders(gl, vertexShader, fragmentShader)

// 清空画布
gl.clearColor(0.0, 0.0, 0.0, 1.0)
gl.clear(gl.COLOR_BUFFER_BIT)

/* let vertices = [
    // x    y      r    g   b
    -0.5, 0.5,
    -0.5, -0.5,
    0.5, -0.5, 
    0.5, 0.5,
] */

// 随机生成 n 个点
let n = 60
let R = 0.8 // 圆的半径
let vertices = []

for (let i = 0; i < n; i++) {
    let deg = 2 * Math.PI / n * i
    let x = Math.cos(deg) * R
    let y = Math.sin(deg) * R
    // let x = (Math.random() - 0.5) * 2
    // let y = (Math.random() - 0.5) * 2

    let r = (Math.random() - 0.5) * 2 + 0.8
    let g = (Math.random() - 0.5) * 2
    let b = (Math.random() - 0.5) * 2

    // vertices.push(x, y, r, g, b)
    vertices.push(x, y)
}

vertices = new Float32Array(vertices)
let FSIZE = vertices.BYTES_PER_ELEMENT
console.log(FSIZE)

/**
 * buffer: 分5个步骤
 */
// 1
let buffer = gl.createBuffer()
// 2
gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
// 3
gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)
// 4：把带有数据的buffer赋值给attribute
let a_position = gl.getAttribLocation(gl.program, 'a_position')
gl.vertexAttribPointer(
    a_position,  //location: vertex Shader里面attribute变量的location
    2,           //size: attribute变量的长度（vec2)
    gl.FLOAT,    //type: buffer里面数据的类型
    false,       //normalized: 正交化，true，false, [1, 2] => [1/根号5， 2/根号5]
    2 * FSIZE,   //stride：每个点的信息所占的BYTES
    0            //offset: 每个点的信息，从第几个BYTES开始数
)
// 5:确认把带有数据的buffer赋值给attribute
gl.enableVertexAttribArray(a_position)

// 画图
// gl.drawArrays(画什么图形， 从哪个点还是， 一共画几个点)

/**
 * WebGL中的基本形状： 点、线、三角形
 *  */
// gl.drawArrays(gl.POINTS, 0, n);

// gl.drawArrays(gl.LINES, 0, n)
// gl.drawArrays(gl.LINE_STRIP, 0, n)
gl.drawArrays(gl.LINE_LOOP, 0, n)

// gl.drawArrays(gl.TRIANGLES, 0, n)
// gl.drawArrays(gl.TRIANGLE_STRIP, 0, n)
// gl.drawArrays(gl.TRIANGLE_FAN, 0, n)
