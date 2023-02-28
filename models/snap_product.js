'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Snap_product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Product.hasMany(models.Snap_product, {foreignKey : 'product_id'});
      models.Snap_product.belongsTo(models.Product, {foreignKey : 'product_id'});
    }
  }
  Snap_product.init({
    name: DataTypes.STRING,
    url_img: DataTypes.STRING,
    weight: DataTypes.DOUBLE,
    sell_price: DataTypes.DOUBLE,
    ship_weight: DataTypes.DOUBLE,
    description: DataTypes.STRING,
    product_id : DataTypes.INTEGER,
    sku : DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Snap_product',
  });
  return Snap_product;
};