import STATUS from '../../constants/statusCodes';
import { successResponse, errorResponse } from '../../utils/response';
import {
  BadRequestError,
  UnprocessableEntityError
  // NotFoundError
} from '../../constants/errors';
import { models } from '../../models';
import {
  createSchema
  // getSchema,
  // partialUpdateSchema,
  // deleteSchema
} from './validation';

export async function createUser(req, res) {
  try {
    await createSchema.validateAsync({ ...req.body, avatar: req.file });

    const { User } = models;

    const user = await User.create({
      ...req.body,
      avatar: req.file
    });

    return successResponse(STATUS.HTTP_200_OK, user, res);
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

export async function getUser(req, res) {
  // try {
  //   const { productId } = req.params;
  //   const { Product, Store } = models;
  //   await getSchema.validateAsync({ productId: parseInt(productId) });
  //   let product = await Product.scope('withoutId').findOne({
  //     include: [
  //       {
  //         model: Store,
  //         as: 'store'
  //       }
  //     ],
  //     where: { id: productId }
  //   });
  //   if (!product) {
  //     throw new NotFoundError();
  //   }
  //   return successResponse(STATUS.HTTP_200_OK, product, res);
  // } catch (error) {
  //   switch (error.name) {
  //     case 'ValidationError':
  //       return errorResponse(
  //         new BadRequestError(error.details[0].message),
  //         res
  //       );
  //     default:
  //       return errorResponse(error, res);
  //   }
  // }
}

export async function listUsers(req, res) {
  // try {
  //   const { Product, Store } = models;
  //   let products = await Product.scope('withoutId').findAll({
  //     include: [
  //       {
  //         model: Store,
  //         as: 'store'
  //       }
  //     ]
  //   });
  //   return successResponse(STATUS.HTTP_200_OK, products, res);
  // } catch (error) {
  //   switch (error.name) {
  //     case 'ValidationError':
  //       return errorResponse(
  //         new BadRequestError(error.details[0].message),
  //         res
  //       );
  //     default:
  //       return errorResponse(error, res);
  //   }
  // }
}

export async function partialUpdateUser(req, res) {
  // try {
  //   const { Product } = models;
  //   const { productId } = req.params;
  //   // TODO: Update only if the user is admin of this product's store
  //   await partialUpdateSchema.validateAsync({ ...req.body, productId });
  //   let product = await Product.update(
  //     { ...req.body },
  //     {
  //       where: {
  //         id: productId
  //       }
  //     }
  //   );
  //   return successResponse(STATUS.HTTP_200_OK, product, res);
  // } catch (error) {
  //   switch (error.name) {
  //     case 'ValidationError':
  //       return errorResponse(
  //         new BadRequestError(error.details[0].message),
  //         res
  //       );
  //     default:
  //       return errorResponse(error, res);
  //   }
  // }
}

export async function removeUser(req, res) {
  // try {
  //   const { productId } = req.params;
  //   const { Product } = models;
  //   await deleteSchema.validateAsync(productId);
  //   // TODO: Remove only if the user is admin of this product's store
  //   Product.destroy({
  //     where: { id: productId }
  //   });
  //   return successResponse(STATUS.HTTP_200_OK, {}, res);
  // } catch (error) {
  //   switch (error.name) {
  //     case 'ValidationError':
  //       return errorResponse(
  //         new BadRequestError(error.details[0].message),
  //         res
  //       );
  //     default:
  //       return errorResponse(error, res);
  //   }
  // }
}
