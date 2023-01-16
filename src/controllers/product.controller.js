const { create,getAll,getById, update, destroy }  = require('./../services/product.service');

const createProduct = async (req,res,next) => {
    try {
        const response = await create(req);
        res.status(201).json(response);
    } catch (error) {
        next(error);        
    }
}

const getAllProduct = async (req,res,next) => {
    try {
        const response = await getAll();
        res.status(200).json(response);
    } catch (error) {
        next(error)
    }
}
const getProductById = async (req,res,next) => {
    try {
        const response = await getById(req);
        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
}
const updateProduct = async (req,res,next) => {
    try {
        const response = await update(req);
        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
}
const deleteProduct = async (req,res,next) => {
    try {
        const response = await destroy(req);
        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
}
module.exports = {
    createProduct,
    getAllProduct,
    getProductById,
    updateProduct,
    deleteProduct
}