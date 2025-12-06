<script setup lang="ts">
import { ref, onMounted } from "vue";
import ItemWrap from "@/components/item-wrap";
import ChartModal from "@/components/chart-modal.vue";
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { LineChart, PieChart, ScatterChart } from "echarts/charts";
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
} from "echarts/components";
import VChart, { THEME_KEY } from "vue-echarts";

use([
  CanvasRenderer,
  LineChart,
  PieChart,
  ScatterChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
]);


// 生成年份数据
const generateYearData = () => {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let i = currentYear - 9; i <= currentYear; i++) {
    years.push(i.toString());
  }
  return years;
};

// 行业大类数据
const industryMajorData = [
  { name: "电力、热力、燃气及水生产和供应业", value: 520 },
  { name: "制造业", value: 380 },
  { name: "采矿业", value: 180 },
  { name: "农、林、牧、渔业", value: 120 },
  { name: "交通运输、仓储和邮政业", value: 90 },
  { name: "信息传输、软件和信息技术服务业", value: 40 },
];

// 行业中类数据
const industryMediumData = [
  { name: "电力、热力生产和供应业", value: 350 },
  { name: "黑色金属冶炼和压延加工业", value: 220 },
  { name: "非金属矿物制品业", value: 180 },
  { name: "造纸和纸制品业", value: 150 },
  { name: "煤炭开采和洗选业", value: 120 },
  { name: "石油天然气开采业", value: 100 },
  { name: "通用设备制造业", value: 80 },
  { name: "其他", value: 30 },
];

// 行业细类数据
const industryDetailData = [
  { name: "电力生产", value: 280 },
  { name: "热力生产和供应", value: 200 },
  { name: "水泥、石灰和石膏制造", value: 180 },
  { name: "常用有色金属冶炼", value: 150 },
  { name: "玻璃制造", value: 120 },
  { name: "石油开采", value: 100 },
  { name: "烟煤和无烟煤开采洗选", value: 80 },
  { name: "其他", value: 120 },
];

// 计算总量
const calculateTotal = (data: any[]) => {
  return data.reduce((sum, item) => sum + item.value, 0);
};

// 工具函数：生成指定范围的随机数（保留指定小数位）
const randomInRange = (min: number, max: number, decimals = 0): number => {
  const v = Math.random() * (max - min) + min;
  return parseFloat(v.toFixed(decimals));
};

// 图表放大相关
const modalVisible = ref(false);
const modalTitle = ref('');

const handleChartZoom = (title: string) => {
  modalTitle.value = title;
  modalVisible.value = true;
};

const handleModalClose = () => {
  modalVisible.value = false;
  modalTitle.value = '';
};

// 上方数据
const topData = ref([
  {
    label: "能耗总量",
    value: calculateTotal(industryMajorData).toLocaleString(),
    unit: "万吨标煤",
  },
  {
    label: "碳排放总量",
    value: (calculateTotal(industryMajorData) * 2.1).toFixed(0),
    unit: "万吨CO2e",
  },
  {
    label: "能耗强度",
    value: "0.52",
    unit: "吨标煤/万元",
  },
  {
    label: "碳排放强度",
    value: "1.09",
    unit: "吨CO2e/万元",
  },
  {
    label: "重点企业数量",
    value: "1,248",
    unit: "家",
  },
  {
    label: "监测覆盖率",
    value: "98.5",
    unit: "%",
  },
  {
    label: "达标企业数量",
    value: "1,189",
    unit: "家",
  },
  {
    label: "达标率",
    value: "95.3",
    unit: "%",
  },
]);

// 折线图配置（ABCD四个地区）
const lineChartOption = ref({
  tooltip: {
    trigger: "axis",
    backgroundColor: "rgba(0,0,0,.6)",
    borderColor: "rgba(147, 235, 248, .8)",
    textStyle: {
      color: "#FFF",
    },
  },
  legend: {
    data: ["A地区", "B地区", "C地区", "D地区"],
    bottom: 10,
    textStyle: {
      color: "#fff",
      fontSize: 12,
    },
  },
  xAxis: {
    type: "category",
    data: generateYearData(),
    axisLabel: {
      color: "#fff",
    },
    axisLine: {
      lineStyle: {
        color: "#fff",
      },
    },
  },
  yAxis: {
    type: "value",
    name: "万吨标煤",
    nameTextStyle: {
      color: "#fff",
    },
    axisLabel: {
      color: "#fff",
    },
    axisLine: {
      lineStyle: {
        color: "#fff",
      },
    },
  },
  series: [
    {
      name: "A地区",
      type: "line",
      data: [280, 290, 305, 315, 325, 340, 350, 365, 375, 385],
      itemStyle: { color: "#FF6B6B" },
      lineStyle: { color: "#FF6B6B" },
    },
    {
      name: "B地区",
      type: "line",
      data: [320, 335, 345, 360, 370, 380, 395, 405, 415, 425],
      itemStyle: { color: "#4ECDC4" },
      lineStyle: { color: "#4ECDC4" },
    },
    {
      name: "C地区",
      type: "line",
      data: [250, 265, 275, 290, 300, 320, 335, 345, 360, 370],
      itemStyle: { color: "#45B7D1" },
      lineStyle: { color: "#45B7D1" },
    },
    {
      name: "D地区",
      type: "line",
      data: [380, 375, 385, 390, 395, 405, 410, 420, 430, 440],
      itemStyle: { color: "#96CEB4" },
      lineStyle: { color: "#96CEB4" },
    },
  ],
});

