import { dataTypes } from '../config/sequelize';
import { Store } from './Store';
import { User } from './User';
import { FavoriteProduct } from './FavoriteProduct';

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
        type: STRING(255),
        get() {
          const rawValue = this.getDataValue('image');
          return rawValue
            ? `${process.env.FILE_STORAGE_URL}/images/products/${rawValue}`
            : null;
        }
      }
    },
    {
      scopes: {
        withoutId: {
          attributes: { exclude: ['storeId'] }
        },
        orderItem: {
          attributes: ['image', 'name', 'id', 'originalPrice', 'storeId']
        }
      },
      hooks: {
        beforeCreate: (product) => {
          const price = parseFloat(product.originalPrice) || 0;
          product.originalPrice = price.toFixed(2);
        },
        beforeUpdate: (product) => {
          const price = parseFloat(product.originalPrice) || 0;
          product.originalPrice = price.toFixed(2);
        }
      }
    }
  );
};

export const initProductAssociations = async () => {
  Product.belongsTo(Store);
  Product.belongsToMany(User, { through: FavoriteProduct });
};
