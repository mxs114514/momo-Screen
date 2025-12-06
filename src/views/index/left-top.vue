<script setup lang="ts">
import { reactive, ref, onMounted } from "vue";
import CountUp from "@/components/count-up";

const duration = ref(2);
const state = reactive({
  temperature: -15,
  humidity: 45,
  windSpeed: 3.5,
  uvIndex: 2,
  comfort: 85,
  totalEnergy: 0,
  energySaving: 0,
  carbonReduction: 0
});

const getData = () => {
  // 模拟数据
  state.temperature = -15 + Math.random() * 2;
  state.humidity = 40 + Math.random() * 10;
  state.windSpeed = 2 + Math.random() * 3;
  state.uvIndex = Math.floor(Math.random() * 5);
  state.comfort = 80 + Math.floor(Math.random() * 15);
  
  state.totalEnergy = 12000 + Math.random() * 500;
  state.energySaving = 15 + Math.random() * 5;
  state.carbonReduction = 800 + Math.random() * 50;
};

onMounted(() => {
  getData();
  setInterval(getData, 5000);
});
</script>

<template>
  <div class="left-top-content">
    <ul class="user_Overview flex">
      <li class="user_Overview-item" style="color: #00fdfa">
        <div class="user_Overview_nums allnum">
          <CountUp :endVal="state.temperature" :duration="duration" :decimalPlaces="1" />
        </div>
        <p>温度 (℃)</p>
      </li>
      <li class="user_Overview-item" style="color: #07f7a8">
        <div class="user_Overview_nums online">
          <CountUp :endVal="state.humidity" :duration="duration" :decimalPlaces="0" />
        </div>
        <p>湿度 (%)</p>
      </li>
      <li class="user_Overview-item" style="color: #e3b337">
        <div class="user_Overview_nums offline">
          <CountUp :endVal="state.windSpeed" :duration="duration" :decimalPlaces="1" />
        </div>
        <p>风速 (m/s)</p>
      </li>
      <li class="user_Overview-item" style="color: #f5023d">
        <div class="user_Overview_nums laramnum">
          <CountUp :endVal="state.comfort" :duration="duration" :decimalPlaces="0" />
        </div>
        <p>舒适度</p>
      </li>
    </ul>
    
    <ul class="user_Overview flex">
      <li class="user_Overview-item" style="color: #00fdfa">
        <div class="user_Overview_nums allnum">
          <CountUp :endVal="state.totalEnergy" :duration="duration" :decimalPlaces="0" />
        </div>
        <p>总能耗 (kWh)</p>
      </li>
      <li class="user_Overview-item" style="color: #07f7a8">
        <div class="user_Overview_nums online">
          <CountUp :endVal="state.energySaving" :duration="duration" :decimalPlaces="1" />
        </div>
        <p>节能率 (%)</p>
      </li>
      <li class="user_Overview-item" style="color: #e3b337">
        <div class="user_Overview_nums offline">
          <CountUp :endVal="state.carbonReduction" :duration="duration" :decimalPlaces="1" />
        </div>
        <p>碳减排 (t)</p>
      </li>
    </ul>
  </div>
</template>

<style scoped lang="scss">
.left-top-content {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  padding-top: 40px;
}

.user_Overview {
  display: flex;
  width: 100%;
  
  li {
    flex: 1;

    p {
      text-align: center;
      height: 16px;
      font-size: 16px;
    }

    .user_Overview_nums {
      width: 100px;
      height: 100px;
      text-align: center;
      line-height: 100px;
      font-size: 18px;
      margin: 20px auto 10px; // 调整间距以适应两排
      background-size: cover;
      background-position: center center;
      position: relative;

      &::before {
        content: "";
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
      }

      &.bgdonghua::before {
        animation: rotating 14s linear infinite;
      }
    }

    .allnum {
      &::before {
        background-image: url("@/assets/img/left_top_lan.png");
      }
    }

    .online {
      &::before {
        background-image: url("@/assets/img/left_top_lv.png");
      }
    }

    .offline {
      &::before {
        background-image: url("@/assets/img/left_top_huang.png");
      }
    }

    .laramnum {
      &::before {
        background-image: url("@/assets/img/left_top_hong.png");
      }
    }
  }
}
</style>
