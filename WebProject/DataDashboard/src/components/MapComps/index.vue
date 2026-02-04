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
import map_mark01 from "@/assets/images/map_mark01.png"
import map_mark02 from "@/assets/images/map_mark02.png"
import map_mark03 from "@/assets/images/map_mark03.png"
import map_mark04 from "@/assets/images/map_mark04.png"
import map_mark05 from "@/assets/images/map_mark05.png"
import map_mark06 from "@/assets/images/map_mark06.png"
import map_mark07 from "@/assets/images/map_mark07.png"
import map_mark08 from "@/assets/images/map_mark08.png"
import map_area01 from "@/assets/images/map_area01.png"
import map_area02 from "@/assets/images/map_area02.png"
import map_area03 from "@/assets/images/map_area03.png"
import map_area04 from "@/assets/images/map_area04.png"

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
import { calculateGeoJsonCenter, type GeoJSON } from '@/utils/genJson'

// 地图容器DOM引用
const mapContainer = ref<HTMLDivElement>()

// Three.js核心对象声明
let scene: THREE.Scene           // 场景对象
let camera: THREE.PerspectiveCamera  // 相机对象
let renderer: THREE.WebGLRenderer   // 渲染器对象
let controls: OrbitControls     // 轨道控制器
let mapMeshes: THREE.Mesh[] = []; // 地图网格数组，用于存储多个区域的网格
let mapMarkPlanes: THREE.Mesh[] = []; // 标记平面数组，用于存储标记点
let animationId: number          // 动画帧ID
// 存储飞线对象以便后续清理
let flyObject3DInstance: THREE.Object3D | null = null;


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

