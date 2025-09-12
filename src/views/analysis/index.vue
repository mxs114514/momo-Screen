<script setup lang="ts">
import { ref, onMounted } from "vue";
import { graphic } from "echarts";
import ItemWrap from "@/components/item-wrap";

// 上方八组数据
const topData = ref([
  { label: "待填写", value: "待填写", unit: "" },
  { label: "待填写", value: "待填写", unit: "" },
  { label: "待填写", value: "待填写", unit: "" },
  { label: "待填写", value: "待填写", unit: "" },
  { label: "待填写", value: "待填写", unit: "" },
  { label: "待填写", value: "待填写", unit: "" },
  { label: "待填写", value: "待填写", unit: "" },
  { label: "待填写", value: "待填写", unit: "" }
]);

// 柱状图配置
const barChartOption = ref({
  title: {
    text: "能源消耗柱状图",
    textStyle: {
      color: "#fff",
      fontSize: 16
    }
  },
  tooltip: {
    trigger: "axis",
    backgroundColor: "rgba(0,0,0,.6)",
    borderColor: "rgba(147, 235, 248, .8)",
    textStyle: {
      color: "#FFF"
    }
  },
  xAxis: {
    type: "category",
    data: ["煤炭", "石油", "天然气", "水电", "风电", "太阳能"],
    axisLabel: {
      color: "#7EB7FD"
    },
    axisLine: {
      lineStyle: {
        color: "rgba(31,99,163,.3)"
      }
    }
  },
  yAxis: {
    type: "value",
    axisLabel: {
      color: "#7EB7FD"
    },
    axisLine: {
      lineStyle: {
        color: "rgba(31,99,163,.3)"
      }
    },
    splitLine: {
      lineStyle: {
        color: "rgba(31,99,163,.1)"
      }
    }
  },
  series: [{
    data: [120, 200, 150, 80, 70, 110],
    type: "bar",
    itemStyle: {
      color: new graphic.LinearGradient(0, 0, 0, 1, [
        { offset: 0, color: "#0BFC7F" },
        { offset: 1, color: "#A3FDE0" }
      ])
    }
  }]
});

// 饼图1配置
const pieChart1Option = ref({
  title: {
    text: "能源结构分布",
    textStyle: {
      color: "#fff",
      fontSize: 14
    }
  },
  tooltip: {
    trigger: "item",
    backgroundColor: "rgba(0,0,0,.6)",
    borderColor: "rgba(147, 235, 248, .8)",
    textStyle: {
      color: "#FFF"
    }
  },
  series: [{
    name: "能源结构",
    type: "pie",
    radius: ["40%", "70%"],
    data: [
      { value: 35, name: "煤炭", itemStyle: { color: "#F4023C" } },
      { value: 25, name: "石油", itemStyle: { color: "#F48C02" } },
      { value: 20, name: "天然气", itemStyle: { color: "#0BFC7F" } },
      { value: 20, name: "新能源", itemStyle: { color: "#09CAF3" } }
    ],
    label: {
      color: "#fff"
    }
  }]
});

// 饼图2配置
const pieChart2Option = ref({
  title: {
    text: "区域分布",
    textStyle: {
      color: "#fff",
      fontSize: 14
    }
  },
  tooltip: {
    trigger: "item",
    backgroundColor: "rgba(0,0,0,.6)",
    borderColor: "rgba(147, 235, 248, .8)",
    textStyle: {
      color: "#FFF"
    }
  },
  series: [{
    name: "区域分布",
    type: "pie",
    radius: ["40%", "70%"],
    data: [
      { value: 30, name: "华北", itemStyle: { color: "#FF6B6B" } },
      { value: 25, name: "华东", itemStyle: { color: "#4ECDC4" } },
      { value: 20, name: "华南", itemStyle: { color: "#45B7D1" } },
      { value: 15, name: "西北", itemStyle: { color: "#96CEB4" } },
      { value: 10, name: "其他", itemStyle: { color: "#FFEAA7" } }
    ],
    label: {
      color: "#fff"
    }
  }]
});

