import STATUS from '../../constants/statusCodes';
import { successResponse, errorResponse } from '../../utils/response';
import {
  BadRequestError,
  UnprocessableEntityError,
  NotFoundError,
  InternalServerError
} from '../../constants/errors';
import { models } from '../../models';
import { getSchema, partialUpdateSchema, deleteSchema } from './validation';
import jwt_decode from 'jwt-decode';
import { fullOrderSerializer } from './serializers';

export async function createOrder(req, res) {
  try {
    const { Order } = models;

    const tokenUser = jwt_decode(req.headers.authorization).user;

    const order = await Order.findOrCreate({
      where: { userId: tokenUser.id, status: 'in_cart' },
      limit: 1,
      defaults: {
        userId: tokenUser.id,
        status: 'in_cart'
      }
    });

    return successResponse(STATUS.HTTP_200_OK, order[0], res);
  } catch (error) {
    switch (error.name) {
      case 'SequelizeUniqueConstraintError':
        return errorResponse(
          new UnprocessableEntityError(error.errors[0].message),
          res
        );
      case 'ValidationError':
        return errorResponse(
          new BadRequestError(error.details[0].message),
          res
        );
      default:
        return new InternalServerError(error.name);
    }
  }
}

export async function getOrder(req, res) {
  try {
    const { orderId } = req.params;
    const { Order, OrderItem, Product, Store } = models;

    await getSchema.validateAsync({ orderId: parseInt(orderId) });

    let order = await Order.findOne({
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
      ],
      where: { id: orderId }
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
    switch (error.name) {
      case 'ValidationError':
        return errorResponse(
          new BadRequestError(error.details[0].message),
          res
        );
      case 'NotFoundError':
        return errorResponse(error, res);
      default:
        return errorResponse(new InternalServerError(error.message), res);
    }
  }
}

export async function listOrders(req, res) {
  try {
    const { Order, Product, Store, OrderItem } = models;
    const { status } = req.query;

    const tokenUser = jwt_decode(req.headers.authorization).user;

    let filters = { userId: tokenUser.id };
    if (status) {
      filters = { ...filters, status };
    }

    let orders = await Order.findAll({
      where: filters,
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

    let ordersJson = [];
    for (let order of orders) {
      const totalPrice = await OrderItem.sum('price', {
        where: { orderId: order.id }
      });

      const orderJson = fullOrderSerializer(order.toJSON());
      orderJson.totalPrice = totalPrice;
      ordersJson.push(orderJson);
    }

    return successResponse(STATUS.HTTP_200_OK, orders, res);
  } catch (error) {
    switch (error.name) {
      case 'ValidationError':
        return errorResponse(
          new BadRequestError(error.details[0].message),
          res
        );
      default:
        return errorResponse(error, res);
    }
  }
}

export async function partialUpdateOrder(req, res) {
  try {
    const { Store } = models;
    const { storeId } = req.params;

    // TODO: Update only if the user is admin of this store
    await partialUpdateSchema.validateAsync({ ...req.body, storeId });

    let store = await Store.update(
      { ...req.body },
      {
        where: {
          id: storeId
        }
      }
    );

    return successResponse(STATUS.HTTP_200_OK, store, res);
  } catch (error) {
    switch (error.name) {
      case 'ValidationError':
        return errorResponse(
          new BadRequestError(error.details[0].message),
          res
        );
      default:
        return errorResponse(error, res);
    }
  }
}

export async function removeOrder(req, res) {
  try {
    const { storeId } = req.params;
    const { Store } = models;

    await deleteSchema.validateAsync(storeId);

    // TODO: Remove only if the user is admin of this store
    Store.destroy({
      where: { id: storeId }
    });

    return successResponse(STATUS.HTTP_200_OK, {}, res);
  } catch (error) {
    switch (error.name) {
      case 'ValidationError':
        return errorResponse(
          new BadRequestError(error.details[0].message),
          res
        );
      default:
        return errorResponse(error, res);
    }
  }
}
