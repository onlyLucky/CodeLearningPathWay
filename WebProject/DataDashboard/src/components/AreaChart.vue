<template>
  <div class="charArea" ref="chartRef"></div>
</template>
<script setup>
import * as echarts from "echarts";
import { onMounted, ref, watch, onUnmounted, nextTick } from 'vue';

const chartRef = ref(null);
let chartInstance = null;

const props = defineProps({
  data: {
    type: Array,
    default: ()=>[]
  },
  titles: {
    type: Array,
    default: ()=>[]
  }
});

// 初始化图表
const initChart = () => {
  if (!chartRef.value) return;
  
  chartInstance = echarts.init(chartRef.value);
  
  updateChart();
  
  // 响应式
  window.addEventListener('resize', handleResize);
};

// 窗口大小改变
const handleResize = () => {
  chartInstance?.resize();
};

const updateChart = ()=>{
  if (!chartInstance) return;
  var dataArr = []
  var titleArr = []
  props.data.map(item => {
    dataArr.push(item.value)
    titleArr.push(item.title)
  });

  const option = {
    backgroundColor:'',
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross'
      }
    },
    textStyle: {
      color: '#99B3C8'
    },
    xAxis: {
      type: 'category',
      boundaryGap: true,
      data: props.titles,
      axisLine:{
        lineStyle:{
          color: "#99B3C8"
        }
      },
    },
    yAxis: {
      type: 'value',
      axisTick: {
        lineStyle: {
          
        }
      },
      splitLine: {
        lineStyle:{
          color: "#99B3C8",
          opacity: 0.5,
          type: "dashed",
        }
      }
    },
    series: [
      {
        data: props.data,
        type: 'line',
        itemStyle: {
          color: '#3F91D8'
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: 'rgba(10, 71, 118, 0.71)'
            },
            {
              offset: 1,
              color: 'rgba(10, 71, 118, 0)'
            }
          ])
        },
      }
    ],
    grid: {
      left: '40px',
      right: '20px',
      top: '20px',
      bottom: '20px'
    }
  }

  chartInstance.setOption(option);
}

// 监听数据变化
watch(() => props.data, () => {
  updateChart();
}, { deep: true });

onMounted(() => {
  nextTick(() => {
    initChart();
  });
});
onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
  chartInstance?.dispose();
  chartInstance = null;
});
</script>

<style scoped lang="scss">
.charArea {
  width: 100%;
  height: 100%;
  min-width: px2rem(260);
  min-height: px2rem(160);
}
</style>