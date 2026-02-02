<template>
  <div class="container">
    <div class="controls">
      <input type="file" accept="image/*" @change="handleImageUpload" />
      <button @click="resetCamera">重置视角</button>
    </div>
    <div ref="canvasRef" class="canvas-container"></div>
    <div class="info">
      <p>鼠标左键：旋转 | 鼠标右键：平移 | 滚轮：缩放</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

const canvasRef = ref<HTMLDivElement>()
let scene: THREE.Scene
let camera: THREE.PerspectiveCamera
let renderer: THREE.WebGLRenderer
let controls: OrbitControls
let mesh: THREE.Mesh | null = null
let texture: THREE.Texture | null = null

// 创建示例形状（可以使用自定义 SVG Path 或 Shape）
const createShape = (): THREE.Shape => {
  const shape = new THREE.Shape()
  
  // 示例：创建一个复杂的形状（这里用星形作为示例）
  const outerRadius = 5
  const innerRadius = 2.5
  const points = 5
  
  for (let i = 0; i < points * 2; i++) {
    const angle = (i / (points * 2)) * Math.PI * 2
    const radius = i % 2 === 0 ? outerRadius : innerRadius
    const x = Math.cos(angle) * radius
    const y = Math.sin(angle) * radius
    
    if (i === 0) {
      shape.moveTo(x, y)
    } else {
      shape.lineTo(x, y)
    }
  }
  shape.closePath()
  
  return shape
}

// 调整 UV 映射以确保贴图完全贴合
const adjustUVs = (geometry: THREE.ExtrudeGeometry, shape: THREE.Shape) => {
  const uvAttribute = geometry.attributes.uv
  const positionAttribute = geometry.attributes.position
  const boundingBox = new THREE.Box3().setFromBufferAttribute(positionAttribute as THREE.BufferAttribute)
  const size = new THREE.Vector3()
  boundingBox.getSize(size)
  
  // 为每个顶点计算 UV
  for (let i = 0; i < positionAttribute.count; i++) {
    const x = positionAttribute.getX(i)
    const y = positionAttribute.getY(i)
    const z = positionAttribute.getZ(i)
    
    // 根据面的类型（顶面、底面、侧面）计算不同的 UV
    // 这里使用平面投影，根据 x,y 坐标映射到 0-1 范围
    const u = (x - boundingBox.min.x) / size.x
    const v = (y - boundingBox.min.y) / size.y
    
    uvAttribute.setXY(i, u, v)
  }
  
  uvAttribute.needsUpdate = true
}

// 创建拉伸几何体
const createExtrudedMesh = (shape: THREE.Shape, imgUrl?: string) => {
  const extrudeSettings: THREE.ExtrudeGeometryOptions = {
    depth: 2,
    bevelEnabled: true,
    bevelThickness: 0.3,
    bevelSize: 0.2,
    bevelSegments: 5,
    curveSegments: 12
  }
  
  const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings)
  
  // 计算 UV 映射以确保贴图贴合
  adjustUVs(geometry, shape)
  
  // 创建材质
  let material: THREE.MeshStandardMaterial | THREE.MeshStandardMaterial[]
  
  if (imgUrl) {
    const loader = new THREE.TextureLoader()
    texture = loader.load(imgUrl, (tex) => {
      // 纹理加载完成后调整
      tex.colorSpace = THREE.SRGBColorSpace
      tex.wrapS = THREE.ClampToEdgeWrapping
      tex.wrapT = THREE.ClampToEdgeWrapping
      tex.flipY = false
      
      // 如果希望贴图覆盖整个形状而不重复
      tex.repeat.set(1, 1)
      tex.offset.set(0, 0)
    })
    
    // 创建数组材质：顶面/底面使用贴图，侧面使用纯色或贴图
    const sideMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x888888,
      roughness: 0.4,
      metalness: 0.1
    })
    
    const faceMaterial = new THREE.MeshStandardMaterial({
      map: texture,
      roughness: 0.4,
      metalness: 0.1
    })
    
    // ExtrudeGeometry 材质索引：0=顶面/底面, 1=侧面
    material = [faceMaterial, sideMaterial]
  } else {
    material = new THREE.MeshStandardMaterial({
      color: 0x4a90e2,
      roughness: 0.4,
      metalness: 0.1
    })
  }
  
  const newMesh = new THREE.Mesh(geometry, material)
  
  // 居中几何体
  geometry.center()
  
  // 添加阴影
  newMesh.castShadow = true
  newMesh.receiveShadow = true
  
  return newMesh
}

