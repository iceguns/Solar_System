export interface CelestialBody {
  id: string;
  symbol: string;
  name: string;
  en: string;
  category: string;
  /** 主色 / 暗部色 / 光晕色 */
  color: string;
  colorDeep: string;
  glow: string;
  /** 轨道半径（画布 px），太阳为 0 */
  orbitRadius: number;
  /** 展示用球体半径（画布 px） */
  sizeRadius: number;
  diameterKm: number;
  diameterLabel: string;
  distanceLabel: string;
  distanceAU: string;
  /** 真实公转周期（地球日），用于压缩计算；太阳为 0 */
  orbitPeriodDays: number;
  orbitPeriodLabel: string;
  rotationLabel: string;
  moons: number | null;
  tempLabel: string;
  velocityLabel: string;
  earthRatio: number;
  fact: string;
  /** 1× 速度下绕一圈所需秒数（经指数压缩，保留相对快慢） */
  demoPeriod: number;
  /** 是否为类地行星（用于数据表分组着色） */
  rocky: boolean;
}

/** 压缩公式：demoPeriod = C * periodDays^0.45，令地球约 12s/圈 */
const C = 0.843;
const compress = (days: number) => Math.round(C * Math.pow(days, 0.45) * 10) / 10;

export const SUN: CelestialBody = {
  id: "sun",
  symbol: "☉",
  name: "太阳",
  en: "Sun",
  category: "恒星 · G 型主序星（黄矮星）",
  color: "#ffd166",
  colorDeep: "#ff8f1f",
  glow: "rgba(255,170,60,0.55)",
  orbitRadius: 0,
  sizeRadius: 30,
  diameterKm: 1392700,
  diameterLabel: "139.27 万 km",
  distanceLabel: "—（系统中心）",
  distanceAU: "0 AU",
  orbitPeriodDays: 0,
  orbitPeriodLabel: "绕银河系一周约 2.3 亿年",
  rotationLabel: "约 25～35 天（较差自转）",
  moons: null,
  tempLabel: "表面 5,505°C · 核心 1,500 万°C",
  velocityLabel: "绕银心约 230 km/s",
  earthRatio: 109.2,
  fact: "太阳占据了整个太阳系总质量的 99.86%，每秒钟将约 400 万吨物质转化为纯能量。",
  demoPeriod: 0,
  rocky: false,
};

