import dayjs from "dayjs";

// 生成随机整数
export const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

// 生成随机浮点数
export const randomFloat = (min: number, max: number, fixed: number = 2) =>
  parseFloat((Math.random() * (max - min) + min).toFixed(fixed));

// 1.2 左侧面板：关键指标
export const getDashboardData = () => {
  return {
    totalEnergy: randomFloat(10000, 50000, 1), // 总能耗 (kWh)
    energySavingRate: randomFloat(10, 30, 1), // 节能率 (%)
    carbonReduction: randomFloat(500, 2000, 1), // 碳减排量 (t)
    envContribution: randomFloat(80, 99, 1), // 环保贡献大屏 (score)
  };
};

// 1.2 左侧面板：动态等效值
export const getDynamicData = () => {
  return {
    carReduction: randomInt(100, 500), // 燃油车减排量 (辆)
    treeGrowth: randomInt(50, 200), // 树木生长 (棵)
  };
};

// 1.3 右侧面板：AI 预警与建议
const aiMessageTypes = ["warning", "suggestion", "info"];
const locations = [
  "1号楼",
  "2号楼",
  "3号楼",
  "中央大厅",
  "东区停车场",
  "西区冷站",
  "北区雪场",
  "南区入口",
  "极地馆",
  "冰滑梯",
];
const devices = [
  "空调机组",
  "照明系统",
  "新风机组",
  "变压器",
  "电梯",
  "安防摄像头",
  "造雪机",
  "水泵",
  "配电箱",
  "传感器",
];
const events = [
  "能耗异常偏高",
  "运行状态良好",
  "检测到故障信号",
  "需进行例行维护",
  "离线",
  "温度超标",
  "负载率过高",
  "电压波动",
  "滤网需更换",
  "自动重启成功",
  "连接超时",
  "数据丢包",
];

export const getAIMessages = (count: number = 10) => {
  return Array.from({ length: count }).map((_, index) => {
    const loc = locations[randomInt(0, locations.length - 1)];
    const dev = devices[randomInt(0, devices.length - 1)];
    const evt = events[randomInt(0, events.length - 1)];
    return {
      id: index,
      time: dayjs().subtract(randomInt(0, 240), "minute").format("HH:mm:ss"),
      type: aiMessageTypes[randomInt(0, 2)],
      content: `${loc}${dev}${evt} [编号:${1000 + index}]`, // 增加编号确保绝对不重复
    };
  });
};

// 1.3 右侧面板：设备健康度 (雷达图)
export const getDeviceHealth = () => {
  return {
    indicator: [
      { name: "变压器", max: 100 },
      { name: "空调机组", max: 100 },
      { name: "照明系统", max: 100 },
      { name: "光伏逆变器", max: 100 },
      { name: "储能电池", max: 100 },
      { name: "新风系统", max: 100 },
    ],
    data: [
      {
        value: [
          randomInt(80, 100),
          randomInt(70, 95),
          randomInt(85, 100),
          randomInt(90, 100),
          randomInt(75, 98),
          randomInt(80, 95),
        ],
        name: "设备健康评分",
      },
    ],
  };
};

// 1.4 底部面板：能源预测 (未来 24h vs 历史)
export const getEnergyForecast = () => {
  const hours = Array.from({ length: 24 }).map((_, i) => dayjs().add(i, "hour").format("HH:00"));
  const forecast = hours.map(() => randomFloat(100, 300));
  const history = hours.map(() => randomFloat(80, 280)); // 模拟昨天的同一时间或历史均值
  return {
    categories: hours,
    series: [
      { name: "预测能耗", data: forecast },
      { name: "历史同期", data: history },
    ],
  };
};

// 1.4 底部面板：环境参数
export const getEnvironmentData = () => {
  return {
    temperature: randomFloat(18, 30, 1), // 温度 (℃)
    humidity: randomFloat(30, 70, 1), // 湿度 (%)
    windSpeed: randomFloat(0, 10, 1), // 风速 (m/s)
    uvIndex: randomInt(0, 10), // 紫外线指数
  };
};

// 1.1 中央展示区：设备状态列表
export const getDeviceStatusList = (count: number = 5) => {
  const statuses = ["运行中", "待机", "故障", "维护中"];
  const devices = ["1# 变压器", "中央空调主机", "A区照明", "光伏阵列 A", "储能柜 1", "新风机组 2"];
  return Array.from({ length: count }).map((_, i) => ({
    id: i,
    name: devices[randomInt(0, devices.length - 1)],
    status: statuses[randomInt(0, 3)],
    load: randomInt(20, 90) + "%",
    temperature: randomInt(30, 60) + "℃",
  }));
};
