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

/**
 * Creates an order if the requested user is an administrator
 *
 * @param {number} storeId
 */
orders.post('/', auth, async (req, res) => {
  res.json(await createOrder(req, res));
});

/**
 * Finds a single order by its id
 *
 * @param {number} orderId
 */
orders.get('/:orderId', auth, async (req, res) => {
  res.json(await getOrder(req, res));
});

/**
 * Lists all the orders
 */
orders.get('/', auth, async (req, res) => {
  res.json(await listOrders(req, res));
});

/**
 * Updates an order by its id
 *
 * @param {string} status
 * @param {number} addressId
 * @param {Date} registeredAt
 */
orders.patch('/:orderId', auth, async (req, res) => {
  res.json(await partialUpdateOrder(req, res));
});

/**
 * Updates a list of orders
 *
 * @param {string} status
 * @param {number} addressId
 * @param {number[]} orderIds
 */
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