// 初始化场景
const initScene = () => {
  if (!canvasRef.value) return
  
  // 场景
  scene = new THREE.Scene()
  scene.background = new THREE.Color(0x1a1a1a)
  
  // 相机
  const width = canvasRef.value.clientWidth
  const height = canvasRef.value.clientHeight
  camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000)
  camera.position.set(0, 0, 15)
  
  // 渲染器
  renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setSize(width, height)
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap
  canvasRef.value.appendChild(renderer.domElement)
  
  // 控制器
  controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
  controls.dampingFactor = 0.05
  controls.minDistance = 5
  controls.maxDistance = 50
  
  // 灯光
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
  scene.add(ambientLight)
  
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
  directionalLight.position.set(10, 10, 5)
  directionalLight.castShadow = true
  directionalLight.shadow.mapSize.width = 2048
  directionalLight.shadow.mapSize.height = 2048
  scene.add(directionalLight)
  
  const fillLight = new THREE.DirectionalLight(0xffffff, 0.3)
  fillLight.position.set(-10, 0, -5)
  scene.add(fillLight)
  
  // 初始形状
  const shape = createShape()
  mesh = createExtrudedMesh(shape)
  scene.add(mesh)
  
  // 渲染循环
  const animate = () => {
    requestAnimationFrame(animate)
    controls.update()
    renderer.render(scene, camera)
  }
  animate()
  
  // 窗口大小调整
  const handleResize = () => {
    if (!canvasRef.value) return
    const w = canvasRef.value.clientWidth
    const h = canvasRef.value.clientHeight
    camera.aspect = w / h
    camera.updateProjectionMatrix()
    renderer.setSize(w, h)
  }
  window.addEventListener('resize', handleResize)
}

// 处理图片上传
const handleImageUpload = (event: any) => {
  const input = event.target as any
  if (!input.files || input.files.length === 0) return
  
  const file = input.files[0]
  const url = window.URL.createObjectURL(file)
  
  // 移除旧模型
  if (mesh) {
    scene.remove(mesh)
    mesh.geometry.dispose()
    if (Array.isArray(mesh.material)) {
      mesh.material.forEach(m => m.dispose())
    } else {
      mesh.material.dispose()
    }
  }
  if (texture) {
    texture.dispose()
  }
  
  // 创建新模型
  const shape = createShape()
  mesh = createExtrudedMesh(shape, url)
  scene.add(mesh)
}

// 重置相机
const resetCamera = () => {
  if (!camera || !controls) return
  camera.position.set(0, 0, 15)
  controls.reset()
}

onMounted(() => {
  initScene()
})

onUnmounted(() => {
  if (renderer) {
    renderer.dispose()
  }
  if (texture) {
    texture.dispose()
  }
})
</script>

<style scoped>
.container {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #1a1a1a;
}

.controls {
  padding: 15px;
  background: #2a2a2a;
  display: flex;
  gap: 15px;
  align-items: center;
  border-bottom: 1px solid #333;
}

.controls input[type="file"] {
  color: white;
  padding: 8px;
  background: #333;
  border-radius: 4px;
  border: 1px solid #444;
  cursor: pointer;
}

.controls button {
  padding: 8px 16px;
  background: #4a90e2;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.3s;
}

.controls button:hover {
  background: #357abd;
}

.canvas-container {
  flex: 1;
  position: relative;
  overflow: hidden;
}

.info {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  color: rgba(255, 255, 255, 0.6);
  font-size: 12px;
  pointer-events: none;
  text-align: center;
}
</style>