var markDataList = [
  [
    {
      lngLat: [118.61565501,28.4393911],
      markImg: map_mark03,
      to: "",
    },
    {
      lngLat: [120.76965592,27.86485354],
      markImg: map_mark04,
      to: "D",
    },
    {
      lngLat: [121.82855553,29.37426525],
      markImg: map_mark05,
      to: ""
    },
    {
      lngLat: [122.19057249,30.0502638],
      markImg: map_mark08,
      to: "B",
    },
    {
      lngLat: [121.25837882,30.30063158],
      markImg: map_mark03,// 
      to: "A",
    },
    {
      lngLat: [120.65200041,28.85240721],
      markImg: map_mark04,
      to: "E",
    },
    {
      lngLat: [119.8193614,28.39163094],
      markImg: map_mark05,
      to: "D",
    },
    {
      lngLat: [120.4619415,27.40783758],
      markImg: map_mark08,
      to: "D",
    },
    {
      lngLat: [119.90081522,29.52400497],
      markImg: map_mark03,
      to: "",
    },
    {
      lngLat: [119.54784868,30.51918038],
      markImg: map_mark04,// 
      to: "A",
    },
    {
      lngLat: [121.34888306,29.34271297],
      markImg: map_mark05,
      to: "B",
    },
    {
      lngLat: [120.66105083,30.30844531],
      markImg: map_mark08,
      to: "",
    },
    {
      lngLat: [120.89636186,30.61269418],
      markImg: map_mark03,
      to: "A",
    },
    {
      lngLat: [120.045622,30.79167664],
      markImg: map_mark04,
      to: "A",
    },
    {
      lngLat: [119.11342833,29.626331],
      markImg: map_mark05,
      to: "C",
    },
    {
      lngLat: [118.35319272,29.16900093],
      markImg: map_mark08,
      to: "C",
    },
    {
      lngLat: [121.33983263,28.29604606],
      markImg: map_mark01,
      to: "D",
    },
  ],
  [
    {
      lngLat: [119.78400715,30.60272968],
      markImg: map_mark03,
      to: "",//A
    },
    {
      lngLat: [121.23671543,29.40075844],
      markImg: map_mark04,
      to: "C",
    },
    {
      lngLat: [121.0281583,29.85086315],
      markImg: map_mark05, 
      to: "C",
    },
    {
      lngLat: [119.87030666,29.58854638],
      markImg: map_mark01,
      to: "B",
    },
    {
      lngLat: [121.43439725,28.51234538],
      markImg: map_mark03,
      to: "C",
    },
    {
      lngLat: [120.72933911,30.56846957],
      markImg: map_mark04,
      to: "",//D
    },
    {
      lngLat: [119.96018478,28.96195761],
      markImg: map_mark05,
      to: "B",
    },
    {
      lngLat: [118.79844126,28.54050274],
      markImg: map_mark01,
      to: "B",
    },
    {
      lngLat: [120.29732592,27.80749072],
      markImg: map_mark04,
      to: "C",
    }
  ],
  [
    {
      lngLat: [121.20503846,28.09706841],
      markImg: map_mark02,
      to: "A",
    },
    {
      lngLat: [121.91882702,29.52162644],
      markImg: map_mark06,
      to: "A",
    },
    {
      lngLat: [120.53090482,29.27114549],
      markImg: map_mark07,
      to: "B",
    },
    {
      lngLat: [119.202465,27.59742705],
      markImg: map_mark08,
      to: "C",
    },
    {
      lngLat: [121.24469338,30.20082414],
      markImg: map_mark01,
      to: "",//A
    },
    {
      lngLat: [120.75892061,30.44043857],
      markImg: map_mark02,
      to: "C",
    },
    {
      lngLat: [120.50116363,30.14940203],
      markImg: map_mark06,
      to: "C",
    },
    {
      lngLat: [119.70806523,30.28646798],
      markImg: map_mark05,
      to: "C",
    },
    {
      lngLat: [119.96582221,30.90089087],
      markImg: map_mark07,
      to: "A",
    },
    {
      lngLat: [119.31151603,28.91596816],
      markImg: map_mark08,
      to: "",//C
    },
    {
      lngLat: [120.30288903,27.98331796],
      markImg: map_mark07,
      to: "C",
    }
  ],
  [
    {
      lngLat: [119.90888819,31.04855588],
      markImg: map_mark01,
      to: "A",
    },
    {
      lngLat: [121.20087168,29.34709359],
      markImg: map_mark03,
      to: "D",
    },
    {
      lngLat: [121.20087168,30.16959237],
      markImg: map_mark05,
      to: "D",
    },
    {
      lngLat: [119.1583073,29.83926878],
      markImg: map_mark08,
      to: "D",
    },
    {
      lngLat: [118.33389879,29.18608402],
      markImg: map_mark01,
      to: "B",
    },
    {
      lngLat: [119.95810661,28.97101099],
      markImg: map_mark05,
      to: "D",
    },
    {
      lngLat: [120.16728489,29.70041937],
      markImg: map_mark08,
      to: "D",
    },
    {
      lngLat: [120.49950921,27.57312259],
      markImg: map_mark05,
      to: "C",
    },
    {
      lngLat: [120.74560131,28.61516227],
      markImg: map_mark08,
      to: "B",
    },
    {
      lngLat: [119.20752572,28.39890694],
      markImg: map_mark01,
      to: "B",
    },
    {
      lngLat: [120.4502908,28.8309732],
      markImg: map_mark05,
      to: "D",
    },
    {
      lngLat: [121.27469931,28.57194668],
      markImg: map_mark08,
      to: "C",
    },
    {
      lngLat: [121.61922824,29.34709359],
      markImg: map_mark05,
      to: "D",
    },
  ],
  [
    {
      lngLat: [119.40301702,29.43395688],
      markImg: map_mark01,
      to: "C",
    },
    {
      lngLat: [119.69600706,29.71607461],
      markImg: map_mark02,
      to: "C",
    },
    {
      lngLat: [120.08317248,30.0427027],
      markImg: map_mark03,
      to: "",//A
    },
    {
      lngLat: [120.32384287,30.5846942],
      markImg: map_mark04,
      to: "A",
    },
    {
      lngLat: [121.03539013,30.67473399],
      markImg: map_mark05,
      to: "A",
    },
    {
      lngLat: [119.34023343,30.0427027],
      markImg: map_mark06,
      to: "C",
    },
    {
      lngLat: [120.99353441,28.52776039],
      markImg: map_mark07,
      to: "B",
    },
    {
      lngLat: [121.4748752,29.68880738],
      markImg: map_mark08,
      to: "A",
    },
    {
      lngLat: [120.7842558,29.13277442],
      markImg: map_mark05,
      to: "B",
    },
    {
      lngLat: [120.29245108,28.54614571],
      markImg: map_mark04,
      to: "B",
    },
    {
      lngLat: [121.87250454,29.40661338],
      markImg: map_mark02,
      to: "C",
    },
    {
      lngLat: [122.18642245,30.03364416],
      markImg: map_mark05,
      to: "A",
    },
    {
      lngLat: [119.83203815,27.79898863],
      markImg: map_mark04,
      to: "B",
    },
    {
      lngLat: [119.16234662,28.38976836],
      markImg: map_mark02,
      to: "B",
    },
  ]
]

