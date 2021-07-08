export const giveXpFromOrder = (cost = 0) => {
  cost = Number(cost);
  return Math.round(cost * 10);
};

export const giveXpFromRating = () => {
  return 30;
};
