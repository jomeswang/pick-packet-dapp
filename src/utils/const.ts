export const DIFFICULTY_SETTINGS = [
  {
    // 低
    probability: [0.4, 0.3, 0.2, 0.1], // 按照元宝，红包，炸弹进行排序
    speed: 1,
  },
  {
    // 中
    probability: [0.3, 0.3, 0.3, 0.1],
    speed: 1.5,
  },
  {
    // 高
    probability: [0.2, 0.3, 0.3, 0.2],
    speed: 1.3,
  },
];

export const MATERIAL_ANIMATION_MAP = {
  packet: {
    className: 'c-5',
    record: +5,
  },
  yuanbao: {
    className: 'c-10',
    record: +10,
  },
  bian: {
    className: 'c-5-',
    record: -5,
  },
};

export const CONTRACT_ADDRESS = '0xE175C3a7d7Cfc93d7a242917D22f2F8B6e120951';
