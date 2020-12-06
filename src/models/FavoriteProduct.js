import { dataTypes } from '../config/sequelize';

const { INTEGER } = dataTypes;

export let FavoriteProduct;
export const initFavoriteProduct = async (sequelize) => {
  FavoriteProduct = sequelize.define('favorite_products', {
    id: {
      type: INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    productId: {
      type: INTEGER.UNSIGNED,
      allowNull: false
    },
    userId: {
      type: INTEGER.UNSIGNED,
      allowNull: false
    }
  });
};
