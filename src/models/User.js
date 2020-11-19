import { dataTypes } from '../config/sequelize';
import { hashSync, compareSync } from 'bcrypt';
import { Address } from './Address';
import { Store } from './Store';
import { Order } from './Order';
import { StoreUser } from './StoreUser';

const { STRING, INTEGER, TINYINT } = dataTypes;

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
      level: {
        type: TINYINT.UNSIGNED,
        defaultValue: 1
      },
      xp: {
        type: INTEGER.UNSIGNED,
        defaultValue: 0
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
      role: {
        type: STRING(20),
        allowNull: false,
        defaultValue: 'client'
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
      }
    }
  );

  User.prototype.validPassword = function (password) {
    return compareSync(password, this.password);
  };
};

export const initUserAssociations = async () => {
  User.belongsToMany(Address, { through: 'address_user' });
  User.belongsToMany(Store, { through: StoreUser });

  User.hasMany(Order);
};
