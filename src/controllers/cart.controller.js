const {countMyCart,update} = require('./../services/cart.service');

const countProductInCart = async (req,res,next) => {
    try {
        const response = await countMyCart(req);
        res.status(200).json(response);
    } catch (error) {
        next(error);        
    }
}
const updateProductInCart = async (req,res,next) => {
    try {
        const response = await update(req);
        res.status(response.metadata.status).json(response);
    } catch (error) {
        next(error);
    }
}

module.exports = {
    countProductInCart,
    updateProductInCart
}