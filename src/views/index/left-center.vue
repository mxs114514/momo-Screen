<script setup lang="ts">
import { reactive, onMounted } from "vue";
import CountUp from "@/components/count-up";

const state = reactive({
  totalLoad: 0,
  todayConsumption: 0,
  carbonEmission: 0
});

const getData = () => {
  // 模拟数据
  state.totalLoad = 4500 + Math.random() * 500;
  state.todayConsumption = 12000 + Math.random() * 100;
  state.carbonEmission = 8.5 + Math.random() * 0.5;
};

onMounted(() => {
  getData();
  setInterval(getData, 5000);
});
</script>

<template>
  <div class="dynamic-display">
    <div class="item load">
      <div class="icon-wrapper">
        <i class="iconfont icon-load">⚡</i>
      </div>
      <div class="info">
        <div class="label">实时总负荷</div>
        <div class="value">
          <CountUp :endVal="state.totalLoad" :duration="2" :decimalPlaces="0" />
          <span class="unit">kW</span>
        </div>
      </div>
    </div>
    <div class="item consumption">
      <div class="icon-wrapper">
        <i class="iconfont icon-energy">🔋</i>
      </div>
      <div class="info">
        <div class="label">今日累计能耗</div>
        <div class="value">
          <CountUp :endVal="state.todayConsumption" :duration="2" :decimalPlaces="0" />
          <span class="unit">kWh</span>
        </div>
      </div>
    </div>
    <div class="item carbon">
      <div class="icon-wrapper">
        <i class="iconfont icon-carbon">☁️</i>
      </div>
      <div class="info">
        <div class="label">今日碳排放</div>
        <div class="value">
          <CountUp :endVal="state.carbonEmission" :duration="2" :decimalPlaces="2" />
          <span class="unit">t</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.dynamic-display {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  height: 100%;
  padding: 20px;

  .item {
    display: flex;
    align-items: center;
    background: rgba(6, 30, 93, 0.5);
    border-radius: 10px;
    padding: 15px 20px;
    border: 1px solid rgba(11, 252, 127, 0.2);
    transition: all 0.3s;

    &:hover {
      border-color: rgba(11, 252, 127, 0.8);
      box-shadow: 0 0 15px rgba(11, 252, 127, 0.3);
    }

    .icon-wrapper {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.1);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 20px;
      font-size: 24px;
    }

    .info {
      flex: 1;

      .label {
        color: #fff;
        font-size: 14px;
        margin-bottom: 5px;
      }

      .value {
        color: #0bfc7f;
        font-size: 24px;
        font-weight: bold;
        
        .unit {
          font-size: 14px;
          margin-left: 5px;
          color: #aaa;
        }
      }
    }
  }
}
</style>
