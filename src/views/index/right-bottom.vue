<script setup lang="ts">
import { ref, onMounted } from "vue";

const option = ref({});

const getData = () => {
  // 硬编码数据，确保所有项都在90以上
  const data = {
    indicator: [
      { name: '制冷机组', max: 100 },
      { name: '造雪机', max: 100 },
      { name: '灯光系统', max: 100 },
      { name: '新风系统', max: 100 },
      { name: '电力设施', max: 100 },
      { name: '安防监控', max: 100 }
    ],
    data: [
      {
        value: [95, 92, 97, 93, 96, 94],
        name: '健康评分'
      }
    ]
  };

  option.value = {
    tooltip: {
      trigger: 'item'
    },
    radar: {
      indicator: data.indicator,
      radius: '65%',
      center: ['50%', '50%'],
      splitNumber: 4,
      axisName: {
        color: '#fff',
        backgroundColor: '#666',
        borderRadius: 3,
        padding: [3, 5]
      },
      splitArea: {
        areaStyle: {
          color: ['rgba(114, 172, 209, 0.2)', 'rgba(114, 172, 209, 0.4)', 'rgba(114, 172, 209, 0.6)', 'rgba(114, 172, 209, 0.8)'],
          shadowColor: 'rgba(0, 0, 0, 0.3)',
          shadowBlur: 10
        }
      },
      axisLine: {
        lineStyle: {
          color: 'rgba(255, 255, 255, 0.5)'
        }
      },
      splitLine: {
        lineStyle: {
          color: 'rgba(255, 255, 255, 0.5)'
        }
      }
    },
    series: [
      {
        name: '设备健康评分',
        type: 'radar',
        data: data.data,
        symbol: 'circle',
        symbolSize: 6,
        itemStyle: {
          color: '#F48C02'
        },
        areaStyle: {
          color: 'rgba(244, 140, 2, 0.5)'
        },
        lineStyle: {
          width: 2,
          color: '#F48C02'
        }
      }
    ]
  };
};

onMounted(() => {
  getData();
});
</script>

<template>
  <div class="right-bottom-box">
    <v-chart class="chart" :option="option" v-if="JSON.stringify(option) != '{}'" />
  </div>
</template>

<style scoped lang="scss">
.right-bottom-box {
  width: 100%;
  height: 90%;
  margin-bottom: 10%;
}

.chart {
  height: 100%;
  width: 100%;
}
</style>
