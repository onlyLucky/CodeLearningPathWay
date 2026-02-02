<template>
  <div class="container">
    <div ref="canvasRef" class="canvas-container"></div>
    <div class="controls">
      <h3>卫星地图 3D Extrusion</h3>
      <p>左键旋转 | 右键平移 | 滚轮缩放</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

const canvasRef = ref<HTMLDivElement>()

// 生成程序化卫星地图纹理
const createSatelliteTexture = () => {
  const size = 1024
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!

  // 基础海洋色
  ctx.fillStyle = '#1e3a5f'
  ctx.fillRect(0, 0, size, size)

  // 生成地形噪点
  for (let i = 0; i < 400; i++) {
    const x = Math.random() * size
    const y = Math.random() * size
    const radius = Math.random() * 100 + 20
    
    // 陆地渐变
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius)
    gradient.addColorStop(0, `rgba(${46 + Math.random() * 40}, ${125 + Math.random() * 40}, ${50 + Math.random() * 30}, 1)`)
    gradient.addColorStop(0.5, `rgba(${100 + Math.random() * 40}, ${80 + Math.random() * 30}, ${40 + Math.random() * 20}, 0.8)`)
    gradient.addColorStop(1, 'rgba(30, 58, 95, 0)')
    
    ctx.fillStyle = gradient
    ctx.beginPath()
    ctx.arc(x, y, radius, 0, Math.PI * 2)
    ctx.fill()
  }

  // 添加城市灯光点
  for (let i = 0; i < 200; i++) {
    const x = Math.random() * size
    const y = Math.random() * size
    ctx.fillStyle = `rgba(255, 220, 150, ${Math.random() * 0.8 + 0.2})`
    ctx.fillRect(x, y, 2, 2)
  }

  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  return texture
}

// 创建高度图纹理（用于 Shader 中的地形起伏）
const createHeightTexture = () => {
  const size = 512
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!
  
  const imageData = ctx.createImageData(size, size)
  for (let i = 0; i < imageData.data.length; i += 4) {
    const noise = Math.random() * 255
    imageData.data[i] = noise     // R
    imageData.data[i + 1] = noise // G
    imageData.data[i + 2] = noise // B
    imageData.data[i + 3] = 255   // A
  }
  ctx.putImageData(imageData, 0, 0)
  
  return new THREE.CanvasTexture(canvas)
}

