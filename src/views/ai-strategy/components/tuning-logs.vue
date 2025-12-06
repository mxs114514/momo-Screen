<script setup lang="ts">
import { ref, onMounted } from 'vue';

interface LogItem {
  id: number;
  time: string;
  device: string;
  action: string;
  result: string;
  status: 'success' | 'warning' | 'info';
}

const logs = ref<LogItem[]>([]);

const generateLogs = () => {
  const devices = ['制冷机组 #1', '制冷机组 #2', '造雪机 A组', '景观灯光控制器', '新风系统', '冰面温控探头'];
  const actions = ['调整设定温度 -0.5℃', '降低风机转速 10%', '开启节能模式', '参数自校准', '上传运行数据', '优化PID参数'];
  const results = ['能耗降低 2.3%', '温度波动 < 0.1℃', '执行成功', '等待反馈', '模型收敛'];
  
  const tempLogs: LogItem[] = [];
  for (let i = 0; i < 60; i++) {
    const date = new Date();
    date.setMinutes(date.getMinutes() - i * 5);
    
    const statusRandom = Math.random();
    let status: 'success' | 'warning' | 'info' = 'success';
    if (statusRandom > 0.9) status = 'warning';
    else if (statusRandom > 0.7) status = 'info';

    tempLogs.push({
      id: i,
      time: date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      device: devices[Math.floor(Math.random() * devices.length)],
      action: actions[Math.floor(Math.random() * actions.length)],
      result: results[Math.floor(Math.random() * results.length)],
      status: status
    });
  }
  logs.value = tempLogs;
};

onMounted(() => {
  generateLogs();
});
</script>

<template>
  <div class="log-container">
    <div class="log-header">
      <span>时间</span>
      <span>对象</span>
      <span>动作</span>
      <span>结果</span>
    </div>
    <div class="log-list">
      <div v-for="log in logs" :key="log.id" class="log-row">
        <span class="col-time">{{ log.time }}</span>
        <span class="col-device" :title="log.device">{{ log.device }}</span>
        <span class="col-action" :title="log.action">{{ log.action }}</span>
        <span class="col-result" :class="log.status">{{ log.result }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.log-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  font-size: 12px;
}

.log-header {
  display: grid;
  grid-template-columns: 1fr 1.5fr 2fr 1.5fr;
  padding: 8px 10px;
  background: rgba(0, 234, 255, 0.1);
  color: #00eaff;
  font-weight: bold;
  border-bottom: 1px solid rgba(0, 234, 255, 0.2);
}

.log-list {
  flex: 1;
  overflow-y: auto;
  
  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(0, 234, 255, 0.2);
  }
}

.log-row {
  display: grid;
  grid-template-columns: 1fr 1.5fr 2fr 1.5fr;
  padding: 4px 10px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  color: #ccc;
  transition: background 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.05);
  }

  span {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    padding-right: 5px;
  }

  .col-time { color: #aaa; }
  .col-device { color: #fff; }
  
  .col-result {
    &.success { color: #52c41a; }
    &.warning { color: #faad14; }
    &.info { color: #1890ff; }
  }
}
</style>