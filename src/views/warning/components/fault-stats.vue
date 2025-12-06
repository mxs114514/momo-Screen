<script setup lang="ts">
import { ref, onMounted } from 'vue';
import * as echarts from 'echarts';

const option = ref({});

onMounted(() => {
  option.value = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' }
    },
    grid: {
      top: '15%',
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: ['电力', '制冷', '网络', '照明', '安防'],
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
        name: '故障次数',
        type: 'bar',
        barWidth: '40%',
        data: [12, 8, 15, 5, 3],
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#00eaff' },
            { offset: 1, color: '#005bea' }
          ])
        }
      }
    ]
  };
});
</script>

<template>
  <div class="stats-container">
    <v-chart class="chart" :option="option" autoresize />
  </div>
</template>

<style scoped lang="scss">
.stats-container {
  width: 100%;
  height: 90%;
  margin-top: 2%;
}
.chart {
  width: 100%;
  height: 100%;
}
</style>