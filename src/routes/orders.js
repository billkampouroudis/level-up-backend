import { Router } from 'express';
import {
  createOrder,
  getOrder,
  listOrders,
  partialUpdateOrder,
  partialUpdateOrders,
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

orders.get('/:orderId', auth, async (req, res) => {
  res.json(await getOrder(req, res));
});

orders.get('/', auth, async (req, res) => {
  res.json(await listOrders(req, res));
});

orders.patch('/:orderId', auth, async (req, res) => {
  res.json(await partialUpdateOrder(req, res));
});

orders.patch('/', auth, async (req, res) => {
  res.json(await partialUpdateOrders(req, res));
});

orders.delete(
  '/:orderId',
  (req, res, next) => auth(req, res, next, ['admin']),
  async (req, res) => {
    res.json(await removeOrder(req, res));
  }
);

export default orders;
