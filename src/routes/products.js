import { Router } from 'express';
import {
  createProduct,
  getProduct,
  listProducts,
  partialUpdateProduct,
  removeProduct
} from '../controllers/products';

const auth = Router();

auth.post('/', async (req, res) => {
  res.json(await createProduct(req, res));
});

auth.get('/:productId', async (req, res) => {
  res.json(await getProduct(req, res));
});

auth.get('/', async (req, res) => {
  res.json(await listProducts(req, res));
});

auth.patch('/:productId', async (req, res) => {
  res.json(await partialUpdateProduct(req, res));
});

auth.delete('/:productId', async (req, res) => {
  res.json(await removeProduct(req, res));
});

export default auth;
