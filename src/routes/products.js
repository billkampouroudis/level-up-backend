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

products.post('/', async (req, res) => {
  res.json(await createProduct(req, res));
});

products.get('/:productId', async (req, res) => {
  res.json(await getProduct(req, res));
});

products.get(
  '/',
  (req, res, next) => auth(req, res, next, ['admin', 'client']),
  async (req, res) => {
    res.json(await listProducts(req, res));
  }
);

products.patch('/:productId', async (req, res) => {
  res.json(await partialUpdateProduct(req, res));
});

products.delete('/:productId', async (req, res) => {
  res.json(await removeProduct(req, res));
});

export default products;
