const { On_order, Product, sequelize  } = require('../../models/index.js');
const {errors : throwError, success} = require('../utils/response.util');
const queryInterface = sequelize.getQueryInterface();

const create = async (req) => {
    const creationOrder = await On_order.create({
        id : `TRX-${Date.now()}`,
        CustomerId: req.session.customerId,
        notes : req.body.notes,
        status : req.body.status,
        amount : req.body.amount,
        pay_status : req.body.pay_status,
        evidence_of_tf : req.body.evidence_of_tf,
        shpping_method: req.body.shipping_method,
        shipping_distance : req.body.shipping_distance,
        shipping_address : req.body.shipping_address,
        qty_product : req.body.qty_product

    })
    const newArr = req.body.products.map((elm,idx) => {
        return {
            OnOrderId : creationOrder.id,
            ProductId : elm.id,
            qty : elm.qty,
            sum_price_each: elm.qty * elm.price,
            createdAt : new Date(),
            updatedAt : new Date()
        }
    })
    queryInterface.bulkInsert('On_orders_details', newArr);

    return success(201, {order_id : creationOrder.id}, 'berhasil menambahkan data order');

}

module.exports = {
    create
}