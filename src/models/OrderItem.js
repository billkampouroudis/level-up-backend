import { dataTypes } from '../config/sequelize';
import { Order } from './Order';
import { Product } from './Product';

const { INTEGER, DECIMAL, SMALLINT } = dataTypes;

export let OrderItem;
export const initOrderItem = async (sequelize) => {
  OrderItem = sequelize.define(
    'order_item',
    {
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
      }
    },
    {
      timestamps: false
    }
  );
};

export const initOrderItemAssociations = () => {
  OrderItem.belongsTo(Product);
  OrderItem.belongsTo(Order);
};
