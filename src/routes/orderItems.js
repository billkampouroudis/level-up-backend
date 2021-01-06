import { Router } from 'express';
import {
  createOrderItem,
  getOrderItem,
  listOrderItems,
  partialUpdateOrderItem,
  removeOrderItem
} from '../controllers/orderItems';
import auth from '../middlewares/auth';

const orderItems = Router();

orderItems.post(
  '/',
  (req, res, next) => auth(req, res, next, ['admin']),
  async (req, res) => {
    res.json(await createOrderItem(req, res));
  }
);

orderItems.get('/:orderItemId', auth, async (req, res) => {
  res.json(await getOrderItem(req, res));
});

orderItems.get('/', async (req, res) => {
  res.json(await listOrderItems(req, res));
});

orderItems.patch(
  '/:orderItemId',
  (req, res, next) => auth(req, res, next, ['admin']),
  async (req, res) => {
    res.json(await partialUpdateOrderItem(req, res));
  }
);

orderItems.delete(
  '/:orderItemId',
  (req, res, next) => auth(req, res, next, ['admin']),
  async (req, res) => {
    res.json(await removeOrderItem(req, res));
  }
);

export default orderItems;
