/* 处理地图数据工具函数 */

/* 定义 GeoJSON 接口类型 */
interface GeoJSONPoint {
  type: 'Point'
  coordinates: [number, number] | [number, number, number]
}

interface GeoJSONLineString {
  type: 'LineString'
  coordinates: [number, number][] | [number, number, number][]
}

interface GeoJSONPolygon {
  type: 'Polygon'
  coordinates: [number, number][][] | [number, number, number][][]
}

interface GeoJSONMultiPoint {
  type: 'MultiPoint'
  coordinates: [number, number][] | [number, number, number][]
}

interface GeoJSONMultiLineString {
  type: 'MultiLineString'
  coordinates: [number, number][][] | [number, number, number][][]
}

interface GeoJSONMultiPolygon {
  type: 'MultiPolygon'
  coordinates: [number, number][][][] | [number, number, number][][][]
}

interface GeoJSONGeometry {
  type: string
  coordinates: any
}

interface GeoJSONFeature {
  type: 'Feature'
  geometry: GeoJSONGeometry
  properties?: any
}

interface GeoJSONFeatureCollection {
  type: 'FeatureCollection'
  features: GeoJSONFeature[]
}

export interface GeoJSON {
  type: string
  features?: GeoJSONFeature[]
  geometry?: GeoJSONGeometry
  coordinates?: any
}

/**
 * 计算单个坐标数组的中心点
 * @param coordinates 坐标数组，格式为 [[lng1, lat1], [lng2, lat2], ...]
 * @returns 中心点坐标 [lng, lat]
 */
const calculateCoordinatesCenter = (coordinates: [number, number][]): [number, number] => {
  if (coordinates.length === 0) return [0, 0]
  
  let sumLng = 0
  let sumLat = 0
  
  coordinates.forEach(([lng, lat]) => {
    sumLng += lng
    sumLat += lat
  })
  
  return [sumLng / coordinates.length, sumLat / coordinates.length]
}

/**
 * 计算多边形坐标的中心点
 * @param coordinates 多边形坐标数组，格式为 [[[lng1, lat1], [lng2, lat2], ...]]
 * @returns 中心点坐标 [lng, lat]
 */
const calculatePolygonCenter = (coordinates: [number, number][][]): [number, number] => {
  if (coordinates.length === 0) return [0, 0]
  
  const flattened: [number, number][] = []
  coordinates.forEach(ring => {
    ring.forEach(coord => flattened.push(coord))
  })
  
  return calculateCoordinatesCenter(flattened)
}

/**
 * 计算多多边形坐标的中心点
 * @param coordinates 多多边形坐标数组，格式为 [[[[lng1, lat1], ...]], [[[lng2, lat2], ...]]]
 * @returns 中心点坐标 [lng, lat]
 */
const calculateMultiPolygonCenter = (coordinates: [number, number][][][]): [number, number] => {
  if (coordinates.length === 0) return [0, 0]
  
  const flattened: [number, number][] = []
  coordinates.forEach(polygon => {
    polygon.forEach(ring => {
      ring.forEach(coord => flattened.push(coord))
    })
  })
  
  return calculateCoordinatesCenter(flattened)
}

/**
 * 计算 GeoJSON 几何体的中心点
 * @param geometry GeoJSON 几何体对象
 * @returns 中心点坐标 [lng, lat]
 */
const calculateGeometryCenter = (geometry: GeoJSONGeometry): [number, number] => {
  const { type, coordinates } = geometry
  
  switch (type) {
    case 'Point':
      return coordinates as [number, number]
    
    case 'MultiPoint':
      return calculateCoordinatesCenter(coordinates as [number, number][])
    
    case 'LineString':
      return calculateCoordinatesCenter(coordinates as [number, number][])
    
    case 'MultiLineString':
      const flattenedLines: [number, number][] = []
      ;(coordinates as [number, number][][]).forEach(line => {
        line.forEach(coord => flattenedLines.push(coord))
      })
      return calculateCoordinatesCenter(flattenedLines)
    
    case 'Polygon':
      return calculatePolygonCenter(coordinates as [number, number][][])
    
    case 'MultiPolygon':
      return calculateMultiPolygonCenter(coordinates as [number, number][][][])
    
    default:
      return [0, 0]
  }
}

