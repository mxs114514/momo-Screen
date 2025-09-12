<script setup lang="ts">
import { ref, onMounted } from "vue";
import { graphic } from "echarts";
import VChart from "vue-echarts";
import ItemWrap from "@/components/item-wrap";

// 生成2018-2024年的年份数据
const years = ["2018", "2019", "2020", "2021", "2022", "2023", "2024"];

// 行业大类数据（基于综合分析页面的分类）
const industryMajorData = {
  "电力、热力、燃气及水生产和供应业": [420, 435, 450, 465, 480, 495, 510],
  "制造业": [380, 390, 400, 410, 420, 430, 440],
  "采矿业": [180, 175, 170, 165, 160, 155, 150],
  "农、林、牧、渔业": [120, 125, 130, 135, 140, 145, 150],
  "交通运输、仓储和邮政业": [90, 95, 100, 105, 110, 115, 120],
  "信息传输、软件和信息技术服务业": [40, 45, 50, 55, 60, 65, 70]
};

// 行业中类数据
const industryMediumData = {
  "电力、热力生产和供应业": [350, 365, 380, 395, 410, 425, 440],
  "黑色金属冶炼和压延加工业": [220, 225, 230, 235, 240, 245, 250],
  "非金属矿物制品业": [180, 185, 190, 195, 200, 205, 210],
  "造纸和纸制品业": [150, 155, 160, 165, 170, 175, 180],
  "煤炭开采和洗选业": [120, 115, 110, 105, 100, 95, 90],
  "石油天然气开采业": [100, 105, 110, 115, 120, 125, 130],
  "通用设备制造业": [80, 85, 90, 95, 100, 105, 110],
  "其他": [30, 32, 34, 36, 38, 40, 42]
};

// 行业细类数据
const industryDetailData = {
  "电力生产": [280, 290, 300, 310, 320, 330, 340],
  "热力生产和供应": [200, 205, 210, 215, 220, 225, 230],
  "水泥、石灰和石膏制造": [180, 185, 190, 195, 200, 205, 210],
  "常用有色金属冶炼": [150, 155, 160, 165, 170, 175, 180],
  "玻璃制造": [120, 125, 130, 135, 140, 145, 150],
  "石油开采": [100, 105, 110, 115, 120, 125, 130],
  "烟煤和无烟煤开采洗选": [80, 75, 70, 65, 60, 55, 50],
  "其他": [120, 125, 130, 135, 140, 145, 150]
};

// 计算总量数据
const calculateTotalData = (data: Record<string, number[]>) => {
  return years.map((_, index) => {
    return Object.values(data).reduce((sum, values) => sum + values[index], 0);
  });
};

// 柱状图1配置（行业大类能耗趋势）
const barChart1Option = ref({
  title: {
    text: "行业大类能耗趋势",
    textStyle: {
      color: "#fff",
      fontSize: 14,
    },
  },
  tooltip: {
    trigger: "axis",
    backgroundColor: "rgba(0,0,0,.6)",
    borderColor: "rgba(147, 235, 248, .8)",
    textStyle: {
      color: "#FFF",
    },
    formatter: function (params: any) {
      return `${params[0].name}年<br/>能耗总量: ${params[0].value}万吨标煤`;
    },
  },
  xAxis: {
    type: "category",
    data: years,
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
    name: "能耗总量（万吨标煤）",
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
      data: calculateTotalData(industryMajorData),
      type: "bar",
      itemStyle: {
        color: new graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: "#F4023C" },
          { offset: 1, color: "#FB6CB7" },
        ]),
      },
    },
  ],
});

