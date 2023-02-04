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
const update = async (req) => {
    const {ProductId, qty} = req.body;
    console.log('FLAAGGG', qty);
    const userId = req.session.customerId;
    const findMyCart = await Cart.findOne({
        where : {
            customer_id : userId
        } 
    });
    // SELECT productId FROM Cart_details WHERE ProductId = req.body.ProductId AND CartId = findMyCart.id
    const {count, rows : sameProduct} =  await Cart_detail.findAndCountAll({
        where : {
            [Op.and]: [{ ProductId }, { CartId : findMyCart.id }],   
        }
    })
    if (count > 0) {
        await Cart_detail.update({qty :sameProduct[0]?.dataValues?.qty + Number(qty) }, {
            where :  {
                [Op.and]: [{ ProductId }, { CartId : findMyCart.id }]
            }
        })
        return success(200, {}, 'sukses mengupdate data');
    }
    await Cart_detail.create({ProductId, qty, CartId : findMyCart.id});
    return success(200, {}, 'sukses menambahkan data');

}
module.exports = {
    countMyCart,
    update
}