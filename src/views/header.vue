<script setup lang="ts">
import { reactive, ref } from "vue";
import dayjs from "dayjs";
import type { DateDataType } from "./index.d";
import { useSettingStore } from "@/stores/index";
import { useRouter, useRoute } from "vue-router";

const dateData = reactive<DateDataType>({
  dateDay: "",
  dateYear: "",
  dateWeek: "",
  timing: null,
});

const router = useRouter();
const route = useRoute();
const { setSettingShow } = useSettingStore();
const weekday = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];

// 导航菜单配置
const navItems = ref([
  { name: "首页", path: "/index" },
  { name: "能源行业综合分析", path: "/analysis" },
  { name: "能源行业趋势", path: "/trend" },
  { name: "能源区域分析", path: "/supervision" },
  { name: "环保监测", path: "/environmental" },
  { name: "政策法规", path: "/policy" },
  { name: "数据报告", path: "/report" },
]);

// 导航栏展开状态
const isNavExpanded = ref(false);

// 导航点击处理
const handleNavClick = (item: any) => {
  router.push(item.path);
};

// 鼠标进入导航区域
const handleNavMouseEnter = () => {
  isNavExpanded.value = true;
};

// 鼠标离开导航区域
const handleNavMouseLeave = () => {
  isNavExpanded.value = false;
};

const timeFn = () => {
  dateData.timing = setInterval(() => {
    dateData.dateDay = dayjs().format("YYYY-MM-DD hh : mm : ss");
    dateData.dateWeek = weekday[dayjs().day()];
  }, 1000);
};
timeFn();
</script>

<template>
  <div class="title_wrap">
    <div class="zuojuxing"></div>
    <div class="youjuxing"></div>
    <div class="guang"></div>

    <!-- 左侧导航栏 -->
    <div
      class="nav-container"
      @mouseenter="handleNavMouseEnter"
      @mouseleave="handleNavMouseLeave"
    >
      <nav class="nav-menu" :class="{ expanded: isNavExpanded }">
        <!-- 首页按钮（始终显示） -->
        <div
          class="nav-item home-item"
          :class="{ active: route.path === '/index' }"
          @click="handleNavClick(navItems[0])"
        >
          {{ navItems[0].name }}
        </div>

        <!-- 展开箭头（折叠状态显示） -->
        <div class="nav-arrow" v-show="!isNavExpanded">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path
              d="M9 18L15 12L9 6"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>

        <!-- 其他导航项（展开状态显示） -->
        <div
          v-for="item in navItems.slice(1)"
          :key="item.path"
          class="nav-item other-item"
          :class="{ active: route.path === item.path }"
          @click="handleNavClick(item)"
          v-show="isNavExpanded"
        >
          {{ item.name }}
        </div>
      </nav>
    </div>

    <!-- 中间标题 -->
    <div class="title-container">
      <div class="title">
        <span class="title-text">新能源实时能源监测系统</span>
      </div>
    </div>

    <!-- 右侧时间 -->
    <div class="timers">
      {{ dateData.dateYear }} {{ dateData.dateWeek }} {{ dateData.dateDay }}
      <div class="setting_icon" @click="setSettingShow(true)">
        <img src="@/assets/img/headers/setting.png" alt="设置" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.title_wrap {
  height: 60px;
  background-image: url("../assets/img/top.png");
  background-size: cover;
  background-position: center center;
  position: relative;
  margin-bottom: 4px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;

  .guang {
    position: absolute;
    bottom: -26px;
    background-image: url("../assets/img/guang.png");
    background-position: 80px center;
    width: 100%;
    height: 56px;
  }

  .zuojuxing,
  .youjuxing {
    position: absolute;
    top: -2px;
    width: 140px;
    height: 6px;
    background-image: url("../assets/img/headers/juxing1.png");
  }

  .zuojuxing {
    left: 11%;
  }

  .youjuxing {
    right: 11%;
    transform: rotate(180deg);
  }

  // 左侧导航栏样式
  .nav-container {
    position: absolute;
    left: 20px;
    top: 50%;
    transform: translateY(-50%);
    z-index: 10;
  }

  .nav-menu {
    display: flex;
    align-items: center;
    gap: 6px;
    transition: all 0.3s ease;

    &.expanded {
      gap: 8px;
    }
  }

  .nav-item {
    padding: 6px 12px;
    font-size: 12px;
    color: rgba(255, 255, 255, 0.8);
    background: rgba(0, 0, 0, 0.3);
    border: 1px solid rgba(147, 235, 248, 0.3);
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.3s ease;
    backdrop-filter: blur(5px);
    white-space: nowrap;
    position: relative;
    overflow: hidden;

    &::before {
      content: "";
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(
        90deg,
        transparent,
        rgba(147, 235, 248, 0.2),
        transparent
      );
      transition: left 0.5s ease;
    }

    &:hover {
      color: #00eaff;
      border-color: rgba(147, 235, 248, 0.6);
      background: rgba(0, 0, 0, 0.5);
      box-shadow: 0 0 15px rgba(147, 235, 248, 0.3);
      transform: translateY(-1px);

      &::before {
        left: 100%;
      }
    }

    &.active {
      color: #00eaff;
      background: rgba(0, 234, 255, 0.1);
      border-color: #00eaff;
      box-shadow: 0 0 20px rgba(0, 234, 255, 0.4);
    }
  }

  .home-item {
    // 首页按钮样式保持不变
  }

  .other-item {
    opacity: 0;
    transform: translateX(-10px);
    animation: slideIn 0.3s ease forwards;

    @for $i from 1 through 6 {
      &:nth-child(#{$i + 2}) {
        animation-delay: #{$i * 0.05}s;
      }
    }
  }

  .nav-arrow {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    color: rgba(255, 255, 255, 0.6);
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      color: #00eaff;
      transform: translateX(2px);
    }
  }

  @keyframes slideIn {
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  // 中间标题容器
  .title-container {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    z-index: 5;
  }

  .title {
    margin: 0 auto;
    position: relative;
    text-align: center;
    background-size: cover;
    color: transparent;
    height: 60px;
    line-height: 46px;

    .title-text {
      text-align: center;
      font-size: 38px;
      font-weight: 900;
      letter-spacing: 6px;
      width: 100%;
      background: linear-gradient(
        92deg,
        #0072ff 0%,
        #00eaff 48.8525390625%,
        #01aaff 100%
      );
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }

  // 右侧时间样式
  .timers {
    position: absolute;
    right: 20px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 18px;
    display: flex;
    align-items: center;
    color: rgba(255, 255, 255, 0.9);
    z-index: 5;

    .setting_icon {
      width: 20px;
      height: 20px;
      cursor: pointer;
      margin-left: 12px;
      transition: transform 0.3s ease;

      &:hover {
        transform: rotate(90deg);
      }

      img {
        width: 100%;
        height: 100%;
      }
    }
  }
}
</style>
