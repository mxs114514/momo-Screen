<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, reactive } from "vue";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import BorderBox13 from "@/components/datav/border-box-13";
import { randomInt } from "@/utils/mockData";

const deviceStatusList = ref<any[]>([]);
const isDeviceListExpanded = ref(true);
const threeContainer = ref<HTMLElement | null>(null);

// 建筑列表配置
const buildingList = [
  { name: '冰雪大皇宫', status: '运行中' },
  { name: '梦幻城堡', status: '运行中' },
  { name: '玲珑冰塔', status: '运行中' },
  { name: '巨龙冰雕', status: '拍照点' },
  { name: '极地购物中心', status: '营业中' },
  { name: '极光摩天轮', status: '运行中' },
  { name: '极速螺旋滑梯', status: '运行中' },
  { name: '极地大剧院', status: '演出中' },
  { name: '水晶圣殿', status: '运行中' }
];

// 生成建筑状态列表
const getBuildingStatusList = () => {
  return buildingList.map((item, index) => ({
    id: index + 1,
    name: item.name,
    status: item.status,
    load: Math.floor(Math.random() * 40 + 60) + '%',
    temperature: (Math.random() * 5 - 20).toFixed(1) + '℃'
  }));
};

// 悬浮窗状态
const tooltip = reactive({
  show: false,
  left: 0,
  top: 0,
  data: {
    name: '',
    status: '',
    visitors: 0,
    temperature: 0
  }
});

// Three.js 变量
let scene: THREE.Scene;
let camera: THREE.PerspectiveCamera;
let renderer: THREE.WebGLRenderer;
let controls: OrbitControls;
let animationId: number;
const buildings: THREE.Mesh[] = [];
const energyParticles: THREE.Mesh[] = [];
let ferrisWheelGroup: THREE.Group;

// 冰雪材质
const iceMaterial = new THREE.MeshPhysicalMaterial({
  color: 0xaaddff,
  metalness: 0.1,
  roughness: 0.1,
  transmission: 0.6, // 透光率
  thickness: 1.0, // 厚度
  envMapIntensity: 1.0,
  clearcoat: 1.0,
  clearcoatRoughness: 0.1,
  transparent: true,
  opacity: 0.9
});

const glowMaterial = new THREE.MeshBasicMaterial({
  color: 0x00eaff,
  transparent: true,
  opacity: 0.3,
  side: THREE.BackSide
});

// 创建中式冰雪大殿
const createChinesePalace = (x: number, z: number) => {
  const group = new THREE.Group();
  
  // 台基
  const baseGeo = new THREE.BoxGeometry(80, 6, 60);
  const base = new THREE.Mesh(baseGeo, iceMaterial);
  base.position.y = 3;
  group.add(base);

  // 大殿主体
  const bodyGeo = new THREE.BoxGeometry(70, 20, 40);
  const body = new THREE.Mesh(bodyGeo, iceMaterial);
  body.position.y = 16;
  group.add(body);

  // 重檐庑殿顶 (下层)
  const roof1Geo = new THREE.CylinderGeometry(45, 60, 10, 4);
  const roof1 = new THREE.Mesh(roof1Geo, iceMaterial);
  roof1.rotation.y = Math.PI / 4;
  roof1.position.y = 28;
  roof1.scale.set(1, 0.6, 0.7); 
  group.add(roof1);

  // 重檐庑殿顶 (上层)
  const roof2Geo = new THREE.CylinderGeometry(0, 40, 15, 4);
  const roof2 = new THREE.Mesh(roof2Geo, iceMaterial);
  roof2.rotation.y = Math.PI / 4;
  roof2.position.y = 38;
  roof2.scale.set(1, 0.6, 0.7);
  group.add(roof2);

  // 廊柱
  const pillarGeo = new THREE.CylinderGeometry(1.5, 1.5, 20);
  const pPositions = [
    [30, 16, 18], [30, 16, -18], [-30, 16, 18], [-30, 16, -18],
    [0, 16, 22], [0, 16, -22], [15, 16, 22], [-15, 16, 22]
  ];
  pPositions.forEach(pos => {
    const p = new THREE.Mesh(pillarGeo, iceMaterial);
    p.position.set(pos[0], pos[1], pos[2]);
    group.add(p);
  });

  group.position.set(x, 0, z);

  // 交互碰撞盒
  const hitBox = new THREE.Mesh(
    new THREE.BoxGeometry(90, 50, 70),
    new THREE.MeshBasicMaterial({ visible: false })
  );
  hitBox.position.set(x, 25, z);
  hitBox.userData = {
    isBuilding: true,
    name: '冰雪大皇宫',
    status: '运行中',
    visitors: randomInt(1500, 4000),
    temperature: -12
  };

  scene.add(group);
  scene.add(hitBox);
  buildings.push(hitBox);
};

