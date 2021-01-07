import is from '../misc/is';

export const levels = (level) => {
  const _levels = [
    { key: 0, minXp: 0 }, // not in use
    { key: 1, minXp: 200, discount: 0.02 },
    { key: 2, minXp: 500, discount: 0.04 },
    { key: 3, minXp: 1000, discount: 0.05 },
    { key: 4, minXp: 1500, discount: 0.1 },
    { key: 5, minXp: 2500, discount: 0.15 },
    { key: 6, minXp: 4000, discount: 0.2 },
    { key: 7, minXp: 5500, discount: 0.25 },
    { key: 8, minXp: 7500, discount: 0.3 },
    { key: 9, minXp: 9500, discount: 0.5 },
    { key: 10, minXp: 12000, discount: 0.6 }
  ];

  if (level < 0) {
    return _levels[1];
  }

  if (level >= 10) {
    return _levels[10];
  }

  return _levels[level];
};

export const giveXpFromOrder = (cost = 0) => {
  cost = Number(cost);
  return Math.round(cost * 10);
};

export const calculateUserLevel = (xp = 0) => {
  xp = parseInt(xp);
  if (!is.number(xp)) {
    return 0;
  }

  switch (true) {
    case xp < levels(2).minXp:
      return 1;
    case xp < levels(3).minXp:
      return 2;
    case xp < levels(4).minXp:
      return 3;
    case xp < levels(5).minXp:
      return 4;
    case xp < levels(6).minXp:
      return 5;
    case xp < levels(7).minXp:
      return 6;
    case xp < levels(8).minXp:
      return 7;
    case xp < levels(9).minXp:
      return 8;
    case xp < levels(1).minXp:
      return 9;
    case xp >= levels(10).minXp:
      return 10;
    default:
      return 1;
  }
};
