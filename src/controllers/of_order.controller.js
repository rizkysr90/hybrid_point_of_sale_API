const {create, getById} = require('./../services/of_order.service')

const createOrder = async (req,res,next) => {
    try {
        const response = await create(req);
        res.status(201).json(response);
    } catch (error) {
        next(error);        
    }
}

const getOrderById = async (req,res,next) => {
    try {
        const response = await getById(req);
        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
}


module.exports = {
    createOrder,
    getOrderById
}