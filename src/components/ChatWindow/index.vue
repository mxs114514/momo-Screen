<template>
  <div
    v-if="visible"
    class="chat-window"
    :class="{ 'chat-window--left': side === 'left', 'chat-window--right': side === 'right' }"
    :style="windowStyle"
  >
    <!-- 聊天窗口头部 -->
    <div class="chat-header">
      <div class="chat-title">
        <img src="@/assets/img/人工智能-copy.png" alt="AI" class="chat-avatar" />
        <span class="chat-name">AI助手</span>
        <span class="chat-status">在线</span>
      </div>
      <div class="chat-actions">
        <el-button
          type="text"
          size="small"
          @click="handleMinimize"
          class="action-btn"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 13H5v-2h14v2z"/>
          </svg>
        </el-button>
        <el-button
          type="text"
          size="small"
          @click="handleClose"
          class="action-btn close-btn"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
          </svg>
        </el-button>
      </div>
    </div>

    <!-- 聊天消息区域 -->
    <div class="chat-messages" ref="messagesRef">
      <div
        v-for="message in messages"
        :key="message.id"
        class="message-item"
        :class="{ 'message-item--user': message.type === 'user', 'message-item--ai': message.type === 'ai' }"
      >
        <div class="message-avatar">
          <img
            v-if="message.type === 'ai'"
            src="@/assets/img/人工智能-copy.png"
            alt="AI"
            class="avatar-img"
          />
          <div v-else class="user-avatar">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
          </div>
        </div>
        <div class="message-content">
          <div class="message-bubble">
            <div class="message-text">{{ message.content }}</div>
            <div class="message-time">{{ formatTime(message.timestamp) }}</div>
          </div>
        </div>
      </div>
      
      <!-- AI正在输入提示 -->
      <div v-if="isAiTyping" class="message-item message-item--ai">
        <div class="message-avatar">
          <img src="@/assets/img/人工智能-copy.png" alt="AI" class="avatar-img" />
        </div>
        <div class="message-content">
          <div class="message-bubble typing-indicator">
            <div class="typing-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 输入区域 -->
    <div class="chat-input">
      <div class="input-container">
        <el-input
          v-model="inputMessage"
          type="textarea"
          :rows="1"
          :autosize="{ minRows: 1, maxRows: 4 }"
          placeholder="输入消息..."
          @keydown.enter.exact="handleSend"
          @keydown.enter.shift.exact.prevent="handleNewLine"
          class="message-input"
        />
        <el-button
          type="primary"
          :disabled="!inputMessage.trim() || isAiTyping"
          @click="handleSend"
          class="send-btn"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
          </svg>
        </el-button>
      </div>
      <div class="input-tips">
        <span class="tip-text">按 Enter 发送，Shift + Enter 换行</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, nextTick, watch } from 'vue'
import { ElButton, ElInput, ElMessage } from 'element-plus'

// 定义属性
interface Props {
  visible: boolean
  position: { x: number; y: number }
  side: 'left' | 'right'
}

const props = withDefaults(defineProps<Props>(), {
  visible: false,
  side: 'right'
})

// 定义事件
const emit = defineEmits<{
  close: []
  minimize: []
}>()

// 消息接口
interface Message {
  id: string
  type: 'user' | 'ai'
  content: string
  timestamp: number
}

// 响应式数据
const inputMessage = ref('')
const isAiTyping = ref(false)
const messagesRef = ref<HTMLElement>()

// 消息列表
const messages = ref<Message[]>([
  {
    id: '1',
    type: 'ai',
    content: '你好！我是AI助手，有什么可以帮助您的吗？',
    timestamp: Date.now()
  }
])

// 计算窗口样式
const windowStyle = computed(() => {
  const baseStyle = {
    top: `${Math.max(20, Math.min(window.innerHeight - 500, props.position.y))}px`
  }
  
  if (props.side === 'left') {
    return {
      ...baseStyle,
      left: `${Math.max(20, props.position.x + 80)}px`
    }
  } else {
    return {
      ...baseStyle,
      right: `${Math.max(20, window.innerWidth - props.position.x)}px`
    }
  }
})

// 格式化时间
const formatTime = (timestamp: number) => {
  const date = new Date(timestamp)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  
  if (diff < 60000) { // 1分钟内
    return '刚刚'
  } else if (diff < 3600000) { // 1小时内
    return `${Math.floor(diff / 60000)}分钟前`
  } else if (date.toDateString() === now.toDateString()) { // 今天
    return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
  } else {
    return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
  }
}

// 滚动到底部
const scrollToBottom = () => {
  nextTick(() => {
    if (messagesRef.value) {
      messagesRef.value.scrollTop = messagesRef.value.scrollHeight
    }
  })
}

// 发送消息
const handleSend = () => {
  const content = inputMessage.value.trim()
  if (!content || isAiTyping.value) return
  
  // 添加用户消息
  const userMessage: Message = {
    id: Date.now().toString(),
    type: 'user',
    content,
    timestamp: Date.now()
  }
  
  messages.value.push(userMessage)
  inputMessage.value = ''
  scrollToBottom()
  
  // 模拟AI回复
  simulateAiResponse(content)
}

// 换行处理
const handleNewLine = () => {
  inputMessage.value += '\n'
}