// 创建欧式梦幻城堡
const createEuropeanCastle = (x: number, z: number) => {
  const group = new THREE.Group();
  
  // 主堡
  const keepGeo = new THREE.BoxGeometry(40, 50, 40);
  const keep = new THREE.Mesh(keepGeo, iceMaterial);
  keep.position.y = 25;
  group.add(keep);

  // 中央尖塔
  const spireGeo = new THREE.ConeGeometry(20, 35, 4);
  const spire = new THREE.Mesh(spireGeo, iceMaterial);
  spire.position.y = 67.5;
  spire.rotation.y = Math.PI / 4;
  group.add(spire);

  // 四角塔楼
  const towerGeo = new THREE.CylinderGeometry(8, 8, 40, 16);
  const towerRoofGeo = new THREE.ConeGeometry(10, 20, 16);
  
  const corners = [[25, 25], [25, -25], [-25, 25], [-25, -25]];
  corners.forEach(([cx, cz]) => {
    const t = new THREE.Mesh(towerGeo, iceMaterial);
    t.position.set(cx, 20, cz);
    
    const tr = new THREE.Mesh(towerRoofGeo, iceMaterial);
    tr.position.set(cx, 50, cz);
    
    group.add(t, tr);
  });

  // 连接城墙
  const wallGeo = new THREE.BoxGeometry(50, 20, 10);
  const w1 = new THREE.Mesh(wallGeo, iceMaterial);
  w1.position.set(0, 10, 25);
  const w2 = new THREE.Mesh(wallGeo, iceMaterial);
  w2.position.set(0, 10, -25);
  const w3 = new THREE.Mesh(wallGeo, iceMaterial);
  w3.rotation.y = Math.PI / 2;
  w3.position.set(25, 10, 0);
  const w4 = new THREE.Mesh(wallGeo, iceMaterial);
  w4.rotation.y = Math.PI / 2;
  w4.position.set(-25, 10, 0);
  
  group.add(w1, w2, w3, w4);

  group.position.set(x, 0, z);

  // 交互碰撞盒
  const hitBox = new THREE.Mesh(
    new THREE.BoxGeometry(80, 80, 80),
    new THREE.MeshBasicMaterial({ visible: false })
  );
  hitBox.position.set(x, 40, z);
  hitBox.userData = {
    isBuilding: true,
    name: '梦幻城堡',
    status: '运行中',
    visitors: randomInt(2000, 5000),
    temperature: -15
  };

  scene.add(group);
  scene.add(hitBox);
  buildings.push(hitBox);
};

// 创建玲珑冰塔
const createIcePagoda = (x: number, z: number) => {
  const group = new THREE.Group();
  const levels = 7;
  let currentY = 0;
  let width = 14;

  for(let i=0; i<levels; i++) {
    // 塔身
    const h = 7;
    const body = new THREE.Mesh(
      new THREE.CylinderGeometry(width*0.8, width, h, 6),
      iceMaterial
    );
    body.position.y = currentY + h/2;
    group.add(body);

    // 塔檐
    const roof = new THREE.Mesh(
      new THREE.ConeGeometry(width * 1.6, 3, 6),
      iceMaterial
    );
    roof.position.y = currentY + h + 1.5;
    group.add(roof);

    currentY += h + 3;
    width *= 0.85;
  }

  // 塔刹
  const finial = new THREE.Mesh(new THREE.SphereGeometry(2.5), iceMaterial);
  finial.position.y = currentY + 2;
  group.add(finial);

  group.position.set(x, 0, z);

  // 交互碰撞盒
  const hitBox = new THREE.Mesh(
    new THREE.BoxGeometry(30, currentY, 30),
    new THREE.MeshBasicMaterial({ visible: false })
  );
  hitBox.position.set(x, currentY/2, z);
  hitBox.userData = {
    isBuilding: true,
    name: '玲珑冰塔',
    status: '运行中',
    visitors: randomInt(500, 1200),
    temperature: -18
  };

  scene.add(group);
  scene.add(hitBox);
  buildings.push(hitBox);
};

// 创建巨龙冰雕
const createDragonSculpture = (x: number, z: number) => {
  const group = new THREE.Group();
  
  // 龙身 (正弦波球体)
  for(let i=0; i<15; i++) {
    const s = new THREE.Mesh(new THREE.SphereGeometry(5 - i*0.2, 12, 12), iceMaterial);
    s.position.set(
      i * 5, 
      15 + Math.sin(i * 0.8)*8, 
      Math.cos(i * 0.8)*8
    );
    group.add(s);
  }
  
  // 龙头
  const headGroup = new THREE.Group();
  const headMain = new THREE.Mesh(new THREE.BoxGeometry(10, 8, 12), iceMaterial);
  const horn1 = new THREE.Mesh(new THREE.ConeGeometry(1, 8), iceMaterial);
  horn1.position.set(3, 6, -2);
  horn1.rotation.x = -0.5;
  const horn2 = new THREE.Mesh(new THREE.ConeGeometry(1, 8), iceMaterial);
  horn2.position.set(-3, 6, -2);
  horn2.rotation.x = -0.5;
  
  headGroup.add(headMain, horn1, horn2);
  headGroup.position.set(-5, 18, 0);
  group.add(headGroup);

  group.position.set(x, 0, z);
  group.rotation.y = -Math.PI / 3;

  // 交互碰撞盒
  const hitBox = new THREE.Mesh(
    new THREE.BoxGeometry(90, 40, 40),
    new THREE.MeshBasicMaterial({ visible: false })
  );
  hitBox.position.set(x + 30, 20, z);
  hitBox.userData = {
    isBuilding: true,
    name: '巨龙冰雕',
    status: '拍照点',
    visitors: randomInt(200, 800),
    temperature: -20
  };

  scene.add(group);
  scene.add(hitBox);
  buildings.push(hitBox);
};