onMounted(() => {
  if (!canvasRef.value) return

  // 场景设置
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(0x050510)
  scene.fog = new THREE.FogExp2(0x050510, 0.02)

  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000)
  camera.position.set(0, 20, 40)

  const renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.shadowMap.enabled = true
  canvasRef.value.appendChild(renderer.domElement)

  const controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true

  // 创建轮廓形状（示例：星形地图区域）
  const createMapShape = () => {
    const shape = new THREE.Shape()
    const points = 8
    const outerRadius = 10
    const innerRadius = 5
    
    for (let i = 0; i < points * 2; i++) {
      const angle = (i / (points * 2)) * Math.PI * 2
      const radius = i % 2 === 0 ? outerRadius : innerRadius
      const x = Math.cos(angle) * radius
      const y = Math.sin(angle) * radius
      if (i === 0) shape.moveTo(x, y)
      else shape.lineTo(x, y)
    }
    shape.closePath()
    return shape
  }

  // ExtrudeGeometry 设置
  const extrudeSettings: THREE.ExtrudeGeometryOptions = {
    depth: 0.00001,               // 挤出深度
  }

  const geometry = new THREE.ExtrudeGeometry(createMapShape(), extrudeSettings)
  
  // 修正 UV 映射以适应卫星纹理
  const posAttribute = geometry.attributes.position
  const uvAttribute = geometry.attributes.uv
  
  // 计算边界框用于 UV 归一化
  geometry.computeBoundingBox()
  const min = geometry.boundingBox!.min
  const max = geometry.boundingBox!.max
  const range = new THREE.Vector3().subVectors(max, min)

  for (let i = 0; i < posAttribute.count; i++) {
    const x = posAttribute.getX(i)
    const y = posAttribute.getY(i)
    const z = posAttribute.getZ(i)
    
    // 平面投影 UV（顶部和侧面使用不同的映射方式）
    const u = (x - min.x) / range.x
    const v = (y - min.y) / range.y
    
    // 侧面 UV 基于高度重复
    const sideV = z / extrudeSettings.depth!
    
    uvAttribute.setXY(i, u, v)
  }

  // 卫星地图 Shader 材质
  const satelliteTexture = createSatelliteTexture()
  const heightTexture = createHeightTexture()

  const shaderMaterial = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uSatelliteMap: { value: satelliteTexture },
      uHeightMap: { value: heightTexture },
      uExtrusionDepth: { value: extrudeSettings.depth as number },
      uLightPosition: { value: new THREE.Vector3(10, 20, 10) },
      uColor: { value: new THREE.Color(0xffffff) }
    },
    vertexShader: `
      uniform float uTime;
      uniform float uExtrusionDepth;
      varying vec2 vUv;
      varying vec3 vPosition;
      varying vec3 vNormal;
      varying float vHeight;
      
      void main() {
        vUv = uv;
        vPosition = position;
        vNormal = normalize(normalMatrix * normal);
        
        // 计算相对高度 (0.0 - 1.0)
        // ExtrudeGeometry 的 z 范围通常是 0 到 depth
        vHeight = position.z / uExtrusionDepth;
        
        // 可选：添加顶点动画（大气呼吸效果）
        vec3 newPosition = position + normal * sin(uTime * 0.5 + position.x) * 0.05;
        
        gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
      }
    `,
    fragmentShader: `
      uniform sampler2D uSatelliteMap;
      uniform sampler2D uHeightMap;
      uniform vec3 uLightPosition;
      uniform vec3 uColor;
      uniform float uTime;
      
      varying vec2 vUv;
      varying vec3 vPosition;
      varying vec3 vNormal;
      varying float vHeight;
      
      void main() {
        // 基础卫星纹理
        vec4 satelliteColor = texture2D(uSatelliteMap, vUv);
        
        // 根据高度调整颜色（高处更亮，模拟积雪或光照）
        float heightFactor = smoothstep(0.7, 1.0, vHeight);
        vec3 highAltColor = mix(satelliteColor.rgb, vec3(0.9, 0.95, 1.0), heightFactor * 0.3);
        
        // 简单的光照计算
        vec3 lightDir = normalize(uLightPosition - vPosition);
        float diff = max(dot(vNormal, lightDir), 0.0);
        vec3 diffuse = highAltColor * (0.6 + 0.4 * diff);
        
        // 边缘发光效果（扫描线）
        float scanLine = sin(vPosition.z * 2.0 - uTime * 3.0) * 0.5 + 0.5;
        float edgeGlow = smoothstep(0.9, 1.0, vHeight) * scanLine * 0.3;
        
        // 侧面添加深色阴影（地形侧面通常是悬崖/建筑侧面）
        float sideShadow = 1.0 - smoothstep(0.0, 0.1, vHeight) * 0.3;
        
        vec3 finalColor = diffuse * sideShadow + vec3(0.3, 0.6, 1.0) * edgeGlow;
        
        gl_FragColor = vec4(finalColor, 1.0);
      }
    `,
    side: THREE.DoubleSide
  })

  const mesh = new THREE.Mesh(geometry, shaderMaterial)
  mesh.castShadow = true
  mesh.receiveShadow = true
  mesh.rotation.x = -Math.PI / 2 // 平放
  scene.add(mesh)

  // 添加辅助线框（可选）
  const wireframeGeometry = new THREE.WireframeGeometry(geometry)
  const wireframeMaterial = new THREE.LineBasicMaterial({ 
    color: 0x00ffff, 
    transparent: true, 
    opacity: 0.1 
  })
  const wireframe = new THREE.LineSegments(wireframeGeometry, wireframeMaterial)
  wireframe.rotation.x = -Math.PI / 2
  wireframe.position.y = 0.01 // 避免 z-fighting
  scene.add(wireframe)

  // 动画循环
  const clock = new THREE.Clock()
  const animate = () => {
    requestAnimationFrame(animate)
    
    const elapsedTime = clock.getElapsedTime()
    shaderMaterial.uniforms.uTime.value = elapsedTime
    
    controls.update()
    renderer.render(scene, camera)
  }
  animate()

  // 响应式处理
  const handleResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
  }
  window.addEventListener('resize', handleResize)

  onUnmounted(() => {
    window.removeEventListener('resize', handleResize)
    geometry.dispose()
    shaderMaterial.dispose()
    satelliteTexture.dispose()
    renderer.dispose()
  })
})
</script>

<style scoped>
.container {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: #000;
}

.canvas-container {
  width: 100%;
  height: 100%;
}

.controls {
  position: absolute;
  top: 20px;
  left: 20px;
  color: white;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: rgba(0, 0, 0, 0.6);
  padding: 15px;
  border-radius: 8px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  pointer-events: none;
}

.controls h3 {
  margin: 0 0 10px 0;
  font-size: 18px;
  background: linear-gradient(90deg, #00d2ff, #3a7bd5);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.controls p {
  margin: 0;
  font-size: 12px;
  color: #aaa;
}
</style>