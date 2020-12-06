import { Router } from 'express';
import {
  createProduct,
  getProduct,
  listProducts,
  partialUpdateProduct,
  removeProduct
} from '../controllers/products';
import auth from '../middlewares/auth';

const products = Router();

products.post(
  '/',
  (req, res, next) => auth(req, res, next, ['admin']),
  async (req, res) => {
    res.json(await createProduct(req, res));
  }
);

products.get('/:productId', async (req, res) => {
  res.json(await getProduct(req, res));
});

products.get('/', async (req, res) => {
  res.json(await listProducts(req, res));
});

products.patch(
  '/:productId',
  (req, res, next) => auth(req, res, next, ['admin']),
  async (req, res) => {
    res.json(await partialUpdateProduct(req, res));
  }
);

products.delete(
  '/:productId',
  (req, res, next) => auth(req, res, next, ['admin']),
  async (req, res) => {
    res.json(await removeProduct(req, res));
  }
);

export default products;
