const { On_order, On_orders_detail, Product, sequelize  } = require('../../models/index.js');
const {errors : throwError, success} = require('../utils/response.util');
const queryInterface = sequelize.getQueryInterface();
const pagination = require('../utils/pagination.util');

const create = async (req) => {
    console.log(req.body);
    const creationOrder = await On_order.create({
        id : `TRX-${Date.now()}`,
        CustomerId: req.session.customerId,
        notes : req.body.notes,
        status : req.body.status,
        amount : req.body.amount,
        pay_status : req.body.pay_status,
        evidence_of_tf : req.body.evidence_of_tf,
        shipping_method: req.body.shipping_method,
        shipping_distance : req.body.shipping_distance,
        shipping_address : req.body.shipping_address,
        qty_product : req.body.qty_product

    })
    let newArr = [];
    if (req.body.products.length < 2) {
        newArr = req.body.products.map((elm,idx) => {
        return {
            OnOrderId : creationOrder.id,
            ProductId : elm.id,
            qty : elm.qty,
            sum_price_each: elm.qty * elm.price,
            createdAt : new Date(),
            updatedAt : new Date()
        }
    })
    } else {
        newArr = req.body.products.map((elm,idx) => {
            return {
                OnOrderId : creationOrder.id,
                ProductId : elm.id,
                qty : elm.Cart_detail.qty,
                sum_price_each: elm.Cart_detail.qty * elm.sell_price,
                createdAt : new Date(),
                updatedAt : new Date()
            }
        })
    }
    queryInterface.bulkInsert('On_orders_details', newArr);
    return success(201, {order_id : creationOrder.id}, 'berhasil menambahkan data order');
}

const getAll = async (req) => {
    if (!req.session.customerId) {
        throwError(401, {}, 'anda tidak memiliki akses');
    }
    const {page, row} = pagination(req.body.page, req.body.row);
    const opt = {
        where : {
            CustomerId : req.session.customerId
        },
        order : [
            ['createdAt', 'DESC']
        ],
        include : [
                {
                    model : Product,
                    attributes : ['id', 'name', 'url_img']
                }
               
            ]
        ,
        attributes : ['id','createdAt','amount','qty_product'
                    ,'pay_status','status','shipping_method'],
        limit: row,
        offset: page
    }
    const getData = await On_order.findAll(opt);
    return success(200,getData,'sukses mendapatkan data');

}

const getById = async (req) => {
    // req.params.id
    const opt = {
        include : [
            {
                model : Product
            }
           
        ]
    ,
    }
    const getData = await On_order.findByPk(req.params.id, opt);
    return success(200,getData,'sukses mendapatkan data');
}

module.exports = {
    create,
    getAll,
    getById
}