// 创建大型商场 (升级版)
const createMall = (x: number, z: number) => {
  const group = new THREE.Group();

  // 商场主体（L型结构，加大尺寸）
  const mainBodyGeo = new THREE.BoxGeometry(80, 30, 40);
  const mainBody = new THREE.Mesh(mainBodyGeo, iceMaterial);
  mainBody.position.y = 15;
  group.add(mainBody);

  const wingGeo = new THREE.BoxGeometry(40, 25, 70);
  const wing = new THREE.Mesh(wingGeo, iceMaterial);
  wing.position.set(-20, 12.5, 35);
  group.add(wing);

  // 中央穹顶
  const domeGeo = new THREE.SphereGeometry(20, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
  const dome = new THREE.Mesh(domeGeo, iceMaterial);
  dome.position.set(0, 30, 0);
  group.add(dome);

  // 内部发光
  const innerLight = new THREE.PointLight(0xffaa00, 1.5, 80);
  innerLight.position.set(0, 15, 10);
  group.add(innerLight);

  group.position.set(x, 0, z);

  // 交互碰撞盒
  const hitBoxGeo = new THREE.BoxGeometry(100, 50, 100);
  const hitBoxMat = new THREE.MeshBasicMaterial({ visible: false });
  const hitBox = new THREE.Mesh(hitBoxGeo, hitBoxMat);
  hitBox.position.set(x, 25, z + 15);
  hitBox.userData = {
    isBuilding: true,
    name: '极地购物中心',
    status: '营业中',
    visitors: randomInt(2000, 5000),
    temperature: 22
  };

  scene.add(group);
  scene.add(hitBox);
  buildings.push(hitBox);
};

// 创建城墙与塔楼
const createFortressWall = () => {
  const wallGroup = new THREE.Group();
  const size = 380; // 扩大园区
  const height = 15;
  const thickness = 6;

  // 围墙材质
  const wallMat = new THREE.MeshStandardMaterial({
    color: 0xaaddff, roughness: 0.3, metalness: 0.1, transparent: true, opacity: 0.6
  });

  // 墙体
  const walls = [
    { pos: [0, height/2, -size/2], dim: [size, height, thickness] }, // 北
    { pos: [-size/2, height/2, 0], dim: [thickness, height, size] }, // 西
    { pos: [size/2, height/2, 0], dim: [thickness, height, size] },  // 东
    // 南墙分两段
    { pos: [-size/4 - 25, height/2, size/2], dim: [size/2 - 50, height, thickness] },
    { pos: [size/4 + 25, height/2, size/2], dim: [size/2 - 50, height, thickness] }
  ];

  walls.forEach(w => {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(w.dim[0], w.dim[1], w.dim[2]), wallMat);
    mesh.position.set(w.pos[0], w.pos[1], w.pos[2]);
    wallGroup.add(mesh);
  });

  // 角楼
  const towerGeo = new THREE.CylinderGeometry(8, 10, 25, 6);
  const towerRoof = new THREE.ConeGeometry(12, 10, 6);
  const corners = [[-size/2, -size/2], [size/2, -size/2], [-size/2, size/2], [size/2, size/2]];
  
  corners.forEach(([cx, cz]) => {
    const t = new THREE.Mesh(towerGeo, iceMaterial);
    t.position.set(cx, 12.5, cz);
    const tr = new THREE.Mesh(towerRoof, iceMaterial);
    tr.position.set(cx, 30, cz);
    wallGroup.add(t, tr);
  });

  // 南大门 (优化版：宏伟冰雪之门)
  const gateGroup = new THREE.Group();
  
  // 1. 主门柱 (左右各一个巨型塔楼)
  const gateTowerGeo = new THREE.BoxGeometry(15, 45, 15);
  const tower1 = new THREE.Mesh(gateTowerGeo, iceMaterial);
  tower1.position.set(-40, 22.5, 0);
  const tower2 = new THREE.Mesh(gateTowerGeo, iceMaterial);
  tower2.position.set(40, 22.5, 0);

  // 塔楼顶盖
  const roofGeo = new THREE.ConeGeometry(12, 15, 4);
  const roof1 = new THREE.Mesh(roofGeo, iceMaterial);
  roof1.position.set(-40, 52.5, 0);
  roof1.rotation.y = Math.PI / 4;
  const roof2 = new THREE.Mesh(roofGeo, iceMaterial);
  roof2.position.set(40, 52.5, 0);
  roof2.rotation.y = Math.PI / 4;

  // 2. 门楣 (连接部分)
  const lintelGeo = new THREE.BoxGeometry(65, 10, 10);
  const lintel = new THREE.Mesh(lintelGeo, iceMaterial);
  lintel.position.set(0, 35, 0);

  // 3. 二层阁楼
  const pavilionBody = new THREE.BoxGeometry(40, 15, 10);
  const pavilion = new THREE.Mesh(pavilionBody, iceMaterial);
  pavilion.position.set(0, 47.5, 0);

  // 阁楼屋顶 (中式大屋顶)
  const mainRoofGeo = new THREE.CylinderGeometry(0, 50, 15, 4);
  const mainRoof = new THREE.Mesh(mainRoofGeo, iceMaterial);
  mainRoof.scale.set(1, 0.6, 0.6);
  mainRoof.rotation.y = Math.PI / 4;
  mainRoof.position.set(0, 60, 0);

  // 4. 牌匾
  const signGeo = new THREE.BoxGeometry(20, 6, 2);
  const signMat = new THREE.MeshBasicMaterial({ color: 0x00eaff });
  const sign = new THREE.Mesh(signGeo, signMat);
  sign.position.set(0, 40, 6);

  // 5. 装饰性冰锥 (门柱旁)
  const spikeGeo = new THREE.ConeGeometry(2, 10, 4);
  const spike1 = new THREE.Mesh(spikeGeo, iceMaterial); spike1.position.set(-55, 5, 5);
  const spike2 = new THREE.Mesh(spikeGeo, iceMaterial); spike2.position.set(55, 5, 5);

  gateGroup.add(tower1, tower2, roof1, roof2, lintel, pavilion, mainRoof, sign, spike1, spike2);
  gateGroup.position.set(0, 0, size/2);
  wallGroup.add(gateGroup);

  scene.add(wallGroup);
};