let mapCurrent = 0

/* 切换地图数据源 */
const renderMapDataChange = (index: number) => {
  mapCurrent = index
  // 重新渲染标记点
  renderMapMarkers();
  // 重新渲染目标区域
  generateMapTargetArea();
  // 重新生成飞线
  generateFlyLine();
}

const createMapGeometry = ()=>{
  // 计算地图中心位置，用于居中显示
  const centerPos = calculateGeoJsonCenter(mapGeoData as GeoJSON)
  lngLatToVector3.center(centerPos).scale(600).translate([6,5]);//scale(360).translate([1, 4])
  // 主体
  createMapGeometryShape({
    depth: 1,
    opacity: 0.8,
    bgColor: 0x101b31,
    positionZ: -1,
  })                   
  // 区域层
  createMapGeometryInsideShape({
    depth: 0.001,
    positionZ: 0,
    borderColor: 0xffffff,
    borderOpacity: 0.15,
  })
  // 主体边框01
  createMapGeometryShape({
    depth: 0.001,
    positionZ: -1,
    opacity: 0,
    borderColor: 0xffffff,
    borderOpacity: 0.4,
  })
  createMapGeometryShape({
    depth: 0.001,
    positionZ: -0.75,
    opacity: 0,
    borderColor: "#aaaaaa",
    borderOpacity: 0.3,
  })
  createMapGeometryShape({
    depth: 0.001,
    positionZ: -0.50,
    opacity: 0,
    borderColor: 0xaaaaaa,
    borderOpacity: 0.2,
  })
  createMapGeometryShape({
    depth: 0.001,
    positionZ: -0.25,
    opacity: 0,
    borderColor: 0xaaaaaa,
    borderOpacity: 0.1,
  })
  // 贴图
  createMapGeometryShape({
    depth: 0.001,
    positionZ: 0,
    opacity: 0,
    borderColor: '',
    texture: true,
  })
  // 边框
  createMapGeometryShape({
    depth: 0.001,
    positionZ: 0.04,
    opacity: 0,
    borderColor: '#1a8ed6',
    borderOpacity: 1,
    borderWidth: 1,
    isCreateData: true,
  })

  // 数据贴图 目标区域
  generateMapTargetArea()
  // 生成飞行线
  generateFlyLine()
  
  scene.rotation.x = -Math.PI / 2 // 旋转几何体（适配 Three.js 坐标系）
}

/* 创建地图几何体*/
interface MapGeometryOptions{
  depth?: number, // 地图厚度（3D 高度）
  bgColor?: number | string, // 地图背景颜色
  opacity?: number, // 地图透明度
  texture?: THREE.Texture | null | boolean,// 地图纹理
  borderColor?: number | string,// 地图边框颜色
  borderOpacity?: number,// 地图边框透明度
  borderWidth?: number,// 地图边框宽度
  insideLineColor?: number | string,// 地图内部线颜色
  positionX?: number,// 地图X轴位置
  positionY?: number,// 地图Y轴位置
  positionZ?: number,// 地图Z轴位置
  isCreateData?: boolean,// 是否创建数据贴图
}
const createMapGeometryShape = (options: MapGeometryOptions = {
  depth: 1,
  bgColor: "#ffffff",
  opacity: 0,
  positionX: 0,
  positionY: 0,
  positionZ: 0,
  borderWidth: 1,
  texture: null,
  isCreateData: false,
}) =>{
  // console.log(mapGeoData)   // 输出地图数据用于调试
  let {depth,bgColor,opacity,borderColor,texture,borderWidth,borderOpacity,isCreateData} = options as MapGeometryOptions
  if(!bgColor){
    bgColor = "#ffffff"
  }
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
      bevelEnabled: false, // 关闭倒角（简化）
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
      // 计算 UV 映射以确保贴图贴合
      // fixSeamUVs(geometry)
      adjustUVs(geometry, shapes)
      createMapTexture(geometry)
    }
    if(borderColor){
      createMapLine(geometry,mesh,borderColor,borderWidth,borderOpacity)
    }
    
    // 使用（在3D坐标上添加）
    if(isCreateData){
      renderMapMarkers()
    }
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
  bgColor: "#ffffff",
  positionX: 0,
  positionY: 0,
  positionZ: 0,
  borderWidth: 1,
}) =>{
  // console.log(mapGeoFullData)   // 输出地图数据用于调试
  const {depth,bgColor,opacity,borderColor,borderWidth,borderOpacity} = options as MapGeometryOptions
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
          color: borderColor, // 边缘线颜色（黑色，与填充色对比）
          linewidth: 1, // 线宽（注意：WebGL限制，默认1，多数浏览器不支持大于1）
          depthTest: false, // 禁用深度测试，确保线条始终显示在顶层
          transparent: true, // 启用透明度
          opacity: borderOpacity, // 描边透明度（0.5）
        });
        // 步骤4：创建线对象（LineSegments 适合闭合轮廓，无断点）
        const shapeLine = new THREE.LineSegments(edgeGeometry, lineMaterial);

        // 3. 线对象与Shape填充Mesh同步旋转/偏移（关键！保证描边贴合）
        // shapeLine.rotation.x = -Math.PI / 2; // 与地图Mesh同步旋转
        shapeLine.position.set(0, 0, (options.positionZ || 0)) // 放置在线条应在的层级之上一点，避免被其他元素遮挡

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
      opacity: 0,
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
      createMapLine(geometry,mesh,borderColor,borderWidth,borderOpacity)
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
const createMapLine = (geometry: THREE.ExtrudeGeometry,mesh: THREE.Mesh,color: number|string =0xffffff,width: number = 1,borderOpacity: number = 1) =>{
  // 添加边缘描边（关键步骤）
  const edges = new THREE.EdgesGeometry(geometry) // 提取边缘 
  const lineMaterial = new THREE.LineBasicMaterial({ 
    color,  // 描边颜色
    transparent: true,
    opacity: borderOpacity,
    linewidth: width,      // 线宽（部分浏览器支持有限）
    depthTest: false      // 禁用深度测试，确保线条始终显示在顶层
  })

  const wireframe = new THREE.LineSegments(edges, lineMaterial)
  mesh.add(wireframe) // 将线条作为子对象添加
}

