/** 气体配色（大气成分堆叠图） */
export const GAS_COLORS: Record<string, string> = {
  "CO₂": "#e8a15c",
  "N₂": "#8fb4e8",
  "O₂": "#7fe0c3",
  "Ar": "#c9c9e0",
  "H₂": "#f2d18b",
  "He": "#f7a8c4",
  "CH₄": "#9fe8f2",
  "H": "#ffd9a0",
  "Na": "#ffcf70",
  "O": "#b8e0a8",
  "CO": "#d8b48a",
  "其它": "#8b98ab",
};

/** 行星质量占「全部行星质量」的百分比 */
export const MASS_SHARES = [
  { name: "木星", pct: 71.1, color: "#f2c49b" },
  { name: "土星", pct: 21.3, color: "#f0d9a8" },
  { name: "海王星", pct: 3.8, color: "#7ea6ff" },
  { name: "天王星", pct: 3.3, color: "#bfeef2" },
  { name: "地球", pct: 0.22, color: "#7cc4ff" },
  { name: "金星", pct: 0.18, color: "#f3d9a4" },
  { name: "火星", pct: 0.02, color: "#ff9a6b" },
  { name: "水星", pct: 0.01, color: "#cfc4b4" },
];

/** 行星分类 */
export const CLASSIFICATIONS = [
  {
    name: "类地行星",
    en: "Terrestrial",
    color: "#ff9a6b",
    members: ["水星", "金星", "地球", "火星"],
    desc: "岩石与金属构成的固态世界：密度高、个头小、自转偏慢，卫星稀少甚至没有。它们都挤在太阳近旁的小半个院子里。",
    stat: "密度 3.9 – 5.5 g/cm³",
  },
  {
    name: "气态巨行星",
    en: "Gas Giants",
    color: "#f2c49b",
    members: ["木星", "土星"],
    desc: "以氢和氦为主的庞然大物，没有可以站立的表面，却都戴着光环、领着几十上百颗卫星。木星一颗的质量就是其余七颗行星总和的 2.5 倍。",
    stat: "木星 Ø ≈ 11 个地球",
  },
  {
    name: "冰巨行星",
    en: "Ice Giants",
    color: "#7ea6ff",
    members: ["天王星", "海王星"],
    desc: "内部以水、氨、甲烷等「冰」为主，外层大气里的甲烷吸收红光，让它们呈淡青与深蓝。天王星躺着转，海王星刮着超音速风暴。",
    stat: "风速最高 2,100 km/h",
  },
  {
    name: "矮行星",
    en: "Dwarf Planets",
    color: "#d8c7ae",
    members: ["冥王星", "谷神星", "阋神星", "鸟神星", "妊神星"],
    desc: "2006 年新增的类别：自身重力足以呈球形，却没能清空轨道附近的邻居。冥王星因这一条从第九大行星「降级」，也由此闻名于世。",
    stat: "官方成员 5 颗",
  },
];

/** 矮行星档案（不含已在星图中的冥王星） */
export const DWARFS = [
  {
    cn: "谷神星",
    en: "Ceres",
    diameter: "940 km",
    au: "2.77 AU",
    period: "4.6 年",
    note: "小行星带中最大的天体，也是主带内唯一的矮行星。黎明号发现其表面的奥卡托坑会反射出明亮的盐斑。",
    color: "#b9c3d4",
  },
  {
    cn: "阋神星",
    en: "Eris",
    diameter: "2,326 km",
    au: "67.8 AU",
    period: "558 年",
    note: "比冥王星还略重一点。正是 2005 年它的发现，迫使天文学界重新定义「行星」，冥王星随之降级。",
    color: "#cfd8e6",
  },
  {
    cn: "鸟神星",
    en: "Makemake",
    diameter: "1,430 km",
    au: "45.8 AU",
    period: "305 年",
    note: "柯伊伯带第二亮的成员，表面覆盖甲烷冰与乙烷冰，几乎没有大气层。",
    color: "#e8b48a",
  },
  {
    cn: "妊神星",
    en: "Haumea",
    diameter: "≈1,560 km（长轴）",
    au: "43.1 AU",
    period: "285 年",
    note: "自转一圈只要 3.9 小时，被甩成了椭球形——还拥有自己的光环和两颗卫星。",
    color: "#a8d8c8",
  },
];

/** 探测纪元时间线 */
export const MISSIONS = [
  { year: "1962", cn: "水手 2 号", en: "Mariner 2", target: "金星", note: "人类首次成功的行星际飞掠，测得金星灼热的表面。" },
  { year: "1965", cn: "水手 4 号", en: "Mariner 4", target: "火星", note: "传回第一批火星近距离照片——一个陨击坑遍布的荒凉世界。" },
  { year: "1970", cn: "金星 7 号", en: "Venera 7", target: "金星", note: "首次在另一颗行星表面软着陆并发回数据，仅坚持了 23 分钟。" },
  { year: "1976", cn: "海盗 1 号", en: "Viking 1", target: "火星", note: "首次成功的火星着陆，开展了著名的生命探测实验。" },
  { year: "1977", cn: "旅行者 1/2 号", en: "Voyager", target: "四颗巨行星", note: "「行星大旅行」一次看遍木星、土星、天王星、海王星，现均已进入星际空间。" },
  { year: "1995", cn: "伽利略号", en: "Galileo", target: "木星", note: "首个木星轨道器，投放的大气探针直接扎进了云层深处。" },
  { year: "2004", cn: "卡西尼-惠更斯", en: "Cassini", target: "土星", note: "环绕土星 13 年；惠更斯探针降落在泰坦的甲烷河畔。" },
  { year: "2012", cn: "好奇号", en: "Curiosity", target: "火星", note: "核动力漫游车着陆盖尔坑，证实火星曾具备宜居条件。" },
  { year: "2015", cn: "新视野号", en: "New Horizons", target: "冥王星", note: "九年飞行后的 4 小时飞掠，揭开冥王星的「心形」氮冰平原。" },
  { year: "2016", cn: "朱诺号", en: "Juno", target: "木星", note: "沿极地轨道穿越辐射带，透视木星内部的大红斑之根。" },
  { year: "2018", cn: "帕克太阳探测器", en: "Parker Probe", target: "太阳", note: "以 70 万 km/h 掠过日冕，成为史上最快、距太阳最近的人造物。" },
  { year: "2021", cn: "天问一号 · 祝融号", en: "Tianwen-1", target: "火星", note: "中国首次自主火星任务即实现「绕、落、巡」一步到位。" },
  { year: "2023", cn: "JUICE", en: "Jupiter Icy Moons", target: "木星系", note: "欧洲出发前往木卫三等冰卫星，预计 2031 年抵达。" },
];

/** 太阳系边疆 */
export const FRONTIERS = [
  {
    cn: "柯伊伯带",
    en: "Kuiper Belt",
    range: "30 – 55 AU",
    note: "海王星轨道之外的冰质天体环带，冥王星、鸟神星都住在这里，也是短周期彗星的老家。",
    color: "#9fe8f2",
  },
  {
    cn: "日球层顶",
    en: "Heliopause",
    range: "≈ 120 AU",
    note: "太阳风与星际介质相遇的边界。2012 年旅行者 1 号在此「出海」，进入星际空间。",
    color: "#f2d18b",
  },
  {
    cn: "奥尔特云",
    en: "Oort Cloud",
    range: "0.03 – 3 光年",
    note: "理论上包裹太阳系的冰壳，长周期彗星的发源地，外缘几乎到达太阳引力的极限。",
    color: "#c9c9e0",
  },
];
