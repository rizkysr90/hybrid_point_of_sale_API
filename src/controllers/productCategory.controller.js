const { create, get, getById, update, destroy } = require("../services/productCategories.service");

const createProductCategory = async (req,res,next) => {
    try {
        const response = await create(req);
        res.status(201).json(response);
    } catch (error) {
        next(error);
    }
}
const getProductCategory = async (req,res,next) => {
    try {
        const response = await get();
        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
}
const getProductCategoryId = async (req,res,next) => {
    try {
        const response = await getById(req);
        res.status(200).json(response);
    } catch (error) {
        next(error)
    }
}

const updateCategory = async (req,res,next) => {
    try {
        const response = await update(req);
        res.status(200).json(response);
    } catch (error) {
        next(error);        
    }
}
const deleteCategory = async (req,res,next) => {
    try {
        const response = await destroy(req);
        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
}

module.exports = {
    createProductCategory,
    getProductCategory,
    getProductCategoryId,
    updateCategory,
    deleteCategory
}