// 修正 UV 映射
const fixSeamUVs = (geometry: THREE.ExtrudeGeometry) => {
  const uvAttribute = geometry.attributes.uv
  const posAttribute = geometry.attributes.position
  
  // 获取边界框用于归一化
  geometry.computeBoundingBox()
  const min = geometry.boundingBox!.min
  const max = geometry.boundingBox!.max
  const range = new THREE.Vector2(max.x - min.x, max.y - min.y)
  
  for (let i = 0; i < posAttribute.count; i++) {
    const x = posAttribute.getX(i)
    const y = posAttribute.getY(i)
    const z = posAttribute.getZ(i)
    
    // 判断是顶面/底面还是侧面
    const isTopFace = Math.abs(z - max.z) < 0.01
    const isBottomFace = Math.abs(z - min.z) < 0.01
    
    let u: number, v: number
    
    if (isTopFace || isBottomFace) {
      // 顶面和底面使用平面投影
      u = (x - min.x) / range.x
      v = (y - min.y) / range.y
    } else {
      // 侧面使用圆柱投影或保持原样
      u = (x - min.x) / range.x
      v = (z - min.z) / (max.z - min.z)
    }
    
    // 避免 UV 边缘重复（防止接缝闪烁）
    u = Math.min(Math.max(u, 0.001), 0.999)
    v = Math.min(Math.max(v, 0.001), 0.999)
    
    uvAttribute.setXY(i, u, v)
  }
  
  uvAttribute.needsUpdate = true
}

// 调整 UV 映射以确保贴图完全贴合
const adjustUVs = (geometry: THREE.ExtrudeGeometry, shapes: THREE.Shape[]) => {
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

/* 创建地图纹理 */
const createMapTexture = (geometry: THREE.ExtrudeGeometry) => {
  // 加载地图纹理贴图
  const textureLoader = new THREE.TextureLoader()
  const texture = textureLoader.load(textScreen, (tex) => {
    // 纹理加载完成后调整
    tex.colorSpace = THREE.SRGBColorSpace
    tex.wrapS = THREE.ClampToEdgeWrapping
    tex.wrapT = THREE.ClampToEdgeWrapping
    tex.flipY = false
    
    // 如果希望贴图覆盖整个形状而不重复
    tex.repeat.set(1, 1)
    tex.offset.set(0, 0)
  }) 
  // 3. 创建带纹理的材质
  let material: THREE.MeshStandardMaterial | THREE.MeshStandardMaterial[]

  // 创建数组材质：顶面/底面使用贴图，侧面使用纯色或贴图
  const sideMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x888888,
    roughness: 0.4,
    metalness: 0.1,
    polygonOffset: true, // 开启多边形偏移
    polygonOffsetFactor: 1,  // 顶面向前偏移
    polygonOffsetUnits: 1,
  })
  
  const faceMaterial = new THREE.MeshStandardMaterial({
    map: texture,
    roughness: 0.4,
    metalness: 0.1,
    polygonOffset: true,
    polygonOffsetFactor: -1,   // 侧面向后偏移
    polygonOffsetUnits: -1
  })
    // ExtrudeGeometry 材质索引：0=顶面/底面, 1=侧面
    material = [faceMaterial, sideMaterial]

  // 4. 创建网格
  const mesh = new THREE.Mesh(geometry, material)
  // mesh.rotation.x = -Math.PI / 2 // 旋转几何体（适配 Three.js 坐标系）
  scene.add(mesh)
}