/**
 * 计算 GeoJSON Feature 的中心点
 * @param feature GeoJSON Feature 对象
 * @returns 中心点坐标 [lng, lat]
 */
export const calculateFeatureCenter = (feature: GeoJSONFeature): [number, number] => {
  if (!feature.geometry) return [0, 0]
  return calculateGeometryCenter(feature.geometry)
}

/**
 * 计算 GeoJSON 数据的中心点
 * @param geoJson GeoJSON 数据对象（可以是 Feature、FeatureCollection 或 Geometry）
 * @returns 中心点坐标 [lng, lat]
 */
export const calculateGeoJsonCenter = (geoJson: GeoJSON): [number, number] => {
  const { type, features, geometry, coordinates } = geoJson
  
  switch (type) {
    case 'Feature':
      if (geometry) {
        return calculateGeometryCenter(geometry)
      }
      return [0, 0]
    
    case 'FeatureCollection':
      if (!features || features.length === 0) return [0, 0]
      
      const allCenters: [number, number][] = []
      features.forEach(feature => {
        const center = calculateFeatureCenter(feature)
        allCenters.push(center)
      })
      
      return calculateCoordinatesCenter(allCenters)
    
    case 'Point':
      return coordinates as [number, number]
    
    case 'MultiPoint':
      return calculateCoordinatesCenter(coordinates as [number, number][])
    
    case 'LineString':
      return calculateCoordinatesCenter(coordinates as [number, number][])
    
    case 'MultiLineString':
      const flattenedLines: [number, number][] = []
      ;(coordinates as [number, number][][]).forEach(line => {
        line.forEach(coord => flattenedLines.push(coord))
      })
      return calculateCoordinatesCenter(flattenedLines)
    
    case 'Polygon':
      return calculatePolygonCenter(coordinates as [number, number][][])
    
    case 'MultiPolygon':
      return calculateMultiPolygonCenter(coordinates as [number, number][][][])
    
    default:
      return [0, 0]
  }
}

/**
 * 获取 GeoJSON 数据的边界框
 * @param geoJson GeoJSON 数据对象
 * @returns 边界框 { minLng, minLat, maxLng, maxLat }
 */
export const getGeoJsonBounds = (geoJson: GeoJSON): {
  minLng: number
  minLat: number
  maxLng: number
  maxLat: number
} => {
  let minLng = Infinity
  let minLat = Infinity
  let maxLng = -Infinity
  let maxLat = -Infinity

  const processCoordinates = (coords: [number, number][]) => {
    coords.forEach(([lng, lat]) => {
      minLng = Math.min(minLng, lng)
      minLat = Math.min(minLat, lat)
      maxLng = Math.max(maxLng, lng)
      maxLat = Math.max(maxLat, lat)
    })
  }

  const { type, features, geometry, coordinates } = geoJson

  if (type === 'FeatureCollection' && features) {
    features.forEach(feature => {
      if (feature.geometry && feature.geometry.coordinates) {
        processCoordinates(feature.geometry.coordinates as [number, number][])
      }
    })
  } else if (geometry && geometry.coordinates) {
    processCoordinates(geometry.coordinates as [number, number][])
  } else if (coordinates) {
    processCoordinates(coordinates as [number, number][])
  }

  return { minLng, minLat, maxLng, maxLat }
}

/**
 * 计算边界框的中心点
 * @param bounds 边界框对象
 * @returns 中心点坐标 [lng, lat]
 */
export const calculateBoundsCenter = (bounds: {
  minLng: number
  minLat: number
  maxLng: number
  maxLat: number
}): [number, number] => {
  return [
    (bounds.minLng + bounds.maxLng) / 2,
    (bounds.minLat + bounds.maxLat) / 2
  ]
}
