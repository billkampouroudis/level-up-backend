import STATUS from '../../constants/statusCodes';
import { successResponse, errorResponse } from '../../utils/response';
import {
  BadRequestError,
  UnprocessableEntityError,
  NotFoundError,
  ForbiddenError,
  InternalServerError
} from '../../constants/errors';
import { models } from '../../models';
import {
  createSchema,
  getSchema,
  partialUpdateSchema,
  deleteSchema
} from './validation';
import jwt_decode from 'jwt-decode';
import { createOrder } from '../orders';

export async function createOrderItem(req, res) {
  try {
    await createSchema.validateAsync({ ...req.body });
    const { productId, quantity } = req.body;

    const { OrderItem, Product } = models;

    const product = await Product.findOne({ where: { id: productId } });
    if (!product) {
      throw new UnprocessableEntityError();
    }

    const reqBody = { ...req.body, storeId: product.storeId };
    const createUserResponse = await createOrder(
      { ...req, body: reqBody },
      res
    );
    if (createUserResponse.error) {
      return errorResponse(createUserResponse.error, res);
    }

    const finalPrice = product.originalPrice * quantity;

    const { id } = createUserResponse.data.dataValues;
    const orderItem = await OrderItem.create({
      ...req.body,
      orderId: id,
      price: finalPrice
    });

    return successResponse(STATUS.HTTP_200_OK, orderItem, res);
  } catch (error) {
    switch (error.name) {
      case 'SequelizeUniqueConstraintError':
        {
          const { OrderItem } = models;

          const orderItem = await OrderItem.findOne({
            where: { productId: req.body.productId, size: req.body.size }
          });

          addProducts(orderItem.id, req.body.quantity)
            .then(() => successResponse(STATUS.HTTP_200_OK, {}, res))
            .catch((error) => errorResponse(error, res));
        }
        break;
      case 'ValidationError':
        return errorResponse(
          new BadRequestError(error.details[0].message),
          res
        );
      case 'UnprocessableEntityError':
        return errorResponse(new UnprocessableEntityError(error.message), res);
      default:
        return errorResponse(error, res);
    }
  }
}

export async function getOrderItem(req, res) {
  try {
    const { orderItemId } = req.params;
    const { OrderItem, Product } = models;

    await getSchema.validateAsync({ id: parseInt(orderItemId) });

    const orderItem = await OrderItem.findOne({
      where: { id: orderItem },
      include: [
        {
          model: Product,
          as: 'product'
        }
      ]
    });

    if (!orderItem) {
      throw new NotFoundError();
    }

    return successResponse(STATUS.HTTP_200_OK, orderItem, res);
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

export async function listOrderItems(req, res) {
  try {
    const { OrderItem, Product, Store } = models;

    const orderItems = await OrderItem.findAll({
      include: [
        {
          model: Product,
          as: 'product',
          attributes: {
            exclude: [
              'sizes',
              'originalPrice',
              'reducedPrice',
              'createdAt',
              'updatedAt',
              'storeId'
            ]
          },
          include: [
            {
              model: Store,
              attributes: ['brandName', 'id']
            }
          ]
        }
      ]
    });

    return successResponse(STATUS.HTTP_200_OK, orderItems, res);
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

export async function partialUpdateOrderItem(req, res) {
  try {
    const { orderItemId } = req.params;
    const { User, Order, OrderItem, Product, Store } = models;

    await partialUpdateSchema.validateAsync({ ...req.body, orderItemId });

    const tokenUser = jwt_decode(req.headers.authorization).user;

    const user = await User.findOne({
      attributes: {
        exclude: ['password']
      },
      where: {
        id: 1
      },
      include: [
        {
          model: Order,
          attributes: ['id', 'status', 'userId'],
          include: [
            {
              model: OrderItem,
              as: 'orderItems',
              attributes: ['id', 'productId', 'orderId']
            }
          ]
        }
      ]
    });

    if (!user || user.id !== tokenUser.id) {
      throw new ForbiddenError();
    }

    let orderItem = await OrderItem.findOne({
      where: {
        id: orderItemId
      },
      include: [
        {
          model: Product,
          as: 'product',
          attributes: {
            exclude: [
              'sizes',
              'originalPrice',
              'reducedPrice',
              'createdAt',
              'updatedAt',
              'storeId'
            ]
          },
          include: [
            {
              model: Store,
              attributes: ['brandName', 'id']
            }
          ]
        }
      ],
      returning: true,
      plain: true
    });

    for (let key in req.body) {
      orderItem[key] = req.body[key];
    }

    let product = null;
    if (req.body.quantity) {
      product = await Product.findOne({
        where: { id: orderItem.productId }
      });

      orderItem.price = product.originalPrice * req.body.quantity;
    }

    await orderItem.save();

    return successResponse(STATUS.HTTP_200_OK, orderItem, res);
  } catch (error) {
    switch (error.name) {
      case 'ValidationError':
        return errorResponse(
          new BadRequestError(error.details[0].message),
          res
        );
      case 'ForbiddenError':
        return errorResponse(error, res);
      default:
        return errorResponse(new InternalServerError(error.message), res);
    }
  }
}

async function addProducts(orderItemId, itemsToAdd) {
  const { OrderItem, Product } = models;

  try {
    const orderItem = await OrderItem.findOne({ where: { id: orderItemId } });
    orderItem.quantity += itemsToAdd;

    const product = await Product.findOne({
      where: { id: orderItem.productId }
    });
    orderItem.price = product.originalPrice * orderItem.quantity;

    await orderItem.save();
    return Promise.resolve();
  } catch (error) {
    return Promise.reject(error);
  }
}

export async function removeOrderItem(req, res) {
  try {
    const { orderItemId } = req.params;
    const { OrderItem, Order } = models;

    await deleteSchema.validateAsync({ orderItemId });

    const tokenUser = jwt_decode(req.headers.authorization).user;

    const orders = await Order.findAll({
      where: { userId: tokenUser.id, status: 'in_cart' },
      include: [
        {
          model: OrderItem,
          as: 'orderItems'
        }
      ]
    });

    if (!orders) {
      throw new ForbiddenError();
    }

    for (let order of orders) {
      if (order.orderItems.find((item) => item.id === parseInt(orderItemId))) {
        await Order.destroy({
          where: { id: order.id }
        });
        return successResponse(STATUS.HTTP_200_OK, {}, res);
      }
    }

    OrderItem.destroy({
      where: { id: orderItemId }
    });

    return successResponse(STATUS.HTTP_200_OK, {}, res);
  } catch (error) {
    switch (error.name) {
      case 'ValidationError':
        return errorResponse(
          new BadRequestError(error.details[0].message),
          res
        );
      case 'ForbiddenError':
        return errorResponse(error, res);
      default:
        return errorResponse(new InternalServerError(error.message), res);
    }
  }
}
