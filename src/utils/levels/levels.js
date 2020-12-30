import is from '../misc/is';

export const levels = [
  { key: 0, minXp: 0 },
  { key: 1, minXp: 200 },
  { key: 2, minXp: 400 },
  { key: 3, minXp: 600 },
  { key: 4, minXp: 800 },
  { key: 5, minXp: 1000 },
  { key: 6, minXp: 2000 },
  { key: 7, minXp: 3000 },
  { key: 8, minXp: 4000 },
  { key: 9, minXp: 5000 },
  { key: 10, minXp: 8000 }
];

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
    case xp < levels[2].minXp:
      return 1;
    case xp < levels[3].minXp:
      return 2;
    case xp < levels[4].minXp:
      return 3;
    case xp < levels[5].minXp:
      return 4;
    case xp < levels[6].minXp:
      return 5;
    case xp < levels[7].minXp:
      return 6;
    case xp < levels[8].minXp:
      return 7;
    case xp < levels[9].minXp:
      return 8;
    case xp < levels[10].minXp:
      return 9;
    case xp >= levels[10].minXp:
      return 10;
    default:
      return 1;
  }
};