// 饼图3配置
const pieChart3Option = ref({
  title: {
    text: "项目类型",
    textStyle: {
      color: "#fff",
      fontSize: 14
    }
  },
  tooltip: {
    trigger: "item",
    backgroundColor: "rgba(0,0,0,.6)",
    borderColor: "rgba(147, 235, 248, .8)",
    textStyle: {
      color: "#FFF"
    }
  },
  series: [{
    name: "项目类型",
    type: "pie",
    radius: ["40%", "70%"],
    data: [
      { value: 40, name: "A类项目", itemStyle: { color: "#A8E6CF" } },
      { value: 35, name: "B类项目", itemStyle: { color: "#FFD93D" } },
      { value: 25, name: "C类项目", itemStyle: { color: "#6BCF7F" } }
    ],
    label: {
      color: "#fff"
    }
  }]
});

// 散点图1配置（企业-总量）
const scatterChart1Option = ref({
  title: {
    text: "企业-总量散点图",
    textStyle: {
      color: "#fff",
      fontSize: 16
    }
  },
  tooltip: {
    trigger: "item",
    backgroundColor: "rgba(0,0,0,.6)",
    borderColor: "rgba(147, 235, 248, .8)",
    textStyle: {
      color: "#FFF"
    }
  },
  xAxis: {
    type: "value",
    name: "企业规模",
    nameTextStyle: {
      color: "#7EB7FD"
    },
    axisLabel: {
      color: "#7EB7FD"
    },
    axisLine: {
      lineStyle: {
        color: "rgba(31,99,163,.3)"
      }
    },
    splitLine: {
      lineStyle: {
        color: "rgba(31,99,163,.1)"
      }
    }
  },
  yAxis: {
    type: "value",
    name: "能源总量",
    nameTextStyle: {
      color: "#7EB7FD"
    },
    axisLabel: {
      color: "#7EB7FD"
    },
    axisLine: {
      lineStyle: {
        color: "rgba(31,99,163,.3)"
      }
    },
    splitLine: {
      lineStyle: {
        color: "rgba(31,99,163,.1)"
      }
    }
  },
  series: [{
    type: "scatter",
    data: [
      [10, 20], [15, 35], [20, 45], [25, 55], [30, 65],
      [35, 75], [40, 85], [45, 95], [50, 105], [55, 115]
    ],
    itemStyle: {
      color: "#0BFC7F",
      shadowColor: "#0BFC7F",
      shadowBlur: 10
    },
    symbolSize: 8
  }]
});

// 散点图2配置（企业-强度）
const scatterChart2Option = ref({
  title: {
    text: "企业-强度散点图",
    textStyle: {
      color: "#fff",
      fontSize: 16
    }
  },
  tooltip: {
    trigger: "item",
    backgroundColor: "rgba(0,0,0,.6)",
    borderColor: "rgba(147, 235, 248, .8)",
    textStyle: {
      color: "#FFF"
    }
  },
  xAxis: {
    type: "value",
    name: "企业规模",
    nameTextStyle: {
      color: "#7EB7FD"
    },
    axisLabel: {
      color: "#7EB7FD"
    },
    axisLine: {
      lineStyle: {
        color: "rgba(31,99,163,.3)"
      }
    },
    splitLine: {
      lineStyle: {
        color: "rgba(31,99,163,.1)"
      }
    }
  },
  yAxis: {
    type: "value",
    name: "能源强度",
    nameTextStyle: {
      color: "#7EB7FD"
    },
    axisLabel: {
      color: "#7EB7FD"
    },
    axisLine: {
      lineStyle: {
        color: "rgba(31,99,163,.3)"
      }
    },
    splitLine: {
      lineStyle: {
        color: "rgba(31,99,163,.1)"
      }
    }
  },
  series: [{
    type: "scatter",
    data: [
      [10, 15], [15, 25], [20, 30], [25, 40], [30, 45],
      [35, 50], [40, 60], [45, 65], [50, 70], [55, 80]
    ],
    itemStyle: {
      color: "#09CAF3",
      shadowColor: "#09CAF3",
      shadowBlur: 10
    },
    symbolSize: 8
  }]
});

