<script setup lang="ts">
import { ref, onMounted } from 'vue';
import ItemWrap from "@/components/item-wrap";
import ChartModal from "@/components/chart-modal.vue";
import AlarmList from "./components/alarm-list.vue";
import AlarmMap from "./components/alarm-map.vue";
import FaultDiagnosis from "./components/fault-diagnosis.vue";
import FaultStats from "./components/fault-stats.vue";
import WarningTrend from "./components/warning-trend.vue";

// 模拟数据生成
interface AlarmData {
  id: string;
  level: 'High' | 'Medium' | 'Low';
  desc: string;
  time: string;
  status: string;
  area: string;
}

const alarmData = ref<AlarmData[]>([]);

const generateData = () => {
  const data: AlarmData[] = [];
  const areas = ['冰滑梯', '摩天轮', '城堡', '餐饮区', '入口', '停车场', '制冷机房', '变电所'];
  const descs = ['电压异常波动', '温度超过阈值', '设备离线', '信号丢失', '人员聚集预警', '烟雾报警', '水压异常', '门禁异常开启'];
  const statuses = ['未处理', '处理中', '已处理'];

  const getLevel = () => {
    const rand = Math.random();
    if (rand < 0.05) return 'High'; // 5% 概率
    if (rand < 0.35) return 'Medium'; // 30% 概率
    return 'Low'; // 65% 概率
  };

  for (let i = 0; i < 60; i++) {
    data.push({
      id: `ALM-${20231206001 + i}`,
      level: getLevel(),
      desc: `${areas[Math.floor(Math.random() * areas.length)]} - ${descs[Math.floor(Math.random() * descs.length)]}`,
      time: `12-06 ${Math.floor(Math.random() * 24).toString().padStart(2, '0')}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      area: areas[Math.floor(Math.random() * areas.length)]
    });
  }
  return data;
};

onMounted(() => {
  alarmData.value = generateData();
});

// 弹窗逻辑
const modalVisible = ref(false);
const modalTitle = ref('');

const handleZoom = (title: string) => {
  modalTitle.value = title;
  modalVisible.value = true;
};

const handleModalClose = () => {
  modalVisible.value = false;
  modalTitle.value = '';
};
</script>

<template>
  <div class="warning-page">
    <div class="left-panel">
      <ItemWrap 
        class="full-height" 
        title="实时告警列表"
        @zoom="handleZoom('实时告警列表')"
      >
        <AlarmList :data="alarmData" />
      </ItemWrap>
    </div>
    
    <div class="center-panel">
      <ItemWrap 
        class="map-height" 
        title="园区告警分布"
        @zoom="handleZoom('园区告警分布')"
      >
        <AlarmMap />
      </ItemWrap>
      <ItemWrap 
        class="trend-height" 
        title="24小时告警趋势"
        @zoom="handleZoom('24小时告警趋势')"
      >
        <WarningTrend />
      </ItemWrap>
    </div>
    
    <div class="right-panel">
      <ItemWrap 
        class="half-height" 
        title="故障诊断与处置"
        @zoom="handleZoom('故障诊断与处置')"
      >
        <FaultDiagnosis />
      </ItemWrap>
      <ItemWrap 
        class="half-height" 
        title="历史故障统计"
        @zoom="handleZoom('历史故障统计')"
      >
        <FaultStats />
      </ItemWrap>
    </div>

    <ChartModal 
      :visible="modalVisible" 
      :title="modalTitle" 
      @close="handleModalClose"
    >
      <AlarmList v-if="modalTitle === '实时告警列表'" :data="alarmData" />
      <AlarmMap v-if="modalTitle === '园区告警分布'" />
      <WarningTrend v-if="modalTitle === '24小时告警趋势'" />
      <FaultDiagnosis v-if="modalTitle === '故障诊断与处置'" />
      <FaultStats v-if="modalTitle === '历史故障统计'" />
    </ChartModal>
  </div>
</template>

<style scoped lang="scss">
.warning-page {
  width: 100%;
  height: 90%; // 增加高度，减少顶部预留空间
  display: flex;
  justify-content: space-between;
  padding: 10px 20px 10px 20px; // 减少底部内边距
  box-sizing: border-box;
  gap: 20px;
}

.left-panel {
  width: 25%;
  display: flex;
  flex-direction: column;
}

.center-panel {
  width: 45%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.right-panel {
  width: 25%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.full-height {
  height: 100%;
}

.map-height {
  height: 65%;
}

.trend-height {
  height: 33%;
}

.half-height {
  height: 49%;
}
</style>