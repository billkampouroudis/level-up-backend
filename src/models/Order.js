import { dataTypes } from '../config/sequelize';
import { User } from './User';

const { INTEGER } = dataTypes;

export let Order;
export const initOrder = async (sequelize) => {
  Order = sequelize.define('order', {
    id: {
      type: INTEGER.UNSIGNED,
      allowNull: false,
      unique: true,
      primaryKey: true,
      autoIncrement: true
    }
  });
};

export const initOrderAssociations = async () => {
  Order.belongsTo(User);
};