// 创建特色小项目
const createSmallItem = (type: 'tree' | 'igloo' | 'snowman', x: number, z: number, index: number) => {
  const group = new THREE.Group();
  let name = '';
  let height = 0;

  if (type === 'tree') {
    // 冰雪松树
    const trunkGeo = new THREE.CylinderGeometry(1, 1, 4, 6);
    const trunk = new THREE.Mesh(trunkGeo, new THREE.MeshStandardMaterial({ color: 0x8B4513 }));
    trunk.position.y = 2;
    
    const leaves1 = new THREE.Mesh(new THREE.ConeGeometry(4, 8, 6), iceMaterial);
    leaves1.position.y = 6;
    const leaves2 = new THREE.Mesh(new THREE.ConeGeometry(3, 6, 6), iceMaterial);
    leaves2.position.y = 10;
    
    group.add(trunk, leaves1, leaves2);
    name = `雾凇景观 #${index}`;
    height = 12;
  } else if (type === 'igloo') {
    // 冰屋
    const dome = new THREE.Mesh(new THREE.SphereGeometry(5, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2), iceMaterial);
    const tunnel = new THREE.Mesh(new THREE.CylinderGeometry(2, 2, 4, 8, 1, true), iceMaterial);
    tunnel.rotation.z = Math.PI / 2;
    tunnel.position.set(4, 0, 0);
    
    group.add(dome, tunnel);
    name = `爱斯基摩冰屋 #${index}`;
    height = 5;
  } else if (type === 'snowman') {
    // 雪人
    const body = new THREE.Mesh(new THREE.SphereGeometry(3, 12, 12), new THREE.MeshStandardMaterial({ color: 0xffffff }));
    body.position.y = 3;
    const head = new THREE.Mesh(new THREE.SphereGeometry(2, 12, 12), new THREE.MeshStandardMaterial({ color: 0xffffff }));
    head.position.y = 7;
    
    // 眼睛
    const eyeGeo = new THREE.SphereGeometry(0.2);
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
    const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
    leftEye.position.set(0.8, 7.5, 1.5);
    const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
    rightEye.position.set(-0.8, 7.5, 1.5);

    group.add(body, head, leftEye, rightEye);
    name = `雪人宝宝 #${index}`;
    height = 9;
  }

  group.position.set(x, 0, z);
  
  // 交互碰撞盒
  const hitBox = new THREE.Mesh(
    new THREE.BoxGeometry(8, height, 8),
    new THREE.MeshBasicMaterial({ visible: false })
  );
  hitBox.position.set(x, height/2, z);
  hitBox.userData = {
    isBuilding: true,
    name: name,
    status: '开放',
    visitors: randomInt(5, 30),
    temperature: -18
  };

  scene.add(group);
  scene.add(hitBox);
  buildings.push(hitBox);
};

// 创建摩天轮
const createFerrisWheel = (x: number, z: number) => {
  ferrisWheelGroup = new THREE.Group();
  
  // 轮子 (放大版)
  const wheelGeo = new THREE.TorusGeometry(45, 1.5, 16, 60);
  const wheel = new THREE.Mesh(wheelGeo, iceMaterial);
  ferrisWheelGroup.add(wheel);

  // 辐条 (放大版)
  for(let i=0; i<12; i++) { // 增加辐条数量
    const spokeGeo = new THREE.CylinderGeometry(0.6, 0.6, 90);
    const spoke = new THREE.Mesh(spokeGeo, iceMaterial);
    spoke.rotation.z = (Math.PI / 6) * i;
    ferrisWheelGroup.add(spoke);
  }

  // 支架 (放大版)
  const standGeo = new THREE.CylinderGeometry(1.5, 3, 60);
  const stand1 = new THREE.Mesh(standGeo, iceMaterial);
  stand1.position.set(-15, -25, 0);
  stand1.rotation.z = -0.25;
  
  const stand2 = new THREE.Mesh(standGeo, iceMaterial);
  stand2.position.set(15, -25, 0);
  stand2.rotation.z = 0.25;

  const baseGroup = new THREE.Group();
  baseGroup.add(stand1);
  baseGroup.add(stand2);
  baseGroup.position.set(x, 25, z);
  
  ferrisWheelGroup.position.set(x, 50, z); // 整体抬高
  
  // 绑定交互数据
  const hitBoxGeo = new THREE.BoxGeometry(90, 100, 15);
  const hitBoxMat = new THREE.MeshBasicMaterial({ visible: false });
  const hitBox = new THREE.Mesh(hitBoxGeo, hitBoxMat);
  hitBox.position.set(x, 50, z);
  hitBox.userData = {
    isBuilding: true,
    name: '极光摩天轮',
    status: '运行中',
    visitors: randomInt(100, 300),
    temperature: -18
  };

  scene.add(ferrisWheelGroup);
  scene.add(baseGroup);
  scene.add(hitBox);
  buildings.push(hitBox);
};

