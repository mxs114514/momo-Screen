<script setup lang="ts">
import { ref } from 'vue';

const strategies = ref([
  { id: 1, name: '夜间深度休眠模式', type: '节能', status: 'active', desc: '22:00-06:00 降低非必要设备功率' },
  { id: 2, name: '极端暴雪保护', type: '安全', status: 'inactive', desc: '风速>8级自动触发，加固冰建结构' },
  { id: 3, name: '客流高峰动态制冷', type: '舒适', status: 'active', desc: '客流>10000人时，动态调整制冷量' },
  { id: 4, name: '融冰风险紧急干预', type: '安全', status: 'inactive', desc: '冰温>-2℃时，启动液氮辅助降温' },
  { id: 5, name: '景观灯光联动', type: '节能', status: 'active', desc: '随环境亮度自动调节灯光强度' },
  { id: 6, name: '造雪机智能启停', type: '生产', status: 'active', desc: '温湿度适宜时自动开启造雪' },
]);

const activeId = ref(1);

const selectStrategy = (id: number) => {
  activeId.value = id;
};
</script>

<template>
  <div class="strategy-list">
    <div 
      v-for="item in strategies" 
      :key="item.id" 
      class="strategy-item"
      :class="{ 'active': activeId === item.id }"
      @click="selectStrategy(item.id)"
    >
      <div class="item-header">
        <span class="name">{{ item.name }}</span>
        <span class="tag" :class="item.status">{{ item.status === 'active' ? '运行中' : '未激活' }}</span>
      </div>
      <div class="item-desc">{{ item.desc }}</div>
      <div class="item-type">{{ item.type }}</div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.strategy-list {
  height: 100%;
  overflow-y: auto;
  padding: 10px;
  
  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(0, 234, 255, 0.2);
    border-radius: 2px;
  }
}

.strategy-item {
  background: rgba(13, 40, 80, 0.3);
  border: 1px solid rgba(0, 234, 255, 0.1);
  margin-bottom: 8px;
  padding: 10px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
  position: relative;
  overflow: hidden;

  &:hover {
    background: rgba(13, 40, 80, 0.6);
    border-color: rgba(0, 234, 255, 0.5);
  }

  &.active {
    background: rgba(0, 114, 255, 0.2);
    border-color: #00eaff;
    box-shadow: 0 0 10px rgba(0, 234, 255, 0.2) inset;

    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 4px;
      background: #00eaff;
    }
  }
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;

  .name {
    color: #fff;
    font-weight: bold;
    font-size: 14px;
  }

  .tag {
    font-size: 12px;
    padding: 2px 6px;
    border-radius: 2px;
    
    &.active {
      color: #52c41a;
      background: rgba(82, 196, 26, 0.2);
      border: 1px solid rgba(82, 196, 26, 0.4);
    }
    
    &.inactive {
      color: #aaa;
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
    }
  }
}

.item-desc {
  color: #ccc;
  font-size: 12px;
  line-height: 1.4;
  margin-bottom: 6px;
}

.item-type {
  display: inline-block;
  font-size: 12px;
  color: #00eaff;
  background: rgba(0, 234, 255, 0.1);
  padding: 1px 5px;
  border-radius: 2px;
}
</style>