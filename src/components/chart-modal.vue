<template>
  <Teleport to="body">
    <div v-if="visible" class="chart-modal-overlay" @click="handleClose">
      <div class="chart-modal-container" @click.stop>
        <div class="chart-modal-header">
          <h3 class="chart-modal-title">{{ title }}</h3>
          <button class="chart-modal-close" @click="handleClose">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>

        <!-- 左右切换箭头 -->
        <button v-if="showArrows" class="chart-modal-arrow left" @click.stop="emit('prev')" aria-label="上一张">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <path d="M15 6L9 12L15 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
        <button v-if="showArrows" class="chart-modal-arrow right" @click.stop="emit('next')" aria-label="下一张">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <path d="M9 6L15 12L9 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>

        <div class="chart-modal-content">
          <slot></slot>
        </div>

        <!-- 底部序号指示 -->
        <div v-if="showPagination" class="chart-modal-pagination">{{ (currentIndex ?? 0) + 1 }} / {{ total }}</div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
interface Props {
  visible: boolean;
  title?: string;
  showArrows?: boolean;
  showPagination?: boolean;
  currentIndex?: number;
  total?: number;
}

interface Emits {
  (e: 'close'): void;
  (e: 'prev'): void;
  (e: 'next'): void;
}

const props = withDefaults(defineProps<Props>(), {
  title: '图表详情',
  showArrows: false,
  showPagination: false,
  currentIndex: 0,
  total: 1
});

const emit = defineEmits<Emits>();

const handleClose = () => {
  emit('close');
};
</script>

<style scoped lang="scss">
.chart-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  animation: fadeIn 0.3s ease;
}

.chart-modal-container {
  width: 80vw;
  height: 80vh;
  background: rgba(0, 20, 40, 0.95);
  border: 1px solid rgba(147, 235, 248, 0.3);
  border-radius: 8px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  animation: scaleIn 0.3s ease;
}

.chart-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(147, 235, 248, 0.3);
}

.chart-modal-title {
  color: #00eaff;
  font-size: 24px;
  font-weight: bold;
  margin: 0;
}

.chart-modal-close {
  background: none;
  border: none;
  color: #00eaff;
  cursor: pointer;
  padding: 5px;
  border-radius: 4px;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(147, 235, 248, 0.2);
    transform: rotate(90deg);
  }
}

.chart-modal-content {
  flex: 1;
  min-height: 0;
  position: relative;
}

.chart-modal-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(147, 235, 248, 0.15);
  border: 1px solid rgba(147, 235, 248, 0.4);
  color: #00eaff;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  z-index: 2;

  &:hover {
    background: rgba(147, 235, 248, 0.3);
    transform: translateY(-50%) scale(1.05);
  }

  &.left { left: 12px; }
  &.right { right: 12px; }
}

.chart-modal-pagination {
  position: absolute;
  bottom: 12px;
  left: 50%;
  transform: translateX(-50%);
  color: #88f0ff;
  font-size: 14px;
  letter-spacing: 1px;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes scaleIn {
  from {
    transform: scale(0.8);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}
</style>