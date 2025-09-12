<script setup lang="ts">
import { ref, reactive, nextTick, computed } from "vue";
import { centerMap, GETNOBASE } from "@/api";
import { registerMap, getMap } from "echarts/core";
import { optionHandle, regionCodes } from "./center.map";
import BorderBox13 from "@/components/datav/border-box-13";
import { ElMessage } from "element-plus";

import type { MapdataType } from "./center.map";

const option = ref({});
const code = ref("china"); //china 代表中国 其他地市是行政编码
const mapData = ref<MapdataType[]>([]);
const showChart = ref(false);

withDefaults(
  defineProps<{
    // 结束数值
    title: number | string;
  }>(),
  {
    title: "地图",
  }
);

const dataSetHandle = async (regionCode: string, list: object[]) => {
  // 更新当前地图代码
  code.value = regionCode;
  
  const geojson: any = await getGeojson(regionCode);
  let cityCenter: any = {};
  let currentMapData: MapdataType[] = [];
  //获取当前地图每块行政区中心点
  geojson.features.forEach((element: any) => {
    cityCenter[element.properties.name] =
      element.properties.centroid || element.properties.center;
  });
  //当前中心点如果有此条数据中心点则赋值x，y当然这吨x,y也可以后端返回进行大点，前端省去多行代码
  list.forEach((item: any) => {
    if (cityCenter[item.name]) {
      currentMapData.push({
        name: item.name,
        value: cityCenter[item.name].concat(item.value),
      });
    }
  });

  mapData.value = currentMapData;
  await nextTick();

  option.value = optionHandle(regionCode, list, currentMapData);

  // 触发3D柱状图显示动画
  if (regionCode !== "china") {
    showChart.value = false;
    setTimeout(() => {
      showChart.value = true;
    }, 500);
  } else {
    // 返回全国地图时重置状态
    showChart.value = false;
  }
};

const getData = async (regionCode: string) => {
  centerMap({ regionCode: regionCode })
    .then((res) => {
      console.log("中上--设备分布", res);
      if (res.success) {
        dataSetHandle(res.data.regionCode, res.data.dataList);
      } else {
        ElMessage.error(res.msg);
      }
    })
    .catch((err) => {
      ElMessage.error(err);
    });
};
const getGeojson = (regionCode: string) => {
  return new Promise<boolean>(async (resolve) => {
    let mapjson = getMap(regionCode);
    if (mapjson) {
      mapjson = mapjson.geoJSON;
      resolve(mapjson);
    } else {
      mapjson = await GETNOBASE(`./map-geojson/${regionCode}.json`).then(
        (data) => data
      );
      registerMap(regionCode, {
        geoJSON: mapjson as any,
        specialAreas: {},
      });
      resolve(mapjson);
    }
  });
};
// 计算总能源消耗
const totalEnergyConsumption = computed(() => {
  if (!mapData.value || mapData.value.length === 0) return 0;
  return mapData.value.reduce((sum, item) => sum + (item.value[2] || 0), 0);
});

// 计算柱状图高度（最大80px，增加显示差距）
const chartHeight = computed(() => {
  const total = totalEnergyConsumption.value;
  if (total === 0) return 0;
  // 降低基准值，增加高度显示差距，最大高度提升到80px
  const maxValue = 500;
  return Math.min((total / maxValue) * 150, 150);
});

// 是否显示3D柱状图
const shouldShow3DChart = computed(() => {
  return code.value !== "china" && totalEnergyConsumption.value > 0;
});

getData(code.value);

const mapClick = (params: any) => {
  // console.log(params);
  let xzqData = regionCodes[params.name];
  if (xzqData) {
    showChart.value = false;
    getData(xzqData.adcode);
  } else {
  }
};
</script>

<template>
  <div class="centermap">
    <div class="maptitle">
      <div class="zuo"></div>
      <span class="titletext">{{ title }}</span>
      <div class="you"></div>
    </div>
    <div class="mapwrap">
      <BorderBox13>
        <div class="quanguo" @click="getData('china')" v-if="code !== 'china'">
          中国
        </div>
        <v-chart
          class="chart"
          :option="option"
          ref="centerMapRef"
          @click="mapClick"
          v-if="JSON.stringify(option) != '{}'"
        />

        <!-- 3D柱状图 -->
        <div
          v-if="shouldShow3DChart && showChart"
          class="energy-3d-chart"
          :class="{ 'chart-animate': showChart }"
          :style="{ '--target-height': chartHeight + 'px' }"
        >
          <div class="chart-container">
            <div
              class="chart-bar"
              :style="!showChart ? { height: chartHeight + 'px' } : {}"
            ></div>
            <div class="chart-value">{{ totalEnergyConsumption }}</div>
          </div>
        </div>
      </BorderBox13>
    </div>
  </div>
