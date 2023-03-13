'use strict';
const { faker } = require('@faker-js/faker');
const { Product, Snap_product, product_category } = require('../models/index');

faker.setLocale('id_ID')
function createRandomProduct() {
  let sku = 'RZK-'
  for(let i = 0; i < 4; i++) {
    sku += `${Math.floor(Math.random() * 10)}`
  }
  let buy_price = faker.datatype.number({min : 10000, max : 5000000})
  let product_weight = faker.datatype.number({min: 1})


  let data = {
      name : faker.commerce.productName(),
      stock : faker.datatype.number({max : 999, min: 1}),
      url_img : faker.image.imageUrl(640, 480, 'food', true),
      buy_price,
      sell_price : faker.datatype.number({min : buy_price, max : 10000000}),
      sku,
      product_weight,
      shipping_weight : faker.datatype.number({min : product_weight + 100}),
      description : faker.commerce.productDescription(),
      is_sold_online : true,
      is_active : true,
      createdAt : new Date(),
      updatedAt : new Date(),
  }

  // const prepSnapData = {
  //     name : data.name,
  //     url_img : data.url_img,
  //     weight: data.product_weight,
  //     sell_price: data.sell_price,
  //     ship_weight: data.shipping_weight,
  //     description : data.description,
  //     sku : data.sku,
  //     createdAt : new Date(),
  //     updatedAt : new Date(),
  // }
  // return {
  //   product : data,
  //   snap : prepSnapData
  // };
  return data;
}
module.exports = {
  async up (queryInterface, Sequelize) {
      let baseArr = Array.from(Array(10).keys())
      let seedDataProduct = baseArr.map(() => {
        return createRandomProduct()
      })
      await Promise.all(seedDataProduct.map(async (elm) => {
          let category = {
              name : faker.helpers.unique(faker.commerce.product),
              createdAt : new Date(),
              updatedAt : new Date()
          }

          let creationCategory = await product_category.create(category);
          elm.product_category_id = creationCategory.id;
          let creationProduct = await Product.create(elm);
          const prepSnapData = {
              name : elm.name,
              url_img : elm.url_img,
              weight: elm.product_weight,
              sell_price: elm.sell_price,
              ship_weight: elm.shipping_weight,
              description : elm.description,
              sku : elm.sku,
              product_id : creationProduct.id,
              createdAt : new Date(),
              updatedAt : new Date(),
          }
          await Snap_product.create(prepSnapData)
      }))
      // let seedDataSnap = baseArr.map(() => {
      //   return createRandomProduct().snap
      // })
      // await queryInterface.bulkInsert('Products', seedDataProduct ,{}); 
      // await queryInterface.bulkInsert('Snap_products', seedDataSnap ,{}); 
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Snap_products');
    await queryInterface.bulkDelete('Products');
   
  }
};