// 创建极速冰滑梯组 (升级版：螺旋弯曲滑道，真实U型结构)
const createIceSlide = (x: number, z: number) => {
  const group = new THREE.Group();
  
  // 滑道截面形状 (U型 - 缩小版)
  const slideShape = new THREE.Shape();
  slideShape.absarc(0, 0, 1.5, 0, Math.PI, true); // 半圆弧
  slideShape.lineTo(-1.5, 2); // 左侧壁
  slideShape.lineTo(-2, 2); // 左外沿
  slideShape.lineTo(-2, 0); // 左底
  slideShape.absarc(0, 0, 2, Math.PI, 0, true); // 外底圆弧
  slideShape.lineTo(2, 2); // 右外沿
  slideShape.lineTo(1.5, 2); // 右侧壁
  
  // 创建三条螺旋滑梯 (缩小版)
  for(let i=0; i<3; i++) {
    const radius = 15 + i * 8; // 半径减小
    const height = 40 + i * 15; // 高度减小
    const turns = 1.5 + i * 0.2; // 圈数不变
    
    const points = [];
    const segments = 100;
    for(let j=0; j<=segments; j++) {
      const t = j / segments;
      const angle = t * Math.PI * 2 * turns; // 螺旋角度
      // 螺旋下降路径
      const px = Math.cos(angle) * radius;
      const pz = Math.sin(angle) * radius;
      const py = height * (1 - t);
      points.push(new THREE.Vector3(px, py, pz));
    }
    
    // 延伸一段缓冲直道
    const lastP = points[points.length-1];
    const secondLastP = points[points.length-2];
    const dir = new THREE.Vector3().subVectors(lastP, secondLastP).normalize();
    points.push(new THREE.Vector3(lastP.x + dir.x * 20, 0, lastP.z + dir.z * 20));

    const path = new THREE.CatmullRomCurve3(points);
    
    const extrudeSettings = {
      steps: 150,
      bevelEnabled: false,
      extrudePath: path
    };
    
    const slideGeo = new THREE.ExtrudeGeometry(slideShape, extrudeSettings);
    const slide = new THREE.Mesh(slideGeo, iceMaterial);
    group.add(slide);

    // 添加支撑柱 (每隔一段距离)
    for(let k=0; k<5; k++) {
      const t = 0.2 + k * 0.15;
      const pos = path.getPoint(t);
      if(pos.y > 5) {
        const pillarHeight = pos.y;
        const pillarGeo = new THREE.CylinderGeometry(0.5, 0.8, pillarHeight, 6);
        const pillar = new THREE.Mesh(pillarGeo, iceMaterial);
        pillar.position.set(pos.x, pillarHeight/2, pos.z);
        group.add(pillar);
      }
    }
  }

  group.position.set(x, 0, z);

  // 交互碰撞盒
  const hitBox = new THREE.Mesh(
    new THREE.BoxGeometry(50, 40, 50),
    new THREE.MeshBasicMaterial({ visible: false })
  );
  hitBox.position.set(x, 20, z);
  hitBox.userData = {
    isBuilding: true,
    name: '极速螺旋滑梯',
    status: '运行中',
    visitors: randomInt(600, 1200),
    temperature: -16
  };
  
  scene.add(group);
  scene.add(hitBox);
  buildings.push(hitBox);
};