// 饼图配置（ABCDEF六个地区能耗占比）
const regionPieOption = ref({
  tooltip: {
    trigger: "item",
    backgroundColor: "rgba(0,0,0,.6)",
    borderColor: "rgba(147, 235, 248, .8)",
    textStyle: {
      color: "#FFF",
    },
    formatter: "{b}: {c}万吨标煤 ({d}%)",
  },
  legend: {
    data: ["A地区", "B地区", "C地区", "D地区", "E地区", "F地区"],
    orient: "vertical",
    right: 10,
    top: "center",
    textStyle: {
      color: "#fff",
      fontSize: 12,
    },
  },
  series: [
    {
      name: "区域占比",
      type: "pie",
      radius: ["40%", "70%"],
      data: [
        { value: 280, name: "A地区", itemStyle: { color: "#FF6B6B" } },
        { value: 320, name: "B地区", itemStyle: { color: "#4ECDC4" } },
        { value: 250, name: "C地区", itemStyle: { color: "#45B7D1" } },
        { value: 380, name: "D地区", itemStyle: { color: "#96CEB4" } },
        { value: 180, name: "E地区", itemStyle: { color: "#FFEAA7" } },
        { value: 120, name: "F地区", itemStyle: { color: "#DDA0DD" } },
      ],
      label: {
        color: "#fff",
        fontSize: 10,
      },
    },
  ],
});

// 散点图1配置（企业-总量）
const scatterChart1Option = ref({
  tooltip: {
    trigger: "item",
    backgroundColor: "rgba(0,0,0,.6)",
    borderColor: "rgba(147, 235, 248, .8)",
    textStyle: {
      color: "#FFF",
    },
    formatter: function (params) {
      return `${params.seriesName}<br/>能耗: ${params.data[0]}万吨标煤<br/>碳排放: ${params.data[1]}万吨CO2e`;
    },
  },
  legend: {
    data: ["钢铁企业", "化工企业", "电力企业", "建材企业", "有色企业"],
    bottom: 10,
    textStyle: {
      color: "#fff",
      fontSize: 12,
    },
  },
  xAxis: {
    type: "value",
    name: "万吨标煤",
    nameTextStyle: {
      color: "#fff",
    },
    axisLabel: {
      color: "#fff",
    },
    axisLine: {
      lineStyle: {
        color: "#fff",
      },
    },
  },
  yAxis: {
    type: "value",
    name: "万吨CO2e",
    nameTextStyle: {
      color: "#fff",
    },
    axisLabel: {
      color: "#fff",
    },
    axisLine: {
      lineStyle: {
        color: "#fff",
      },
    },
  },
  series: [
    {
      name: "钢铁企业",
      type: "scatter",
      data: [[randomInRange(100, 300, 0), randomInRange(250, 650, 0)]],
      itemStyle: { color: "#FF6B6B" },
    },
    {
      name: "化工企业",
      type: "scatter",
      data: [[randomInRange(80, 160, 0), randomInRange(160, 350, 0)]],
      itemStyle: { color: "#4ECDC4" },
    },
    {
      name: "电力企业",
      type: "scatter",
      data: [[randomInRange(200, 380, 0), randomInRange(500, 820, 0)]],
      itemStyle: { color: "#45B7D1" },
    },
    {
      name: "建材企业",
      type: "scatter",
      data: [[randomInRange(60, 160, 0), randomInRange(120, 340, 0)]],
      itemStyle: { color: "#96CEB4" },
    },
    {
      name: "有色企业",
      type: "scatter",
      data: [[randomInRange(140, 200, 0), randomInRange(260, 400, 0)]],
      itemStyle: { color: "#FFEAA7" },
    },
  ],
});