export const PLANETS: CelestialBody[] = [
  {
    id: "mercury",
    symbol: "☿",
    name: "水星",
    en: "Mercury",
    category: "类地行星",
    color: "#cfc4b4",
    colorDeep: "#6e6459",
    glow: "rgba(207,196,180,0.4)",
    orbitRadius: 80,
    sizeRadius: 4.6,
    diameterKm: 4879,
    diameterLabel: "4,879 km",
    distanceLabel: "5,790 万 km",
    distanceAU: "0.39 AU",
    orbitPeriodDays: 87.97,
    orbitPeriodLabel: "88 地球日",
    rotationLabel: "58.6 地球日",
    moons: 0,
    tempLabel: "-173°C ～ 427°C",
    velocityLabel: "47.4 km/s",
    earthRatio: 0.38,
    fact: "水星是八大行星中公转最快的一颗，但它的「一天」（日出到日出）长达 176 个地球日——比它的一年还长一倍。",
    demoPeriod: compress(87.97),
    rocky: true,
  },
  {
    id: "venus",
    symbol: "♀",
    name: "金星",
    en: "Venus",
    category: "类地行星",
    color: "#f3d9a4",
    colorDeep: "#b3813d",
    glow: "rgba(243,217,164,0.42)",
    orbitRadius: 110,
    sizeRadius: 7.6,
    diameterKm: 12104,
    diameterLabel: "12,104 km",
    distanceLabel: "1.082 亿 km",
    distanceAU: "0.72 AU",
    orbitPeriodDays: 224.7,
    orbitPeriodLabel: "224.7 地球日",
    rotationLabel: "243 地球日（逆向）",
    moons: 0,
    tempLabel: "约 464°C（最热行星）",
    velocityLabel: "35.0 km/s",
    earthRatio: 0.95,
    fact: "金星自转方向与众不同——在金星上，太阳从西边升起。它厚重的大气产生强烈温室效应，使它比离太阳更近的水星还热。",
    demoPeriod: compress(224.7),
    rocky: true,
  },
  {
    id: "earth",
    symbol: "♁",
    name: "地球",
    en: "Earth",
    category: "类地行星",
    color: "#7cc4ff",
    colorDeep: "#1d5fbf",
    glow: "rgba(124,196,255,0.45)",
    orbitRadius: 142,
    sizeRadius: 8,
    diameterKm: 12756,
    diameterLabel: "12,756 km",
    distanceLabel: "1.496 亿 km",
    distanceAU: "1.00 AU",
    orbitPeriodDays: 365.25,
    orbitPeriodLabel: "365.25 地球日",
    rotationLabel: "23.9 小时",
    moons: 1,
    tempLabel: "平均约 15°C",
    velocityLabel: "29.8 km/s",
    earthRatio: 1,
    fact: "地球是目前已知唯一存在生命的星球。液态水覆盖了约 71% 的表面，而月球的引力稳定了地轴倾角，带来了四季。",
    demoPeriod: compress(365.25),
    rocky: true,
  },
  {
    id: "mars",
    symbol: "♂",
    name: "火星",
    en: "Mars",
    category: "类地行星",
    color: "#ff9a6b",
    colorDeep: "#a63d24",
    glow: "rgba(255,154,107,0.42)",
    orbitRadius: 174,
    sizeRadius: 5.8,
    diameterKm: 6792,
    diameterLabel: "6,792 km",
    distanceLabel: "2.279 亿 km",
    distanceAU: "1.52 AU",
    orbitPeriodDays: 686.98,
    orbitPeriodLabel: "687 地球日",
    rotationLabel: "24.6 小时",
    moons: 2,
    tempLabel: "平均约 -63°C",
    velocityLabel: "24.1 km/s",
    earthRatio: 0.53,
    fact: "火星上的奥林帕斯山高约 21.9 km，接近珠穆朗玛峰的三倍，是太阳系已知最高的火山。",
    demoPeriod: compress(686.98),
    rocky: true,
  },
  {
    id: "jupiter",
    symbol: "♃",
    name: "木星",
    en: "Jupiter",
    category: "气态巨行星",
    color: "#f2c49b",
    colorDeep: "#9c5f33",
    glow: "rgba(242,196,155,0.42)",
    orbitRadius: 226,
    sizeRadius: 21,
    diameterKm: 142984,
    diameterLabel: "142,984 km",
    distanceLabel: "7.786 亿 km",
    distanceAU: "5.20 AU",
    orbitPeriodDays: 4332.6,
    orbitPeriodLabel: "11.9 地球年",
    rotationLabel: "9.9 小时（最快自转）",
    moons: 95,
    tempLabel: "云顶约 -108°C",
    velocityLabel: "13.1 km/s",
    earthRatio: 11.2,
    fact: "木星的大红斑是一场持续了至少 350 年的巨型风暴，宽度足以并排放下两个地球。它也是行星中的「老大哥」——质量是其余七颗行星总和的 2.5 倍。",
    demoPeriod: compress(4332.6),
    rocky: false,
  },
  {
    id: "saturn",
    symbol: "♄",
    name: "土星",
    en: "Saturn",
    category: "气态巨行星",
    color: "#f0d9a8",
    colorDeep: "#a5804a",
    glow: "rgba(240,217,168,0.42)",
    orbitRadius: 274,
    sizeRadius: 17.5,
    diameterKm: 120536,
    diameterLabel: "120,536 km",
    distanceLabel: "14.335 亿 km",
    distanceAU: "9.58 AU",
    orbitPeriodDays: 10759,
    orbitPeriodLabel: "29.4 地球年",
    rotationLabel: "10.7 小时",
    moons: 146,
    tempLabel: "云顶约 -139°C",
    velocityLabel: "9.7 km/s",
    earthRatio: 9.45,
    fact: "土星环宽约 28 万公里，厚度却大多不足 1 公里——由无数冰粒与碎石组成。土星密度低于水，理论上可以浮在足够大的浴缸里。",
    demoPeriod: compress(10759),
    rocky: false,
  },
  {
    id: "uranus",
    symbol: "♅",
    name: "天王星",
    en: "Uranus",
    category: "冰巨行星",
    color: "#bfeef2",
    colorDeep: "#4ba8b8",
    glow: "rgba(191,238,242,0.4)",
    orbitRadius: 318,
    sizeRadius: 12,
    diameterKm: 51118,
    diameterLabel: "51,118 km",
    distanceLabel: "28.725 亿 km",
    distanceAU: "19.19 AU",
    orbitPeriodDays: 30687,
    orbitPeriodLabel: "84 地球年",
    rotationLabel: "17.2 小时（侧躺自转）",
    moons: 28,
    tempLabel: "云顶约 -197°C",
    velocityLabel: "6.8 km/s",
    earthRatio: 4.0,
    fact: "天王星的自转轴倾斜约 98°，几乎是「躺着」绕太阳滚动——每个极点会经历连续 42 年的白昼，再迎来 42 年的黑夜。",
    demoPeriod: compress(30687),
    rocky: false,
  },
  {
    id: "neptune",
    symbol: "♆",
    name: "海王星",
    en: "Neptune",
    category: "冰巨行星",
    color: "#7ea6ff",
    colorDeep: "#2b49c9",
    glow: "rgba(126,166,255,0.42)",
    orbitRadius: 358,
    sizeRadius: 11.5,
    diameterKm: 49528,
    diameterLabel: "49,528 km",
    distanceLabel: "44.951 亿 km",
    distanceAU: "30.07 AU",
    orbitPeriodDays: 60190,
    orbitPeriodLabel: "164.8 地球年",
    rotationLabel: "16.1 小时",
    moons: 16,
    tempLabel: "云顶约 -201°C",
    velocityLabel: "5.4 km/s",
    earthRatio: 3.88,
    fact: "海王星是唯一「先由数学算出位置、后被望远镜找到」的行星（1846 年）。直到 2011 年，它才完成被发现后的第一整圈公转。",
    demoPeriod: compress(60190),
    rocky: false,
  },
];

export const ALL_BODIES: CelestialBody[] = [SUN, ...PLANETS];

export const SPEED_PRESETS = [0.5, 1, 2, 5, 10, 20];

export const EARTH_DEMO_PERIOD = PLANETS[2].demoPeriod;
