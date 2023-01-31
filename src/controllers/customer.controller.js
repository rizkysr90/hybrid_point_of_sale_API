const {createAddrs, getAddrs} = require('./../services/customers.service')

const addNewAddress = async (req,res,next) => {
    try {
        const response = await createAddrs(req);
        res.status(201).json(response);
    } catch (error) {
        next(error);
    }
}

const getAddress = async (req,res,next) => {
    try {
        const response = await getAddrs(req);
        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
}

module.exports = {
    addNewAddress,
    getAddress
}