// 模拟AI回复
const simulateAiResponse = async (userInput: string) => {
  isAiTyping.value = true
  scrollToBottom()
  
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000))
  
  // 简单的回复逻辑
  let aiResponse = ''
  
  if (userInput.includes('你好') || userInput.includes('您好')) {
    aiResponse = '您好！很高兴为您服务。请问有什么可以帮助您的吗？'
  } else if (userInput.includes('时间')) {
    aiResponse = `现在的时间是：${new Date().toLocaleString('zh-CN')}`
  } else if (userInput.includes('天气')) {
    aiResponse = '抱歉，我暂时无法获取实时天气信息。建议您查看天气应用或网站获取准确的天气预报。'
  } else if (userInput.includes('帮助') || userInput.includes('功能')) {
    aiResponse = '我可以帮助您：\n1. 回答一般性问题\n2. 提供时间信息\n3. 进行简单对话\n4. 协助解决问题\n\n请随时告诉我您需要什么帮助！'
  } else {
    const responses = [
      '这是一个很有趣的问题，让我想想...',
      '我理解您的意思，这确实需要仔细考虑。',
      '根据您的描述，我建议您可以尝试不同的方法。',
      '感谢您的提问，这让我学到了新东西。',
      '我会尽力帮助您解决这个问题。'
    ]
    aiResponse = responses[Math.floor(Math.random() * responses.length)]
  }
  
  isAiTyping.value = false
  
  // 添加AI回复
  const aiMessage: Message = {
    id: Date.now().toString(),
    type: 'ai',
    content: aiResponse,
    timestamp: Date.now()
  }
  
  messages.value.push(aiMessage)
  scrollToBottom()
}

// 关闭窗口
const handleClose = () => {
  emit('close')
}

// 最小化窗口
const handleMinimize = () => {
  emit('minimize')
}

// 监听可见性变化，自动滚动到底部
watch(() => props.visible, (newVisible) => {
  if (newVisible) {
    scrollToBottom()
  }
})
</script>

<style scoped lang="scss">
.chat-window {
  position: fixed;
  width: 450px;
  height: 600px;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  z-index: 9998;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  
  &--left {
    transform-origin: left top;
  }
  
  &--right {
    transform-origin: right top;
  }
}

.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  
  .chat-title {
    display: flex;
    align-items: center;
    gap: 12px;
    
    .chat-avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      object-fit: cover;
      border: 2px solid rgba(255, 255, 255, 0.3);
    }
    
    .chat-name {
      font-weight: 600;
      font-size: 16px;
    }
    
    .chat-status {
      font-size: 12px;
      opacity: 0.8;
      background: rgba(255, 255, 255, 0.2);
      padding: 2px 8px;
      border-radius: 10px;
    }
  }
  
  .chat-actions {
    display: flex;
    gap: 4px;
    
    .action-btn {
      width: 28px;
      height: 28px;
      border-radius: 6px;
      color: rgba(255, 255, 255, 0.8);
      transition: all 0.2s ease;
      
      &:hover {
        background: rgba(255, 255, 255, 0.2);
        color: white;
      }
      
      &.close-btn:hover {
        background: rgba(255, 59, 48, 0.8);
      }
    }
  }
}

.chat-messages {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
  background: #f8f9fa;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.2);
    border-radius: 3px;
    
    &:hover {
      background: rgba(0, 0, 0, 0.3);
    }
  }
}

.message-item {
  display: flex;
  margin-bottom: 16px;
  
  &--user {
    flex-direction: row-reverse;
    
    .message-bubble {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      margin-left: 12px;
      margin-right: 0;
    }
    
    .message-time {
      color: rgba(255, 255, 255, 0.8);
    }
  }
  
  &--ai {
    .message-bubble {
      background: white;
      color: #333;
      margin-right: 12px;
      border: 1px solid rgba(0, 0, 0, 0.1);
    }
  }
}

.message-avatar {
  flex-shrink: 0;
  
  .avatar-img {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    object-fit: cover;
  }
  
  .user-avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
  }
}

.message-content {
  flex: 1;
  min-width: 0;
}

.message-bubble {
  max-width: 320px;
  padding: 12px 16px;
  border-radius: 18px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  
  .message-text {
    line-height: 1.4;
    word-wrap: break-word;
    white-space: pre-wrap;
  }
  
  .message-time {
    font-size: 11px;
    opacity: 0.7;
    margin-top: 4px;
  }
  
  &.typing-indicator {
    padding: 16px;
    
    .typing-dots {
      display: flex;
      gap: 4px;
      
      span {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: #999;
        animation: typing 1.4s infinite ease-in-out;
        
        &:nth-child(1) { animation-delay: 0s; }
        &:nth-child(2) { animation-delay: 0.2s; }
        &:nth-child(3) { animation-delay: 0.4s; }
      }
    }
  }
}

@keyframes typing {
  0%, 60%, 100% {
    transform: scale(0.8);
    opacity: 0.5;
  }
  30% {
    transform: scale(1);
    opacity: 1;
  }
}

.chat-input {
  padding: 16px 20px;
  background: white;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  
  .input-container {
    display: flex;
    gap: 12px;
    align-items: flex-end;
    
    .message-input {
      flex: 1;
      
      :deep(.el-textarea__inner) {
        border-radius: 20px;
        border: 1px solid #e0e0e0;
        padding: 12px 16px;
        resize: none;
        font-size: 14px;
        line-height: 1.4;
        
        &:focus {
          border-color: #667eea;
          box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.2);
        }
      }
    }
    
    .send-btn {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border: none;
      display: flex;
      align-items: center;
      justify-content: center;
      
      &:hover {
        transform: scale(1.05);
      }
      
      &:disabled {
        opacity: 0.5;
        transform: none;
      }
    }
  }
  
  .input-tips {
    margin-top: 8px;
    
    .tip-text {
      font-size: 12px;
      color: #999;
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .chat-window {
    width: 320px;
    height: 450px;
  }
  
  .message-bubble {
    max-width: 240px;
  }
}
</style>