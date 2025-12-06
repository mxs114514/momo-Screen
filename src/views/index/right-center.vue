<script setup lang="ts">
import { reactive, onMounted } from "vue";

const equipmentList = reactive([
  { name: '中央制冷机组', status: '运行中', param: '出水 7℃', load: '85%' },
  { name: '1# 造雪机', status: '运行中', param: '流量 50L/m', load: '92%' },
  { name: '2# 造雪机', status: '待机', param: '--', load: '0%' },
  { name: '景观灯光总控', status: '运行中', param: '模式: 节日', load: '60%' },
  { name: '新风机组 A', status: '故障', param: '报警: 滤网', load: '0%' },
]);

const updateData = () => {
  // 模拟数据变化
  equipmentList[0].load = (80 + Math.floor(Math.random() * 15)) + '%';
  equipmentList[1].load = (85 + Math.floor(Math.random() * 10)) + '%';
};

onMounted(() => {
  setInterval(updateData, 3000);
});
</script>

<template>
  <div class="equipment-list">
    <div class="header">
      <span>设备名称</span>
      <span>状态</span>
      <span>关键参数</span>
      <span>负载</span>
    </div>
    <div class="list-body">
      <div class="row" v-for="(item, index) in equipmentList" :key="index">
        <span class="name">{{ item.name }}</span>
        <span class="status" :class="item.status === '运行中' ? 'running' : item.status === '故障' ? 'fault' : 'standby'">
          {{ item.status }}
        </span>
        <span class="param">{{ item.param }}</span>
        <span class="load">{{ item.load }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.equipment-list {
  width: 100%;
  height: 100%;
  padding: 10px;
  font-size: 13px;
  color: #fff;

  .header {
    display: flex;
    padding: 5px 10px;
    background: rgba(0, 114, 255, 0.3);
    color: #00eaff;
    font-weight: bold;
    margin-bottom: 5px;
    
    span {
      flex: 1;
      text-align: center;
      &:first-child { flex: 1.5; text-align: left; }
    }
  }

  .list-body {
    .row {
      display: flex;
      padding: 8px 10px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      align-items: center;

      &:hover {
        background: rgba(255, 255, 255, 0.05);
      }

      span {
        flex: 1;
        text-align: center;
        &:first-child { flex: 1.5; text-align: left; }
      }

      .status {
        &.running { color: #00ff00; }
        &.fault { color: #ff0000; }
        &.standby { color: #ffaa00; }
      }

      .load {
        color: #00eaff;
      }
    }
  }
}
</style>