</template>

<style scoped lang="scss">
.centermap {
  margin-bottom: 30px;

  .maptitle {
    height: 60px;
    display: flex;
    justify-content: center;
    padding-top: 10px;
    box-sizing: border-box;

    .titletext {
      font-size: 28px;
      font-weight: 900;
      letter-spacing: 6px;
      background: linear-gradient(
        92deg,
        #0072ff 0%,
        #00eaff 48.8525390625%,
        #01aaff 100%
      );
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin: 0 10px;
    }

    .zuo,
    .you {
      background-size: 100% 100%;
      width: 29px;
      height: 20px;
      margin-top: 8px;
    }

    .zuo {
      background: url("@/assets/img/xiezuo.png") no-repeat;
    }

    .you {
      background: url("@/assets/img/xieyou.png") no-repeat;
    }
  }

  .mapwrap {
    height: 580px;
    width: 100%;
    // padding: 0 0 10px 0;
    box-sizing: border-box;
    position: relative;

    .quanguo {
      position: absolute;
      right: 20px;
      top: -46px;
      width: 80px;
      height: 28px;
      border: 1px solid #00eded;
      border-radius: 10px;
      color: #00f7f6;
      text-align: center;
      line-height: 26px;
      letter-spacing: 6px;
      cursor: pointer;
      box-shadow: 0 2px 4px rgba(0, 237, 237, 0.5),
        0 0 6px rgba(0, 237, 237, 0.4);
      z-index: 10;
    }
  }
}

/* 3D柱状图样式 */
.energy-3d-chart {
  position: absolute;
  bottom: 20px;
  right: 60px;
  perspective: 200px;
  perspective-origin: center bottom;
}

.chart-container {
  position: relative;
  transform-style: preserve-3d;
  transform: rotateX(15deg) rotateY(-10deg);
}

.chart-bar {
  width: 32px;
  min-height: 3px;
  background: linear-gradient(
    to top,
    rgba(58, 139, 255, 0.8) 0%,
    rgba(123, 202, 236, 0.6) 50%,
    rgba(173, 216, 230, 0.4) 100%
  );
  border-radius: 2px;
  position: relative;
  transform-origin: bottom center;
  box-shadow: 0 0 10px rgba(58, 139, 255, 0.3),
    inset 0 0 3px rgba(255, 255, 255, 0.2), 2px 0 8px rgba(0, 0, 0, 0.3);
}

/* 3D立体效果 */
.chart-bar::before {
  content: "";
  position: absolute;
  top: 0;
  right: -3px;
  width: 3px;
  height: 100%;
  background: linear-gradient(
    to top,
    rgba(30, 80, 150, 0.9) 0%,
    rgba(80, 150, 200, 0.7) 50%,
    rgba(120, 180, 220, 0.5) 100%
  );
  transform: skewY(-45deg);
  transform-origin: bottom;
}

.chart-bar::after {
  content: "";
  position: absolute;
  top: -3px;
  left: 0;
  width: 12px;
  height: 3px;
  background: linear-gradient(
    to right,
    rgba(173, 216, 230, 0.6) 0%,
    rgba(200, 230, 250, 0.4) 100%
  );
  transform: skewX(-45deg);
  transform-origin: left;
}

.chart-value {
  position: absolute;
  top: -25px;
  left: 50%;
  transform: translateX(-50%);
  color: #7acaec;
  font-size: 12px;
  font-weight: bold;
  text-shadow: 0 0 3px rgba(122, 202, 236, 0.8);
  white-space: nowrap;
}

/* 动画效果 */
.energy-3d-chart .chart-bar {
  height: 2px;
  transition: height 0.3s ease;
}

.energy-3d-chart.chart-animate .chart-bar {
  animation: growUp 2s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
}

.energy-3d-chart.chart-animate .chart-value {
  animation: fadeInValue 2s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
  opacity: 0;
}

@keyframes growUp {
  from {
    height: 0 !important;
    opacity: 0.3;
  }
  to {
    height: var(--target-height, 80px) !important;
    opacity: 1;
  }
}

@keyframes fadeInValue {
  0% {
    opacity: 0;
    transform: translateX(-50%) translateY(10px);
  }
  70% {
    opacity: 0;
  }
  100% {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}
</style>
