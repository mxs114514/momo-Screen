<script setup lang="ts">
import { ref } from 'vue';

const visitorCount = ref(5000);
const temperature = ref(-15);
const windSpeed = ref(3);

const simulationResult = ref({
  energy: 85,
  iceStatus: 98,
  comfort: 92
});

const updateSimulation = () => {
  // 简单的模拟逻辑
  const energyBase = 50;
  const visitorFactor = visitorCount.value / 10000 * 30;
  const tempFactor = Math.abs(temperature.value + 10) * 1.5;
  
  simulationResult.value.energy = Math.min(100, Math.floor(energyBase + visitorFactor + tempFactor));
  simulationResult.value.iceStatus = Math.min(100, Math.max(0, 100 - (temperature.value > -5 ? (temperature.value + 5) * 5 : 0)));
  simulationResult.value.comfort = Math.min(100, Math.max(0, 100 - windSpeed.value * 2 - (visitorCount.value > 8000 ? 10 : 0)));
};
</script>

<template>
  <div class="sandbox-container">
    <div class="controls">
      <div class="control-group">
        <label>预计游客人数 (人)</label>
        <div class="slider-wrap">
          <input type="range" min="0" max="20000" step="100" v-model="visitorCount" @input="updateSimulation">
          <span class="value">{{ visitorCount }}</span>
        </div>
      </div>
      <div class="control-group">
        <label>未来气温 (℃)</label>
        <div class="slider-wrap">
          <input type="range" min="-30" max="5" step="1" v-model="temperature" @input="updateSimulation">
          <span class="value">{{ temperature }}</span>
        </div>
      </div>
      <div class="control-group">
        <label>风速 (级)</label>
        <div class="slider-wrap">
          <input type="range" min="0" max="12" step="1" v-model="windSpeed" @input="updateSimulation">
          <span class="value">{{ windSpeed }}</span>
        </div>
      </div>
    </div>

    <div class="results">
      <div class="result-card">
        <div class="chart-ring energy" :style="{ '--p': simulationResult.energy }">
          <div class="inner">{{ simulationResult.energy }}%</div>
        </div>
        <div class="label">预计能耗负荷</div>
      </div>
      <div class="result-card">
        <div class="chart-ring ice" :style="{ '--p': simulationResult.iceStatus }">
          <div class="inner">{{ simulationResult.iceStatus }}%</div>
        </div>
        <div class="label">冰建安全指数</div>
      </div>
      <div class="result-card">
        <div class="chart-ring comfort" :style="{ '--p': simulationResult.comfort }">
          <div class="inner">{{ simulationResult.comfort }}</div>
        </div>
        <div class="label">游客舒适度</div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.sandbox-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 10px;
  gap: 15px;
}

.controls {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.control-group {
  label {
    display: block;
    color: #00eaff;
    font-size: 12px;
    margin-bottom: 4px;
  }
  
  .slider-wrap {
    display: flex;
    align-items: center;
    gap: 10px;
    
    input[type=range] {
      flex: 1;
      accent-color: #00eaff;
      height: 4px;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 2px;
      appearance: none;
      
      &::-webkit-slider-thumb {
        appearance: none;
        width: 12px;
        height: 12px;
        background: #00eaff;
        border-radius: 50%;
        cursor: pointer;
        box-shadow: 0 0 5px rgba(0, 234, 255, 0.8);
      }
    }
    
    .value {
      width: 40px;
      text-align: right;
      color: #fff;
      font-size: 12px;
      font-family: monospace;
    }
  }
}

.results {
  flex: 1;
  display: flex;
  justify-content: space-around;
  align-items: center;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  padding: 10px;
}

.result-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  
  .label {
    font-size: 12px;
    color: #ccc;
  }
}

.chart-ring {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: conic-gradient(var(--c) calc(var(--p) * 1%), rgba(255, 255, 255, 0.1) 0);
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &::before {
    content: '';
    position: absolute;
    width: 50px;
    height: 50px;
    background: #0d2850;
    border-radius: 50%;
  }
  
  .inner {
    position: relative;
    color: #fff;
    font-weight: bold;
    font-size: 14px;
  }
  
  &.energy { --c: #ff4d4f; }
  &.ice { --c: #00eaff; }
  &.comfort { --c: #52c41a; }
}
</style>