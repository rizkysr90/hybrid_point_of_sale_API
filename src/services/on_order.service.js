const { On_order, On_orders_detail, Cart, Cart_detail, Product, sequelize  } = require('../../models/index.js');
const {errors : throwError, success} = require('../utils/response.util');
const queryInterface = sequelize.getQueryInterface();
const { Op } = require("sequelize");
const pagination = require('../utils/pagination.util');

const create = async (req) => {
    // Verifikasi validasi produk
    let orderedProductId = [];
    req.body.products.forEach((elm) => {
        orderedProductId.push(elm.id);
    });
    let findOrderedProducts = await Product.findAll({
        where : {
            id : {
                [Op.in] : orderedProductId
            }
        }
    })
    if (findOrderedProducts.length !== orderedProductId.length) {
        throwError(404, {}, 'produk tidak ditemukan')
    }
  
    findOrderedProducts.forEach((elm, idx) => {
        if (elm.stock < req.body.products[idx].Cart_detail.qty ) {
            throwError(400, {}, 'produk habis')
        }
        if (!elm.is_active || !elm.is_sold_online) {
            throwError(400, {}, 'produk tidak aktif')
        }
    })
    let idOrder = "";
    for(let i = 0; i < 3; i++) {
        idOrder += `${Math.floor(Math.random() * 10)}`
    }
    await Promise.all(req.body.products.map(async (elm, idx) => {
        // console.log(elm);
        // console.log(findOrderedProducts[idx]);
         await Product.update({
            stock : Number(findOrderedProducts[idx].stock) - Number(elm.Cart_detail.qty)
        }, {
            where : {
                id : elm.id
            }
        })
    }))
    
    let unixTime = String(Date.now()).slice(-3);
    console.log('iniiii', req.body);
    const creationOrder = await On_order.create({
        id : `${req.session.customerId}-${idOrder}-${unixTime}`,
        CustomerId: req.session.customerId,
        notes : req.body.notes,
        status : req.body.status,
        amount : req.body.amount,
        pay_status : req.body.pay_status,
        evidence_of_tf : req.body.evidence_of_tf,
        shipping_method: req.body.shipping_method,
        shipping_distance : req.body.shipping_distance,
        shipping_address : req.body.shipping_address,
        qty_product : req.body.qty_product,
        lat : req.body.lat,
        lng : req.body.lng

    })
    let newArr = [];
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
    const findMyCart = await Cart.findOne({
        where : {
            customer_id : req.session.customerId
        } 
    });
    await Cart_detail.destroy({
        where : {
            CartId : findMyCart.id,
            deletedAt : null
        }
    })
    await queryInterface.bulkInsert('On_orders_details', newArr);
    return success(201, {orderId : creationOrder.id}, 'berhasil menambahkan data order');

    // return success(201, {order_id : creationOrder.id}, 'berhasil menambahkan data order');
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