// 创建极地大剧院 (流线型贝壳结构)
const createGrandTheater = (x: number, z: number) => {
  const group = new THREE.Group();
  
  // 1. 底座台阶
  const baseGeo = new THREE.CylinderGeometry(45, 50, 5, 32);
  const base = new THREE.Mesh(baseGeo, iceMaterial);
  base.position.y = 2.5;
  group.add(base);

  // 2. 主体贝壳 (三个交错的椭球)
  const shellGeo = new THREE.SphereGeometry(25, 32, 32, 0, Math.PI * 2, 0, Math.PI/2);
  
  // 大贝壳
  const shell1 = new THREE.Mesh(shellGeo, iceMaterial);
  shell1.scale.set(1, 1.2, 1.5);
  shell1.position.set(0, 5, 0);
  shell1.rotation.x = -Math.PI / 6;
  
  // 中贝壳
  const shell2 = new THREE.Mesh(shellGeo, iceMaterial);
  shell2.scale.set(0.8, 1.0, 1.2);
  shell2.position.set(15, 5, 10);
  shell2.rotation.x = -Math.PI / 5;
  shell2.rotation.y = Math.PI / 4;

  // 小贝壳
  const shell3 = new THREE.Mesh(shellGeo, iceMaterial);
  shell3.scale.set(0.6, 0.8, 1.0);
  shell3.position.set(-15, 5, 10);
  shell3.rotation.x = -Math.PI / 5;
  shell3.rotation.y = -Math.PI / 4;

  group.add(shell1, shell2, shell3);

  // 3. 顶部装饰 (全息投影球)
  const orbGeo = new THREE.SphereGeometry(4, 16, 16);
  const orbMat = new THREE.MeshBasicMaterial({ color: 0x00ffff });
  const orb = new THREE.Mesh(orbGeo, orbMat);
  orb.position.set(0, 40, -5);
  group.add(orb);

  // 4. 环绕光带
  const ringGeo = new THREE.TorusGeometry(35, 0.5, 16, 64);
  const ringMat = new THREE.MeshBasicMaterial({ color: 0xff00ff });
  const ring = new THREE.Mesh(ringGeo, ringMat);
  ring.rotation.x = Math.PI / 2;
  ring.position.y = 10;
  group.add(ring);

  group.position.set(x, 0, z);

  // 交互碰撞盒
  const hitBox = new THREE.Mesh(
    new THREE.BoxGeometry(80, 50, 80),
    new THREE.MeshBasicMaterial({ visible: false })
  );
  hitBox.position.set(x, 25, z);
  hitBox.userData = {
    isBuilding: true,
    name: '极地大剧院',
    status: '演出中: 冰雪奇缘',
    visitors: randomInt(800, 1500),
    temperature: -15
  };

  scene.add(group);
  scene.add(hitBox);
  buildings.push(hitBox);
};

// 创建水晶圣殿 (哥特式尖塔群)
const createCrystalSanctuary = (x: number, z: number) => {
  const group = new THREE.Group();

  // 1. 主塔
  const mainTowerGeo = new THREE.CylinderGeometry(10, 15, 60, 6);
  const mainTower = new THREE.Mesh(mainTowerGeo, iceMaterial);
  mainTower.position.y = 30;
  
  const mainSpireGeo = new THREE.ConeGeometry(10, 40, 6);
  const mainSpire = new THREE.Mesh(mainSpireGeo, iceMaterial);
  mainSpire.position.y = 80;

  // 2. 四周副塔
  const subTowerGeo = new THREE.CylinderGeometry(4, 6, 30, 6);
  const subSpireGeo = new THREE.ConeGeometry(4, 20, 6);
  
  for(let i=0; i<4; i++) {
    const angle = (Math.PI / 2) * i;
    const tx = Math.cos(angle) * 20;
    const tz = Math.sin(angle) * 20;
    
    const st = new THREE.Mesh(subTowerGeo, iceMaterial);
    st.position.set(tx, 15, tz);
    
    const ss = new THREE.Mesh(subSpireGeo, iceMaterial);
    ss.position.set(tx, 40, tz);
    
    // 飞扶壁 (连接主塔和副塔)
    const bridgeGeo = new THREE.BoxGeometry(10, 2, 2);
    const bridge = new THREE.Mesh(bridgeGeo, iceMaterial);
    bridge.position.set(tx/2, 20, tz/2);
    bridge.lookAt(0, 20, 0);

    group.add(st, ss, bridge);
  }

  // 3. 悬浮能量环
  const haloGeo = new THREE.TorusGeometry(12, 0.8, 16, 32);
  const haloMat = new THREE.MeshBasicMaterial({ color: 0xffff00 });
  const halo = new THREE.Mesh(haloGeo, haloMat);
  halo.rotation.x = Math.PI / 2;
  halo.position.y = 90;
  // 简单的上下浮动动画需要在 animate 中实现，这里先静态

  group.add(mainTower, mainSpire, halo);
  group.position.set(x, 0, z);

  // 交互碰撞盒
  const hitBox = new THREE.Mesh(
    new THREE.BoxGeometry(60, 100, 60),
    new THREE.MeshBasicMaterial({ visible: false })
  );
  hitBox.position.set(x, 50, z);
  hitBox.userData = {
    isBuilding: true,
    name: '水晶圣殿',
    status: '运行中',
    visitors: randomInt(200, 500),
    temperature: -20
  };

  scene.add(group);
  scene.add(hitBox);
  buildings.push(hitBox);
};