/* 清除所有标记平面 */
const clearMapMarkPlanes = () => {
  mapMarkPlanes.forEach(plane => {
    scene.remove(plane); // 从场景中移除
    plane.geometry.dispose(); // 释放几何体内存
    if (plane.material) {
      const material = plane.material as THREE.Material;
      if ((material as THREE.MeshBasicMaterial).map) {
        if ((material as THREE.MeshBasicMaterial).map) {
          (material as THREE.MeshBasicMaterial).map!.dispose(); // 释放纹理内存
        }
      }
      material.dispose(); // 释放材质内存
    }
  });
  mapMarkPlanes = []; // 清空数组
}

/* 渲染地图标记点 */
const renderMapMarkers = () => {
  clearMapMarkPlanes(); // 先清除现有的标记点
  if (markDataList[mapCurrent]) {
    markDataList[mapCurrent].forEach((item: any) => {
      var point: [number, number] = lngLatToVector3(item.lngLat) || [0, 0];
      createMapMarkPlane(new THREE.Vector3(point[0], point[1], 0.5), item.markImg, { width: 2.4, height: 2.4 });
    });
  }
}

/* 创建地图数据平面点 */
interface CreateMapMarkPlaneOptions {
  width?: number;
  height?: number;
}

const createMapMarkPlane = (position: THREE.Vector3, textureUrl: any, options: CreateMapMarkPlaneOptions = {}) => {
  const { width = 1, height = 1 } = options;
  const geometry = new THREE.PlaneGeometry(width, height)
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
  mapMarkPlanes.push(plane) // 添加到标记平面数组中
  return plane
}

const enum AreaTypeEnum {
  STATUS01 = '01',
  STATUS02 = '02',
  STATUS03 = '03',
  STATUS04 = '04',
}

const AreaColorEnum: Record<AreaTypeEnum, string> = {
  [AreaTypeEnum.STATUS01]: '#33ef2b',
  [AreaTypeEnum.STATUS02]: '#5ee8f1',
  [AreaTypeEnum.STATUS03]: '#f2a824',
  [AreaTypeEnum.STATUS04]: '#ed3309',
}

interface AreaDataInter {
  [key: string]: {
    lngLat: [number, number];
    name: string;
    type: AreaTypeEnum;
    color?: string;
  }
}

