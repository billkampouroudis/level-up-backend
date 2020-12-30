import get from '../misc/get';
import is from '../misc/is';

/**
 * Calculates the cost before and after discount.
 *
 * @returns {object} costs: Object with strings values of the original cost, the reduced cost and the total discount.
 * @returns {string} costs.originalCost
 * @returns {string} costs.reducedCost
 * @returns {string} costs.totalDiscount
 */
export const calculateCosts = (orders = []) => {
  let originalCost = 0;
  let reducedCost = 0;
  let totalDiscount = 0;

  for (let order of orders) {
    for (let orderItem of order.orderItems || []) {
      const original =
        parseFloat(get.safe(() => orderItem.product.originalPrice)) *
        orderItem.quantity;
      const reduced =
        parseFloat(get.safe(() => orderItem.product.reducedPrice)) *
        orderItem.quantity;

      originalCost += is.number(original) ? original : 0;
      reducedCost += is.number(reduced) ? reduced : 0;
    }
  }

  totalDiscount = reducedCost ? (originalCost - reducedCost).toFixed(2) : 0;
  originalCost = originalCost.toFixed(2);
  reducedCost = reducedCost ? reducedCost.toFixed(2) : originalCost;

  const costs = { originalCost, reducedCost, totalDiscount };
  return costs;
};
