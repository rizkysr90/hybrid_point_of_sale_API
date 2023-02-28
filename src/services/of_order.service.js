const { of_orders, Product, of_orders_details , Snap_product, User, sequelize } = require('../../models/index.js');
const { success } = require('../utils/response.util.js');
const queryInterface = sequelize.getQueryInterface();

const create = async (req) => {
    const creationOrder = await of_orders.create({
        id : `TRX-${Date.now()}`,
        status : req.body.status,
        amount : req.body.amount,
        pay_amount : req.body.pay_amount,
        user_id : req.user.id
    })
    const newArr = await Promise.all(req.body.products.map(async (elm,idx) => {
        let findSnap = await Snap_product.findOne({
            where : {
                product_id : elm.product_id
            },
            order : [['createdAt', 'ASC']]
        })
        return {
            ofOrderId : creationOrder.id,
            ProductId : elm.product_id,
            qty : elm.qty,
            sum_price_each: elm.amount,
            createdAt : new Date(),
            updatedAt : new Date(),
            snap_product_id :findSnap.id
        }
    }))
    console.log('Gass', newArr);
    await queryInterface.bulkInsert('of_orders_details', newArr);

    return success(201, {order_id : creationOrder.id}, 'berhasil menambahkan data order');


}
const getById = async (req) => {
    const opt = {
        include : [
            {
                model: Product
            },
            {
                model: User
            }
            
        ]
            
    }
    const getData = await of_orders.findByPk(req.params.id, opt);
    return success(200,getData,'sukses mendapatkan data');
}
module.exports = {
    create,
    getById
}