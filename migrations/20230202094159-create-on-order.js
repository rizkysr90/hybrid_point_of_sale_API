'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('On_orders', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING
      },
      CustomerId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Customers',
          key: 'id'
        }
      },
      notes: {
        type: Sequelize.STRING
      },
      amount: {
        type: Sequelize.DOUBLE
      },
      pay_status: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      status: {
        type: Sequelize.STRING,
        defaultValue: "belum bayar"
      },
      evidence_of_tf: {
        type: Sequelize.STRING
      },
      shipping_method: {
        type: Sequelize.STRING
      },
      shipping_distance: {
        type: Sequelize.DOUBLE
      },
      shipping_address: {
        type: Sequelize.STRING
      },
      qty_product: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      deletedAt: {
        allowNull: true,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('On_orders');
  }
};