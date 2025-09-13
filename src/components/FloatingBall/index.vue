<template>
  <div
    ref="floatingBallRef"
    class="floating-ball"
    :class="{ 'is-docked': isDocked, 'is-hidden': isHidden }"
    :style="ballStyle"
    @mousedown="startDrag"
    @click="handleClick"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <img src="@/assets/img/人工智能-copy.png" alt="AI助手" class="ball-icon" />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'

// 定义事件
const emit = defineEmits<{
  click: [position: { x: number; y: number }]
  'position-change': [position: { x: number; y: number }]
}>()

// 响应式数据
const floatingBallRef = ref<HTMLElement>()
const isDragging = ref(false)
const isDocked = ref(false)
const isHidden = ref(false)
const isHovering = ref(false)

// 位置数据
const position = reactive({
  x: window.innerWidth - 80, // 初始位置在右侧
  y: window.innerHeight / 2 - 30
})

// 拖拽相关数据
const dragData = reactive({
  startX: 0,
  startY: 0,
  offsetX: 0,
  offsetY: 0
})

// 计算样式
const ballStyle = computed(() => ({
  left: `${position.x}px`,
  top: `${position.y}px`,
  transform: isDocked.value && !isHovering.value ? 
    (position.x < window.innerWidth / 2 ? 'translateX(-50%)' : 'translateX(50%)') : 
    'translateX(0)'
}))

// 开始拖拽
const startDrag = (e: MouseEvent) => {
  if (e.button !== 0) return // 只响应左键
  
  isDragging.value = true
  isDocked.value = false
  isHidden.value = false
  
  dragData.startX = e.clientX
  dragData.startY = e.clientY
  dragData.offsetX = e.clientX - position.x
  dragData.offsetY = e.clientY - position.y
  
  document.addEventListener('mousemove', handleDrag)
  document.addEventListener('mouseup', stopDrag)
  
  e.preventDefault()
}

// 拖拽中
const handleDrag = (e: MouseEvent) => {
  if (!isDragging.value) return
  
  const newX = e.clientX - dragData.offsetX
  const newY = e.clientY - dragData.offsetY
  
  // 限制在屏幕范围内
  position.x = Math.max(0, Math.min(window.innerWidth - 60, newX))
  position.y = Math.max(0, Math.min(window.innerHeight - 60, newY))
  
  // 实时触发位置变化事件
  emit('position-change', {
    x: position.x,
    y: position.y
  })
}

// 停止拖拽
const stopDrag = () => {
  if (!isDragging.value) return
  
  isDragging.value = false
  
  document.removeEventListener('mousemove', handleDrag)
  document.removeEventListener('mouseup', stopDrag)
  
  // 自动吸边
  autoSnap()
  
  // 触发位置变化事件
  emit('position-change', {
    x: position.x,
    y: position.y
  })
}

// 自动吸边
const autoSnap = () => {
  const centerX = window.innerWidth / 2
  const ballCenterX = position.x + 30 // 球的中心点
  
  // 判断靠近哪一边
  if (ballCenterX < centerX) {
    // 靠近左边
    position.x = 0
  } else {
    // 靠近右边
    position.x = window.innerWidth - 60
  }
  
  isDocked.value = true
  
  // 延迟隐藏
  setTimeout(() => {
    if (!isHovering.value) {
      isHidden.value = true
    }
  }, 2000)
}

// 鼠标进入
const handleMouseEnter = () => {
  isHovering.value = true
  isHidden.value = false
}

// 鼠标离开
const handleMouseLeave = () => {
  isHovering.value = false
  
  if (isDocked.value) {
    setTimeout(() => {
      if (!isHovering.value) {
        isHidden.value = true
      }
    }, 1000)
  }
}

// 点击事件
const handleClick = (e: MouseEvent) => {
  // 如果刚刚拖拽过，不触发点击
  if (Math.abs(e.clientX - dragData.startX) > 5 || Math.abs(e.clientY - dragData.startY) > 5) {
    return
  }
  
  emit('click', {
    x: position.x,
    y: position.y
  })
}

// 窗口大小变化处理
const handleResize = () => {
  // 确保悬浮球在屏幕范围内
  position.x = Math.max(0, Math.min(window.innerWidth - 60, position.x))
  position.y = Math.max(0, Math.min(window.innerHeight - 60, position.y))
  
  if (isDocked.value) {
    autoSnap()
  }
}

// 生命周期
onMounted(() => {
  window.addEventListener('resize', handleResize)
  
  // 初始自动吸边
  setTimeout(() => {
    autoSnap()
  }, 1000)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  document.removeEventListener('mousemove', handleDrag)
  document.removeEventListener('mouseup', stopDrag)
})
</script>

<style scoped lang="scss">
.floating-ball {
  position: fixed;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  cursor: pointer;
  z-index: 9999;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  user-select: none;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  
  &:hover {
    transform: scale(1.1) !important;
    box-shadow: 0 6px 25px rgba(0, 0, 0, 0.4);
  }
  
  &:active {
    transform: scale(0.95) !important;
  }
  
  &.is-docked {
    transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    
    &.is-hidden {
      opacity: 0.7;
    }
  }
  
  .ball-icon {
    width: 36px;
    height: 36px;
    object-fit: contain;
    filter: brightness(1.2) contrast(1.1);
    transition: all 0.3s ease;
  }
  
  &:hover .ball-icon {
    filter: brightness(1.4) contrast(1.2);
  }
}

// 响应式设计
@media (max-width: 768px) {
  .floating-ball {
    width: 50px;
    height: 50px;
    
    .ball-icon {
      width: 30px;
      height: 30px;
    }
  }
}
</style>