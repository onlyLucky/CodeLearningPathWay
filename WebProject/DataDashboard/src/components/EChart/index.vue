<template>
  <div ref="chartRef" class="chart-container"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import * as echarts from 'echarts'
import type { EChartsCoreOption as EChartsOption, ECharts } from 'echarts'

interface Props {
  option: EChartsOption
  theme?: string
  autoResize?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  theme: 'dark',
  autoResize: true
})

const chartRef = ref<HTMLElement>()
let chartInstance: ECharts | null = null

const initChart = () => {
  if (!chartRef.value) return
  
  chartInstance = echarts.init(chartRef.value, props.theme)
  chartInstance.setOption(props.option)
}

const resizeChart = () => {
  if (chartInstance) {
    chartInstance.resize()
  }
}

watch(
  () => props.option,
  (newOption) => {
    if (chartInstance) {
      chartInstance.setOption(newOption, true)
    }
  },
  { deep: true }
)

onMounted(() => {
  nextTick(() => {
    initChart()
    if (props.autoResize) {
      window.addEventListener('resize', resizeChart)
    }
  })
})

onUnmounted(() => {
  if (chartInstance) {
    chartInstance.dispose()
    chartInstance = null
  }
  if (props.autoResize) {
    window.removeEventListener('resize', resizeChart)
  }
})

defineExpose({
  resize: resizeChart,
  getInstance: () => chartInstance
})
</script>

<style scoped>
.chart-container {
  width: 100%;
  height: 100%;
}
</style>
