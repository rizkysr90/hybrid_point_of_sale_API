const {countMyCart, add, getAll, updateQty, remove} = require('./../services/cart.service');

const countProductInCart = async (req,res,next) => {
    try {
        const response = await countMyCart(req);
        res.status(200).json(response);
    } catch (error) {
        next(error);        
    }
}
const addProductInCart = async (req,res,next) => {
    try {
        const response = await add(req);
        res.status(response.metadata.status).json(response);
    } catch (error) {
        next(error);
    }
}

const getProductInCart = async (req,res,next) => {
    try {
        const response = await getAll(req);
        res.status(response.metadata?.status).json(response);
    } catch (error) {
        next(error);
    }
}

const updateQtyInCart = async (req,res,next) => {
    try {
        const response = await updateQty(req);
        res.status(response.metadata?.status).json(response);
    } catch (error) {
        next(error);
    }
}
const removeProductInCart = async (req,res,next) => {
    try {
        const response = await remove(req);
        res.status(response.metadata?.status).json(response);
    } catch (error) {
        next(error);
    }
}
module.exports = {
    countProductInCart,
    addProductInCart,
    getProductInCart,
    updateQtyInCart,
    removeProductInCart
}