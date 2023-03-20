const {Cart, Product, Cart_detail} = require('../../models/index');
const pagination = require('../utils/pagination.util');
const { Op } = require("sequelize");
const {errors : throwError, success} = require('../utils/response.util');

const countMyCart = async (req) => {
    const userId = req.session.customerId;
    const findMyCart = await Cart.findOne({
        where : {
            customer_id : userId
        } 
    })
    if (!findMyCart) {
        throwError(404,{},'keranjang belanja tidak ditemukan');
    }
    
    const opt = {
        where : {
            CartId : findMyCart.id
        }
    }
    const amount = await Cart_detail.count(opt)
    return success(200,{ totalProductInCart : amount }, 'sukses mendapatkan data');
}
const add = async (req) => {
    const {ProductId, qty} = req.body;
    const userId = req.session.customerId;
    if (!userId) {
        throwError(401, {}, 'anda tidak memiliki akses')
    }
    const findMyCart = await Cart.findOne({
        where : {
            customer_id : userId
        } 
    });
    // SELECT productId FROM Cart_details WHERE ProductId = req.body.ProductId AND CartId = findMyCart.id
    const getCart =  await Cart_detail.findOne({
        where : {
            [Op.and]: [{ ProductId }, { CartId : findMyCart.id }],   
        },
    })
    
    if (getCart) {
        await Cart_detail.update({qty : getCart.qty + Number(qty) }, {
            where :  {
                [Op.and]: [{ ProductId }, { CartId : findMyCart.id }]
            }
        })
        return success(200, {}, 'sukses mengupdate data');
    }
    await Cart_detail.create({ProductId, qty, CartId : findMyCart.id}, { fields : ['ProductId', 'qty', 'CartId']});
    return success(200, {}, 'sukses menambahkan data');
}

const getAll = async (req) => {
    const userId = req.session.customerId;
    if (!userId) {
        throwError(401, {}, 'anda tidak memiliki akses')
    }
    const findMyCart = await Cart.findOne({
        where : {
            customer_id : userId
        } 
    });
    const getData =  await Cart.findOne({
        where : {
            customer_id : userId
        },
        include : [
                {
                    model : Product,
                    attributes : ['id', 'name', 'stock', 'product_weight'
                    ,'shipping_weight', 'url_img', 'sell_price'],
                }
               
            ]
        ,
        attributes : ['id'],
    })
    return success(200, getData,  'sukses mendapatkan data');

}
const updateQty = async (req) => {
    const userId = req.session.customerId;
    if (!userId) {
        throwError(401, {}, 'anda tidak memiliki akses')
    }
    const findMyCart = await Cart.findOne({
        where : {
            customer_id : userId
        } 
    });
    await Cart_detail.update({qty : req.body.qty}, {
        where : {
            CartId : findMyCart.id,
            ProductId : req.body.ProductId
        }
    })
    return success(200, {},  'sukses mengupdate data');
}
const remove = async (req) => {
    const userId = req.session.customerId;
    if (!userId) {
        throwError(401, {}, 'anda tidak memiliki akses')
    }
    const findMyCart = await Cart.findOne({
        where : {
            customer_id : userId
        } 
    });
    await Cart_detail.destroy({
        where : {
            CartId : findMyCart.id,
            ProductId : req.params.ProductId
        }
    })
    return success(200, {},  'sukses menghapus data');
}

module.exports = {
    countMyCart,
    add,
    getAll,
    updateQty,
    remove
}