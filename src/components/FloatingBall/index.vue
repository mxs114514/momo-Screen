<template>
  <div
    ref="floatingBall"
    class="floating-ball"
    :class="{ 'is-dragging': isDragging, 'is-edge': isAtEdge }"
    :style="ballStyle"
    @mousedown="startDrag"
    @click="handleClick"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <div class="ball-content">
      <img 
        src="@/assets/img/人工智能-copy.png" 
        alt="AI助手" 
        class="ai-icon"
      />
      <div class="tech-glow"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted, computed } from 'vue'

interface Position {
  x: number
  y: number
}

const emit = defineEmits<{
  click: [position: Position, isLeftSide: boolean]
}>()

const floatingBall = ref<HTMLElement>()
const isDragging = ref(false)
const isAtEdge = ref(false)
const isHovered = ref(false)

const position = reactive<Position>({
  x: window.innerWidth - 80, // 初始位置在右侧
  y: window.innerHeight / 2 - 30
})

const ballStyle = computed(() => ({
  left: `${position.x}px`,
  top: `${position.y}px`,
  transform: isAtEdge.value && !isHovered.value && !isDragging.value 
    ? (position.x < window.innerWidth / 2 ? 'translateX(-50%)' : 'translateX(50%)')
    : 'translateX(0)'
}))

let dragOffset = { x: 0, y: 0 }
let autoEdgeTimer: number | null = null

const startDrag = (e: MouseEvent) => {
  e.preventDefault()
  isDragging.value = true
  isAtEdge.value = false
  
  const rect = floatingBall.value!.getBoundingClientRect()
  dragOffset.x = e.clientX - rect.left
  dragOffset.y = e.clientY - rect.top
  
  document.addEventListener('mousemove', onDrag)
  document.addEventListener('mouseup', stopDrag)
}

const onDrag = (e: MouseEvent) => {
  if (!isDragging.value) return
  
  position.x = Math.max(0, Math.min(window.innerWidth - 60, e.clientX - dragOffset.x))
  position.y = Math.max(0, Math.min(window.innerHeight - 60, e.clientY - dragOffset.y))
}

const stopDrag = () => {
  isDragging.value = false
  document.removeEventListener('mousemove', onDrag)
  document.removeEventListener('mouseup', stopDrag)
  
  // 延迟自动吸边
  autoEdgeTimer = window.setTimeout(() => {
    autoSnapToEdge()
  }, 1000)
}

const autoSnapToEdge = () => {
  const centerX = window.innerWidth / 2
  const targetX = position.x < centerX ? 0 : window.innerWidth - 60
  
  // 平滑动画到边缘
  const startX = position.x
  const distance = targetX - startX
  const duration = 300
  const startTime = Date.now()
  
  const animate = () => {
    const elapsed = Date.now() - startTime
    const progress = Math.min(elapsed / duration, 1)
    const easeOut = 1 - Math.pow(1 - progress, 3)
    
    position.x = startX + distance * easeOut
    
    if (progress < 1) {
      requestAnimationFrame(animate)
    } else {
      isAtEdge.value = true
    }
  }
  
  requestAnimationFrame(animate)
}

const handleClick = (e: MouseEvent) => {
  if (isDragging.value) return
  
  e.stopPropagation()
  const isLeftSide = position.x < window.innerWidth / 2
  emit('click', { x: position.x, y: position.y }, isLeftSide)
}

const handleMouseEnter = () => {
  isHovered.value = true
  if (autoEdgeTimer) {
    clearTimeout(autoEdgeTimer)
    autoEdgeTimer = null
  }
}

const handleMouseLeave = () => {
  isHovered.value = false
  if (!isDragging.value && isAtEdge.value) {
    // 鼠标离开后重新半隐藏
    autoEdgeTimer = window.setTimeout(() => {
      // 触发重新渲染以应用半隐藏效果
    }, 500)
  }
}

const handleResize = () => {
  // 窗口大小改变时调整位置
  position.x = Math.min(position.x, window.innerWidth - 60)
  position.y = Math.min(position.y, window.innerHeight - 60)
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
  // 初始自动吸边
  setTimeout(() => {
    autoSnapToEdge()
  }, 1000)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  if (autoEdgeTimer) {
    clearTimeout(autoEdgeTimer)
  }
})
</script>

<style scoped>
.floating-ball {
  position: fixed;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #06b6d4 100%);
  box-shadow: 
    0 4px 20px rgba(59, 130, 246, 0.3),
    0 0 0 1px rgba(255, 255, 255, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  cursor: pointer;
  z-index: 9999;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  user-select: none;
  backdrop-filter: blur(10px);
}

.floating-ball:hover {
  transform: scale(1.1) !important;
  box-shadow: 
    0 8px 30px rgba(59, 130, 246, 0.5),
    0 0 0 2px rgba(255, 255, 255, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
}

.floating-ball.is-dragging {
  transform: scale(1.05);
  box-shadow: 
    0 12px 40px rgba(59, 130, 246, 0.4),
    0 0 0 2px rgba(255, 255, 255, 0.3);
}

.floating-ball.is-edge {
  opacity: 0.7;
}

.floating-ball.is-edge:not(:hover) {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.ball-content {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  overflow: hidden;
}

.ai-icon {
  width: 32px;
  height: 32px;
  filter: brightness(0) invert(1);
  z-index: 2;
  position: relative;
}

.tech-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 40px;
  height: 40px;
  transform: translate(-50%, -50%);
  background: radial-gradient(circle, rgba(59, 130, 246, 0.6) 0%, transparent 70%);
  border-radius: 50%;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 0.6;
    transform: translate(-50%, -50%) scale(1);
  }
  50% {
    opacity: 0.8;
    transform: translate(-50%, -50%) scale(1.2);
  }
}

/* 科技感边框动画 */
.floating-ball::before {
  content: '';
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  border-radius: 50%;
  background: conic-gradient(from 0deg, #3b82f6, #06b6d4, #8b5cf6, #3b82f6);
  z-index: -1;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.floating-ball:hover::before {
  opacity: 1;
  animation: rotate 2s linear infinite;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>