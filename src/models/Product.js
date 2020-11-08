import { dataTypes } from '../config/sequelize';

const { INTEGER, STRING, DECIMAL, TINYINT } = dataTypes;

export let Product;
export const initProduct = async (sequelize) => {
  Product = sequelize.define('products', {
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
    original_price: {
      type: DECIMAL,
      allowNull: false
    },
    reduced_price: {
      type: DECIMAL
    },
    discount_level: {
      type: TINYINT.UNSIGNED
    },
    sizes: {
      type: STRING(10),
      allowNull: false
    },
    image: {
      type: STRING(255),
      allowNull: false
    },

    store_id: {
      type: INTEGER.UNSIGNED,
      allowNull: false
    }
  });
};

export const initProductAssociations = async () => {
  // Order.belongsToMany(Order, { through: 'address_user' });
};
