<script setup lang="ts">
import { ref, onMounted } from 'vue';
import * as echarts from 'echarts';

const option = ref({});

onMounted(() => {
  const hours = Array.from({ length: 24 }, (_, i) => `${i}:00`);
  const data1 = Array.from({ length: 24 }, () => Math.floor(Math.random() * 20));
  const data2 = Array.from({ length: 24 }, () => Math.floor(Math.random() * 3)); // 减少紧急告警数量

  option.value = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['一般告警', '紧急告警'],
      textStyle: { color: '#fff' },
      top: 0
    },
    grid: {
      top: '30px',
      left: '10px',
      right: '10px',
      bottom: '10px',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: hours,
      axisLine: { lineStyle: { color: '#fff' } },
      axisLabel: { color: '#fff' }
    },
    yAxis: {
      type: 'value',
      axisLine: { lineStyle: { color: '#fff' } },
      axisLabel: { color: '#fff' },
      splitLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } }
    },
    series: [
      {
        name: '一般告警',
        type: 'line',
        smooth: true,
        data: data1,
        itemStyle: { color: '#faad14' },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(250, 173, 20, 0.5)' },
            { offset: 1, color: 'rgba(250, 173, 20, 0.1)' }
          ])
        }
      },
      {
        name: '紧急告警',
        type: 'line',
        smooth: true,
        data: data2,
        itemStyle: { color: '#ff4d4f' },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(255, 77, 79, 0.5)' },
            { offset: 1, color: 'rgba(255, 77, 79, 0.1)' }
          ])
        }
      }
    ]
  };
});
</script>

<template>
  <div class="trend-container">
    <v-chart class="chart" :option="option" autoresize />
  </div>
</template>

<style scoped lang="scss">
.trend-container {
  width: 100%;
  height: 90%;
  margin-top: 2%;
}
.chart {
  width: 100%;
  height: 100%;
}
</style>