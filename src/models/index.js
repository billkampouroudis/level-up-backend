import { Address, initAddress, initAddressAssociations } from './Address';
import { Order, initOrder, initOrderAssociations } from './Order';
import {
  OrderItem,
  initOrderItem,
  initOrderItemAssociations
} from './OrderItem';
import { Product, initProduct, initProductAssociations } from './Product';
import { Store, initStore, initStoreAssociations } from './Store';
import {
  StoreUser,
  initStoreUser,
  initStoreUserAssociations
} from './StoreUser';
import { User, initUser, initUserAssociations } from './User';
import { FavoriteProduct, initFavoriteProduct } from './FavoriteProduct';

export let models;
const initModels = async (sequelize) => {
  // Initiate models
  await initAddress(sequelize);
  await initOrder(sequelize);
  await initOrderItem(sequelize);
  await initProduct(sequelize);
  await initStore(sequelize);
  await initStoreUser(sequelize);
  await initUser(sequelize);
  await initFavoriteProduct(sequelize);

  // Initiate associations between models
  await initAddressAssociations();
  await initOrderAssociations();
  await initOrderItemAssociations();
  await initProductAssociations();
  await initStoreAssociations();
  await initStoreUserAssociations();
  await initUserAssociations();

  models = {
    Address,
    Order,
    OrderItem,
    Product,
    Store,
    StoreUser,
    User,
    FavoriteProduct
  };
};

export default initModels;
