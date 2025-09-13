# 🚀 IofTV-Screen-Vue3 智能大屏项目

> 一个充满魅力的数据可视化大屏项目，现在还带了个会聊天的小助手！ 🤖✨

## 📖 项目简介

这是一个基于 [IofTV-Screen](https://github.com/daidaibg/IofTV-Screen) 的增强版本，我们在原有的酷炫大屏基础上，加入了更多实用功能和现代化体验。就像给一辆跑车装上了智能导航系统一样！🏎️

## ✨ 新增特色功能

### 🔐 1. 全新登录界面

- 精美的登录页面设计
- 前端验证机制（是的，我们很诚实，就是前端比对 😄）
- 流畅的登录体验

### 🎨 2. 首页视觉升级

- 优化了展示内容和动画效果
- 更加丝滑的用户体验
- 让数据"活"起来的动态效果

### 🧭 3. 智能导航系统

- 新增导航栏，告别迷路的烦恼
- 多个仪表盘和列表界面
- 更丰富的数据展示维度

### 🤖 4. AI 智能助手（重磅功能！）

- 悬浮窗设计，随时待命
- 支持简单问答交互
- 基于火山引擎豆包大模型
- 让你的大屏不再孤单！

## 🛠️ 技术栈

- **前端框架**: Vue 3 + TypeScript
- **构建工具**: Vite
- **样式方案**: SCSS + TailwindCSS
- **AI 服务**: OpenAI SDK + 火山引擎 ARK API
- **数据可视化**: ECharts

## 🚀 快速开始

```bash
# 克隆项目
git clone [your-repo-url]

# 进入项目目录
cd IofTV-Screen-Vue3

# 安装依赖
npm install
# 或者
pnpm install

# 启动开发服务器
npm run dev
```

## 🤖 AI 助手配置指南

想要体验智能助手功能？跟着这个步骤走就对了！

### 第一步：获取 API 密钥

1. 前往 [火山引擎控制台](https://console.volcengine.com/ark)
2. 申请豆包大模型的 API 访问权限
3. 获取你的 API Key 和端点 ID

### 第二步：配置环境变量（建议这么干，但是本人太懒直接写代码里了）

在 aiService.ts 填写你上一步获得的各种东西：
this.config = {
apiKey: import.meta.env.VITE_ARK_API_KEY || '',
baseURL: import.meta.env.VITE_AI_BASE_URL || '',
model: import.meta.env.VITE_AI_MODEL || '' // 默认模型 ID
}

### 第三步：享受 AI 对话

配置完成后，你就可以点击页面右侧的悬浮球，开始与 AI 助手愉快聊天了！🎉

## 🎭 项目特点

### 📊 纯前端项目

- **无后端依赖**: 轻装上阵，部署简单
- **模拟数据**: 所有展示数据都是精心设计的假数据（但看起来很真！）
- **前端验证**: 登录验证直接在前端完成（我们很坦诚 😊）

### 🎨 现代化设计

- 响应式布局，适配各种屏幕
- 流畅的动画效果
- 深色主题，护眼又酷炫

### 🔧 开发友好

- TypeScript 全面支持
- 组件化架构
- 清晰的代码结构

## 📁 项目结构

```
IofTV-Screen-Vue3/
├── src/
│   ├── components/          # 组件库
│   │   ├── ChatWindow/      # AI聊天窗口
│   │   └── FloatingBall/    # 悬浮球组件
│   ├── services/            # 服务层
│   │   └── aiService.ts     # AI服务配置
│   ├── views/               # 页面视图
│   ├── assets/              # 静态资源
│   └── utils/               # 工具函数
├── .env.development         # 开发环境配置
├── .env.production          # 生产环境配置
└── README.md               # 你正在看的这个文件
```

## 🙏 致谢

感谢原项目 [IofTV-Screen](https://github.com/daidaibg/IofTV-Screen) 提供的优秀基础！

---

**💡 小贴士**: 我喜欢你！ 😉
