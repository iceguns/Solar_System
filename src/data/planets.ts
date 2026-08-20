export interface AtmoPart {
  gas: string;
  pct: number;
}

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
  /** 档案主备注 */
  fact: string;
  /** 补充冷知识（面板列表） */
  facts: string[];
  /** 1× 速度下绕一圈所需秒数（经指数压缩，保留相对快慢） */
  demoPeriod: number;
  /** 是否为类地行星（用于数据表分组着色） */
  rocky: boolean;

  /* ── 扩展档案 ── */
  massLabel: string;
  gravityLabel: string;
  tiltLabel: string;
  /** 阳光抵达所需时间 */
  lightLabel: string;
  /** 著名卫星 */
  moonsLabel: string;
  /** 代表探测任务 */
  missionLabel: string;
  /** 观测 / 发现史 */
  discoveryLabel: string;
  /** 大气成分（体积占比，约数） */
  atmo: AtmoPart[];
  atmoNote: string;
}

/** 压缩公式：demoPeriod = C * periodDays^0.45，令地球约 12s/圈 */
export const DEMO_C = 0.843;
const compress = (days: number) => Math.round(DEMO_C * Math.pow(days, 0.45) * 10) / 10;

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
  facts: [
    "核心温度约 1,500 万°C，氢核聚变每秒钟合成约 6 亿吨氦。",
    "光从核心「挤」到表面需要上万年，离开表面后 8 分 20 秒即达地球。",
    "它正处于壮年期，约 50 亿年后将膨胀为红巨星，吞没内侧行星的轨道。",
  ],
  demoPeriod: 0,
  rocky: false,
  massLabel: "1.989 × 10³⁰ kg",
  gravityLabel: "274 m/s²",
  tiltLabel: "7.25°",
  lightLabel: "—（光源本身）",
  moonsLabel: "—",
  missionLabel: "帕克太阳探测器 · 羲和号 · 夸父一号",
  discoveryLabel: "远古即被观测 · 1543 年哥白尼确立日心说",
  atmo: [
    { gas: "H", pct: 73.5 },
    { gas: "He", pct: 24.9 },
    { gas: "其它", pct: 1.6 },
  ],
  atmoNote: "光球层之上依次为色球层与百万度的日冕",
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
    facts: [
      "表面布满与月球相似的陨击坑，最大的卡洛里盆地直径约 1,550 km。",
      "没有卫星，也留不住厚大气，昼夜温差超过 600°C。",
      "信使号（2011–2015）曾环绕探测；贝皮可伦坡号预计 2026 年抵达。",
    ],
    demoPeriod: compress(87.97),
    rocky: true,
    massLabel: "3.30 × 10²³ kg",
    gravityLabel: "3.7 m/s²",
    tiltLabel: "0.03°",
    lightLabel: "3.2 分钟",
    moonsLabel: "—（无卫星）",
    missionLabel: "水手 10 号 · 信使号 · 贝皮可伦坡号",
    discoveryLabel: "上古时代 · 肉眼可见",
    atmo: [
      { gas: "O", pct: 42 },
      { gas: "Na", pct: 29 },
      { gas: "H", pct: 22 },
      { gas: "He", pct: 6 },
    ],
    atmoNote: "只有极稀薄的外逸层，气体不断逃逸又被补充",
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
    facts: [
      "表面气压约为地球的 92 倍，相当于地球海洋 900 米深处。",
      "古称「太白」「启明」「长庚」，是夜空中最亮的行星。",
      "苏联金星号系列曾多次着陆，最长纪录也仅在表面存活约 2 小时。",
    ],
    demoPeriod: compress(224.7),
    rocky: true,
    massLabel: "4.87 × 10²⁴ kg",
    gravityLabel: "8.87 m/s²",
    tiltLabel: "177.4°（逆行自转）",
    lightLabel: "6.0 分钟",
    moonsLabel: "—（无卫星）",
    missionLabel: "金星计划 · 麦哲伦号 · 晓号",
    discoveryLabel: "上古时代 · 肉眼可见",
    atmo: [
      { gas: "CO₂", pct: 96.5 },
      { gas: "N₂", pct: 3.5 },
    ],
    atmoNote: "浓厚大气 + 硫酸云，失控的温室效应",
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
    facts: [
      "太阳系中密度最高的行星（5.51 g/cm³）。",
      "磁场源自液态外核的「发电机效应」，为生命屏蔽太阳风。",
      "月球正以每年约 3.8 cm 的速度悄悄远离。",
    ],
    demoPeriod: compress(365.25),
    rocky: true,
    massLabel: "5.97 × 10²⁴ kg",
    gravityLabel: "9.81 m/s²",
    tiltLabel: "23.4°（四季之源）",
    lightLabel: "8 分 20 秒",
    moonsLabel: "月球",
    missionLabel: "—（我们的家园）",
    discoveryLabel: "—（我们在这里）",
    atmo: [
      { gas: "N₂", pct: 78 },
      { gas: "O₂", pct: 21 },
      { gas: "Ar", pct: 1 },
    ],
    atmoNote: "太阳系中唯一富含游离氧的大气",
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
    facts: [
      "一天 24.6 小时、四季分明，是与地球节律最像的行星。",
      "水手谷长约 4,000 km，几乎横跨整个美国东西海岸。",
      "好奇号、毅力号与祝融号都曾在它的表面行驶。",
    ],
    demoPeriod: compress(686.98),
    rocky: true,
    massLabel: "6.42 × 10²³ kg",
    gravityLabel: "3.71 m/s²",
    tiltLabel: "25.2°",
    lightLabel: "12.7 分钟",
    moonsLabel: "火卫一 · 火卫二",
    missionLabel: "海盗号 · 好奇号 · 毅力号 · 天问一号",
    discoveryLabel: "上古时代 · 肉眼可见",
    atmo: [
      { gas: "CO₂", pct: 95 },
      { gas: "N₂", pct: 2.8 },
      { gas: "Ar", pct: 2 },
    ],
    atmoNote: "气压不足地球海平面的 1%",
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
    facts: [
      "自转不足 10 小时，快速旋转把赤道甩得明显隆起。",
      "磁场约为地球的 2 万倍，是行星之最。",
      "木卫二欧罗巴的冰下海洋，被视为寻找地外生命的头号目标。",
    ],
    demoPeriod: compress(4332.6),
    rocky: false,
    massLabel: "1.898 × 10²⁷ kg",
    gravityLabel: "24.79 m/s²",
    tiltLabel: "3.1°",
    lightLabel: "43.3 分钟",
    moonsLabel: "木卫一至四（伽利略卫星）等 95 颗",
    missionLabel: "伽利略号 · 朱诺号 · JUICE",
    discoveryLabel: "上古时代 · 肉眼可见",
    atmo: [
      { gas: "H₂", pct: 90 },
      { gas: "He", pct: 10 },
    ],
    atmoNote: "成分最接近原始太阳星云",
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
    facts: [
      "卡西尼号证实环物质正以「环雨」形式缓慢坠入行星本体。",
      "卫星泰坦拥有浓厚大气与液态甲烷湖，惠更斯曾在此着陆。",
      "恩克拉多斯的冰下喷泉，暗示冰壳之下藏着全球海洋。",
    ],
    demoPeriod: compress(10759),
    rocky: false,
    massLabel: "5.68 × 10²⁶ kg",
    gravityLabel: "10.44 m/s²",
    tiltLabel: "26.7°（环的倾角）",
    lightLabel: "1 小时 20 分",
    moonsLabel: "泰坦 · 恩克拉多斯等 146 颗",
    missionLabel: "卡西尼-惠更斯号（2004–2017）",
    discoveryLabel: "上古时代 · 肉眼可见",
    atmo: [
      { gas: "H₂", pct: 96 },
      { gas: "He", pct: 3 },
      { gas: "CH₄", pct: 1 },
    ],
    atmoNote: "平均密度 0.69 g/cm³，比水还低",
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
    facts: [
      "1781 年赫歇尔用自制望远镜发现它——人类首次「发现」新行星。",
      "淡青色来自大气中甲烷对红光的吸收。",
      "旅行者 2 号（1986 年飞掠）是迄今唯一到访的探测器。",
    ],
    demoPeriod: compress(30687),
    rocky: false,
    massLabel: "8.68 × 10²⁵ kg",
    gravityLabel: "8.87 m/s²",
    tiltLabel: "97.8°（躺着自转）",
    lightLabel: "2 小时 40 分",
    moonsLabel: "天卫五米兰达等 28 颗",
    missionLabel: "旅行者 2 号（1986 飞掠）",
    discoveryLabel: "1781 年 · 威廉·赫歇尔",
    atmo: [
      { gas: "H₂", pct: 83 },
      { gas: "He", pct: 15 },
      { gas: "CH₄", pct: 2 },
    ],
    atmoNote: "内部以水、氨、甲烷「冰」为主",
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
    facts: [
      "风速可达 2,100 km/h——太阳系里的风暴之王。",
      "勒维耶与亚当斯各自独立用数学推算出了它的位置。",
      "卫星海卫一逆行运转，可能是被俘获的柯伊伯带天体。",
    ],
    demoPeriod: compress(60190),
    rocky: false,
    massLabel: "1.02 × 10²⁶ kg",
    gravityLabel: "11.15 m/s²",
    tiltLabel: "28.3°",
    lightLabel: "4 小时 10 分",
    moonsLabel: "海卫一特里顿等 16 颗",
    missionLabel: "旅行者 2 号（1989 飞掠）",
    discoveryLabel: "1846 年 · 伽勒（据勒维耶计算）",
    atmo: [
      { gas: "H₂", pct: 80 },
      { gas: "He", pct: 19 },
      { gas: "CH₄", pct: 1 },
    ],
    atmoNote: "高空风速超过音速",
  },
  {
    id: "pluto",
    symbol: "⯓",
    name: "冥王星",
    en: "Pluto",
    category: "矮行星 · 柯伊伯带",
    color: "#e0c9a8",
    colorDeep: "#8a6f4d",
    glow: "rgba(224,201,168,0.38)",
    orbitRadius: 396,
    sizeRadius: 4.2,
    diameterKm: 2377,
    diameterLabel: "2,377 km",
    distanceLabel: "59.06 亿 km",
    distanceAU: "39.48 AU",
    orbitPeriodDays: 90560,
    orbitPeriodLabel: "248 地球年",
    rotationLabel: "6.4 地球日（逆向）",
    moons: 5,
    tempLabel: "约 -229°C",
    velocityLabel: "4.7 km/s",
    earthRatio: 0.19,
    fact: "冥王星与它的卫星卡戎互相潮汐锁定，永远以同一面相对——像一对牵手旋转的舞伴。",
    facts: [
      "2006 年因「未能清空轨道附近」被重新归类为矮行星。",
      "2015 年新视野号拍到的「心形」区域是一整片氮冰平原。",
      "轨道高度偏心，1979–1999 年间它曾比海王星更靠近太阳。",
    ],
    demoPeriod: compress(90560),
    rocky: false,
    massLabel: "1.31 × 10²² kg",
    gravityLabel: "0.62 m/s²",
    tiltLabel: "122.5°",
    lightLabel: "5 小时 28 分",
    moonsLabel: "卡戎等 5 颗",
    missionLabel: "新视野号（2015 飞掠）",
    discoveryLabel: "1930 年 · 克莱德·汤博",
    atmo: [
      { gas: "N₂", pct: 90 },
      { gas: "CH₄", pct: 8 },
      { gas: "CO", pct: 2 },
    ],
    atmoNote: "极稀薄，随轨道远近冻结—升华循环",
  },
];

