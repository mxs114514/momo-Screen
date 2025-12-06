<script setup lang="ts">
import { ref } from 'vue';
import ItemWrap from '@/components/item-wrap/item-wrap.vue';
import ChartModal from "@/components/chart-modal.vue";
import StrategyLibrary from './components/strategy-library.vue';
import TuningLogs from './components/tuning-logs.vue';
import VisualOrchestration from './components/visual-orchestration.vue';
import DigitalSandbox from './components/digital-sandbox.vue';
import RlProcess from './components/rl-process.vue';
import BenefitPrediction from './components/benefit-prediction.vue';

const modalVisible = ref(false);
const modalTitle = ref('');

const handleChartZoom = (title: string) => {
  modalTitle.value = title;
  modalVisible.value = true;
};

const handleModalClose = () => {
  modalVisible.value = false;
  modalTitle.value = '';
};
</script>

<template>
  <div class="page-container">
    <!-- 左侧面板 -->
    <div class="col-left">
      <ItemWrap title="策略库管理" class="h-50" @zoom="handleChartZoom('策略库管理')">
        <StrategyLibrary />
      </ItemWrap>
      <ItemWrap title="参数调整日志" class="h-50" @zoom="handleChartZoom('参数调整日志')">
        <TuningLogs />
      </ItemWrap>
    </div>

    <!-- 中间面板 -->
    <div class="col-center">
      <ItemWrap title="可视化策略编排" class="h-65" @zoom="handleChartZoom('可视化策略编排')">
        <VisualOrchestration />
      </ItemWrap>
      <ItemWrap title="多目标优化仿真器" class="h-35" @zoom="handleChartZoom('多目标优化仿真器')">
        <DigitalSandbox />
      </ItemWrap>
    </div>

    <!-- 右侧面板 -->
    <div class="col-right">
      <ItemWrap title="强化学习自调优过程" class="h-50" @zoom="handleChartZoom('强化学习自调优过程')">
        <RlProcess />
      </ItemWrap>
      <ItemWrap title="节能收益预测" class="h-50" @zoom="handleChartZoom('节能收益预测')">
        <BenefitPrediction />
      </ItemWrap>
    </div>
  </div>

  <ChartModal 
    :visible="modalVisible" 
    :title="modalTitle" 
    @close="handleModalClose"
  >
    <StrategyLibrary v-if="modalTitle === '策略库管理'" />
    <TuningLogs v-if="modalTitle === '参数调整日志'" />
    <VisualOrchestration v-if="modalTitle === '可视化策略编排'" />
    <DigitalSandbox v-if="modalTitle === '多目标优化仿真器'" />
    <RlProcess v-if="modalTitle === '强化学习自调优过程'" />
    <BenefitPrediction v-if="modalTitle === '节能收益预测'" />
  </ChartModal>
</template>

<style scoped lang="scss">
.page-container {
  width: 100%;
  height: 90%; /* 减去头部高度 */
  padding: 10px 20px 20px;
  display: flex;
  gap: 20px;
  box-sizing: border-box;
}

.col-left, .col-right {
  width: 28%;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.col-center {
  width: 44%;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.h-50 { height: 50%; } /* 留出 gap 空间 */
.h-65 { height: 90%; }
.h-35 { height: 32%; }

:deep(.item_title_content) {
  padding: 8px;
  box-sizing: border-box;
}
</style>