onMounted(() => {
  console.log("能源行业综合分析页面已加载");
});
</script>

<template>
  <div class="analysis-container">
    <!-- 上方1/7：两行四列八组数据 -->
    <div class="top-section">
      <div class="data-grid">
        <div 
          v-for="(item, index) in topData" 
          :key="index"
          class="data-item"
        >
          <div class="data-label">{{ item.label }}</div>
          <div class="data-value">{{ item.value }} <span class="data-unit">{{ item.unit }}</span></div>
        </div>
      </div>
    </div>

    <!-- 中间3/7：一个柱状图和三个饼状图 -->
    <div class="middle-section">
      <div class="chart-container">
        <ItemWrap class="bar-chart" title="">
          <v-chart class="chart" :option="barChartOption" />
        </ItemWrap>
      </div>
      <div class="pie-charts">
        <ItemWrap class="pie-chart" title="">
          <v-chart class="chart" :option="pieChart1Option" />
        </ItemWrap>
        <ItemWrap class="pie-chart" title="">
          <v-chart class="chart" :option="pieChart2Option" />
        </ItemWrap>
        <ItemWrap class="pie-chart" title="">
          <v-chart class="chart" :option="pieChart3Option" />
        </ItemWrap>
      </div>
    </div>

    <!-- 下方3/7：左右两边平均分的散点图 -->
    <div class="bottom-section">
      <ItemWrap class="scatter-chart" title="">
        <v-chart class="chart" :option="scatterChart1Option" />
      </ItemWrap>
      <ItemWrap class="scatter-chart" title="">
        <v-chart class="chart" :option="scatterChart2Option" />
      </ItemWrap>
    </div>
  </div>
</template>

<style scoped lang="scss">
.analysis-container {
  width: 100%;
  height: calc(100vh - 64px);
  display: flex;
  flex-direction: column;
  padding: 16px;
  box-sizing: border-box;
  gap: 16px;
}

// 上方1/7区域
.top-section {
  flex: 1;
  min-height: 0;
}

.data-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: 16px;
  height: 100%;
}

.data-item {
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(147, 235, 248, 0.3);
  border-radius: 8px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  backdrop-filter: blur(5px);
  transition: all 0.3s ease;

  &:hover {
    border-color: rgba(147, 235, 248, 0.6);
    box-shadow: 0 0 15px rgba(147, 235, 248, 0.3);
  }

  .data-label {
    color: rgba(255, 255, 255, 0.8);
    font-size: 14px;
    margin-bottom: 8px;
  }

  .data-value {
    color: #00eaff;
    font-size: 20px;
    font-weight: bold;
    
    .data-unit {
      font-size: 14px;
      color: rgba(255, 255, 255, 0.6);
      margin-left: 4px;
    }
  }
}

// 中间3/7区域
.middle-section {
  flex: 3;
  display: flex;
  gap: 16px;
  min-height: 0;
}

.chart-container {
  flex: 1;
  
  .bar-chart {
    height: 100%;
    
    .chart {
      height: 100%;
    }
  }
}

.pie-charts {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
  
  .pie-chart {
    flex: 1;
    
    .chart {
      height: 100%;
    }
  }
}

// 下方3/7区域
.bottom-section {
  flex: 3;
  display: flex;
  gap: 16px;
  min-height: 0;
  
  .scatter-chart {
    flex: 1;
    
    .chart {
      height: 100%;
    }
  }
}

// 图表通用样式
.chart {
  width: 100%;
  min-height: 200px;
}
</style>