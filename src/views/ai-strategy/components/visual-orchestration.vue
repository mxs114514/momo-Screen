<script setup lang="ts">
import { ref, onMounted } from 'vue';

// 模拟节点数据
const nodes = ref([
  { id: 1, type: 'trigger', label: '环境感知', x: 50, y: 50, icon: '🌡️' },
  { id: 2, type: 'condition', label: '游客量 > 5000', x: 250, y: 50, icon: '👥' },
  { id: 3, type: 'condition', label: '温度 > -5℃', x: 250, y: 150, icon: '❄️' },
  { id: 4, type: 'model', label: 'AI 决策模型', x: 450, y: 100, icon: '🧠' },
  { id: 5, type: 'action', label: '开启备用机组', x: 650, y: 50, icon: '⚙️' },
  { id: 6, type: 'action', label: '调整风机转速', x: 650, y: 150, icon: '💨' },
]);

// 模拟连线
const connections = ref([
  { from: 1, to: 2 },
  { from: 1, to: 3 },
  { from: 2, to: 4 },
  { from: 3, to: 4 },
  { from: 4, to: 5 },
  { from: 4, to: 6 },
]);

// 简单的 SVG 路径计算
const getPath = (startId: number, endId: number) => {
  const start = nodes.value.find(n => n.id === startId);
  const end = nodes.value.find(n => n.id === endId);
  if (!start || !end) return '';
  
  // 简单的贝塞尔曲线
  const x1 = start.x + 80; // 节点宽度的一半
  const y1 = start.y + 20; // 节点高度的一半
  const x2 = end.x;
  const y2 = end.y + 20;
  
  return `M ${x1} ${y1} C ${(x1 + x2) / 2} ${y1}, ${(x1 + x2) / 2} ${y2}, ${x2} ${y2}`;
};

</script>

<template>
  <div class="orchestration-container">
    <div class="toolbar">
      <div class="tool-item">➕ 添加触发器</div>
      <div class="tool-item">➕ 添加条件</div>
      <div class="tool-item">➕ 添加动作</div>
      <div class="tool-item play">▶ 模拟运行</div>
    </div>
    
    <div class="canvas-area">
      <svg class="connections">
        <path 
          v-for="(conn, idx) in connections" 
          :key="idx" 
          :d="getPath(conn.from, conn.to)"
          stroke="#00eaff" 
          stroke-width="2" 
          fill="none"
          stroke-dasharray="5,5"
          class="animated-line"
        />
      </svg>
      
      <div 
        v-for="node in nodes" 
        :key="node.id" 
        class="node"
        :class="node.type"
        :style="{ left: node.x + 'px', top: node.y + 'px' }"
      >
        <div class="node-icon">{{ node.icon }}</div>
        <div class="node-label">{{ node.label }}</div>
        <div class="node-port input" v-if="node.type !== 'trigger'"></div>
        <div class="node-port output" v-if="node.type !== 'action'"></div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.orchestration-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  overflow: hidden;
}

.toolbar {
  height: 40px;
  background: rgba(13, 40, 80, 0.5);
  display: flex;
  align-items: center;
  padding: 0 10px;
  border-bottom: 1px solid rgba(0, 234, 255, 0.2);
  gap: 10px;

  .tool-item {
    padding: 4px 10px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
    font-size: 12px;
    cursor: pointer;
    color: #ccc;
    transition: all 0.2s;

    &:hover {
      background: rgba(0, 234, 255, 0.2);
      color: #fff;
    }
    
    &.play {
      background: #00eaff;
      color: #000;
      font-weight: bold;
      margin-left: auto;
      
      &:hover {
        background: #00c6ff;
      }
    }
  }
}

.canvas-area {
  flex: 1;
  position: relative;
  overflow: hidden;
  background-image: radial-gradient(rgba(0, 234, 255, 0.1) 1px, transparent 1px);
  background-size: 20px 20px;
}

.connections {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.animated-line {
  animation: dash 30s linear infinite;
}

@keyframes dash {
  to {
    stroke-dashoffset: -1000;
  }
}

.node {
  position: absolute;
  width: 140px;
  height: 40px;
  background: rgba(13, 40, 80, 0.9);
  border: 1px solid #00eaff;
  border-radius: 20px;
  display: flex;
  align-items: center;
  padding: 0 10px;
  cursor: grab;
  box-shadow: 0 0 10px rgba(0, 234, 255, 0.2);
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.05);
    z-index: 10;
  }

  &.trigger { border-color: #52c41a; }
  &.condition { border-color: #faad14; }
  &.model { border-color: #722ed1; }
  &.action { border-color: #f5222d; }

  .node-icon {
    margin-right: 8px;
    font-size: 16px;
  }

  .node-label {
    font-size: 12px;
    color: #fff;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .node-port {
    position: absolute;
    width: 8px;
    height: 8px;
    background: #fff;
    border-radius: 50%;
    top: 50%;
    transform: translateY(-50%);
    
    &.input { left: -4px; }
    &.output { right: -4px; }
  }
}
</style>