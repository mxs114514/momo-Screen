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
const chatVisible = ref(false);
const chatPosition = ref({ x: 0, y: 0 });
const chatIsLeftSide = ref(false);

// 处理悬浮球点击事件
const handleFloatingBallClick = (position: { x: number; y: number }, isLeftSide: boolean) => {
  chatPosition.value = position;
  chatIsLeftSide.value = isLeftSide;
  chatVisible.value = true;
};

// 处理聊天窗口关闭事件
const handleChatClose = () => {
  chatVisible.value = false;
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
  <Setting />
  
  <!-- AI悬浮球和聊天窗口 -->
  <FloatingBall @click="handleFloatingBallClick" />
  <ChatWindow 
    :visible="chatVisible"
    :position="chatPosition"
    :isLeftSide="chatIsLeftSide"
    @close="handleChatClose"
  />
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
