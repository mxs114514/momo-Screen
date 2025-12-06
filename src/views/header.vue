<script setup lang="ts">
import { reactive, ref, onMounted } from "vue";
import dayjs from "dayjs";
import type { DateDataType } from "./index.d";
import { useSettingStore } from "@/stores/index";
import { useRouter, useRoute } from "vue-router";
import { getEnvironmentData, randomInt } from "@/utils/mockData";

const dateData = reactive<DateDataType>({
  dateDay: "",
  dateYear: "",
  dateWeek: "",
  timing: null,
});

const weatherData = reactive({
  temp: 0,
  weather: '晴',
  icon: '☀️'
});

const router = useRouter();
const route = useRoute();
const { setSettingShow } = useSettingStore();
const weekday = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];

// 导航菜单配置
const navItems = ref([
  { name: "首页", path: "/index" },
  { name: "智能预警中心", path: "/warning" },
  { name: "AI 策略与优化", path: "/ai-strategy" },
  { name: "能碳数据报表", path: "/energy-report" },
  { name: "碳资产区块链", path: "/carbon-blockchain" },
  { name: "边缘计算监控", path: "/edge-monitor" },
  { name: "环保贡献大屏", path: "/environmental-contribution" },
  { name: "冰雪能源行业综合分析", path: "/analysis" },
  { name: "冰雪能源行业趋势", path: "/trend" },
  { name: "冰雪能源区域分析", path: "/supervision" },
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
    dateData.dateDay = dayjs().format("YYYY-MM-DD HH:mm:ss");
    dateData.dateWeek = weekday[dayjs().day()];
  }, 1000);
};

const updateWeather = () => {
  const env = getEnvironmentData();
  weatherData.temp = env.temperature;
  const weathers = ['晴', '多云', '阴', '小雨'];
  const icons = ['☀️', '⛅', '☁️', '🌧️'];
  const idx = randomInt(0, 3);
  weatherData.weather = weathers[idx];
  weatherData.icon = icons[idx];
};

onMounted(() => {
  timeFn();
  updateWeather();
  setInterval(updateWeather, 60000);
});
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
        <div class="nav-items-container" v-show="isNavExpanded">
          <!-- 第一行：5个项目 -->
          <div class="nav-row first-row">
            <div
              v-for="item in navItems.slice(1, 6)"
              :key="item.path"
              class="nav-item other-item"
              :class="{ active: route.path === item.path }"
              @click="handleNavClick(item)"
            >
              {{ item.name }}
            </div>
          </div>
          <!-- 第二行：4个项目 -->
          <div class="nav-row second-row">
            <div
              v-for="item in navItems.slice(6)"
              :key="item.path"
              class="nav-item other-item"
              :class="{ active: route.path === item.path }"
              @click="handleNavClick(item)"
            >
              {{ item.name }}
            </div>
          </div>
        </div>
      </nav>
    </div>

    <!-- 中间标题 -->
    <div class="title-container">
      <div class="title">
        <span class="title-text">冰雪能源可视化实时监测系统</span>
      </div>
      <div class="welcome-msg" v-if="route.path === '/index'">欢迎莅临智慧园区指导工作</div>
    </div>

    <!-- 右侧时间与天气 -->
    <div class="timers">
      <span class="weather-info">{{ weatherData.icon }} {{ weatherData.weather }} {{ weatherData.temp }}℃</span>
      <span class="time-info">{{ dateData.dateYear }} {{ dateData.dateWeek }} {{ dateData.dateDay }}</span>
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
    align-items: flex-start;
    gap: 6px;
    transition: all 0.3s ease;

    &.expanded {
      gap: 12px;
      align-items: flex-start;
    }
  }

  .nav-items-container {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .nav-row {
    display: flex;
    align-items: center;
    gap: 8px;

    &.first-row {
      // 第一行样式
    }

    &.second-row {
      // 第二行样式
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
    &:hover {
      transform: none; // 覆盖通用悬停效果，保持位置不变
    }
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
    display: flex;
    flex-direction: column;
    align-items: center;
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

  .welcome-msg {
    font-size: 14px;
    color: #a1e5ff;
    letter-spacing: 4px;
    margin-top: -10px;
    text-shadow: 0 0 5px rgba(0, 114, 255, 0.5);
    animation: fadeIn 1s ease-in-out;
    font-weight: bold;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(5px); }
    to { opacity: 1; transform: translateY(0); }
  }

  // 右侧时间样式
  .timers {
    position: absolute;
    right: 0;
    top: 30px;
    font-size: 18px;
    display: flex;
    align-items: center;
    color: #fff;
    
    .weather-info {
      margin-right: 20px;
      font-size: 16px;
      color: #00eaff;
      display: flex;
      align-items: center;
      gap: 5px;
    }

    .time-info {
      margin-right: 10px;
    }

    .setting_icon {
      width: 20px;
      height: 20px;
      cursor: pointer;
      margin-left: 10px;
      margin-right: 20px;
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
}
</style>
