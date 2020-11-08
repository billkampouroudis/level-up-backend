import { dataTypes } from '../config/sequelize';

const { INTEGER } = dataTypes;

export let Order;
export const initOrder = async (sequelize) => {
  Order = sequelize.define('orders', {
    id: {
      type: INTEGER.UNSIGNED,
      allowNull: false,
      unique: true,
      primaryKey: true,
      autoIncrement: true
    },

    user_id: {
      type: INTEGER.UNSIGNED,
      allowNull: false
    }
  });
};

export const initOrderAssociations = async () => {
  // Order.belongsToMany(Order, { through: 'address_user' });
};
