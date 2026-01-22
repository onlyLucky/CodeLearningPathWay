<template>
  <div class="map-comps">
    <div ref="mapContainer" class="map-container"></div>
  </div>
</template>

<script setup lang="ts">
import mapGeoData from '@/assets/data/map/330000_full.json'
import { ref, onMounted, onBeforeUnmount } from 'vue'
import * as THREE from 'three'
import { gsap } from 'gsap'
import d3 from 'd3'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

const mapContainer = ref<HTMLDivElement>()

let scene: THREE.Scene
let camera: THREE.PerspectiveCamera
let renderer: THREE.WebGLRenderer
let controls: OrbitControls
let mapMesh: THREE.Mesh
let dataPoints: THREE.Points
let animationId: number

const mapData = {
  center: [116.404, 39.915],
  zoom: 10,
  points: [
    { x: 0, y: 0, z: 0, value: 100 },
    { x: 2, y: 0, z: 1, value: 80 },
    { x: -2, y: 0, z: 2, value: 60 },
    { x: 1, y: 0, z: -2, value: 90 },
    { x: -1, y: 0, z: -1, value: 70 },
    { x: 3, y: 0, z: 0, value: 85 },
    { x: -3, y: 0, z: 1, value: 75 },
    { x: 0, y: 0, z: 3, value: 95 },
    { x: 2, y: 0, z: -3, value: 65 },
    { x: -2, y: 0, z: -2, value: 55 }
  ]
}

const initScene = () => {
  scene = new THREE.Scene()
  console.log(mapGeoData)
  // scene.background = new THREE.Color(0x0a0e27)
  // scene.fog = new THREE.Fog(0x0a0e27, 10, 50)
}

const initCamera = () => {
  const aspect = mapContainer.value!.clientWidth / mapContainer.value!.clientHeight
  camera = new THREE.PerspectiveCamera(60, aspect, 0.1, 1000)
  camera.position.set(0, 15, 15)
  camera.lookAt(0, 0, 0)
}

const initRenderer = () => {
  renderer = new THREE.WebGLRenderer({ 
    antialias: true,
    alpha: true
  })
  renderer.setSize(mapContainer.value!.clientWidth, mapContainer.value!.clientHeight)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap
  mapContainer.value!.appendChild(renderer.domElement)
}

const initControls = () => {
  controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
  controls.dampingFactor = 0.05
  controls.minDistance = 5
  controls.maxDistance = 50
  controls.maxPolarAngle = Math.PI / 2.2
  controls.autoRotate = true
  controls.autoRotateSpeed = 0.5
}

const createMap = (depth: number)=>{
  const map = new THREE.Object3D()
  const center = mapGeoData.features[0].geometry.coordinates[0][0]
  mapGeoData.features.forEach((feature) => {
    const geometry = new THREE.PlaneGeometry(20, 20, 50, 50)
  })
}

const createMapGeometry = () => {
  const geometry = new THREE.PlaneGeometry(20, 20, 50, 50)
  const positions = geometry.attributes.position.array as Float32Array
  
  for (let i = 0; i < positions.length; i += 3) {
    const x = positions[i]
    const z = positions[i + 2]
    const distance = Math.sqrt(x * x + z * z)
    const height = Math.sin(distance * 0.5) * 0.5 + Math.cos(x * 0.3) * 0.3
    positions[i + 1] = height
  }
  
  geometry.computeVertexNormals()
  
  const material = new THREE.MeshStandardMaterial({
    color: 0x00d4ff,
    roughness: 0.8,
    metalness: 0.2,
    wireframe: false,
    side: THREE.DoubleSide
  })
  
  mapMesh = new THREE.Mesh(geometry, material)
  mapMesh.rotation.x = -Math.PI / 2
  mapMesh.receiveShadow = true
  scene.add(mapMesh)
}

const createDataPoints = () => {
  const geometry = new THREE.BufferGeometry()
  const positions: number[] = []
  const colors: number[] = []
  const sizes: number[] = []
  
  mapData.points.forEach((point) => {
    positions.push(point.x, point.y + 1, point.z)
    
    const color = new THREE.Color()
    color.setHSL(0.5 + point.value / 200, 0.8, 0.5)
    colors.push(color.r, color.g, color.b)
    
    sizes.push(point.value / 20)
  })
  
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3))
  geometry.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1))
  
  const material = new THREE.PointsMaterial({
    size: 0.5,
    vertexColors: true,
    transparent: true,
    opacity: 0.8,
    sizeAttenuation: true
  })
  
  dataPoints = new THREE.Points(geometry, material)
  scene.add(dataPoints)
}

