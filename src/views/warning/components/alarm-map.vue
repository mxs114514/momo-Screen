<script setup lang="ts">
import { ref, onMounted } from 'vue';
import * as echarts from 'echarts';

const option = ref({});
const isStatsCollapsed = ref(false);

const toggleStats = () => {
  isStatsCollapsed.value = !isStatsCollapsed.value;
};

// 园区坐标点定义
const parkNodes = [
  { name: '冰雪大皇宫', x: 50, y: 90, symbolSize: 24, category: 'landmark' },
  { name: '梦幻城堡', x: 15, y: 70, symbolSize: 20, category: 'landmark' },
  { name: '坽珑冰塔', x: 30, y: 75, symbolSize: 18, category: 'landmark' },
  { name: '巨龙冰雕', x: 70, y: 75, symbolSize: 18, category: 'landmark' },
  { name: '极地购物中心', x: 20, y: 30, symbolSize: 16, category: 'service' },
  { name: '极光摩天轮', x: 85, y: 70, symbolSize: 22, category: 'landmark' },
  { name: '极速螺旋滑梯', x: 35, y: 50, symbolSize: 18, category: 'landmark' },
  { name: '极地大剧院', x: 65, y: 50, symbolSize: 18, category: 'landmark' },
  { name: '水晶圣殿', x: 50, y: 60, symbolSize: 20, category: 'landmark' },
  { name: '游客中心', x: 80, y: 30, symbolSize: 16, category: 'service' },
  { name: '正门入口', x: 50, y: 10, symbolSize: 16, category: 'entrance' }
];

// 园区路径定义
const parkRoads = [
  [[50, 10], [50, 30]], // 入口 -> 中轴分岔点
  [[50, 30], [20, 30]], // -> 购物中心
  [[50, 30], [80, 30]], // -> 游客中心
  [[20, 30], [15, 70]], // 购物中心 -> 城堡
  [[80, 30], [85, 70]], // 游客中心 -> 摩天轮
  [[15, 70], [30, 75]], // 城堡 -> 冰塔
  [[85, 70], [70, 75]], // 摩天轮 -> 龙雕
  [[30, 75], [50, 90]], // 冰塔 -> 皇宫
  [[70, 75], [50, 90]], // 龙雕 -> 皇宫
  [[20, 30], [35, 50]], // 购物中心 -> 滑梯
  [[80, 30], [65, 50]], // 游客中心 -> 剧院
  [[35, 50], [50, 60]], // 滑梯 -> 圣殿
  [[65, 50], [50, 60]], // 剧院 -> 圣殿
  [[50, 60], [50, 90]], // 圣殿 -> 皇宫 (中轴线)
  [[35, 50], [30, 75]], // 滑梯 -> 冰塔
  [[65, 50], [70, 75]]  // 剧院 -> 龙雕
];

