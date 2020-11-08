// const { Order } = require('./Order');
// const { Product } = require('./Product');
// const { ProductOrder } = require('./ProductOrder');
// const { Store } = require('./Store');

import { Address, initAddress, initAddressAssociations } from './Address';
import { Order, initOrder, initOrderAssociations } from './Order';
import {
  OrderItem,
  initOrderItem,
  initOrderItemAssociations
} from './OrderItem';
import { Product, initProduct, initProductAssociations } from './Product';
import { Store, initStore, initStoreAssociations } from './Store';
import { User, initUser, initUserAssociations } from './User';

export let models;
const initModels = async (sequelize) => {
  // Initiate models
  await initAddress(sequelize);
  await initOrder(sequelize);
  await initOrderItem(sequelize);
  await initProduct(sequelize);
  await initStore(sequelize);
  await initUser(sequelize);

  // Initiate associations between models
  await initAddressAssociations();
  await initOrderAssociations();
  await initOrderItemAssociations();
  await initProductAssociations();
  await initStoreAssociations();
  await initUserAssociations();

  models = {
    Address,
    Order,
    OrderItem,
    Product,
    Store,
    User
  };
};

export default initModels;
