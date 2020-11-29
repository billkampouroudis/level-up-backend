import { dataTypes } from '../config/sequelize';
import { Store } from './Store';

const { INTEGER, STRING, DECIMAL, TINYINT } = dataTypes;

export let Product;
export const initProduct = async (sequelize) => {
  Product = sequelize.define(
    'product',
    {
      id: {
        type: INTEGER.UNSIGNED,
        allowNull: false,
        unique: true,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: STRING(100),
        allowNull: false
      },
      description: {
        type: STRING(255)
      },
      originalPrice: {
        type: DECIMAL(10, 2),
        allowNull: false
      },
      reducedPrice: {
        type: DECIMAL(10, 2)
      },
      discountLevel: {
        type: TINYINT.UNSIGNED
      },
      sizes: {
        type: STRING(30),
        allowNull: false
      },
      stars: {
        type: TINYINT.UNSIGNED
      },
      image: {
        type: STRING(255)
      }
    },
    {
      scopes: {
        withoutId: {
          attributes: { exclude: ['storeId'] }
        }
      }
    }
  );
};

export const initProductAssociations = async () => {
  Product.belongsTo(Store);
};