const areaGeoData: AreaDataInter[] = [
  {
    A: {
      lngLat: [120.64822528, 30.25985951],
      name: "A目标区域",
      type: AreaTypeEnum.STATUS01
    },
    B: {
      lngLat: [121.6527629,29.43395688],
      name: "B目标区域",
      type: AreaTypeEnum.STATUS02
    },
    C: {
      lngLat: [119.09956311,29.23326748],
      name: "C目标区域",
      type: AreaTypeEnum.STATUS03
    },
    D: {
      lngLat: [120.32384334,28.25159646],
      name: "D目标区域",
      type: AreaTypeEnum.STATUS04
    },
    E: {
      lngLat: [120.4389466,29.35190464],
      name: "E目标区域",
      type: AreaTypeEnum.STATUS04
    },
  },
  {
    A: {
      lngLat: [119.78075747,30.72614701],
      name: "A目标区域",
      type: AreaTypeEnum.STATUS03
    },
    B: {
      lngLat: [119.30917859,29.81716855],
      name: "B目标区域",
      type: AreaTypeEnum.STATUS02
    },
    C: {
      lngLat: [121.44153527,29.77565201],
      name: "C目标区域",
      type: AreaTypeEnum.STATUS01
    },
    D: {
      lngLat: [120.7649221,30.63210045],
      name: "D目标区域",
      type: AreaTypeEnum.STATUS04
    },
  },
  {
    A: {
      lngLat: [121.29431219,30.22678602],
      name: "A目标区域",
      type: AreaTypeEnum.STATUS01
    },
    B: {
      lngLat: [121.4017543,28.43943396],
      name: "B目标区域",
      type: AreaTypeEnum.STATUS02
    },
    C: {
      lngLat: [119.13651637,28.75388448],
      name: "C目标区域",
      type: AreaTypeEnum.STATUS03
    },
  },
  {
    A: {
      lngLat: [120.42021622,30.22109907],
      name: "A目标区域",
      type: AreaTypeEnum.STATUS01
    },
    B: {
      lngLat: [119.91973506,29.01171939],
      name: "B目标区域",
      type: AreaTypeEnum.STATUS02
    },
    C: {
      lngLat: [120.18446769,28.39685409],
      name: "C目标区域",
      type: AreaTypeEnum.STATUS03
    },
    D: {
      lngLat: [120.47764571,29.30984207],
      name: "D目标区域",
      type: AreaTypeEnum.STATUS04
    },
  },
  {
    A: {
      lngLat: [120.20268327,30.18313014],
      name: "A目标区域",
      type: AreaTypeEnum.STATUS01
    },
    B: {
      lngLat: [120.58586836,28.07728914],
      name: "B目标区域",
      type: AreaTypeEnum.STATUS02
    },
    C: {
      lngLat: [118.79423781,29.00993314],
      name: "C目标区域",
      type: AreaTypeEnum.STATUS03
    },
  },
]

/* 创建目标区域 */
const drawTargetArea = (key: any) => {
  const AreaData = areaGeoData[mapCurrent];
  const areaItem = AreaData[key];
  const Point: [number, number] = lngLatToVector3(areaItem.lngLat as [number, number]) || [0, 0];
  const PositionZ = 0.6
  const AreaType: AreaTypeEnum = areaItem.type
  const CircleColor = areaItem.color || AreaColorEnum[AreaType]
  const AreaName = areaItem.name
  let ArrowUrl: any = null

  switch (AreaType) {
    case AreaTypeEnum.STATUS01:
      ArrowUrl = map_area01
      break;
    case AreaTypeEnum.STATUS02:  
      ArrowUrl = map_area02
      break;
    case AreaTypeEnum.STATUS03:  
      ArrowUrl = map_area03
      break;
    case AreaTypeEnum.STATUS04:  
      ArrowUrl = map_area04
      break;
    default:
      break;
  }

  /* 绘制圆点 */
  const createCircleRing = (point: [number, number], positionZ: number, color: any)=>{
    // 圆点
    const spotGeometry = new THREE.CircleGeometry(0.6, 200);// 圆点半径为1.4，200个分段
    const spotMaterial = new THREE.MeshBasicMaterial({
      color: color,
      side: THREE.DoubleSide,
    });
    const circle = new THREE.Mesh(spotGeometry, spotMaterial);
    circle.position.set(point[0], point[1], positionZ);

    // 圆环
    const ringGeometry = new THREE.RingGeometry(0.8, 1.2, 50);
    const ringMaterial = new THREE.MeshBasicMaterial({
      color: color,
      side: THREE.DoubleSide,
      transparent: true,
    });
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.position.set(point[0], point[1], positionZ);

    return {circle, ring}
  }
  // 箭头贴图
  const createArrow = (point: [number, number],positionZ: number,textUrl: any) => {
    const arrowGeometry = new THREE.PlaneGeometry(1.4, 1.4);
    const textureLoader = new THREE.TextureLoader()
    const texture = textureLoader.load(textUrl)
    const arrowMaterial = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      side: THREE.DoubleSide,
    });
    const arrow = new THREE.Mesh(arrowGeometry, arrowMaterial);
    arrow.rotation.x = Math.PI / 2; // 绕X轴旋转90度使贴图面向观察者
    arrow.position.set(point[0], point[1], positionZ+1);

    return arrow
  }
  // 顶部标题
  const createTitleBox = (point: [number, number],positionZ: number,title: string,color: any) => {
    // 创建Canvas来绘制带背景和边框的文本
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    
    // 设置画布尺寸
    canvas.width = 400;
    canvas.height = 120;
    
    // 绘制背景
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'; // 黑色半透明背景
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // 绘制红色边框
    /* ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, canvas.width, canvas.height); */
    ctx.beginPath()
    ctx.moveTo(0, canvas.height)           // 左下角
    ctx.lineTo(canvas.width, canvas.height)   // 右下角
    ctx.strokeStyle = color
    ctx.lineWidth = 10
    ctx.stroke()
    
    // 绘制文字
    ctx.font = 'bolder 50px Arial';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(title, canvas.width / 2, canvas.height / 2);
    
    // 创建纹理
    const texture = new THREE.CanvasTexture(canvas);
    const material = new THREE.MeshBasicMaterial({ 
      map: texture,
      transparent: true,
      side: THREE.DoubleSide
    });
    
    // 创建平面几何体
    const geometry = new THREE.PlaneGeometry(6.6, 2); // 
    const titleMesh = new THREE.Mesh(geometry, material);
    titleMesh.position.set(point[0], point[1], positionZ + 3);
    titleMesh.rotation.x = Math.PI / 2; // 绕X轴旋转90度使贴图面向观察者
    titleMesh.userData = { isBillboard: true }; // 添加标识，用于在动画循环中识别
    return titleMesh;
  }
  const {circle, ring} = createCircleRing(Point, PositionZ, CircleColor)
  const arrow = createArrow(Point, PositionZ, ArrowUrl)
  const title = createTitleBox(Point, PositionZ, AreaName, CircleColor)

  return { circle, ring, arrow, title };
}