// 柱状图2配置（行业中类能耗趋势）
const barChart2Option = ref({
  title: {
    text: "行业中类能耗趋势",
    textStyle: {
      color: "#fff",
      fontSize: 14,
    },
  },
  tooltip: {
    trigger: "axis",
    backgroundColor: "rgba(0,0,0,.6)",
    borderColor: "rgba(147, 235, 248, .8)",
    textStyle: {
      color: "#FFF",
    },
    formatter: function (params: any) {
      return `${params[0].name}年<br/>能耗总量: ${params[0].value}万吨标煤`;
    },
  },
  xAxis: {
    type: "category",
    data: years,
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
    name: "能耗总量（万吨标煤）",
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
      data: calculateTotalData(industryMediumData),
      type: "bar",
      itemStyle: {
        color: new graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: "#F48C02" },
          { offset: 1, color: "#FDDB7D" },
        ]),
      },
    },
  ],
});

// 柱状图3配置（行业细类能耗趋势）
const barChart3Option = ref({
  title: {
    text: "行业细类能耗趋势",
    textStyle: {
      color: "#fff",
      fontSize: 14,
    },
  },
  tooltip: {
    trigger: "axis",
    backgroundColor: "rgba(0,0,0,.6)",
    borderColor: "rgba(147, 235, 248, .8)",
    textStyle: {
      color: "#FFF",
    },
    formatter: function (params: any) {
      return `${params[0].name}年<br/>能耗总量: ${params[0].value}万吨标煤`;
    },
  },
  xAxis: {
    type: "category",
    data: years,
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
    name: "能耗总量（万吨标煤）",
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
      data: calculateTotalData(industryDetailData),
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

// 散点图1数据（行业能碳总量分析）- 10个行业随机分布
const scatterChart1Data = [
  { name: "钢铁企业", value: [1320, 890], industry: "钢铁" },
  { name: "化工企业", value: [760, 1650], industry: "化工" },
  { name: "电力企业", value: [450, 2100], industry: "电力" },
  { name: "建材企业", value: [1180, 1200], industry: "建材" },
  { name: "有色企业", value: [890, 750], industry: "有色" },
  { name: "石化企业", value: [1450, 1850], industry: "石化" },
  { name: "纺织企业", value: [320, 1450], industry: "纺织" },
  { name: "机械企业", value: [1050, 580], industry: "机械" },
  { name: "食品企业", value: [680, 1980], industry: "食品" },
  { name: "交通企业", value: [1380, 1320], industry: "交通" },
];

// 散点图2数据（行业能碳强度分析）- 10个行业随机分布
const scatterChart2Data = [
  { name: "钢铁企业", value: [3.8, 2.1], industry: "钢铁" },
  { name: "化工企业", value: [1.5, 4.7], industry: "化工" },
  { name: "电力企业", value: [4.2, 3.2], industry: "电力" },
  { name: "建材企业", value: [2.3, 5.0], industry: "建材" },
  { name: "有色企业", value: [4.1, 1.9], industry: "有色" },
  { name: "石化企业", value: [1.8, 3.8], industry: "石化" },
  { name: "纺织企业", value: [3.5, 2.6], industry: "纺织" },
  { name: "机械企业", value: [2.7, 4.3], industry: "机械" },
  { name: "食品企业", value: [4.4, 3.1], industry: "食品" },
  { name: "交通企业", value: [1.3, 2.4], industry: "交通" },
];

// 行业颜色配置
const industryColors = {
  "钢铁": "#F4023C",
  "化工": "#F48C02",
  "电力": "#0BFC7F",
  "建材": "#1890FF",
  "有色": "#722ED1",
  "石化": "#FF6B35",
  "纺织": "#9C27B0",
  "机械": "#607D8B",
  "食品": "#4CAF50",
  "交通": "#FF9800",
};

// 散点图1配置（行业能碳总量分析）
const scatterChart1Option = ref({
  title: {
    text: "行业能碳总量分析",
    textStyle: {
      color: "#fff",
      fontSize: 14,
    },
  },
  tooltip: {
    backgroundColor: "rgba(0,0,0,.6)",
    borderColor: "rgba(147, 235, 248, .8)",
    textStyle: {
      color: "#FFF",
    },
    formatter: function (params: any) {
      return `${params.data.name}<br/>能耗总量: ${params.data.value[0]}万吨标煤<br/>碳排放总量: ${params.data.value[1]}万吨CO2`;
    },
  },
  legend: {
    data: Object.keys(industryColors),
    textStyle: {
      color: "#fff",
    },
    top: 30,
  },
  xAxis: {
    type: "value",
    name: "能耗总量（万吨标煤）",
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
  yAxis: {
    type: "value",
    name: "碳排放总量（万吨CO2）",
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
  series: Object.keys(industryColors).map((industry) => ({
    name: industry,
    type: "scatter",
    symbolSize: 8,
    itemStyle: {
      color: industryColors[industry as keyof typeof industryColors],
    },
    data: scatterChart1Data.filter((item) => item.industry === industry),
  })),
});

// 散点图2配置（行业能碳强度分析）
const scatterChart2Option = ref({
  title: {
    text: "行业能碳强度分析",
    textStyle: {
      color: "#fff",
      fontSize: 14,
    },
  },
  tooltip: {
    backgroundColor: "rgba(0,0,0,.6)",
    borderColor: "rgba(147, 235, 248, .8)",
    textStyle: {
      color: "#FFF",
    },
    formatter: function (params: any) {
      return `${params.data.name}<br/>能耗强度: ${params.data.value[0]}吨标煤/万元<br/>碳排放强度: ${params.data.value[1]}吨CO2/万元`;
    },
  },
  legend: {
    data: Object.keys(industryColors),
    textStyle: {
      color: "#fff",
    },
    top: 30,
  },
  xAxis: {
    type: "value",
    name: "能耗强度（吨标煤/万元）",
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
  yAxis: {
    type: "value",
    name: "碳排放强度（吨CO2/万元）",
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
  series: Object.keys(industryColors).map((industry) => ({
    name: industry,
    type: "scatter",
    symbolSize: 8,
    itemStyle: {
      color: industryColors[industry as keyof typeof industryColors],
    },
    data: scatterChart2Data.filter((item) => item.industry === industry),
  })),
});

onMounted(() => {
  console.log("能源行业趋势页面已加载");
});
</script>

<template>
  <div class="trend-container">
    <!-- 左侧柱状图区域 -->
    <div class="left-section">
      <ItemWrap title="能源行业趋势">
        <div class="bar-charts-container">
          <div class="chart-item">
            <v-chart :option="barChart1Option" class="chart" />
          </div>
          <div class="chart-item">
            <v-chart :option="barChart2Option" class="chart" />
          </div>
          <div class="chart-item">
            <v-chart :option="barChart3Option" class="chart" />
          </div>
        </div>
      </ItemWrap>
    </div>

    <!-- 右侧散点图区域 -->
    <div class="right-section">
      <ItemWrap title="行业象限分布">
        <div class="scatter-charts-container">
          <div class="chart-item">
            <v-chart :option="scatterChart1Option" class="chart" />
          </div>
          <div class="chart-item">
            <v-chart :option="scatterChart2Option" class="chart" />
          </div>
        </div>
      </ItemWrap>
    </div>
  </div>
</template>

<style scoped lang="scss">
.trend-container {
  width: 100%;
  height: calc(100vh - 64px);
  padding: 16px;
  box-sizing: border-box;
  display: flex;
  gap: 16px;
}

// 左侧柱状图区域（占2/5）
.left-section {
  width: 40%;
  height: 100%;
  
  .bar-charts-container {
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 16px;
    
    .chart-item {
      flex: 1;
      min-height: 0;
      
      .chart {
        width: 100%;
        height: 100%;
      }
    }
  }
}

// 右侧散点图区域（占3/5）
.right-section {
  width: 60%;
  height: 100%;
  
  .scatter-charts-container {
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 16px;
    
    .chart-item {
      flex: 1;
      min-height: 0;
      
      .chart {
        width: 100%;
        height: 100%;
      }
    }
  }
}

// 通用图表样式
.chart {
  background: transparent;
}

// ItemWrap组件内部样式调整
:deep(.item-wrap) {
  height: 100%;
  
  .content {
    height: calc(100% - 60px);
    padding: 16px;
  }
}
</style>