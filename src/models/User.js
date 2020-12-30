import { dataTypes } from '../config/sequelize';
import { hashSync, compareSync } from 'bcrypt';
import { Address } from './Address';
import { Store } from './Store';
import { Order } from './Order';
import { StoreUser } from './StoreUser';
import { Product } from './Product';
import { FavoriteProduct } from './FavoriteProduct';

const { STRING, INTEGER } = dataTypes;

export let User;
export const initUser = async (sequelize) => {
  User = sequelize.define(
    'user',
    {
      id: {
        type: INTEGER.UNSIGNED,
        allowNull: false,
        unique: true,
        primaryKey: true,
        autoIncrement: true
      },
      firstName: {
        type: STRING(45),
        allowNull: false
      },
      lastName: {
        type: STRING(45),
        allowNull: false
      },
      xp: {
        type: INTEGER.UNSIGNED,
        defaultValue: 50
      },
      email: {
        type: STRING(100),
        allowNull: false,
        unique: true
      },
      mobileNumberCode: {
        type: STRING(3)
      },
      mobileNumber: {
        type: STRING(100)
      },
      password: {
        type: STRING(60),
        allowNull: false
      },
      avatar: {
        type: STRING()
      }
    },
    {
      hooks: {
        beforeCreate: (user) => {
          user.password = hashSync(user.password, 5);
        }
      },
      scopes: {
        auth: {
          attributes: { exclude: ['password'] }
        }
      }
    }
  );

  User.prototype.validPassword = function (password) {
    return compareSync(password, this.password);
  };
};

export const initUserAssociations = async () => {
  User.belongsToMany(Store, { through: StoreUser });
  User.belongsToMany(Product, {
    as: 'favoriteProducts',
    through: FavoriteProduct
  });

  User.hasMany(Address);
  User.hasMany(Order);
};
