const {create, getAll, getById, updatePayment, getAllAdmin, processOrder, getSuccessOrder} = require('./../services/on_order.service')

const createOrder = async (req,res,next) => {
    try {
        const response = await create(req);
        res.status(201).json(response);
    } catch (error) {
        next(error);        
    }
}
const verifyOrder = async (req,res,next) => {
    try {
        const response = await processOrder(req);
        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
}
const getAllOrder = async (req,res,next) => {
    try {
        const response = await getAllAdmin(req);
        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
}
const getMyOrder = async (req,res,next) => {
    try {
        const response = await getAll(req);
        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
}
const getFinishOrder = async (req,res,next) => {
    try {
        const response = await getSuccessOrder(req);
        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
}
const updatePaymentOrder = async (req,res,next) => {
    try {
        const response = await updatePayment(req);
        res.status(200).json(response);
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
    getMyOrder,
    getOrderById,
    updatePaymentOrder,
    getAllOrder,
    verifyOrder,
    getFinishOrder
}