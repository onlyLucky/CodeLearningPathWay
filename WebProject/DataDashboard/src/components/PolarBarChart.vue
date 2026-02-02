<template>
  <div class="charPolar" ref="chartRef"></div>
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
  var colorArr = []
  props.data.map(item => {
    dataArr.push(item.value)
    titleArr.push(item.title)
    colorArr.push(item.color)
  });

  const option = {
    /* title: [
      {
        text: 'Tangential Polar Bar Label Position (middle)'
      }
    ], */
    polar: {
      radius: [2, '94%']
    },
    angleAxis: {
      show:false,
      max: 100,
      startAngle: 75
    },
    radiusAxis: {
      show:false,
      type: 'category',
      data: titleArr
    },
    tooltip: {},
    series: {
      type: 'bar',
      roundCap: true,
      data: dataArr,
      barCategoryGap: 1,
      colorBy: "data",
      color: colorArr,
      coordinateSystem: 'polar',
      showBackground: true,
      label: {
        show: false,
        position: 'middle',
        formatter: '{b}: {c}'
      },
      animation: true,
      animationDuration: 2000,
      animationEasing: 'cubicOut',
      animationDelay: function (idx) {
        return idx * 100
      }
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
.charPolar {
  width: 100%;
  height: 100%;
  min-width: px2rem(130);
  min-height: px2rem(130);
}
</style>