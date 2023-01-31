'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Customer_Addresses', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      recipient_name: {
        type: Sequelize.STRING
      },
      recipient_phone_number: {
        type: Sequelize.STRING
      },
      street: {
        type: Sequelize.STRING
      },
      province: {
        type: Sequelize.STRING
      },
      state: {
        type: Sequelize.STRING
      },
      district: {
        type: Sequelize.STRING
      },
      village: {
        type: Sequelize.STRING
      },
      postal_code: {
        type: Sequelize.STRING
      },
      lat: {
        type: Sequelize.FLOAT
      },
      lng: {
        type: Sequelize.FLOAT
      },
      isPrimaryAddress : {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      CustomerId : {
        type: Sequelize.INTEGER,
        references: {
          model: 'Customers',
          key: 'id'
        }
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
    await queryInterface.dropTable('Customer_Addresses');
  }
};