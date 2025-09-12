<script setup lang="ts">
import { ref, onMounted } from "vue";
import { graphic } from "echarts";
import ItemWrap from "@/components/item-wrap";

// 上方八组数据
const topData = ref([
  { label: "能耗总量", value: "1230", unit: "万吨标准煤" },
  { label: "能耗强度", value: "12", unit: "吨标煤/万元" },
  { label: "碳排放量", value: "2680", unit: "万吨CO2e" },
  { label: "碳排强度", value: "26.1", unit: "吨CO2e/万元" },
]);

// 柱状图配置
const barChartOption = ref({
  title: {
    text: "能源消耗历史趋势图",
    textStyle: {
      color: "#fff",
      fontSize: 16,
    },
  },
  tooltip: {
    trigger: "axis",
    backgroundColor: "rgba(0,0,0,.6)",
    borderColor: "rgba(147, 235, 248, .8)",
    textStyle: {
      color: "#FFF",
    },
    formatter: function (params) {
      return `${params[0].name}年<br/>能耗总量: ${params[0].value}万吨标煤`;
    },
  },
  xAxis: {
    type: "category",
    data: ["2010", "2012", "2014", "2016", "2018", "2020"],
    axisLabel: {
      color: "#7EB7FD",
    },
    axisLine: {
      lineStyle: {
        color: "rgba(31,99,163,.3)",
      },
    },
  },
  yAxis: {
    type: "value",
    name: "万吨标煤",
    nameTextStyle: {
      color: "#7EB7FD",
    },
    axisLabel: {
      color: "#7EB7FD",
    },
    axisLine: {
      lineStyle: {
        color: "rgba(31,99,163,.3)",
      },
    },
    splitLine: {
      lineStyle: {
        color: "rgba(31,99,163,.1)",
      },
    },
  },
  series: [
    {
      data: [800, 900, 1050, 1250, 1500, 1800],
      type: "bar",
      itemStyle: {
        color: new graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: "#0BFC7F" },
          { offset: 1, color: "#A3FDE0" },
        ]),
      },
    },
  ],
});

// 饼图1配置（行业大类）
const pieChart1Option = ref({
  tooltip: {
    trigger: "item",
    backgroundColor: "rgba(0,0,0,.6)",
    borderColor: "rgba(147, 235, 248, .8)",
    textStyle: {
      color: "#FFF",
    },
    formatter: "{b}: {c}万吨标煤 ({d}%)",
  },
  series: [
    {
      name: "行业大类",
      type: "pie",
      radius: ["40%", "70%"],
      data: [
        {
          value: 420,
          name: "电力、热力、燃气及水生产和供应业",
          itemStyle: { color: "#F4023C" },
        },
        { value: 380, name: "制造业", itemStyle: { color: "#F48C02" } },
        { value: 180, name: "采矿业", itemStyle: { color: "#0BFC7F" } },
        {
          value: 120,
          name: "农、林、牧、渔业",
          itemStyle: { color: "#09CAF3" },
        },
        {
          value: 90,
          name: "交通运输、仓储和邮政业",
          itemStyle: { color: "#A8E6CF" },
        },
        {
          value: 40,
          name: "信息传输、软件和信息技术服务业",
          itemStyle: { color: "#FFD93D" },
        },
      ],
      label: {
        color: "#fff",
        fontSize: 10,
      },
    },
  ],
});

// 饼图2配置（行业中类）
const pieChart2Option = ref({
  tooltip: {
    trigger: "item",
    backgroundColor: "rgba(0,0,0,.6)",
    borderColor: "rgba(147, 235, 248, .8)",
    textStyle: {
      color: "#FFF",
    },
    formatter: "{b}: {c}万吨标煤 ({d}%)",
  },
  series: [
    {
      name: "行业中类",
      type: "pie",
      radius: ["40%", "70%"],
      data: [
        {
          value: 350,
          name: "电力、热力生产和供应业",
          itemStyle: { color: "#FF6B6B" },
        },
        {
          value: 220,
          name: "黑色金属冶炼和压延加工业",
          itemStyle: { color: "#4ECDC4" },
        },
        {
          value: 180,
          name: "非金属矿物制品业",
          itemStyle: { color: "#45B7D1" },
        },
        { value: 150, name: "造纸和纸制品业", itemStyle: { color: "#96CEB4" } },
        {
          value: 120,
          name: "煤炭开采和洗选业",
          itemStyle: { color: "#FFEAA7" },
        },
        {
          value: 100,
          name: "石油天然气开采业",
          itemStyle: { color: "#DDA0DD" },
        },
        { value: 80, name: "通用设备制造业", itemStyle: { color: "#98FB98" } },
        { value: 30, name: "其他", itemStyle: { color: "#F0E68C" } },
      ],
      label: {
        color: "#fff",
        fontSize: 10,
      },
    },
  ],
});

