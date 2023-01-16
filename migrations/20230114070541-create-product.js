'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Products', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      stock: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0
      },
      url_img: {
        type: Sequelize.STRING,
        allowNull: true
      },
      buy_price: {
        type: Sequelize.DOUBLE,
        allowNull: true
      },
      sell_price: {
        type: Sequelize.DOUBLE,
        allowNull: true
      },
      sku: {
        type: Sequelize.STRING,
        allowNull: true
      },
      product_weight: {
        type: Sequelize.DOUBLE,
        allowNull: true
      },
      shipping_weight: {
        type: Sequelize.DOUBLE,
        allowNull: true
      },
      description: {
        type: Sequelize.STRING,
        allowNull: true
      },
      is_sold_online: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      is_active : {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      id_cloudinary_img : {
        type: Sequelize.STRING,
        defaultValue: null
      },
      product_category_id :  {
        type: Sequelize.INTEGER,
        references: {
          model: 'product_categories',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        defaultValue: null
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
    await queryInterface.dropTable('Products');
  }
};