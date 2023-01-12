const { create } = require("../services/productCategories.service");

const createProductCategory = async (req,res,next) => {
    try {
        const response = await create(req);
        res.status(201).json(response);
    } catch (error) {
        next(error);
    }
}

module.exports = {
    createProductCategory
}