let spotList:any = [] // 圆环
let arrowList:any = [] // 箭头
// 存储目标区域对象以便后续清理
let areaObject3DInstance: THREE.Object3D | null = null;

/* 清除现有的目标区域 */
const clearMapTargetAreas = () => {
  if (areaObject3DInstance) {
    // 从场景中移除
    scene.remove(areaObject3DInstance);
    // 清理内存
    areaObject3DInstance.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.geometry.dispose();
        if (child.material) {
          const materials = Array.isArray(child.material) ? child.material : [child.material];
          materials.forEach(material => {
            if (material.map) material.map.dispose(); // 释放纹理
            material.dispose(); // 释放材质
          });
        }
      }
    });
    // 清空数组
    arrowList = [];
    spotList = [];
  }
}

const generateMapTargetArea = ()=>{
  // 先清理现有的目标区域
  clearMapTargetAreas();
  
  // 创建新的目标区域对象
  areaObject3DInstance = new THREE.Object3D();
  const TempAreaData = areaGeoData[mapCurrent]
  for (const areaKey of Object.keys(TempAreaData)) {
    const areaTarget = drawTargetArea(areaKey)
    areaObject3DInstance.add(areaTarget.circle)
    areaObject3DInstance.add(areaTarget.ring)
    areaObject3DInstance.add(areaTarget.arrow)
    areaTarget.title && areaObject3DInstance.add(areaTarget.title)
    arrowList.push(areaTarget.arrow)
    spotList.push(areaTarget.ring)
  }
  scene.add(areaObject3DInstance)
}

const targetAreaAnimate = () => {
  spotList.forEach((mesh: any) => {
    mesh._s += 0.01;
    mesh.scale.set(1 * mesh._s, 1 * mesh._s, 1 * mesh._s);
    if (mesh._s <= 2) {
      mesh.material.opacity = 2 - mesh._s;
    } else {
      mesh._s = 1;
    }
  });
  // 箭头贴图动画
  arrowList.forEach((arrow: any) => {
    arrow.rotation.y += 0.01; // 沿Z轴持续旋转动画
  });
}

// 更新始终面向相机的标签
const updateBillboardObjects = () => {
  scene.traverse((obj) => {
    if (obj instanceof THREE.Mesh && obj.userData && obj.userData.isBillboard) {
      // 让对象始终面向相机
      obj.lookAt(camera.position);
    }
  });
}

