import STATUS from '../../constants/statusCodes';
import { successResponse, errorResponse } from '../../utils/response';
import {
  BadRequestError,
  UnprocessableEntityError,
  NotFoundError
} from '../../constants/errors';
import { models } from '../../models';
import {
  createSchema,
  getSchema,
  partialUpdateSchema,
  deleteSchema
} from './validation';

export async function createStore(req, res) {
  try {
    await createSchema.validateAsync({ ...req.body, avatar: req.file });

    const { Store } = models;

    const store = await Store.create({
      ...req.body,
      avatar: req.file
    });

    return successResponse(STATUS.HTTP_200_OK, store, res);
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

export async function getStore(req, res) {
  try {
    const { storeId } = req.params;
    const { Store } = models;

    await getSchema.validateAsync({ storeId: parseInt(storeId) });

    let store = await Store.findOne({ where: { id: storeId } });

    if (!store) {
      throw new NotFoundError();
    }

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

export async function listStores(req, res) {
  try {
    const { Store } = models;

    let stores = await Store.findAll();

    return successResponse(STATUS.HTTP_200_OK, stores, res);
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

export async function partialUpdateStore(req, res) {
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

export async function removeStore(req, res) {
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

export async function listProducts(req, res) {
  try {
    const { storeId } = req.params;
    const { Product, Store } = models;

    let stores = await Product.scope('withoutId').findAll({
      include: [
        {
          model: Store,
          as: 'store'
        }
      ],
      where: { storeId }
    });

    return successResponse(STATUS.HTTP_200_OK, stores, res);
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
