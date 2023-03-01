const { of_orders, Product, of_orders_details , Snap_product, User, sequelize } = require('../../models/index.js');
const { success } = require('../utils/response.util.js');
const {Op} = require('sequelize');
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
    await queryInterface.bulkInsert('of_orders_details', newArr);

    return success(201, {order_id : creationOrder.id}, 'berhasil menambahkan data order');


}
const getAll = async (req) => {
    let {startDate, endDate} = req.query;
    [startDate] = startDate.split('T');
    [endDate] = endDate.split('T');
    // SELECT * FROM of_orders WHERE createdAt BETWEEN
    let opts = {};
    let opts2 = {};
    // {
    //     where : {
    //         createdAt : {
    //             [Op.between]: [startDate, endDate],
    //         }
    //     }
    // }
    if (startDate === endDate) {
        let arrEndDate = endDate.split('-');
        let getDate = Number(arrEndDate[2]);
        getDate += 01;
        if (getDate < 10) {
            getDate = '0' + String(getDate)
        }
        arrEndDate[2] = getDate;
        endDate = arrEndDate.join('-');
        opts.where = {
            createdAt : {
                [Op.and] :{
                    [Op.gte] : startDate,
                    [Op.lt] : endDate

                }
                
            }
        }
    
    }
    opts2 = {...opts};
    opts2.attributes = [[sequelize.fn('SUM', sequelize.col('amount')), 'sum_of_orders']]
    const findOrder = await of_orders.findAll(opts);
    const findSumOrder = await of_orders.findAll(opts2);
    let getSumOrderValue = findSumOrder[0].dataValues.sum_of_orders;
    let response = {
        orders : findOrder,
        meta : {
          sum_of_orders : getSumOrderValue
        }
    }
    return success(200, response, 'berhasil mendapatkan data');
}
const getById = async (req) => {
    const opt = {
        include : [
            {
                model: Product
            },
            {
                model: User
            },
            
        ]
            
    }
    const getData = await of_orders.findByPk(req.params.id, opt);
    return success(200,getData,'sukses mendapatkan data');
}
module.exports = {
    create,
    getById,
    getAll
}