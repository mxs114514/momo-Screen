<script setup lang="ts">
import { ref, onMounted } from "vue";
import ItemWrap from "@/components/item-wrap";

// 页面数据
const pageTitle = ref("能源区域分析");

onMounted(() => {
  console.log("能源区域分析页面已加载");
});
</script>

<template>
  <div class="supervision-container">
    <div class="page-header">
      <h2 class="page-title">{{ pageTitle }}</h2>
    </div>

    <div class="content-area">
      <ItemWrap title="项目监管">
        <div class="placeholder-content">
          <p>能源区域分析内容待完善...</p>
        </div>
      </ItemWrap>
    </div>
  </div>
</template>

<style scoped lang="scss">
.supervision-container {
  width: 100%;
  height: calc(100vh - 64px);
  padding: 16px;
  box-sizing: border-box;
}

.page-header {
  margin-bottom: 24px;

  .page-title {
    color: #00eaff;
    font-size: 24px;
    font-weight: bold;
    text-align: center;
    margin: 0;
    text-shadow: 0 0 10px rgba(0, 234, 255, 0.5);
  }
}

.content-area {
  height: calc(100% - 80px);
}

.placeholder-content {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
  color: rgba(255, 255, 255, 0.6);
  font-size: 16px;
}
</style>