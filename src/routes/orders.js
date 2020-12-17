import { Router } from 'express';
import {
  createOrder,
  getOrder,
  listOrders,
  partialUpdateOrder,
  removeOrder
} from '../controllers/orders';
import auth from '../middlewares/auth';

const orders = Router();

orders.post(
  '/',
  (req, res, next) => auth(req, res, next, ['admin']),
  async (req, res) => {
    res.json(await createOrder(req, res));
  }
);

orders.get('/:orderId', async (req, res) => {
  res.json(await getOrder(req, res));
});

orders.get('/', async (req, res) => {
  res.json(await listOrders(req, res));
});

orders.patch(
  '/:orderId',
  (req, res, next) => auth(req, res, next, ['admin']),
  async (req, res) => {
    res.json(await partialUpdateOrder(req, res));
  }
);

orders.delete(
  '/:orderId',
  (req, res, next) => auth(req, res, next, ['admin']),
  async (req, res) => {
    res.json(await removeOrder(req, res));
  }
);

export default orders;
