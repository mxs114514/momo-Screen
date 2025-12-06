<script setup lang="ts">
import { reactive, onMounted } from "vue";
import CountUp from "@/components/count-up";

const state = reactive({
  total: 0,
  running: 0,
  standby: 0,
  fault: 0,
  offline: 0
});

const getData = () => {
  // 模拟数据
  state.total = 1250;
  
  // 故障 < 5 (0-4)
  state.fault = Math.floor(Math.random() * 5);
  
  // 运行中 > 1100 (1101 - 1200)
  // 预留至少 50 的空间给待机和离线，防止数据过于极端
  state.running = 1101 + Math.floor(Math.random() * 100);
  
  // 计算剩余可用数量
  const remain = state.total - state.running - state.fault;
  
  // 待机在剩余中随机分配
  state.standby = Math.floor(Math.random() * (remain + 1));
  
  // 剩下的给离线，确保总和为 1250
  state.offline = remain - state.standby;
};

onMounted(() => {
  getData();
  setInterval(getData, 60000);
});
</script>

<template>
  <div class="device-status">
    <div class="status-item total">
      <div class="label">设备总数</div>
      <div class="value"><CountUp :endVal="state.total" :duration="1" /></div>
    </div>
    <div class="status-grid">
      <div class="status-item running">
        <div class="label">运行中</div>
        <div class="value"><CountUp :endVal="state.running" :duration="1" /></div>
      </div>
      <div class="status-item standby">
        <div class="label">待机</div>
        <div class="value"><CountUp :endVal="state.standby" :duration="1" /></div>
      </div>
      <div class="status-item fault">
        <div class="label">故障</div>
        <div class="value"><CountUp :endVal="state.fault" :duration="1" /></div>
      </div>
      <div class="status-item offline">
        <div class="label">离线</div>
        <div class="value"><CountUp :endVal="state.offline" :duration="1" /></div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.device-status {
  width: 100%;
  height: 100%;
  padding: 5px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;

  .status-item {
    text-align: center;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 8px;
    padding: 5px;
    
    .label {
      font-size: 12px;
      color: #aaa;
      margin-bottom: 2px;
    }
    
    .value {
      font-size: 20px;
      font-weight: bold;
      color: #fff;
    }

    &.total {
      background: rgba(0, 114, 255, 0.2);
      border: 1px solid rgba(0, 114, 255, 0.5);
      margin-bottom: 5px;
      .value { color: #00eaff; font-size: 28px; }
    }

    &.running .value { color: #00ff00; }
    &.standby .value { color: #ffaa00; }
    &.fault .value { color: #ff0000; }
    &.offline .value { color: #999; }
  }

  .status-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 5px;
  }
}
</style>
