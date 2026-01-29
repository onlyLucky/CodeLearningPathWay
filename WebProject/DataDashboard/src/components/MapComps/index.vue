<template>
  <div class="map-comps">
    <div ref="mapContainer" class="map-container"></div>
  </div>
</template>

<script setup lang="ts">
// 导入地图地理数据
import mapGeoFullData from '@/assets/data/map/330000_full.json'
import mapGeoData from '@/assets/data/map/330000.json'
import textJpg from "@/assets/images/pic.jpg"
import textScreen from "@/assets/images/screen.png"
// 导入Vue组合式API
import { ref, onMounted, onBeforeUnmount } from 'vue'
// 导入Three.js核心库
import * as THREE from 'three'
// 导入D3.js库，用于地理坐标转换
import * as d3 from 'd3'
// 导入GSAP动画库
import { gsap } from 'gsap'
// 导入轨道控制器
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { calculateGeoJsonCenter,getGeoJsonDimensionsScaled, type GeoJSON } from '@/utils/genJson'

// 地图容器DOM引用
const mapContainer = ref<HTMLDivElement>()

// Three.js核心对象声明
let scene: THREE.Scene           // 场景对象
let camera: THREE.PerspectiveCamera  // 相机对象
let renderer: THREE.WebGLRenderer   // 渲染器对象
let controls: OrbitControls     // 轨道控制器
let mapMeshes: THREE.Mesh[] = []; // 地图网格数组，用于存储多个区域的网格
let animationId: number          // 动画帧ID


// 初始化场景
const initScene = () => {
  scene = new THREE.Scene()  // 创建场景对象
  // scene.background = new THREE.Color(0x0a0e27)  // 设置场景背景颜色为深蓝色
  // scene.fog = new THREE.Fog(0x0a0e27, 10, 50)   // 添加雾效，增强深度感
  // 创建坐标轴，参数为轴的长度
  /* const axesHelper = new THREE.AxesHelper(30)
  scene.add(axesHelper) */
}

/* 
  初始化相机
  根据容器尺寸计算宽高比，创建透视相机并设置初始位置与朝向
*/
const initCamera = () => {
  // 计算画布宽高比，确保画面不变形
  const aspect = mapContainer.value!.clientWidth / mapContainer.value!.clientHeight
  // 创建透视相机：视角60°，宽高比，近裁剪面0.1，远裁剪面1000
  camera = new THREE.PerspectiveCamera(60, aspect, 0.1, 1000)
  // 设置相机初始位置：俯视45°角，距离原点约21.2单位
  camera.position.set(0, 20, 20)
  // 让相机看向场景中心(0,0,0)
  camera.lookAt(0, 0, 0) 
}

/* 初始化渲染器 */
const initRenderer = () => {
  renderer = new THREE.WebGLRenderer({ 
    antialias: true,  // 开启抗锯齿，提升边缘平滑度
    alpha: true       // 允许透明背景，便于与页面其他元素融合
  })
  // 设置渲染尺寸为容器实际宽高，防止画面拉伸
  renderer.setSize(mapContainer.value!.clientWidth, mapContainer.value!.clientHeight)
  // 根据设备像素比设置渲染精度，上限为 2，兼顾清晰度与性能
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  // 启用阴影映射，使物体产生投影
  renderer.shadowMap.enabled = true
  // 采用 PCF 柔和阴影，减少锯齿感
  renderer.shadowMap.type = THREE.PCFSoftShadowMap
  // 将渲染器画布节点插入到地图容器中，完成挂载
  mapContainer.value!.appendChild(renderer.domElement)
}

/* 初始化轨道控制器 */
const initControls = () => {
  // 创建 OrbitControls 实例，关联相机与渲染器 DOM 元素
  controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true// 启用阻尼效果，使拖拽更平滑
  controls.dampingFactor = 0.05// 阻尼系数，值越小阻尼感越强
  controls.minDistance = 10// 最小缩放距离，防止相机过度靠近
  controls.maxDistance = 50// 最大缩放距离，防止相机过度远离
  controls.maxPolarAngle = Math.PI / 2.2// 最大极角（俯视角度），限制相机不能垂直仰视
  controls.autoRotate = true// 启用自动旋转
  controls.autoRotateSpeed = 0.5 // 自动旋转速度（弧度/秒）
}

// 经纬度转墨卡托坐标（适配 Three.js 坐标系）
const lngLatToVector3 = d3.geoMercator()

