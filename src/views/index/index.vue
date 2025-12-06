<script setup lang="ts">
import { ref } from 'vue';
import ItemWrap from "@/components/item-wrap";
import ChartModal from "@/components/chart-modal.vue";
import LeftTop from "./left-top.vue";
import LeftCenter from "./left-center.vue";
import LeftBottom from "./left-bottom.vue";
import CenterMap from "./center-map.vue";
import CenterBottom from "./center-bottom.vue";
import RightTop from "./right-top.vue";
import RightCenter from "./right-center.vue";
import RightBottom from "./right-bottom.vue";

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
  <div class="index-box">
    <div class="contetn_left">
      <ItemWrap 
        class="contetn_left-top contetn_lr-item" 
        title="环境监测"
        @zoom="handleChartZoom('环境监测')"
      >
        <LeftTop />
      </ItemWrap>
      <ItemWrap
        class="contetn_left-center contetn_lr-item"
        title="能源概览"
        @zoom="handleChartZoom('能源概览')"
      >
        <LeftCenter />
      </ItemWrap>
    </div>
    <div class="contetn_center">
      <ItemWrap class="contetn_center_top" title="园区3D数字孪生">
        <CenterMap />
      </ItemWrap>
      <ItemWrap 
        class="contetn_center-bottom" 
        title="趋势与日志"
        @zoom="handleChartZoom('趋势与日志')"
      >
        <CenterBottom />
      </ItemWrap>
    </div>
    <div class="contetn_right">
      <ItemWrap
        class="contetn_right-top contetn_lr-item"
        title="设备实时状态"
        @zoom="handleChartZoom('设备实时状态')"
      >
        <RightTop />
      </ItemWrap>
      <ItemWrap
        class="contetn_right-center contetn_lr-item"
        title="关键设备监控"
        style="padding: 0 10px 16px 10px"
        @zoom="handleChartZoom('关键设备监控')"
      >
        <RightCenter />
      </ItemWrap>
      <ItemWrap
        class="contetn_right-bottom contetn_lr-item"
        title="设备健康度"
        @zoom="handleChartZoom('设备健康度')"
      >
        <RightBottom />
      </ItemWrap>
    </div>
  </div>

  <ChartModal 
    :visible="modalVisible" 
    :title="modalTitle" 
    @close="handleModalClose"
  >
    <LeftTop v-if="modalTitle === '环境监测'" />
    <LeftCenter v-if="modalTitle === '能源概览'" />
    <CenterBottom v-if="modalTitle === '趋势与日志'" />
    <RightTop v-if="modalTitle === '设备实时状态'" />
    <RightCenter v-if="modalTitle === '关键设备监控'" />
    <RightBottom v-if="modalTitle === '设备健康度'" />
  </ChartModal>
</template>

<style scoped lang="scss">
.index-box {
  width: 100%;
  display: flex;
  min-height: calc(100% - 64px);
  justify-content: space-between;
}
//左边 右边 结构一样
.contetn_left,
.contetn_right {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  position: relative;
  width: 550px;
  box-sizing: border-box;
  flex-shrink: 0;
}
.contetn_center {
  flex: 1;
  min-width: 0; /* 防止被内容撑大 */
  margin: 0 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  .contetn_center_top {
    height: 600px;
  }
  .contetn_center-bottom {
    height: 315px;
  }
}

.contetn_lr-item {
  height: 310px;
}

.contetn_left .contetn_lr-item {
  height: 480px;
}
</style>
