import { dataTypes } from '../config/sequelize';
import { Product } from './Product';
import { User } from './User';

const { INTEGER } = dataTypes;

export let FavoriteProduct;
export const initFavoriteProduct = async (sequelize) => {
  FavoriteProduct = sequelize.define('FavoriteProduct', {
    id: {
      type: INTEGER.UNSIGNED,
      allowNull: false,
      unique: true,
      primaryKey: true,
      autoIncrement: true
    }
  });
};

export const initFavoriteProductAssociations = async () => {
  FavoriteProduct.belongsTo(Product);
  FavoriteProduct.belongsTo(User);
};
