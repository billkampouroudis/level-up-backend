import { Router } from 'express';
import { getProduct, listProducts } from '../controllers/products';

const products = Router();

products.get('/:productId', async (req, res) => {
  res.json(await getProduct(req, res));
});

products.get('/', async (req, res) => {
  res.json(await listProducts(req, res));
});

export default products;
