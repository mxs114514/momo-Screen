<script setup lang="ts">
import { ref, onMounted } from 'vue';
import VChart from 'vue-echarts';

const option = ref({});

onMounted(() => {
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
      axisPointer: { type: 'shadow' }
    },
    legend: {
      data: ['人工模式', 'AI 优化模式'],
      textStyle: { color: '#ccc' },
      top: 0,
      right: 0,
      itemWidth: 10,
      itemHeight: 10
    },
    xAxis: {
      type: 'category',
      data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      axisLine: { lineStyle: { color: '#aaa' } },
      axisLabel: { color: '#aaa' }
    },
    yAxis: {
      type: 'value',
      name: '能耗 (kWh)',
      nameTextStyle: { color: '#aaa' },
      splitLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } },
      axisLine: { lineStyle: { color: '#aaa' } },
      axisLabel: { color: '#aaa' }
    },
    series: [
      {
        name: '人工模式',
        type: 'bar',
        data: [120, 132, 101, 134, 90, 230, 210],
        itemStyle: { color: '#faad14' }
      },
      {
        name: 'AI 优化模式',
        type: 'bar',
        data: [100, 110, 85, 110, 80, 190, 180],
        itemStyle: { color: '#52c41a' }
      },
      {
        name: '节能收益',
        type: 'line',
        yAxisIndex: 0,
        data: [20, 22, 16, 24, 10, 40, 30],
        lineStyle: { color: '#00eaff', type: 'dashed' },
        itemStyle: { color: '#00eaff' }
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
  height: 90%;
}
.chart {
  width: 100%;
  height: 90%;
}
</style>