'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Snap_products', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      url_img: {
        type: Sequelize.STRING
      },
      weight: {
        type: Sequelize.DOUBLE
      },
      sell_price: {
        type: Sequelize.DOUBLE
      },
      ship_weight: {
        type: Sequelize.DOUBLE
      },
      description: {
        type: Sequelize.STRING
      },
      sku : {
        type : Sequelize.STRING
      },
      product_id : {
        type: Sequelize.INTEGER,
        references: {
          model: 'Products',
          key: 'id',
        }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Snap_products');
  }
};