const addLights = () => {
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.4)
  scene.add(ambientLight)
  
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
  directionalLight.position.set(10, 20, 10)
  directionalLight.castShadow = true
  directionalLight.shadow.mapSize.width = 2048
  directionalLight.shadow.mapSize.height = 2048
  scene.add(directionalLight)
  
  const pointLight = new THREE.PointLight(0x00d4ff, 1, 30)
  pointLight.position.set(0, 5, 0)
  scene.add(pointLight)
}

const animateDataPoints = () => {
  const positions = dataPoints.geometry.attributes.position.array as Float32Array
  const originalY = mapData.points.map(p => p.y + 1)
  
  mapData.points.forEach((point, index) => {
    gsap.to(positions, {
      [index * 3 + 1]: originalY[index] + Math.sin(Date.now() * 0.001 + index) * 0.3,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    })
  })
  
  dataPoints.geometry.attributes.position.needsUpdate = true
}

const animateCameraTransition = (targetPosition: THREE.Vector3, duration: number = 2) => {
  gsap.to(camera.position, {
    x: targetPosition.x,
    y: targetPosition.y,
    z: targetPosition.z,
    duration: duration,
    ease: 'power2.inOut',
    onUpdate: () => {
      camera.lookAt(0, 0, 0)
    }
  })
}

const animateMapScale = (scale: number, duration: number = 1.5) => {
  gsap.to(mapMesh.scale, {
    x: scale,
    y: scale,
    z: scale,
    duration: duration,
    ease: 'elastic.out(1, 0.5)'
  })
}

const animate = () => {
  animationId = requestAnimationFrame(animate)
  controls.update()
  renderer.render(scene, camera)
}

const handleResize = () => {
  if (!mapContainer.value) return
  
  const width = mapContainer.value.clientWidth
  const height = mapContainer.value.clientHeight
  
  camera.aspect = width / height
  camera.updateProjectionMatrix()
  
  renderer.setSize(width, height)
}

const handleMouseInteraction = (event: MouseEvent) => {
  const rect = renderer.domElement.getBoundingClientRect()
  const mouse = new THREE.Vector2(
    ((event.clientX - rect.left) / rect.width) * 2 - 1,
    -((event.clientY - rect.top) / rect.height) * 2 + 1
  )
  
  const raycaster = new THREE.Raycaster()
  raycaster.setFromCamera(mouse, camera)
  
  const intersects = raycaster.intersectObject(mapMesh)
  
  if (intersects.length > 0) {
    const point = intersects[0].point
    gsap.to(camera.position, {
      x: point.x * 0.8,
      y: point.y + 10,
      z: point.z * 0.8 + 5,
      duration: 1,
      ease: 'power2.out'
    })
  }
}

const init = () => {
  initScene()
  initCamera()
  initRenderer()
  initControls()
  createMapGeometry()
  createDataPoints()
  addLights()
  animateDataPoints()
  animate()
  
  window.addEventListener('resize', handleResize)
  renderer.domElement.addEventListener('click', handleMouseInteraction)
  
  gsap.from(camera.position, {
    y: 30,
    duration: 2,
    ease: 'power2.out'
  })
}

onMounted(() => {
  if (mapContainer.value) {
    init()
  }
})

onBeforeUnmount(() => {
  cancelAnimationFrame(animationId)
  window.removeEventListener('resize', handleResize)
  renderer.domElement.removeEventListener('click', handleMouseInteraction)
  
  if (renderer) {
    renderer.dispose()
    mapContainer.value?.removeChild(renderer.domElement)
  }
  
  scene?.clear()
  controls?.dispose()
})

const zoomTo = (level: number) => {
  const targetY = 15 - level * 5
  animateCameraTransition(new THREE.Vector3(0, targetY, targetY))
}

const resetView = () => {
  animateCameraTransition(new THREE.Vector3(0, 15, 15))
  animateMapScale(1)
}

defineExpose({
  zoomTo,
  resetView
})
</script>

<style scoped lang="scss">
.map-comps {
  width: 100%;
  height: 100%;
  position: relative;
}

.map-container {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
