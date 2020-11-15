import { dataTypes } from '../config/sequelize';
import { Store } from './Store';

const { INTEGER, STRING, DECIMAL, TINYINT } = dataTypes;

export let Product;
export const initProduct = async (sequelize) => {
  Product = sequelize.define('product', {
    id: {
      type: INTEGER.UNSIGNED,
      allowNull: false,
      unique: true,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: STRING(50),
      allowNull: false
    },
    description: {
      type: STRING(255)
    },
    originalPrice: {
      type: DECIMAL,
      allowNull: false
    },
    reducedPrice: {
      type: DECIMAL
    },
    discountLevel: {
      type: TINYINT.UNSIGNED
    },
    sizes: {
      type: STRING(10),
      allowNull: false
    },
    image: {
      type: STRING(255),
      allowNull: false
    }
  });
};

export const initProductAssociations = async () => {
  Product.belongsTo(Store);
};
