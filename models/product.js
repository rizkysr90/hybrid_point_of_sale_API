'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
        const fk_category = {
          foreignKey : 'product_category_id'
        }
        models.product_category.hasMany(models.Product, fk_category);
        models.Product.belongsTo(models.product_category, fk_category);
        models.Product.belongsToMany(models.of_orders, {through : models.of_orders_details});
        models.Product.belongsToMany(models.On_order, {through : 'On_orders_details'});

    }
  }
  Product.init({
    name: DataTypes.STRING,
    stock: DataTypes.INTEGER,
    url_img: DataTypes.STRING,
    buy_price: DataTypes.DOUBLE,
    sell_price: DataTypes.DOUBLE,
    sku : DataTypes.STRING,
    product_weight: DataTypes.DOUBLE,
    shipping_weight: DataTypes.DOUBLE,
    description: DataTypes.STRING,
    is_sold_online: DataTypes.BOOLEAN,
    is_active: DataTypes.BOOLEAN,
    product_category_id: DataTypes.INTEGER,
    id_cloudinary_img: DataTypes.STRING

  }, {
    sequelize,
    paranoid: true,
    modelName: 'Product',
  });
  return Product;
};