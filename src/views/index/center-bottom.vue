<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { getEnergyForecast } from "@/utils/mockData";
import { graphic } from "echarts/core";
import dayjs from "dayjs";

const chartOption = ref({});
const logs = ref<any[]>([]);
const scrollRef = ref<HTMLElement | null>(null);
const scrollOffset = ref(0);
let animationFrameId: number;
let globalIdCounter = 0;

// 本地模拟数据源
const locations = ["1号楼", "2号楼", "3号楼", "中央大厅", "东区停车场", "西区冷站", "北区雪场", "南区入口", "极地馆", "冰滑梯"];
const devices = ["空调机组", "照明系统", "新风机组", "变压器", "电梯", "安防摄像头", "造雪机", "水泵", "配电箱", "传感器"];
const eventMap = {
  normal: ["运行状态良好", "自动巡检完成", "能耗指标正常", "温度控制稳定", "自动校准完成", "数据上传成功"],
  info: ["需进行例行维护", "进入节能模式", "检测到人员流动", "系统自动备份", "参数自动优化", "滤网清洁提醒"],
  emergency: ["检测到故障信号", "设备离线", "温度超标报警", "负载率过高", "电压波动异常", "连接超时"]
};

// 获取单条新日志
const getNewLog = () => {
  globalIdCounter++;
  const rand = Math.random() * 100;
  let type = '';
  let levelText = '';
  let eventList: string[] = [];

  // 概率控制: 80% 正常(绿色), 15% 一般(蓝色), 5% 紧急(红色)
  if (rand < 80) {
    type = 'suggestion'; // 对应绿色样式
    levelText = '正常';
    eventList = eventMap.normal;
  } else if (rand < 95) {
    type = 'info'; // 对应蓝色样式
    levelText = '一般';
    eventList = eventMap.info;
  } else {
    type = 'warning'; // 对应红色样式
    levelText = '紧急';
    eventList = eventMap.emergency;
  }

  const loc = locations[Math.floor(Math.random() * locations.length)];
  const dev = devices[Math.floor(Math.random() * devices.length)];
  const evt = eventList[Math.floor(Math.random() * eventList.length)];
  const content = `${loc}${dev}${evt} [编号:${1000 + globalIdCounter}]`;

  return {
    id: `log-${globalIdCounter}`,
    time: dayjs().format("HH:mm:ss"),
    type,
    level: levelText,
    content,
    title: content.substring(0, 10) + "..."
  };
};

const initData = () => {
  // Chart Data
  const rawData = getEnergyForecast();
  const tempData = rawData.series[0].data.map(v => -10 - (v % 15)); 
  const iceData = rawData.series[1].data.map(v => 90 + (v % 10));

  chartOption.value = {
    tooltip: { trigger: "axis", axisPointer: { type: "shadow" } },
    legend: {
      data: ["温度预测", "冰层状态"],
      textStyle: { color: "#B4B4B4" },
      top: "0",
      right: "10%"
    },
    grid: {
      left: "10px", right: "10px", bottom: "10px", top: "30px", containLabel: true
    },
    xAxis: {
      type: "category",
      data: rawData.categories,
      axisLine: { lineStyle: { color: "#B4B4B4" } },
      axisLabel: { color: "#B4B4B4" }
    },
    yAxis: [
      {
        type: "value", name: "温度(℃)",
        axisLine: { lineStyle: { color: "#B4B4B4" } },
        splitLine: { show: false },
        axisLabel: { color: "#B4B4B4" }
      },
      {
        type: "value", name: "状态(%)", min: 0, max: 100,
        axisLine: { lineStyle: { color: "#B4B4B4" } },
        splitLine: { show: false },
        axisLabel: { color: "#B4B4B4" }
      }
    ],
    series: [
      {
        name: "温度预测", type: "line", smooth: true, data: tempData,
        tooltip: { valueFormatter: (value) => Number(value).toFixed(2) + ' ℃' },
        itemStyle: { color: "#00fdfa" },
        areaStyle: {
          color: new graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: "rgba(0, 253, 250, 0.5)" },
            { offset: 1, color: "rgba(0, 253, 250, 0)" }
          ])
        }
      },
      {
        name: "冰层状态", type: "line", smooth: true, yAxisIndex: 1, data: iceData,
        tooltip: { valueFormatter: (value) => Number(value).toFixed(2) + ' %' },
        itemStyle: { color: "#e3b337" }
      }
    ]
  };

  // 初始化日志列表 (填满容器)
  for(let i=0; i<15; i++) {
    logs.value.push(getNewLog());
  }
  
  startScroll();
};

const startScroll = () => {
  const animate = () => {
    scrollOffset.value += 0.5; // 滚动速度
    
    // 当滚动高度超过一行的高度 (40px)
    if (scrollOffset.value >= 40) {
      scrollOffset.value = 0;
      logs.value.shift(); // 移除顶部
      logs.value.push(getNewLog()); // 底部追加新数据
    }
    
    animationFrameId = requestAnimationFrame(animate);
  };
  animate();
};

onMounted(() => {
  initData();
});

onUnmounted(() => {
  cancelAnimationFrame(animationFrameId);
});
</script>

<template>
  <div class="center_bottom">
    <div class="chart-box">
      <v-chart class="chart" :option="chartOption" autoresize v-if="JSON.stringify(chartOption) != '{}'" />
    </div>
    <div class="log-box">
      <div class="scroll-container" ref="scrollRef">
        <div class="log-list" :style="{ transform: `translateY(-${scrollOffset}px)` }">
          <div v-for="item in logs" :key="item.id" class="log-item">
            <span class="time">{{ item.time }}</span>
            <span class="level" :class="item.type">{{ item.level }}</span>
            <span class="content" :title="item.content">{{ item.content }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.center_bottom {
  width: 100%;
  height: 94%; // 稍微减小高度，防止溢出
  margin-top: 1%; // 稍微下移
  display: flex;
  gap: 20px;

  .chart-box {
    flex: 2;
    height: 100%;
    min-width: 0;
    
    .chart {
      width: 100%;
      height: 100%;
    }
  }

  .log-box {
    flex: 1;
    height: 100%;
    display: flex;
    flex-direction: column;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 4px;
    padding: 10px;
    overflow: hidden;

    .scroll-container {
      width: 100%;
      height: 100%;
      overflow: hidden;
      position: relative;
    }

    .log-list {
      width: 100%;
      // 不需要 absolute，直接流式布局，通过 transform 移动
    }

    .log-item {
      display: flex;
      align-items: center;
      height: 40px; // 固定高度，与 JS 逻辑对应
      font-size: 13px;
      color: #fff;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      box-sizing: border-box;

      .time {
        width: 70px;
        color: rgba(255, 255, 255, 0.6);
        flex-shrink: 0;
      }

      .level {
        width: 40px;
        text-align: center;
        margin-right: 10px;
        border-radius: 2px;
        flex-shrink: 0;
        
        &.warning {
          color: #ff4d4f;
          background: rgba(255, 77, 79, 0.1);
        }
        &.info {
          color: #1890ff;
          background: rgba(24, 144, 255, 0.1);
        }
        &.suggestion {
          color: #52c41a;
          background: rgba(82, 196, 26, 0.1);
        }
      }

      .content {
        flex: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
}
</style>