const createMapGeometry = ()=>{
  // 计算地图中心位置，用于居中显示
  const centerPos = calculateGeoJsonCenter(mapGeoData as GeoJSON)
  lngLatToVector3.center(centerPos).scale(400).translate([6,5]);//scale(360).translate([1, 4])
  // 主体
  createMapGeometryShape({
    depth: 1,
    opacity: 0.3,
    bgColor: 0x409eff,
    positionZ: -1,
  })
  // 区域层
  createMapGeometryInsideShape({
    depth: 0.001,
    positionZ: 2,
  })
  // 主体边框01
  createMapGeometryShape({
    depth: 0.001,
    positionZ: -1,
    opacity: 0,
    borderColor: '#798089',
  })
  // 贴图
  createMapGeometryShape({
    depth: 0.001,
    positionZ: 0,
    opacity: 0,
    borderColor: '',
    bgColor: "green",
    texture: false,
  })
  // 边框
  createMapGeometryShape({
    depth: 0.001,
    positionZ: 0,
    opacity: 0,
    borderColor: '#1a8ed6',
    borderWidth: 4,
  })
  scene.rotation.x = -Math.PI / 2 // 旋转几何体（适配 Three.js 坐标系）
}

/* 创建地图几何体*/
interface MapGeometryOptions{
  depth?: number, // 地图厚度（3D 高度）
  bgColor?: number | string, // 地图背景颜色
  opacity?: number, // 地图透明度
  texture?: THREE.Texture | null | boolean,// 地图纹理
  borderColor?: number | string,// 地图边框颜色
  borderWidth?: number,// 地图边框宽度
  insideLineColor?: number | string,// 地图内部线颜色
  positionX?: number,// 地图X轴位置
  positionY?: number,// 地图Y轴位置
  positionZ?: number,// 地图Z轴位置
}
const createMapGeometryShape = (options: MapGeometryOptions = {
  depth: 1,
  opacity: 0,
  positionX: 0,
  positionY: 0,
  positionZ: 0,
  borderWidth: 1,
  texture: null,
}) =>{
  // console.log(mapGeoData)   // 输出地图数据用于调试
  const {depth,bgColor,opacity,borderColor,texture,borderWidth} = options as MapGeometryOptions
  mapGeoData.features.forEach((feature: any) => {
    const coordinates = feature.geometry.coordinates;
    // 处理多级坐标（部分区域有子区域，如海岛）
    const shapes:THREE.Shape[] = [];
    coordinates.forEach((coord: any) => {
      coord.forEach((subCoord: any) => {
        const shape = new THREE.Shape();
        subCoord.forEach((lonlat: [number, number], index: number) => {
          const [x, y] = lngLatToVector3(lonlat) || [0, 0];
          if (index === 0) {
            shape.moveTo(x, y);
          } else {
            shape.lineTo(x, y);
          }
        });
        
        shapes.push(shape);
      });
    })
    // 创建拉伸几何体（3D 高度）
    const geometry = new THREE.ExtrudeGeometry(shapes, {
      depth, // 地图厚度（3D 高度）
      bevelEnabled: false // 关闭倒角（简化）
    });

    // 创建材质（可自定义不同区域的颜色）
    const material = new THREE.MeshLambertMaterial({
      color: bgColor, // 基础颜色（蓝色）
      transparent: true,
      opacity,
    });

    // 创建网格并添加到场景
    const mesh = new THREE.Mesh(geometry, material);
    mesh.userData = { name: feature.properties.name }; // 存储区域名称（用于交互）
    // mesh.rotation.x = -Math.PI / 2; // 旋转几何体（适配 Three.js 坐标系）
    mesh.position.set(options.positionX || 0, options.positionY || 0, options.positionZ || 0); // 确保几何体居中
    scene.add(mesh);
    mapMeshes.push(mesh);
    if(texture){
      createMapTexture(geometry)
    }
    if(borderColor){
      createMapLine(geometry,mesh,borderColor,borderWidth)
    }
    
    // 使用（在3D坐标上添加）
    var point:[number,number] = lngLatToVector3([120.13279236,30.22054087]) || [0,0]
    // createMapMarkPlane(new THREE.Vector3(point[0], point[1],0.5), textJpg)

    // scene.rotation.x = -Math.PI / 2 // 旋转几何体（适配 Three.js 坐标系）
    // 添加鼠标交互（hover 高亮）
    /* mesh.addEventListener('pointerenter', () => {
      gsap.to(mesh.material, { opacity: 1, color: 0xff9500, duration: 0.3 });
    });
    mesh.addEventListener('pointerout', () => {
      gsap.to(mesh.material, { opacity: 0.8, color: 0x409eff, duration: 0.3 });
    }); */
  })
}

