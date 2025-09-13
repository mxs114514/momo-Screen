<template>
  <div 
    v-if="visible" 
    class="chat-window"
    :class="{ 'left-side': isLeftSide }"
    :style="windowStyle"
  >
    <!-- 窗口头部 -->
    <div class="chat-header">
      <div class="header-content">
        <div class="ai-indicator">
          <div class="indicator-dot"></div>
          <span class="ai-title">AI助手</span>
        </div>
        <button class="close-btn" @click="handleClose">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- 消息列表 -->
    <div class="chat-messages" ref="messagesContainer">
      <div 
        v-for="message in messages" 
        :key="message.id"
        class="message"
        :class="message.role"
      >
        <div class="message-content">
          <div v-if="message.role === 'assistant'" class="ai-avatar">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="6" fill="currentColor" opacity="0.2"/>
              <circle cx="8" cy="8" r="3" fill="currentColor"/>
            </svg>
          </div>
          <div class="message-text">
            <span v-if="message.isTyping" class="typing-indicator">
              <span></span><span></span><span></span>
            </span>
            <template v-else>
              {{ message.content }}
            </template>
          </div>
        </div>
      </div>
    </div>

    <!-- 输入区域 -->
    <div class="chat-input">
      <div class="input-container">
        <input
          v-model="inputText"
          type="text"
          placeholder="输入您的问题..."
          class="message-input"
          @keypress.enter="sendMessage"
          @focus="handleInputFocus"
          @blur="handleInputBlur"
          :disabled="isLoading"
        />
        <button 
          class="send-btn"
          :class="{ 'loading': isLoading }"
          @click="sendMessage"
          :disabled="!inputText.trim() || isLoading"
        >
          <svg v-if="!isLoading" width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M2 8L14 2L10 8L14 14L2 8Z" fill="currentColor"/>
          </svg>
          <div v-else class="loading-spinner"></div>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, nextTick, watch } from 'vue'
import { aiService } from '@/services/aiService'

interface Position {
  x: number
  y: number
}

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: number
  isTyping?: boolean
}

interface Props {
  visible: boolean
  position: Position
  isLeftSide: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  close: []
}>()

const messagesContainer = ref<HTMLElement>()
const inputText = ref('')
const isLoading = ref(false)
const isInputFocused = ref(false)

const messages = reactive<Message[]>([
  {
    id: '1',
    role: 'assistant',
    content: '您好！我是AI助手，有什么可以帮助您的吗？',
    timestamp: Date.now()
  }
])

const windowStyle = computed(() => {
  const baseX = props.isLeftSide ? props.position.x + 80 : props.position.x - 400
  const baseY = Math.max(20, Math.min(props.position.y - 250, window.innerHeight - 520))
  
  return {
    left: `${Math.max(20, Math.min(baseX, window.innerWidth - 420))}px`,
    top: `${baseY}px`
  }
})

const generateId = () => Math.random().toString(36).substr(2, 9)

const scrollToBottom = async () => {
  await nextTick()
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

const sendMessage = async () => {
  if (!inputText.value.trim() || isLoading.value) return
  
  const userMessage: Message = {
    id: generateId(),
    role: 'user',
    content: inputText.value.trim(),
    timestamp: Date.now()
  }
  
  messages.push(userMessage)
  const userInput = inputText.value.trim()
  inputText.value = ''
  
  await scrollToBottom()
  
  // 添加AI正在输入的提示
  const typingMessage: Message = {
    id: generateId(),
    role: 'assistant',
    content: '',
    timestamp: Date.now(),
    isTyping: true
  }
  
  messages.push(typingMessage)
  await scrollToBottom()
  
  isLoading.value = true
  
  try {
    const response = await aiService.chat(userInput)
    
    // 移除正在输入的提示
    const typingIndex = messages.findIndex(m => m.isTyping)
    if (typingIndex !== -1) {
      messages.splice(typingIndex, 1)
    }
    
    // 添加AI回复
    const aiMessage: Message = {
      id: generateId(),
      role: 'assistant',
      content: response,
      timestamp: Date.now()
    }
    
    messages.push(aiMessage)
    await scrollToBottom()
    
  } catch (error) {
    console.error('AI服务调用失败:', error)
    
    // 移除正在输入的提示
    const typingIndex = messages.findIndex(m => m.isTyping)
    if (typingIndex !== -1) {
      messages.splice(typingIndex, 1)
    }
    
    // 添加错误消息
    const errorMessage: Message = {
      id: generateId(),
      role: 'assistant',
      content: '抱歉，AI服务暂时不可用，请稍后再试。',
      timestamp: Date.now()
    }
    
    messages.push(errorMessage)
    await scrollToBottom()
  } finally {
    isLoading.value = false
  }
}

const handleClose = () => {
  emit('close')
}

const handleInputFocus = () => {
  isInputFocused.value = true
}

const handleInputBlur = () => {
  isInputFocused.value = false
}

// 监听visible变化，窗口显示时滚动到底部
watch(() => props.visible, (newVisible) => {
  if (newVisible) {
    nextTick(() => {
      scrollToBottom()
    })
  }
})
</script>

<style scoped>
.chat-window {
  position: fixed;
  width: 400px;
  height: 500px;
  background: rgba(15, 23, 42, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: 16px;
  box-shadow: 
    0 20px 40px rgba(0, 0, 0, 0.3),
    0 0 0 1px rgba(255, 255, 255, 0.05),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  z-index: 10000;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: slideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.chat-window.left-side {
  animation: slideInLeft 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateX(0) scale(1);
  }
}

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateX(0) scale(1);
  }
}

