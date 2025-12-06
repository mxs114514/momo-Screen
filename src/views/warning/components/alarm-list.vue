<script setup lang="ts">
import { defineProps } from 'vue';
import SeamlessScroll from "@/components/seamless-scroll/seamless-scroll.vue";

interface AlarmData {
  id: string;
  level: 'High' | 'Medium' | 'Low';
  desc: string;
  time: string;
  status: string;
  area: string;
}

const props = defineProps<{
  data: AlarmData[]
}>();

const getLevelColor = (level: string) => {
  switch (level) {
    case 'High': return '#ff4d4f';
    case 'Medium': return '#faad14';
    case 'Low': return '#52c41a';
    default: return '#fff';
  }
};
</script>

<template>
  <div class="alarm-list-container">
    <div class="header">
      <span class="col-id">ID</span>
      <span class="col-time">时间</span>
      <span class="col-area">区域</span>
      <span class="col-desc">描述</span>
      <span class="col-level">级别</span>
      <span class="col-status">状态</span>
    </div>
    <div class="scroll-wrapper">
      <SeamlessScroll :list="props.data" :step="0.5" :hover="true" :limitScrollNum="5">
        <ul class="list">
          <li v-for="(item, index) in props.data" :key="index" class="list-item">
            <span class="col-id">{{ item.id }}</span>
            <span class="col-time">{{ item.time }}</span>
            <span class="col-area">{{ item.area }}</span>
            <span class="col-desc" :title="item.desc">{{ item.desc }}</span>
            <span class="col-level">
              <span class="tag" :style="{ backgroundColor: getLevelColor(item.level) }">
                {{ item.level === 'High' ? '紧急' : item.level === 'Medium' ? '重要' : '一般' }}
              </span>
            </span>
            <span class="col-status" :class="{ 'done': item.status === '已处理' }">
              {{ item.status }}
            </span>
          </li>
        </ul>
      </SeamlessScroll>
    </div>
  </div>
</template>

<style scoped lang="scss">
.alarm-list-container {
  width: 100%;
  height: 90%;
  margin-top: 2%;
  display: flex;
  flex-direction: column;
  padding: 10px;
  box-sizing: border-box;
  color: #fff;
}

.header {
  display: flex;
  padding: 10px 0;
  background: rgba(255, 255, 255, 0.1);
  font-weight: bold;
  font-size: 14px;
  color: #00eaff;
}

.scroll-wrapper {
  flex: 1;
  overflow: hidden;
  position: relative;
}

.list {
  padding: 0;
  margin: 0;
  list-style: none;
}

.list-item {
  display: flex;
  padding: 12px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  font-size: 13px;
  align-items: center;

  &:hover {
    background: rgba(255, 255, 255, 0.05);
  }
}

.col-id { width: 10%; text-align: center; }
.col-time { width: 20%; text-align: center; }
.col-area { width: 15%; text-align: center; }
.col-desc { width: 30%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; padding: 0 5px; }
.col-level { width: 10%; text-align: center; }
.col-status { width: 15%; text-align: center; color: #ff4d4f; }
.col-status.done { color: #52c41a; }

.tag {
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 12px;
  color: #fff;
}
</style>