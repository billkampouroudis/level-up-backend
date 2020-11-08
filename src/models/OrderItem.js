import { dataTypes } from '../config/sequelize';

const { INTEGER, DECIMAL, SMALLINT } = dataTypes;

export let OrderItem;
export const initAddress = async (sequelize) => {
  OrderItem = sequelize.define('order_item', {
    id: {
      type: INTEGER.UNSIGNED,
      allowNull: false,
      unique: true,
      primaryKey: true,
      autoIncrement: true
    },
    quantity: {
      type: SMALLINT.UNSIGNED,
      allowNull: false
    },
    price: {
      type: DECIMAL,
      allowNull: false
    },
    product_id: {
      type: INTEGER.UNSIGNED,
      allowNull: false
    }
  });
};

export const initORderItemAssociations = () => {
  // Order.belongsToMany(Order, { through: 'address_user' });
};
