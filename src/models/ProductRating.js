import { dataTypes } from '../config/sequelize';
import { Product } from './Product';
import { User } from './User';

const { INTEGER, STRING, TINYINT } = dataTypes;

export let ProductRating;
export const initProductRating = async (sequelize) => {
  ProductRating = sequelize.define('product_rating', {
    id: {
      type: INTEGER.UNSIGNED,
      allowNull: false,
      unique: true,
      primaryKey: true,
      autoIncrement: true
    },
    text: {
      type: STRING(500)
    },
    stars: {
      type: TINYINT.UNSIGNED,
      allowNull: false
    }
  });
};

export const initProductRatingAssociations = async () => {
  ProductRating.belongsTo(User);
  ProductRating.belongsTo(Product);
};