// 初始化 Three.js 场景
const initThree = () => {
  if (!threeContainer.value) return;

  // 1. 场景
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x87CEEB); // 设置天蓝色背景，替代天空球
  scene.fog = new THREE.FogExp2(0xffffff, 0.0015); // 改为白色雾，匹配蓝天

  // 2. 相机
  const width = threeContainer.value.clientWidth;
  const height = threeContainer.value.clientHeight;
  camera = new THREE.PerspectiveCamera(60, width / height, 1, 1000);
  camera.position.set(0, 200, 300); // 抬高相机，俯瞰大场景

  // 3. 渲染器
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(window.devicePixelRatio);
  threeContainer.value.appendChild(renderer.domElement);

  // 4. 控制器
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.maxPolarAngle = Math.PI / 2 - 0.05;

  // 5. 灯光
  // 环境光增强
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
  scene.add(ambientLight);

  // 主平行光增强
  const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
  dirLight.position.set(50, 100, 50);
  scene.add(dirLight);

  // 补光：增加一个背面的平行光，消除阴影死角
  const backLight = new THREE.DirectionalLight(0xaaddff, 0.8);
  backLight.position.set(-50, 50, -50);
  scene.add(backLight);

  // 增加点光源模拟霓虹灯，增强亮度和范围
  const colors = [0x00eaff, 0xff00ff, 0x00ff00, 0xffaa00];
  colors.forEach((color, i) => {
    const light = new THREE.PointLight(color, 3, 200);
    light.position.set(Math.cos(i*1.5)*100, 40, Math.sin(i*1.5)*100);
    scene.add(light);
  });

  // 6. 地面 (雪地)
  const planeGeometry = new THREE.PlaneGeometry(800, 800);
  const planeMaterial = new THREE.MeshStandardMaterial({ 
    color: 0xffffff,
    roughness: 0.4,
    metalness: 0.1,
    side: THREE.DoubleSide
  });
  const plane = new THREE.Mesh(planeGeometry, planeMaterial);
  plane.rotation.x = -Math.PI / 2;
  scene.add(plane);

  // 7. 构建场景
  createFortressWall(); // 城墙与大门
  
  // 中轴线建筑
  createChinesePalace(0, -50); // 核心：冰雪大皇宫
  createDragonSculpture(0, 80); // 入口：巨龙冰雕
  
  // 北部高地
  createEuropeanCastle(0, -140); // 远景：梦幻城堡
  
  // 西北角：极地大剧院
  createGrandTheater(-120, -100);

  // 东北角：水晶圣殿
  createCrystalSanctuary(120, -100);

  // 东部商业与文化
  createMall(120, -30); // 极地购物中心
  createIcePagoda(140, 60); // 玲珑冰塔
  
  // 西部游乐区
  createFerrisWheel(-120, -30); // 摩天轮
  createIceSlide(-140, 60); // 冰滑梯
  
  // 随机填充特色小项目
  const types: ('tree' | 'igloo' | 'snowman')[] = ['tree', 'igloo', 'snowman'];
  for(let i=0; i<40; i++) {
    const x = (Math.random() - 0.5) * 340;
    const z = (Math.random() - 0.5) * 340;
    
    // 简单的碰撞检测，避开主要建筑区域
    if (Math.abs(x) < 60 && Math.abs(z) < 100) continue; // 避开中轴线
    if (x > 80 && z < 0) continue; // 避开商场
    if (x < -80 && z < 0) continue; // 避开摩天轮
    if (Math.abs(z) > 160) continue; // 避开城墙边缘

    const type = types[Math.floor(Math.random() * types.length)];
    createSmallItem(type, x, z, i+1);
  }

  // 8. 能源流动粒子
  const particleGeo = new THREE.SphereGeometry(0.8, 8, 8);
  const particleMat = new THREE.MeshBasicMaterial({ color: 0x00eaff });
  
  for (let i = 0; i < 50; i++) {
    const particle = new THREE.Mesh(particleGeo, particleMat);
    particle.position.set(
      (Math.random() - 0.5) * 300,
      5,
      (Math.random() - 0.5) * 300
    );
    particle.userData = {
      velocity: new THREE.Vector3(
        (Math.random() - 0.5) * 1,
        (Math.random() - 0.5) * 0.5,
        (Math.random() - 0.5) * 1
      )
    };
    scene.add(particle);
    energyParticles.push(particle);
  }

  // 9. 交互
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  const onMouseMove = (event: MouseEvent) => {
    const rect = renderer.domElement.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(buildings);

    if (intersects.length > 0) {
      const target = intersects[0].object as THREE.Mesh;
      // 更新 Tooltip
      tooltip.show = true;
      tooltip.left = event.clientX + 15;
      tooltip.top = event.clientY + 15;
      tooltip.data = {
        name: target.userData.name,
        status: target.userData.status,
        visitors: target.userData.visitors,
        temperature: target.userData.temperature
      };
      document.body.style.cursor = 'pointer';
    } else {
      tooltip.show = false;
      document.body.style.cursor = 'default';
    }
  };

  renderer.domElement.addEventListener('mousemove', onMouseMove);

  animate();
};

const animate = () => {
  animationId = requestAnimationFrame(animate);
  controls.update();

  // 摩天轮旋转
  if(ferrisWheelGroup) {
    ferrisWheelGroup.rotation.z += 0.002;
  }

  // 更新粒子位置
  energyParticles.forEach(p => {
    p.position.add(p.userData.velocity);
    if (Math.abs(p.position.x) > 150 || Math.abs(p.position.z) > 150 || p.position.y < 0 || p.position.y > 50) {
      p.position.set(0, 20, 0); // 从中心重新发射
    }
  });

  renderer.render(scene, camera);
};

const handleResize = () => {
  if (!threeContainer.value || !camera || !renderer) return;
  const width = threeContainer.value.clientWidth;
  const height = threeContainer.value.clientHeight;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
};

