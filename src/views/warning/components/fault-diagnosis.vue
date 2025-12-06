<script setup lang="ts">
import { ref } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';

const diagnosisData = ref([
  {
    id: 'ALM-20251206-001',
    device: '制冷机组 #3',
    rootCause: '电压波动导致压缩机保护停机',
    confidence: '98%',
    sop: [
      '1. 检查配电箱电压输入是否稳定',
      '2. 重置压缩机保护开关',
      '3. 观察运行电流是否正常'
    ],
    status: '待处理'
  },
  {
    id: 'ALM-20251206-002',
    device: '景观灯带 A区',
    rootCause: '控制器信号丢失',
    confidence: '85%',
    sop: [
      '1. 检查信号线连接',
      '2. 重启控制器',
      '3. 更换信号模块'
    ],
    status: '处理中'
  },
  {
    id: 'ALM-20251206-003',
    device: '极速滑梯 传感器B',
    rootCause: '红外传感器被异物遮挡',
    confidence: '92%',
    sop: [
      '1. 现场检查传感器位置',
      '2. 清理遮挡物',
      '3. 进行传感器校准测试'
    ],
    status: '待处理'
  },
  {
    id: 'ALM-20251206-004',
    device: '园区广播系统',
    rootCause: '功放模块过热保护',
    confidence: '88%',
    sop: [
      '1. 检查机柜散热风扇是否运行',
      '2. 清理散热口灰尘',
      '3. 降低输出功率观察'
    ],
    status: '待处理'
  },
  {
    id: 'ALM-20251206-005',
    device: '智能垃圾桶 #15',
    rootCause: '满溢传感器误报',
    confidence: '75%',
    sop: [
      '1. 检查桶内实际容量',
      '2. 清洁传感器探头',
      '3. 调整灵敏度阈值'
    ],
    status: '待处理'
  }
]);

const handleDispatch = (id: string) => {
  ElMessage.success('工单派发成功，系统已自动归档该告警');
  diagnosisData.value = diagnosisData.value.filter(item => item.id !== id);
};

const handleIgnore = (id: string) => {
  ElMessageBox.confirm(
    '确定要忽略此告警吗？忽略后该告警将暂时从列表中移除。',
    '确认忽略',
    {
      confirmButtonText: '确认忽略',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(() => {
      diagnosisData.value = diagnosisData.value.filter(item => item.id !== id);
      ElMessage.info('已忽略该告警');
    })
    .catch(() => {
      // 取消操作
    });
};
</script>

<template>
  <div class="diagnosis-container">
    <div class="diagnosis-item" v-for="item in diagnosisData" :key="item.id">
      <div class="header">
        <span class="device">{{ item.device }}</span>
        <span class="confidence">AI置信度: {{ item.confidence }}</span>
      </div>
      <div class="content">
        <div class="row">
          <span class="label">根因分析:</span>
          <span class="value highlight">{{ item.rootCause }}</span>
        </div>
        <div class="row sop-box">
          <span class="label">处置建议 (SOP):</span>
          <ul class="sop-list">
            <li v-for="(step, idx) in item.sop" :key="idx">{{ step }}</li>
          </ul>
        </div>
        <div class="actions">
          <button class="btn-dispatch" @click="handleDispatch(item.id)">派发工单</button>
          <button class="btn-ignore" @click="handleIgnore(item.id)">忽略</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.diagnosis-container {
  width: 100%;
  height: 90%;
  margin-top: 2%;
  overflow-y: auto;
  padding: 10px;
  box-sizing: border-box;
  
  /* 隐藏滚动条但保留功能 */
  &::-webkit-scrollbar {
    width: 0;
  }
}

.diagnosis-item {
  background: rgba(13, 40, 80, 0.5);
  border: 1px solid rgba(0, 234, 255, 0.3);
  margin-bottom: 15px;
  border-radius: 4px;
  overflow: hidden;
}

.header {
  background: rgba(0, 234, 255, 0.1);
  padding: 8px 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(0, 234, 255, 0.1);

  .device {
    color: #00eaff;
    font-weight: bold;
  }
  .confidence {
    color: #07f7a8;
    font-size: 12px;
  }
}

.content {
  padding: 12px;
  font-size: 13px;
  color: #fff;
}

.row {
  margin-bottom: 10px;
  display: flex;
  flex-direction: column;
  
  .label {
    color: #aaa;
    margin-bottom: 4px;
  }
  
  .value.highlight {
    color: #ff4d4f;
    font-weight: bold;
  }
}

.sop-list {
  margin: 0;
  padding-left: 20px;
  color: #ddd;
  li {
    margin-bottom: 2px;
  }
}

.actions {
  display: flex;
  gap: 10px;
  margin-top: 10px;
  justify-content: flex-end;

  button {
    padding: 4px 12px;
    border: none;
    border-radius: 2px;
    cursor: pointer;
    font-size: 12px;
    transition: all 0.3s;

    &.btn-dispatch {
      background: #00eaff;
      color: #000;
      &:hover { background: #00c4d6; }
    }

    &.btn-ignore {
      background: transparent;
      border: 1px solid #666;
      color: #aaa;
      &:hover { border-color: #999; color: #ddd; }
    }
  }
}
</style>