const createMapGeometryInsideShape = (options: MapGeometryOptions = {
  depth: 1,
  opacity: 0,
  positionX: 0,
  positionY: 0,
  positionZ: 0,
}) =>{
  // console.log(mapGeoFullData)   // 输出地图数据用于调试
  const {depth,bgColor,opacity,borderColor} = options as MapGeometryOptions
  mapGeoFullData.features.forEach((feature: any) => {
    const coordinates = feature.geometry.coordinates;
    // 处理多级坐标（部分区域有子区域，如海岛）
    const shapes:THREE.Shape[] = [];
    coordinates.forEach((coord: any) => {
      coord.forEach((subCoord: any) => {
        const shape = new THREE.Shape();
        subCoord.forEach((lonlat: [number, number], index: number) => {
          const [x, y] = lngLatToVector3(lonlat) || [0, 0];
          if (index === 0) {
            shape.moveTo(x, y);
          } else {
            shape.lineTo(x, y);
          }
        });
        
        shapes.push(shape);

        // 步骤1：根据Shape生成基础几何体（仅提取轮廓）
        const shapeGeometry = new THREE.ShapeGeometry(shape);
        // 步骤2：提取几何体的边缘（EdgesGeometry 自动识别轮廓边）
        const edgeGeometry = new THREE.EdgesGeometry(shapeGeometry);
        // 步骤3：创建线材质（专用！纯色描边，可自定义颜色、线宽）
        const lineMaterial = new THREE.LineBasicMaterial({
          color: 0xFFFFFF, // 边缘线颜色（黑色，与填充色对比）
          linewidth: 1, // 线宽（注意：WebGL限制，默认1，多数浏览器不支持大于1）
        });
        // 步骤4：创建线对象（LineSegments 适合闭合轮廓，无断点）
        const shapeLine = new THREE.LineSegments(edgeGeometry, lineMaterial);

        // 3. 线对象与Shape填充Mesh同步旋转/偏移（关键！保证描边贴合）
        // shapeLine.rotation.x = -Math.PI / 2; // 与地图Mesh同步旋转
        shapeLine.position.set(0, 0, -(depth ?? 0) / 2) // 偏移到地图中心下方，兜底处理 depth 为 undefined 的情况

        // 4. 添加到场景
        scene.add(shapeLine);
      });
    })
    // 创建拉伸几何体（3D 高度）
    const geometry = new THREE.ExtrudeGeometry(shapes, {
      depth, // 地图厚度（3D 高度）
      bevelEnabled: false // 关闭倒角（简化）
    });

    // 创建材质（可自定义不同区域的颜色）
    const material = new THREE.MeshLambertMaterial({
      color: 0x409eff, // 基础颜色（蓝色）
      transparent: true,
      opacity: 0
    });

    // 创建网格并添加到场景
    const mesh = new THREE.Mesh(geometry, material);
    mesh.userData = { name: feature.properties.name }; // 存储区域名称（用于交互）
    // mesh.rotation.x = -Math.PI / 2; // 旋转几何体（适配 Three.js 坐标系）
    mesh.position.set(options.positionX || 0, options.positionY || 0, options.positionZ || 0); // 确保几何体居中
    // scene.add(mesh);
    // mapMeshes.push(mesh);

    // createMapTexture(geometry)
    if(borderColor){
      createMapLine(geometry,mesh,borderColor)
    }
    

    // 使用（在3D坐标上添加）
    var point:[number,number] = lngLatToVector3([120.13279236,30.22054087]) || [0,0]
    // createMapMarkPlane(new THREE.Vector3(point[0], point[1],0.5), textJpg)

    // scene.rotation.x = -Math.PI / 2 // 旋转几何体（适配 Three.js 坐标系）
    // 添加鼠标交互（hover 高亮）
    /* mesh.addEventListener('pointerenter', () => {
      gsap.to(mesh.material, { opacity: 1, color: 0xff9500, duration: 0.3 });
    });
    mesh.addEventListener('pointerout', () => {
      gsap.to(mesh.material, { opacity: 0.8, color: 0x409eff, duration: 0.3 });
    }); */
  })
}

/* 创建地图边缘线 */
const createMapLine = (geometry: THREE.ExtrudeGeometry,mesh: THREE.Mesh,color: number|string =0xffffff,width: number = 1) =>{
  // 添加边缘描边（关键步骤）
  const edges = new THREE.EdgesGeometry(geometry) // 提取边缘 
  const lineMaterial = new THREE.LineBasicMaterial({ 
    color,  // 描边颜色
    linewidth: width      // 线宽（部分浏览器支持有限）
  })

  const wireframe = new THREE.LineSegments(edges, lineMaterial)
  mesh.add(wireframe) // 将线条作为子对象添加
}

