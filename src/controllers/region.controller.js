const {getProvince, getStateByProvince, getDistrict, getVillage} = require('./../services/region.service');


const findProvince = async (req,res,next) => {
    try {
        const response = await getProvince(req);
        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
}
const findState = async (req,res,next) => {
    try {
        const response = await getStateByProvince(req);
        res.status(200).json(response)
    } catch (error) {
        next(error);
    }
}
const findDistrict = async (req,res,next) => {
    try {
        const response = await getDistrict(req);
        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
}
const findVillage = async (req,res,next) => {
    try {
        const response = await getVillage(req);
        res.status(200).json(response);
    } catch (error) {
        next(error)
    }
}

module.exports = {
    findProvince,
    findState,
    findDistrict,
    findVillage
}