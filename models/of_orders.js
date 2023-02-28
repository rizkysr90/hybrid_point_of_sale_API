'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class of_orders extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      const fk_userId = {
        foreignKey : 'user_id'
      }
      models.of_orders.belongsToMany(models.Product, {through : 'of_orders_details'});
      models.User.hasMany(models.of_orders, fk_userId);
      models.of_orders.belongsTo(models.User, fk_userId);
    }
  }
  of_orders.init({
    amount: DataTypes.DOUBLE,
    pay_amount: DataTypes.DOUBLE,
    status: DataTypes.STRING,
    user_id: DataTypes.INTEGER
  }, {
    sequelize,
    paranoid: true,
    modelName: 'of_orders',
  });
  return of_orders;
};