/* 创建地图纹理 */
const createMapTexture = (geometry: THREE.ExtrudeGeometry) => {
  // 加载地图纹理贴图
  const textureLoader = new THREE.TextureLoader()
  const texture = textureLoader.load(textScreen, (texture) => {
    // 纹理加载完成回调
    // texture.wrapS = THREE.RepeatWrapping
    // texture.wrapT = THREE.RepeatWrapping 
    // texture.repeat.set(0, 0) // 设置重复次数
    texture.wrapS = THREE.MirroredRepeatWrapping
    texture.wrapT = THREE.MirroredRepeatWrapping
    texture.repeat.set(1, 1)
  }) 
  texture.colorSpace = THREE.SRGBColorSpace
  // 3. 创建带纹理的材质
  const material = new THREE.MeshLambertMaterial({ 
    map: texture,  // 关键：添加贴图
    side: THREE.DoubleSide
  })

  // 4. 创建网格
  const mesh = new THREE.Mesh(geometry, material)
  // mesh.rotation.x = -Math.PI / 2 // 旋转几何体（适配 Three.js 坐标系）
  scene.add(mesh)
}

/* 创建地图数据平面点 */
const createMapMarkPlane = (position: THREE.Vector3, textureUrl: any) =>{
  const geometry = new THREE.PlaneGeometry(1, 1)
  const textureLoader = new THREE.TextureLoader()
  const texture = textureLoader.load(textureUrl)
  const material = new THREE.MeshBasicMaterial({ 
    map: texture,
    transparent: true,
    opacity: 0.9
  })
  const plane = new THREE.Mesh(geometry, material)
  plane.position.set(position.x, position.y, position.z)
  scene.add(plane)
}

/* 创建目标区域 */
const createTargetArea = (position: THREE.Vector3, textureUrl: any) =>{
  const geometry = new THREE.PlaneGeometry(1, 1)
  const textureLoader = new THREE.TextureLoader()
  const texture = textureLoader.load(textureUrl)
  const material = new THREE.MeshBasicMaterial({ 
    map: texture,
    transparent: true,
    opacity: 0.9
  })
  const plane = new THREE.Mesh(geometry, material)
  plane.position.set(position.x, position.y, position.z)
  scene.add(plane)
}


/* 创建演示立方体（用于测试场景是否正常渲染）*/
const createDemoCube = () => {
  // 创建立方体几何体，尺寸调整为 2x2x2
  const geometry = new THREE.BoxGeometry(2, 2, 2)
  // 使用标准材质，能够响应光照
  const material = new THREE.MeshStandardMaterial({ 
    color: 0xff0000,
    roughness: 0.5,
    metalness: 0.5
  })
  const cube = new THREE.Mesh(geometry, material)
  // 设置立方体位置，确保在相机视野内
  cube.position.set(0, 1, 0)
  // 允许立方体投射和接收阴影
  cube.castShadow = true
  cube.receiveShadow = true
  scene.add(cube)
}


/* 初始化并添加场景光源：环境光、方向光与点光源 */
const addLights = () => {
  // 环境光：提供均匀基础照明，避免死黑区域
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.4)
  scene.add(ambientLight)
  
  // 方向光：模拟太阳光，产生阴影与立体感
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
  directionalLight.position.set(10, 20, 10)
  directionalLight.castShadow = true
  // 设置阴影贴图分辨率，提升阴影清晰度
  directionalLight.shadow.mapSize.width = 2048
  directionalLight.shadow.mapSize.height = 2048
  scene.add(directionalLight)
  
  // 点光源：补充冷色氛围光，增强科技感
  const pointLight = new THREE.PointLight(0x00d4ff, 1, 30)
  pointLight.position.set(0, 5, 0)
  scene.add(pointLight)
}


const handleResize = () => {
  if (!mapContainer.value) return
  
  const width = mapContainer.value.clientWidth
  const height = mapContainer.value.clientHeight
  
  camera.aspect = width / height
  camera.updateProjectionMatrix()
  
  renderer.setSize(width, height)
}

const animate = () => {
  animationId = requestAnimationFrame(animate)
  controls.update()
  renderer.render(scene, camera)
}

const handleMouseInteraction = (event: MouseEvent) => {
  
}

const init = () => {
  // 初始化场景、相机、渲染器与控制器
  initScene()
  initCamera()
  initRenderer()
  initControls()
  // 创建地图几何体与数据点
  // createDemoCube()
  createMapGeometry()
  // 添加光照并启动动画
  addLights()
  // 开始渲染循环
  /* renderer.setAnimationLoop(() => {
    renderer.render(scene, camera)
  }) */
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
  window.removeEventListener('resize', handleResize)
  renderer.domElement.removeEventListener('click', handleMouseInteraction)
  
  if (renderer) {
    renderer.dispose()
    mapContainer.value?.removeChild(renderer.domElement)
  }

  // 清除场景中的地图
  if (scene) {
    mapMeshes.forEach(mesh => scene!.remove(mesh));
    mapMeshes = [];
  }
  
  scene?.clear()
  controls?.dispose()
})

const zoomTo = (level: number) => {
  
}

const resetView = () => {
  
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
