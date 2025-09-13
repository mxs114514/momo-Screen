import OpenAI from 'openai'

// AI服务配置
interface AIConfig {
  apiKey: string
  baseURL: string
  model: string
}

// 消息接口
interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

class AIService {
  private openai: OpenAI | null = null
  private config: AIConfig
  private conversationHistory: ChatMessage[] = []

  constructor() {
    this.config = {
      apiKey: import.meta.env.VITE_ARK_API_KEY || '',
      baseURL: import.meta.env.VITE_AI_BASE_URL || '',
      model: import.meta.env.VITE_AI_MODEL || '' // 默认模型ID
    }

    console.log('AI服务配置:', {
      apiKey: this.config.apiKey ? `${this.config.apiKey.substring(0, 8)}...` : '未设置',
      baseURL: this.config.baseURL,
      model: this.config.model
    })

    this.initializeClient()
  }

  /**
   * 初始化OpenAI客户端
   */
  private initializeClient(): void {
    try {
      this.openai = new OpenAI({
        apiKey: this.config.apiKey,
        baseURL: this.config.baseURL,
        dangerouslyAllowBrowser: true // 允许在浏览器中使用
      })

      // 初始化系统消息
      this.conversationHistory = [
        {
          role: 'system',
          content: '你是一个专业的AI智能监测助手，身份类似于秘书，帮助用户监看各种能源数据收入数据等等，管理整个公司的大部分事务。能够帮助用户解答各种问题。请用简洁、友好的语言回答用户的问题。注意永远不要说自己不会回答或者不知道怎么回答用户的问题，你可以在合理合适的范围内编，一定要合理且使人信服，即使是你的资料库里没用的东西也必须假装知道，注意也不要让用户发现你其实不知道。'
        }
      ]

      console.log('AI服务初始化成功')
    } catch (error) {
      console.error('AI服务初始化失败:', error)
    }
  }

  /**
   * 发送聊天消息
   * @param message 用户消息
   * @returns AI回复
   */
  async chat(message: string): Promise<string> {
    if (!this.openai) {
      throw new Error('AI服务未初始化')
    }

    if (!message.trim()) {
      throw new Error('消息不能为空')
    }

    try {
      // 添加用户消息到历史记录
      const userMessage: ChatMessage = {
        role: 'user',
        content: message.trim()
      }
      this.conversationHistory.push(userMessage)

      // 保持对话历史在合理范围内（最多保留最近10轮对话）
      if (this.conversationHistory.length > 21) { // 1个系统消息 + 20个对话消息
        this.conversationHistory = [
          this.conversationHistory[0], // 保留系统消息
          ...this.conversationHistory.slice(-20) // 保留最近20条消息
        ]
      }

      console.log('发送消息到AI服务:', message)
      console.log('当前对话历史长度:', this.conversationHistory.length)

      // 调用OpenAI API
      const completion = await this.openai.chat.completions.create({
        messages: this.conversationHistory,
        model: this.config.model,
        max_tokens: 1000,
        temperature: 0.7,
        stream: false
      })

      const aiResponse = completion.choices[0]?.message?.content
      
      if (!aiResponse) {
        throw new Error('AI服务返回空响应')
      }

      // 添加AI回复到历史记录
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: aiResponse
      }
      this.conversationHistory.push(assistantMessage)

      console.log('AI回复:', aiResponse)
      return aiResponse

    } catch (error: any) {
      console.error('AI服务调用失败:', error)
      
      // 移除刚添加的用户消息（因为请求失败）
      if (this.conversationHistory.length > 1) {
        this.conversationHistory.pop()
      }

      // 根据错误类型返回不同的错误信息
      if (error.code === 'insufficient_quota') {
        throw new Error('API配额不足，请检查账户余额')
      } else if (error.code === 'invalid_api_key') {
        throw new Error('API密钥无效，请检查配置')
      } else if (error.code === 'model_not_found') {
        throw new Error('指定的模型不存在，请检查模型配置')
      } else if (error.message?.includes('network')) {
        throw new Error('网络连接失败，请检查网络状态')
      } else {
        throw new Error(`AI服务调用失败: ${error.message || '未知错误'}`)
      }
    }
  }

  /**
   * 流式聊天（暂未实现，预留接口）
   * @param message 用户消息
   * @param onChunk 接收流式数据的回调
   */
  async chatStream(
    message: string, 
    onChunk: (chunk: string) => void
  ): Promise<void> {
    if (!this.openai) {
      throw new Error('AI服务未初始化')
    }

    try {
      const userMessage: ChatMessage = {
        role: 'user',
        content: message.trim()
      }
      this.conversationHistory.push(userMessage)

      const stream = await this.openai.chat.completions.create({
        messages: this.conversationHistory,
        model: this.config.model,
        max_tokens: 1000,
        temperature: 0.7,
        stream: true
      })

      let fullResponse = ''
      
      for await (const part of stream) {
        const content = part.choices[0]?.delta?.content || ''
        if (content) {
          fullResponse += content
          onChunk(content)
        }
      }

      // 添加完整回复到历史记录
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: fullResponse
      }
      this.conversationHistory.push(assistantMessage)

    } catch (error: any) {
      console.error('流式AI服务调用失败:', error)
      // 移除刚添加的用户消息
      if (this.conversationHistory.length > 1) {
        this.conversationHistory.pop()
      }
      throw error
    }
  }

  /**
   * 清空对话历史
   */
  clearHistory(): void {
    this.conversationHistory = [
      {
        role: 'system',
        content: '你是一个专业的AI助手，能够帮助用户解答各种问题。请用简洁、友好的语言回答用户的问题。'
      }
    ]
    console.log('对话历史已清空')
  }

  /**
   * 获取当前对话历史长度
   */
  getHistoryLength(): number {
    return this.conversationHistory.length - 1 // 减去系统消息
  }

  /**
   * 更新配置
   * @param newConfig 新的配置
   */
  updateConfig(newConfig: Partial<AIConfig>): void {
    this.config = { ...this.config, ...newConfig }
    this.initializeClient()
  }

  /**
   * 检查服务状态
   */
  async checkStatus(): Promise<boolean> {
    try {
      if (!this.openai) {
        return false
      }
      
      // 发送一个简单的测试消息
      await this.openai.chat.completions.create({
        messages: [{ role: 'user', content: 'test' }],
        model: this.config.model,
        max_tokens: 1
      })
      
      return true
    } catch (error) {
      console.error('AI服务状态检查失败:', error)
      return false
    }
  }
}

// 导出单例实例
export const aiService = new AIService()
export default aiService

// 导出类型
export type { ChatMessage, AIConfig }