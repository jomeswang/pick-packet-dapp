export const getRandomInRange = (min: number, max: number): number =>
  Math.random() * (max - min) + min;

export const getRandomInWindowWidth = (): number => {
  const windowWidth = window.innerWidth;
  return getRandomInRange(0, windowWidth - 100);
};

export const judgeRectCrash = (a: DOMRect, b: DOMRect): boolean => {
  // 假设a不动，b在变换位置，如果b始终在a的外围，那么就不会相撞，否则就是相撞了
  const buffer = 20;
  // 稍微留一点距离buffer， 因为人物并不是正方形的，留一点buffer体验更友好
  if (
    a.bottom - buffer < b.top ||
    a.left + buffer > b.right ||
    a.top + buffer > b.bottom ||
    a.right - buffer < b.left
  ) {
    return false;
  }
  return true;
};
