import { prepareResponse } from '../../utils/response';
import get from '../../utils/misc/get';

export const fullOrderSerializer = (order) => {
  const orderFieldsToHide = ['userId', 'updatedAt'];
  const orderItemsFieldsToHide = ['orderId', 'productId'];
  const productItemsToHide = ['storeId'];

  const _order = prepareResponse(orderFieldsToHide, order);
  let _orderItems = [];
  for (let item of get.safe(() => order.orderItems, [])) {
    const _item = prepareResponse(orderItemsFieldsToHide, item);
    let _itemProduct = prepareResponse(
      productItemsToHide,
      get.safe(() => _item.product, {})
    );

    _orderItems.push({ ..._item, product: _itemProduct });
  }

  _order.orderItems = _orderItems;

  return _order;
};
