'use strict';
const { faker } = require('@faker-js/faker');
faker.setLocale('id_ID')
function createRandomCategory() {
  
  return {
    name : faker.helpers.unique(faker.commerce.product),
    createdAt : new Date(),
    updatedAt : new Date()
   
  }
}
module.exports = {
  async up (queryInterface, Sequelize) {
    let baseArr = Array.from(Array(10).keys())
    let seedData = baseArr.map(() => {
      return createRandomCategory()
    })
    await queryInterface.bulkInsert('product_categories',seedData,{}); 
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('product_categories');
  }
};
