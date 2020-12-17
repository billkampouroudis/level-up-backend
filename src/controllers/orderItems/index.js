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

    const createUserResponse = await createOrder(req, res);
    if (createUserResponse.error) {
      return errorResponse(createUserResponse.error, res);
    }

    const product = await Product.findOne({ where: { id: productId } });
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
    const { OrderItem, Product } = models;

    const orderItems = await OrderItem.findAll({
      include: [
        {
          model: Product,
          as: 'product'
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
    const { OrderItem } = models;

    await partialUpdateSchema.validateAsync({ ...req.body, orderItemId });

    const tokenUser = jwt_decode(req.headers.authorization).user;

    const user = await OrderItem.find({
      where: {
        id: orderItemId
      }
    });

    if (tokenUser.id !== user.id) {
      throw new ForbiddenError();
    }

    const orderItem = await OrderItem.update(
      { ...req.body },
      {
        where: {
          id: orderItemId
        }
      }
    );

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
        return new InternalServerError();
    }
  }
}

export async function removeOrderItem(req, res) {
  try {
    const { orderItemId } = req.params;
    const { OrderItem } = models;

    await deleteSchema.validateAsync(orderItemId);

    const tokenUser = jwt_decode(req.headers.authorization).user;

    const user = await OrderItem.find({
      where: {
        id: orderItemId
      }
    });

    if (tokenUser.id !== user.id) {
      throw new ForbiddenError();
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
        return new InternalServerError();
    }
  }
}