/* 创建目标区域 标记位置 轨迹线 */
const drawFlyLineFunc = (StartPoint: [number, number], EndPoint: [number, number], PositionZ: number) => {
  StartPoint = StartPoint || [0, 0];
  EndPoint = EndPoint || [0, 0];
  PositionZ = PositionZ || 0.5

  // 创建一个小的球体来表示轨迹线上的点
  const drawFlyPoint = (curve: any) => {
    const geometry = new THREE.SphereGeometry(0.2); // 球体半径为0.2
    const material = new THREE.MeshBasicMaterial({
      color: "#f66a4a",
      side: THREE.DoubleSide,
    });
    const mesh: any = new THREE.Mesh(geometry, material);
    // 保存曲线实例
    mesh.curve = curve;
    mesh._s = 0;
    return mesh;
  };

  // 绘制两点链接轨迹线
  const [x0, y0, z0] = [...StartPoint, PositionZ];
  const [x1, y1, z1] = [...EndPoint, PositionZ];
  // 使用 QuadraticBezierCurve3 创建 三维二次贝塞尔曲线
  // 随机3-6范围高度
  const randomHeight = Math.floor(Math.random() * (6 - 3 + 1) + 3);
  const curve = new THREE.QuadraticBezierCurve3(
    new THREE.Vector3(x0, y0, z0),
    new THREE.Vector3((x0 + x1) / 2, (y0 + y1) / 2, randomHeight),
    new THREE.Vector3(x1, y1, z1)
  );

  const flyPoint = drawFlyPoint(curve);

  const lineGeometry = new THREE.BufferGeometry();
  // 获取曲线上50个点
  const points = curve.getPoints(50);
  const positions = [];
  const colors = [];
  const color = new THREE.Color();

  // 给每个顶点设置演示 实现渐变
  for (let j = 0; j < points.length; j++) {
    // 修改颜色偏向 #ed3309 (红橙色)，使用 HSL 值约为 H:0.07, S:0.79, L:0.57
    color.setHSL(0.07 + j * 0.0005, 0.79 - j * 0.002, 0.57 - j * 0.001); // 色
    colors.push(color.r, color.g, color.b);
    positions.push(points[j].x, points[j].y, points[j].z);
  }
  // 放入顶点 和 设置顶点颜色
  lineGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(new Float32Array(positions), 3, true)
  );
  lineGeometry.setAttribute(
    "color",
    new THREE.BufferAttribute(new Float32Array(colors), 3, true)
  );

  const material = new THREE.LineBasicMaterial({
    vertexColors: true,
    // color: "red",
    side: THREE.DoubleSide,
    linewidth: 2, // 设置线条宽度（注意：大部分浏览器只支持最大值为1）
  });
  const flyLine = new THREE.Line(lineGeometry, material);

  return { flyLine, flyPoint };

}
var flyLinePointList:any = [] // 轨迹线上的小点

// 清除现有的飞线
const clearFlyLines = () => {
  if (flyObject3DInstance) {
    // 从场景中移除
    scene.remove(flyObject3DInstance);
    // 清理内存
    flyObject3DInstance.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.geometry.dispose();
        if (child.material) {
          const materials = Array.isArray(child.material) ? child.material : [child.material];
          materials.forEach(material => {
            if (material.map) material.map.dispose(); // 释放纹理
            material.dispose(); // 释放材质
          });
        }
      }
    });
    // 清空数组
    flyLinePointList = [];
  }
}

const generateFlyLine = ()=>{
  // 先清理现有的飞线
  clearFlyLines();
  
  // 创建新的飞线对象
  flyObject3DInstance = new THREE.Object3D() as THREE.Object3D;
  const TempMarkData = markDataList[mapCurrent]
  const TempAreaData = areaGeoData[mapCurrent]
  TempMarkData.map((item: any)=>{
    if(item.to!==''){
      const StartPoint = lngLatToVector3(item.lngLat) || [0, 0];
      var tempEndLngLat = TempAreaData[item.to]
      const EndPoint = lngLatToVector3(tempEndLngLat.lngLat) || [0, 0];
      const PositionZ = 0.5
      
      const {flyLine, flyPoint} = drawFlyLineFunc(StartPoint, EndPoint, PositionZ)
      flyObject3DInstance?.add(flyLine)
      flyObject3DInstance?.add(flyPoint)
      flyLinePointList.push(flyPoint)
    }
  })
  scene.add(flyObject3DInstance)
  
}

const flyLineAnimate = () => {
  flyLinePointList.forEach((point: any) => {
    point._s += 0.003;
    let tankPosition = new THREE.Vector3();
    // getPointAt() 根据弧长在曲线上的位置。必须在范围[0，1]内。
    tankPosition = point.curve.getPointAt(point._s % 1);
    point.position.set(tankPosition.x, tankPosition.y, tankPosition.z);
  })
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
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.8)
  scene.add(ambientLight)
  
  // 方向光：模拟太阳光，产生阴影与立体感
  const directionalLight = new THREE.DirectionalLight(0x333333, 0.3)
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
  // 目标区域动画
  targetAreaAnimate()
  // 轨迹线动画
  flyLineAnimate()
  // 更新始终面向相机的标签
  updateBillboardObjects()
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
  resetView,
  renderMapDataChange
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

