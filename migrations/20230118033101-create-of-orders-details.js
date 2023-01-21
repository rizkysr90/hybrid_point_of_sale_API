'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('of_orders_details', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      ofOrderId : {
        type: Sequelize.STRING,
        references: {
          model: 'of_orders',
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
        type: Sequelize.DOUBLE
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      deletedAt : {
        allowNull : true,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('of_orders_details');
  }
};