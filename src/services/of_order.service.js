const { of_orders, Product,of_orders_details,sequelize } = require('../../models/index.js');
const { success } = require('../utils/response.util.js');
const queryInterface = sequelize.getQueryInterface();

const create = async (req) => {
    const creationOrder = await of_orders.create({
        id : `TRX-${Date.now()}`,
        status : req.body.status,
        amount : req.body.amount,
        pay_amount : req.body.pay_amount
    })
    const newArr = req.body.products.map((elm,idx) => {
        return {
            ofOrderId : creationOrder.id,
            ProductId : elm.text.product_id,
            qty : elm.text.qty,
            sum_price_each: elm.text.amount,
            createdAt : new Date(),
            updatedAt : new Date()
        }
    })
    queryInterface.bulkInsert('of_orders_details', newArr);

    return success(201, {order_id : creationOrder.id}, 'berhasil menambahkan data order');


}
const getById = async (req) => {
    const opt = {
        include : [
            {
                model: Product
            },
            
        ]
            
    }
    const getData = await of_orders.findByPk(req.params.id, opt);
    return success(200,getData,'sukses mendapatkan data');
}
module.exports = {
    create,
    getById
}