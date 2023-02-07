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
      models.of_orders.belongsToMany(models.Product, {through : 'of_orders_details'});
    }
  }
  of_orders.init({
    amount: DataTypes.DOUBLE,
    pay_amount: DataTypes.DOUBLE,
    status: DataTypes.STRING
  }, {
    sequelize,
    paranoid: true,
    modelName: 'of_orders',
  });
  return of_orders;
};