.chat-header {
  padding: 16px;
  border-bottom: 1px solid rgba(59, 130, 246, 0.1);
  background: rgba(30, 58, 138, 0.1);
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.ai-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
}

.indicator-dot {
  width: 8px;
  height: 8px;
  background: #10b981;
  border-radius: 50%;
  animation: pulse 2s ease-in-out infinite;
}

.ai-title {
  color: #e2e8f0;
  font-size: 14px;
  font-weight: 500;
}

.close-btn {
  background: none;
  border: none;
  color: #94a3b8;
  cursor: pointer;
  padding: 4px;
  border-radius: 6px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  color: #e2e8f0;
  background: rgba(59, 130, 246, 0.1);
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.chat-messages::-webkit-scrollbar {
  width: 4px;
}

.chat-messages::-webkit-scrollbar-track {
  background: rgba(59, 130, 246, 0.1);
  border-radius: 2px;
}

.chat-messages::-webkit-scrollbar-thumb {
  background: rgba(59, 130, 246, 0.3);
  border-radius: 2px;
}

.chat-messages::-webkit-scrollbar-thumb:hover {
  background: rgba(59, 130, 246, 0.5);
}

.message {
  display: flex;
  flex-direction: column;
}

.message.user {
  align-items: flex-end;
}

.message.assistant {
  align-items: flex-start;
}

.message-content {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  max-width: 85%;
}

.message.user .message-content {
  flex-direction: row-reverse;
}

.ai-avatar {
  width: 24px;
  height: 24px;
  background: linear-gradient(135deg, #3b82f6, #06b6d4);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
  margin-top: 2px;
}

.message-text {
  padding: 8px 12px;
  border-radius: 12px;
  font-size: 14px;
  line-height: 1.4;
  word-wrap: break-word;
}

.message.user .message-text {
  background: linear-gradient(135deg, #3b82f6, #06b6d4);
  color: white;
  border-bottom-right-radius: 4px;
}

.message.assistant .message-text {
  background: rgba(59, 130, 246, 0.1);
  color: #e2e8f0;
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-bottom-left-radius: 4px;
}

.typing-indicator {
  display: flex;
  gap: 4px;
  align-items: center;
}

.typing-indicator span {
  width: 6px;
  height: 6px;
  background: #94a3b8;
  border-radius: 50%;
  animation: typing 1.4s ease-in-out infinite;
}

.typing-indicator span:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-indicator span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes typing {
  0%, 60%, 100% {
    transform: translateY(0);
    opacity: 0.5;
  }
  30% {
    transform: translateY(-10px);
    opacity: 1;
  }
}

.chat-input {
  padding: 16px;
  border-top: 1px solid rgba(59, 130, 246, 0.1);
  background: rgba(30, 58, 138, 0.05);
}

.input-container {
  display: flex;
  gap: 8px;
  align-items: center;
}

.message-input {
  flex: 1;
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: 8px;
  padding: 8px 12px;
  color: #e2e8f0;
  font-size: 14px;
  outline: none;
  transition: all 0.2s ease;
}

.message-input::placeholder {
  color: #64748b;
}

.message-input:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
}

.message-input:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.send-btn {
  background: linear-gradient(135deg, #3b82f6, #06b6d4);
  border: none;
  border-radius: 8px;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.send-btn:hover:not(:disabled) {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.send-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.loading-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
</style>