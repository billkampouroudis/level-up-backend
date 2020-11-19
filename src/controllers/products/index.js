import STATUS from '../../constants/statusCodes';
import { successResponse, errorResponse } from '../../utils/response';
import {
  BadRequestError,
  DuplicateEntryError,
  UnauthorizedError,
  NotFoundError
} from '../../constants/errors';
import { models } from '../../models';
import { createSchema } from './validation';

export async function createProduct(req, res) {
  try {
    await createSchema.validateAsync({ ...req.body, image: req.file });

    const { Product } = models;

    const storeId = 1; //TODO: take it from the jwt?
    const product = await Product.create({
      ...req.body,
      image: req.file,
      storeId
    });

    return successResponse(STATUS.HTTP_200_OK, product, res);
  } catch (error) {
    switch (error.name) {
      case 'SequelizeUniqueConstraintError':
        return errorResponse(
          new DuplicateEntryError(error.errors[0].message),
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

export async function getProduct(req, res) {
  try {
    const { productId } = req.params;
    const { Product } = models;

    if (!productId) {
      throw new BadRequestError();
    }

    let product = await Product.findOne({ where: { id: productId } });

    if (!product) {
      throw new NotFoundError();
    }

    return successResponse(STATUS.HTTP_200_OK, product, res);
  } catch (error) {
    console.log('ERROR', error);
    return errorResponse(error, res);
  }
}

export async function listProducts(req, res) {
  // try {
  //   const createUserResponse = await create(req, res);
  //   if (createUserResponse.error) {
  //     return errorResponse(createUserResponse.error, res);
  //   }
  //   return await login(req, res);
  // } catch (error) {
  //   console.log('ERROR', error);
  //   return errorResponse(error, res);
  // }
}

export async function partialUpdateProduct(req, res) {}

export async function removeProduct(req, res) {}