onMounted(() => {
  deviceStatusList.value = getBuildingStatusList();
  setInterval(() => {
    deviceStatusList.value = getBuildingStatusList();
  }, 5000);

  setTimeout(() => {
    initThree();
    window.addEventListener('resize', handleResize);
  }, 100);
});

onBeforeUnmount(() => {
  cancelAnimationFrame(animationId);
  window.removeEventListener('resize', handleResize);
  if (renderer) {
    renderer.dispose();
  }
});
</script>

<template>
  <div class="centermap">
    <div class="mapwrap">
      <div ref="threeContainer" class="three-container"></div>

      <!-- 设备状态列表 -->
      <div class="device-status-list" :class="{ 'collapsed': !isDeviceListExpanded }">
        <div class="list-title" @click="isDeviceListExpanded = !isDeviceListExpanded">
          <span>设备实时状态</span>
          <span class="toggle-icon" :style="{ transform: isDeviceListExpanded ? 'rotate(0deg)' : 'rotate(-90deg)' }">▼</span>
        </div>
        <div class="list-content">
          <div class="list-item" v-for="item in deviceStatusList" :key="item.id">
            <span class="name">{{ item.name }}</span>
            <span class="status" :class="item.status === '运行中' ? 'running' : 'warning'">{{ item.status }}</span>
            <span class="load">负载: {{ item.load }}</span>
            <span class="temp">温度: {{ item.temperature }}</span>
          </div>
        </div>
      </div>

      <!-- 3D 模型悬浮窗 -->
      <div class="model-tooltip" v-show="tooltip.show" :style="{ left: tooltip.left + 'px', top: tooltip.top + 'px' }">
        <div class="tooltip-title">{{ tooltip.data.name }}</div>
        <div class="tooltip-row">
          <span class="label">状态:</span>
          <span class="value" :class="tooltip.data.status === '运行中' ? 'running' : 'normal'">{{ tooltip.data.status }}</span>
        </div>
        <div class="tooltip-row">
          <span class="label">当前人数:</span>
          <span class="value">{{ tooltip.data.visitors }} 人</span>
        </div>
        <div class="tooltip-row">
          <span class="label">环境温度:</span>
          <span class="value">{{ tooltip.data.temperature }} ℃</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.centermap {
  height: 100%;
  // margin-bottom: 30px;

  .mapwrap {
    height: 90%;
    width: 100%;
    box-sizing: border-box;
    position: relative;

    .three-container {
      width: 100%;
      height: 100%;
      overflow: hidden;
    }

    .device-status-list {
      position: absolute;
      top: 20px;
      left: 20px;
      width: 300px;
      background: rgba(0, 0, 0, 0.6);
      border: 1px solid rgba(0, 234, 255, 0.3);
      border-radius: 8px;
      padding: 10px;
      z-index: 10;
      backdrop-filter: blur(5px);
      pointer-events: auto;
      transition: width 0.3s ease;

      &.collapsed {
        width: 150px;
        background: rgba(0, 0, 0, 0.4);
        
        .list-title {
          border-bottom: none;
          margin-bottom: 0;
          padding-bottom: 0;
        }

        .list-content {
          max-height: 0;
          opacity: 0;
          margin-top: 0;
        }
      }

      .list-title {
        font-size: 16px;
        color: #00eaff;
        margin-bottom: 10px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-weight: bold;
        border-bottom: 1px solid rgba(0, 234, 255, 0.2);
        padding-bottom: 5px;
        cursor: pointer;
        user-select: none;

        .toggle-icon {
          transition: transform 0.3s;
          font-size: 12px;
        }
      }

      .list-content {
        max-height: 600px;
        overflow: hidden;
        transition: max-height 0.5s ease, opacity 0.5s ease;
        opacity: 1;
      }

      .list-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 12px;
        color: #fff;
        margin-bottom: 8px;
        padding: 4px;
        background: rgba(255, 255, 255, 0.05);
        border-radius: 4px;

        .name {
          flex: 1;
        }

        .status {
          margin-right: 8px;
          &.running { color: #00ff00; }
          &.warning { color: #ffaa00; }
        }

        .load, .temp {
          font-size: 10px;
          color: rgba(255, 255, 255, 0.6);
          margin-left: 5px;
        }
      }
    }

    .model-tooltip {
      position: fixed; // 使用 fixed 定位，避免被父容器 overflow 裁剪
      z-index: 9999;
      background: rgba(0, 20, 40, 0.9);
      border: 1px solid #00eaff;
      border-radius: 4px;
      padding: 10px;
      box-shadow: 0 0 15px rgba(0, 234, 255, 0.5);
      pointer-events: none;
      transform: translate(10px, 10px);
      backdrop-filter: blur(4px);
      min-width: 150px;

      .tooltip-title {
        font-size: 14px;
        font-weight: bold;
        color: #00eaff;
        margin-bottom: 8px;
        border-bottom: 1px solid rgba(0, 234, 255, 0.3);
        padding-bottom: 4px;
      }

      .tooltip-row {
        display: flex;
        justify-content: space-between;
        font-size: 12px;
        color: #fff;
        margin-bottom: 4px;

        .label {
          color: rgba(255, 255, 255, 0.7);
        }

        .value {
          font-weight: bold;
          &.running { color: #00ff00; }
          &.normal { color: #fff; }
        }
      }
    }
  }
}
</style>