// 散点图2配置（企业-强度）
const scatterChart2Option = ref({
  tooltip: {
    trigger: "item",
    backgroundColor: "rgba(0,0,0,.6)",
    borderColor: "rgba(147, 235, 248, .8)",
    textStyle: {
      color: "#FFF",
    },
    formatter: function (params) {
      return `${params.seriesName}<br/>能耗强度: ${params.data[0]}吨标煤/万元<br/>碳排放强度: ${params.data[1]}吨CO2e/万元`;
    },
  },
  legend: {
    data: ["钢铁企业", "化工企业", "电力企业", "建材企业", "有色企业"],
    bottom: 10,
    textStyle: {
      color: "#fff",
      fontSize: 12,
    },
  },
  xAxis: {
    type: "value",
    name: "吨标煤/万元",
    nameTextStyle: {
      color: "#fff",
    },
    axisLabel: {
      color: "#fff",
    },
    axisLine: {
      lineStyle: {
        color: "#fff",
      },
    },
  },
  yAxis: {
    type: "value",
    name: "吨CO2e/万元",
    nameTextStyle: {
      color: "#fff",
    },
    axisLabel: {
      color: "#fff",
    },
    axisLine: {
      lineStyle: {
        color: "#fff",
      },
    },
  },
  series: [
    {
      name: "钢铁企业",
      type: "scatter",
      data: [[randomInRange(2.5, 4.5, 1), randomInRange(6.0, 10.5, 1)]],
      itemStyle: { color: "#FF6B6B" },
    },
    {
      name: "化工企业",
      type: "scatter",
      data: [[randomInRange(4.5, 6.5, 1), randomInRange(10.0, 15.0, 1)]],
      itemStyle: { color: "#4ECDC4" },
    },
    {
      name: "电力企业",
      type: "scatter",
      data: [[randomInRange(9.0, 15.0, 1), randomInRange(20.0, 32.0, 1)]],
      itemStyle: { color: "#45B7D1" },
    },
    {
      name: "建材企业",
      type: "scatter",
      data: [[randomInRange(1.2, 3.5, 1), randomInRange(2.5, 6.0, 1)]],
      itemStyle: { color: "#96CEB4" },
    },
    {
      name: "有色企业",
      type: "scatter",
      data: [[randomInRange(6.5, 10.5, 1), randomInRange(15.0, 23.0, 1)]],
      itemStyle: { color: "#FFEAA7" },
    },
  ],
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
        <div v-for="(item, index) in topData" :key="index" class="data-item">
          <div class="data-label">{{ item.label }}</div>
          <div class="data-value">
            {{ item.value }} <span class="data-unit">{{ item.unit }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 中间3/7：左边折线图，右边饼图 -->
    <div class="middle-section">
      <ItemWrap class="chart-item" title="能耗总量-历史趋势" @zoom="handleChartZoom('能耗总量-历史趋势')">
        <v-chart class="chart" :option="lineChartOption" />
      </ItemWrap>
      <ItemWrap class="chart-item" title="能耗总量-区域占比" @zoom="handleChartZoom('能耗总量-区域占比')">
        <v-chart class="chart" :option="regionPieOption" />
      </ItemWrap>
    </div>

    <!-- 下方3/7：左右两边平均分的散点图 -->
    <div class="bottom-section">
      <ItemWrap class="scatter-chart" title="企业-总量" @zoom="handleChartZoom('企业-总量')">
        <v-chart class="chart" :option="scatterChart1Option" />
      </ItemWrap>
      <ItemWrap class="scatter-chart" title="企业-强度" @zoom="handleChartZoom('企业-强度')">
        <v-chart class="chart" :option="scatterChart2Option" />
      </ItemWrap>
    </div>
  </div>

  <ChartModal 
    :visible="modalVisible" 
    :title="modalTitle" 
    @close="handleModalClose"
  >
    <v-chart v-if="modalTitle === '能耗总量-历史趋势'" class="chart" :option="lineChartOption" />
    <v-chart v-if="modalTitle === '能耗总量-区域占比'" class="chart" :option="regionPieOption" />
    <v-chart v-if="modalTitle === '企业-总量'" class="chart" :option="scatterChart1Option" />
    <v-chart v-if="modalTitle === '企业-强度'" class="chart" :option="scatterChart2Option" />
  </ChartModal>
</template>

<style scoped lang="scss">
.analysis-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 20px;
  box-sizing: border-box;
  gap: 20px;
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
  border: 1px solid rgba(255, 107, 0, 0.3);
  border-radius: 6px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  transition: all 0.3s ease;

  &:hover {
    border-color: rgba(255, 107, 0, 0.6);
    box-shadow: 0 0 15px rgba(255, 107, 0, 0.3);
  }

  .data-label {
    color: rgba(255, 255, 255, 0.8);
    font-size: 12px;
    margin-bottom: 4px;
  }

  .data-value {
    color: #ffb000;
    font-size: 16px;
    font-weight: bold;

    .data-unit {
      font-size: 12px;
      color: rgba(255, 255, 255, 0.6);
      margin-left: 4px;
    }
  }
}

// 中间3/7区域
.middle-section {
  flex: 3;
  display: flex;
  gap: 24px;
  min-height: 0;
}

.chart-item {
  flex: 1;
  height: 100%;

  .chart {
    height: 100%;
  }
}

// 下方3/7区域
.bottom-section {
  flex: 3;
  display: flex;
  gap: 24px;
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