// 饼图3配置（行业细类）
const pieChart3Option = ref({
  tooltip: {
    trigger: "item",
    backgroundColor: "rgba(0,0,0,.6)",
    borderColor: "rgba(147, 235, 248, .8)",
    textStyle: {
      color: "#FFF",
    },
    formatter: "{b}: {c}万吨标煤 ({d}%)",
  },
  series: [
    {
      name: "行业细类",
      type: "pie",
      radius: ["40%", "70%"],
      data: [
        { value: 280, name: "电力生产", itemStyle: { color: "#A8E6CF" } },
        { value: 200, name: "热力生产和供应", itemStyle: { color: "#FFD93D" } },
        {
          value: 180,
          name: "水泥、石灰和石膏制造",
          itemStyle: { color: "#6BCF7F" },
        },
        {
          value: 150,
          name: "常用有色金属冶炼",
          itemStyle: { color: "#FF9999" },
        },
        { value: 120, name: "玻璃制造", itemStyle: { color: "#87CEEB" } },
        { value: 100, name: "石油开采", itemStyle: { color: "#DDA0DD" } },
        {
          value: 80,
          name: "烟煤和无烟煤开采洗选",
          itemStyle: { color: "#F0E68C" },
        },
        { value: 120, name: "其他", itemStyle: { color: "#D3D3D3" } },
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
      data: [
        [85, 195],
        [145, 315],
        [220, 485],
        [280, 620],
      ],
      itemStyle: { color: "#FF6B6B" },
    },
    {
      name: "化工企业",
      type: "scatter",
      data: [
        [65, 140],
        [95, 205],
        [125, 270],
        [155, 335],
      ],
      itemStyle: { color: "#4ECDC4" },
    },
    {
      name: "电力企业",
      type: "scatter",
      data: [
        [320, 720],
        [380, 860],
        [450, 1020],
      ],
      itemStyle: { color: "#45B7D1" },
    },
    {
      name: "建材企业",
      type: "scatter",
      data: [
        [45, 98],
        [75, 162],
        [105, 228],
        [135, 294],
        [165, 358],
      ],
      itemStyle: { color: "#96CEB4" },
    },
    {
      name: "有色企业",
      type: "scatter",
      data: [
        [110, 245],
        [140, 315],
        [185, 415],
        [225, 505],
      ],
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
      data: [
        [1.2, 2.8],
        [2.8, 6.5],
        [4.5, 10.2],
        [6.2, 14.8],
      ],
      itemStyle: { color: "#FF6B6B" },
    },
    {
      name: "化工企业",
      type: "scatter",
      data: [
        [3.8, 8.2],
        [5.5, 12.1],
        [7.2, 15.8],
      ],
      itemStyle: { color: "#4ECDC4" },
    },
    {
      name: "电力企业",
      type: "scatter",
      data: [
        [8.5, 18.5],
        [12.3, 26.8],
        [15.8, 34.2],
      ],
      itemStyle: { color: "#45B7D1" },
    },
    {
      name: "建材企业",
      type: "scatter",
      data: [
        [0.8, 1.5],
        [1.5, 2.8],
        [2.2, 4.1],
        [2.9, 5.5],
        [3.6, 6.8],
      ],
      itemStyle: { color: "#96CEB4" },
    },
    {
      name: "有色企业",
      type: "scatter",
      data: [
        [4.2, 9.5],
        [6.8, 15.2],
        [9.5, 21.8],
        [12.1, 28.5],
      ],
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

    <!-- 中间3/7：一个柱状图和三个饼状图并列排成一排 -->
    <div class="middle-section">
      <ItemWrap class="chart-item" title="能耗总量-历史趋势">
        <v-chart class="chart" :option="barChartOption" />
      </ItemWrap>
      <ItemWrap class="chart-item" title="能耗总量-行业大类">
        <v-chart class="chart" :option="pieChart1Option" />
      </ItemWrap>
      <ItemWrap class="chart-item" title="能耗总量-行业中类">
        <v-chart class="chart" :option="pieChart2Option" />
      </ItemWrap>
      <ItemWrap class="chart-item" title="能耗总量-行业细类">
        <v-chart class="chart" :option="pieChart3Option" />
      </ItemWrap>
    </div>

    <!-- 下方3/7：左右两边平均分的散点图 -->
    <div class="bottom-section">
      <ItemWrap class="scatter-chart" title="企业-总量">
        <v-chart class="chart" :option="scatterChart1Option" />
      </ItemWrap>
      <ItemWrap class="scatter-chart" title="企业-强度">
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
  padding: 20px;
  box-sizing: border-box;
  gap: 24px;
  background-image: url("@/assets/img/pageBg.png");
  background-size: cover;
  background-position: center center;
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
  border-radius: 6px;
  padding: 12px;
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
    font-size: 12px;
    margin-bottom: 4px;
  }

  .data-value {
    color: #00eaff;
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