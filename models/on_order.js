'use strict';
const {
  Model, DATE
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class On_order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.Customer.hasMany(models.On_order);
      models.On_order.belongsTo(models.Customer);
      models.On_order.belongsToMany(models.Product, {through : models.On_orders_detail});


    }
  }
  On_order.init({
    CustomerId: DataTypes.INTEGER,
    notes: DataTypes.STRING,
    amount: DataTypes.DOUBLE,
    pay_status: DataTypes.BOOLEAN,
    status: DataTypes.STRING,
    evidence_of_tf: DataTypes.STRING,
    shipping_method: DataTypes.STRING,
    shipping_distance: DataTypes.DOUBLE,
    shipping_address: DataTypes.STRING,
    qty_product: DataTypes.INTEGER,
    lat: DataTypes.FLOAT,
    lng : DataTypes.FLOAT,
    pay_method : DataTypes.STRING,
    paidAt : DataTypes.DATE
  }, {
    sequelize,
    paranoid: true,
    modelName: 'On_order',
  });
  return On_order;
};