export const ALL_BODIES: CelestialBody[] = [SUN, ...PLANETS];

export const SPEED_PRESETS = [0.5, 1, 2, 5, 10, 20];

export const EARTH_DEMO_PERIOD = PLANETS[2].demoPeriod;

/** 开普勒第三定律数据行（a：AU，T：年，T²/a³≈1） */
export const KEPLER_ROWS = [
  { name: "水星", a: 0.387, T: 0.241 },
  { name: "金星", a: 0.723, T: 0.615 },
  { name: "地球", a: 1.0, T: 1.0 },
  { name: "火星", a: 1.524, T: 1.881 },
  { name: "木星", a: 5.203, T: 11.86 },
  { name: "土星", a: 9.537, T: 29.46 },
  { name: "天王星", a: 19.19, T: 84.01 },
  { name: "海王星", a: 30.07, T: 164.8 },
];

/** 各行星的光照时延（分钟），用于「光的旅行」条形图 */
export const LIGHT_MINUTES = [
  { id: "mercury", name: "水星", minutes: 3.2 },
  { id: "venus", name: "金星", minutes: 6.0 },
  { id: "earth", name: "地球", minutes: 8.33 },
  { id: "mars", name: "火星", minutes: 12.7 },
  { id: "jupiter", name: "木星", minutes: 43.3 },
  { id: "saturn", name: "土星", minutes: 79.6 },
  { id: "uranus", name: "天王星", minutes: 159.6 },
  { id: "neptune", name: "海王星", minutes: 250 },
  { id: "pluto", name: "冥王星", minutes: 328 },
];
