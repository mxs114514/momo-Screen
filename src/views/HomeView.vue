<script setup lang="ts">
import { ref } from "vue";
import { RouterView } from "vue-router";
import ScaleScreen from "@/components/scale-screen";
import Headers from "./header.vue";
import Setting from "./setting.vue";
import { useSettingStore } from "@/stores/index";
import { storeToRefs } from "pinia";
import MessageContent from "@/components/Plugins/MessageContent";
import FloatingBall from "@/components/FloatingBall/index.vue";
import ChatWindow from "@/components/ChatWindow/index.vue";

const settingStore = useSettingStore();
const { isScale } = storeToRefs(settingStore);
const wrapperStyle = {};

// 聊天窗口状态
const chatWindowVisible = ref(false);
const floatingBallPosition = ref({ x: 0, y: 0 });
const chatWindowSide = ref<'left' | 'right'>('right');

// 悬浮球点击处理
const handleFloatingBallClick = (position: { x: number; y: number }) => {
  floatingBallPosition.value = position;
  
  // 根据悬浮球位置决定聊天窗口显示在哪一侧
  const screenWidth = window.innerWidth;
  chatWindowSide.value = position.x < screenWidth / 2 ? 'left' : 'right';
  
  chatWindowVisible.value = true;
};

// 悬浮球位置变化处理
const handleFloatingBallPositionChange = (position: { x: number; y: number }) => {
  floatingBallPosition.value = position;
  
  // 如果聊天窗口打开，更新侧边
  if (chatWindowVisible.value) {
    const screenWidth = window.innerWidth;
    chatWindowSide.value = position.x < screenWidth / 2 ? 'left' : 'right';
  }
};

// 聊天窗口关闭处理
const handleChatWindowClose = () => {
  chatWindowVisible.value = false;
};

// 聊天窗口最小化处理
const handleChatWindowMinimize = () => {
  chatWindowVisible.value = false;
};
</script>

<template>
  <scale-screen
    width="1920"
    height="1080"
    :delay="500"
    :fullScreen="false"
    :boxStyle="{
      background: '#03050C',
      overflow: isScale ? 'hidden' : 'auto',
    }"
    :wrapperStyle="wrapperStyle"
    :autoScale="isScale"
  >
    <div class="content_wrap">
      <Headers />
      <RouterView />
      <MessageContent />
    </div>
  </scale-screen>
  
  <!-- 悬浮球组件 - 移到ScaleScreen外部以确保fixed定位正常工作 -->
  <FloatingBall
    @click="handleFloatingBallClick"
    @position-change="handleFloatingBallPositionChange"
  />
  <!-- AI聊天窗口 -->
  <ChatWindow
    :visible="chatWindowVisible"
    :position="floatingBallPosition"
    :side="chatWindowSide"
    @close="handleChatWindowClose"
    @minimize="handleChatWindowMinimize"
  />
  <Setting />
</template>
<style lang="scss" scoped>
.content_wrap {
  width: 100%;
  height: 100%;
  padding: 16px 16px 16px 16px;
  box-sizing: border-box;
  background-image: url("@/assets/img/pageBg.png");
  background-size: cover;
  background-position: center center;
}
</style>
