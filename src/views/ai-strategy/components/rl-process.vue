<script setup lang="ts">
import { ref, onMounted } from 'vue';
import VChart from 'vue-echarts';
import * as echarts from 'echarts';

const option = ref({});

onMounted(() => {
  const data = [];
  let value = 0;
  for (let i = 0; i < 100; i++) {
    value = value + Math.random() * 2 - 0.8; // 总体向上趋势
    if (value < 0) value = 0;
    data.push(value.toFixed(2));
  }

  option.value = {
    backgroundColor: 'transparent',
    grid: {
      top: 30,
      bottom: 20,
      left: 40,
      right: 20
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'cross' }
    },
    xAxis: {
      type: 'category',
      data: Array.from({ length: 100 }, (_, i) => i),
      axisLine: { lineStyle: { color: '#aaa' } },
      axisLabel: { show: false }
    },
    yAxis: {
      type: 'value',
      splitLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } },
      axisLine: { lineStyle: { color: '#aaa' } },
      axisLabel: { color: '#aaa' }
    },
    series: [
      {
        name: 'Reward',
        type: 'line',
        data: data,
        smooth: true,
        showSymbol: false,
        lineStyle: {
          color: '#722ed1',
          width: 2
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(114, 46, 209, 0.5)' },
            { offset: 1, color: 'rgba(114, 46, 209, 0.01)' }
          ])
        }
      }
    ]
  };
});
</script>

<template>
  <div class="chart-container">
    <v-chart class="chart" :option="option" autoresize />
  </div>
</template>

<style scoped>
.chart-container {
  width: 100%;
  height: 100%;
}
.chart {
  width: 100%;
  height: 100%;
}
</style>