onMounted(() => {
  option.value = {
    backgroundColor: 'transparent',
    grid: {
      top: 10,
      bottom: 10,
      left: 10,
      right: 10
    },
    xAxis: {
      show: false,
      min: 0,
      max: 100
    },
    yAxis: {
      show: false,
      min: 0,
      max: 100
    },
    tooltip: {
      trigger: 'item',
      formatter: (params: any) => {
        if (params.seriesName === '告警') {
          return `${params.name}<br/>${params.value[2]}`;
        }
        return params.name;
      }
    },
    series: [
      // 园区路径
      {
        type: 'lines',
        coordinateSystem: 'cartesian2d',
        data: parkRoads.map(coords => ({ coords })),
        lineStyle: {
          color: 'rgba(0, 234, 255, 0.3)',
          width: 2,
          curveness: 0.1
        },
        effect: {
          show: true,
          period: 4,
          trailLength: 0.1,
          color: 'rgba(0, 234, 255, 0.8)',
          symbolSize: 3
        }
      },
      // 园区建筑点
      {
        type: 'scatter',
        coordinateSystem: 'cartesian2d',
        data: parkNodes.map(node => ({
          name: node.name,
          value: [node.x, node.y],
          symbolSize: node.symbolSize,
          itemStyle: {
            color: node.category === 'entrance' ? '#52c41a' : '#00eaff',
            shadowBlur: 10,
            shadowColor: '#00eaff'
          }
        })),
        label: {
          show: true,
          position: 'top',
          formatter: '{b}',
          color: '#fff',
          fontSize: 12
        }
      },
      // 告警点 (模拟)
      {
        name: '告警',
        type: 'effectScatter',
        coordinateSystem: 'cartesian2d',
        data: [
          { name: '冰雪大皇宫', value: [50, 90, '温度控制系统异常'], itemStyle: { color: '#ff4d4f' } },
          { name: '极光摩天轮', value: [85, 70, '运行平稳度异常'], itemStyle: { color: '#ff4d4f' } },
          { name: '极速螺旋滑梯', value: [35, 50, '部分滑道结冰预警'], itemStyle: { color: '#faad14' } }
        ],
        symbolSize: 20,
        rippleEffect: {
          brushType: 'stroke',
          scale: 3
        },
        label: {
          show: false
        }
      }
    ]
  };
});
</script>

<template>
  <div class="map-container">
    <v-chart class="chart" :option="option" autoresize />
    
    <!-- 可折叠悬浮窗 -->
    <div class="map-stats-container" :class="{ 'collapsed': isStatsCollapsed }">
      <div class="stats-toggle" @click="toggleStats">
        <span>{{ isStatsCollapsed ? '展开统计' : '收起统计' }}</span>
        <i class="arrow" :class="{ 'up': !isStatsCollapsed, 'down': isStatsCollapsed }"></i>
      </div>
      
      <div class="map-stats-content" v-show="!isStatsCollapsed">
        <div class="stat-item">
          <div class="label">今日告警总数</div>
          <div class="value">128</div>
        </div>
        <div class="stat-item">
          <div class="label">已处理</div>
          <div class="value highlight">96</div>
        </div>
        <div class="stat-item">
          <div class="label">待处理</div>
          <div class="value warning">32</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.map-container {
  width: 100%;
  height: 90%;
  margin-top: 2%;
  position: relative;
}
.chart {
  width: 100%;
  height: 100%;
}

.map-stats-container {
  position: absolute;
  bottom: 20px;
  left: 20px;
  width: 180px;
  background: rgba(13, 40, 80, 0.85);
  border: 1px solid rgba(0, 234, 255, 0.3);
  border-radius: 8px;
  backdrop-filter: blur(4px);
  transition: all 0.3s ease;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  z-index: 10;

  &.collapsed {
    width: 100px;
    height: 32px;
    background: rgba(13, 40, 80, 0.6);
    
    .stats-toggle {
      border-bottom: none;
    }
  }
}

.stats-toggle {
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background: rgba(0, 234, 255, 0.1);
  border-bottom: 1px solid rgba(0, 234, 255, 0.1);
  color: #00eaff;
  font-size: 12px;
  user-select: none;
  transition: background 0.2s;

  &:hover {
    background: rgba(0, 234, 255, 0.2);
  }

  .arrow {
    display: inline-block;
    width: 0;
    height: 0;
    margin-left: 6px;
    border-left: 4px solid transparent;
    border-right: 4px solid transparent;
    
    &.up {
      border-bottom: 6px solid #00eaff;
    }
    
    &.down {
      border-top: 6px solid #00eaff;
    }
  }
}

.map-stats-content {
  padding: 10px;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  
  &:last-child {
    margin-bottom: 0;
  }

  .label {
    color: #ccc;
    font-size: 12px;
  }

  .value {
    color: #fff;
    font-weight: bold;
    font-size: 14px;
    
    &.highlight {
      color: #52c41a;
    }
    
    &.warning {
      color: #ff4d4f;
    }
  }
}
</style>