import STATUS from '../../constants/statusCodes';
import { successResponse, errorResponse } from '../../utils/response';
import { BadRequestError, NotFoundError } from '../../constants/errors';
import { models } from '../../models';
import {
  createSchema,
  getSchema,
  partialUpdateSchema,
  partialUpdateMultipleSchema,
  deleteSchema
} from './validation';
import jwt_decode from 'jwt-decode';
import { fullOrderSerializer } from './serializers';
import { calculateCosts } from '../../utils/orders/orders';
import { calculateUserLevel } from '../../utils/levels/levels';
import { giveXpFromOrder } from '../../utils/points/points';
import { User } from '../../models/User';
import moment from 'moment';
import { ProductRating } from '../../models/ProductRating';
import findError from '../../utils/misc/errorHandling';

export async function createOrder(req, res) {
  try {
    const { storeId } = req.body;

    await createSchema.validateAsync({ storeId: parseInt(storeId) });

    const { Order } = models;
    const tokenUser = jwt_decode(req.headers.authorization).user;

    const order = await Order.findOrCreate({
      where: { userId: tokenUser.id, status: 'in_cart', storeId },
      limit: 1,
      defaults: {
        userId: tokenUser.id,
        status: 'in_cart',
        storeId
      }
    });

    return successResponse(STATUS.HTTP_200_OK, order[0], res);
  } catch (error) {
    return errorResponse(findError(error), res);
  }
}

export async function getOrder(req, res) {
  try {
    const { orderId } = req.params;
    const { Order, OrderItem, Product, Store } = models;

    await getSchema.validateAsync({ orderId: parseInt(orderId) });

    const tokenUser = jwt_decode(req.headers.authorization).user;

    let order = await Order.findOne({
      where: { id: orderId, userId: tokenUser.id },
      include: [
        {
          model: OrderItem,
          as: 'orderItems',
          include: [
            {
              model: Product.scope('orderItem'),
              include: [
                {
                  model: Store.scope('orderItem')
                }
              ]
            }
          ]
        }
      ]
    });

    if (!order) {
      throw new NotFoundError();
    }

    const totalPrice = await OrderItem.sum('price', {
      where: { orderId: orderId }
    });

    const orderJson = fullOrderSerializer(order.toJSON());
    orderJson.totalPrice = totalPrice;

    return successResponse(STATUS.HTTP_200_OK, orderJson, res);
  } catch (error) {
    return errorResponse(findError(error), res);
  }
}

export async function listOrders(req, res) {
  try {
    const { Order, Product, Store, OrderItem } = models;
    const { status } = req.query;

    const tokenUser = jwt_decode(req.headers.authorization).user;

    let filters = { userId: tokenUser.id };
    if (status) {
      filters = { ...filters, status: status.split(',') };
    }

    const orders = await Order.findAll({
      where: filters,
      order: [['registeredAt', 'DESC']],
      include: [
        {
          model: OrderItem,
          as: 'orderItems',
          include: [
            {
              model: Product.scope('orderItem'),
              include: [
                {
                  model: Store.scope('orderItem')
                }
              ]
            }
          ]
        }
      ]
    });

    if (orders.length === 0) {
      return successResponse(STATUS.HTTP_200_OK, [], res);
    }

    // Check if user can rate the products of the given order
    let _orders = [];
    for (let order of orders) {
      const _order = order.toJSON();
      for (let [index, orderItem] of order.orderItems.entries()) {
        if (!orderItem.product) {
          continue;
        }

        const rating = await ProductRating.findOne({
          where: { productId: orderItem.product.id, userId: tokenUser.id }
        });

        let canRate = false;
        if (!rating && _order.status === 'closed') {
          canRate = true;
        }

        _order.orderItems[index] = orderItem.toJSON();
        _order.orderItems[index].product.canRate = canRate;
      }
      _orders.push(_order);
    }

    return successResponse(STATUS.HTTP_200_OK, _orders, res);
  } catch (error) {
    return errorResponse(findError(error), res);
  }
}

export async function partialUpdateOrder(req, res) {
  try {
    const { Order, OrderItem, Product, Store } = models;
    const { addressId } = req.body;
    const orderId = req.params.orderId || req.body.orderId;

    const orderIdNumber = parseInt(orderId);
    const addressIdNumber = parseInt(addressId) || undefined;

    await partialUpdateSchema.validateAsync({
      ...req.body,
      orderId: orderIdNumber,
      addressId: addressIdNumber
    });

    const tokenUser = jwt_decode(req.headers.authorization).user;

    let order = await Order.findOne({
      where: { id: orderId, userId: tokenUser.id },
      include: [
        {
          model: OrderItem,
          as: 'orderItems',
          include: [
            {
              model: Product.scope('orderItem'),
              include: [
                {
                  model: Store.scope('orderItem')
                }
              ]
            }
          ]
        }
      ]
    });

    if (!order) {
      throw new NotFoundError();
    }

    for (let key in req.body) {
      order[key] = req.body[key];
    }

    await order.save();

    return successResponse(STATUS.HTTP_200_OK, order, res);
  } catch (error) {
    return errorResponse(findError(error), res);
  }
}

export async function partialUpdateOrders(req, res) {
  try {
    const { orderIds, addressId, status } = req.body;

    const addressIdNumber = parseInt(addressId) || undefined;

    await partialUpdateMultipleSchema.validateAsync({
      ...req.body,
      addressId: addressIdNumber
    });

    // Update all the given orders
    let updatedOrders = [];
    for (let orderId of orderIds) {
      let data = { orderId };

      if (status) {
        if (status === 'registered' && !addressIdNumber) {
          throw new BadRequestError(
            'Address is required in order to register an order'
          );
        }

        data.status = status;
      }

      if (addressId) {
        if (status) {
          data.addressId = addressIdNumber;
        }
      }

      if (status === 'registered') {
        data.registeredAt = moment().format();
      }

      const response = await partialUpdateOrder({ ...req, body: data }, res);
      if (response.error) {
        throw new BadRequestError(response.error.message);
      }

      updatedOrders.push(response.data.toJSON());
    }

    // Add xp points to the user
    if (status === 'registered') {
      const costs = calculateCosts(updatedOrders);
      const userId = updatedOrders[0].userId;
      let user = await User.findOne({
        where: { id: userId },
        attributes: {
          exclude: ['password']
        }
      });

      user.xp += giveXpFromOrder(costs.reducedCost);
      await user.save();

      user.level = calculateUserLevel(user.xp);

      return successResponse(STATUS.HTTP_200_OK, user, res);
    }

    return successResponse(STATUS.HTTP_200_OK, updatedOrders, res);
  } catch (error) {
    return errorResponse(findError(error), res);
  }
}
export async function removeOrder(req, res) {
  try {
    const { storeId } = req.params;
    const { Store } = models;

    await deleteSchema.validateAsync(storeId);

    Store.destroy({
      where: { id: storeId }
    });

    return successResponse(STATUS.HTTP_200_OK, {}, res);
  } catch (error) {
    return errorResponse(findError(error), res);
  }
}
