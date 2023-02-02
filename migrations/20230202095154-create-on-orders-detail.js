'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('On_orders_details', {
      OnOrderId: {
        type: Sequelize.STRING,
        references: {
          model: 'On_orders',
          key: 'id'
        }
      },
      ProductId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Products',
          key: 'id'
        }
      },
      qty: {
        type: Sequelize.INTEGER
      },
      sum_price_each: {
        type: Sequelize.INTEGER
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
    await queryInterface.dropTable('On_orders_details');
  }
};