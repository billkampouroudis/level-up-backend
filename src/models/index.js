// const { Order } = require('./Order');
// const { Product } = require('./Product');
// const { ProductOrder } = require('./ProductOrder');
// const { Store } = require('./Store');

import { Address, initAddress, initAddressAssociations } from './Address';
import { User, initUser, initUserAssociations } from './User';
import { Favorite, initFavorite, initFavoriteAssociations } from './Favorite';

export let models;
const initModels = async (sequelize) => {
  // Initiate models
  await initAddress(sequelize);
  await initUser(sequelize);
  await initFavorite(sequelize);

  // Initiate associations between models
  await initAddressAssociations();
  await initUserAssociations();
  await initFavoriteAssociations();

  models = {
    Address,
    User,
    Favorite
  };
};

export default initModels;
