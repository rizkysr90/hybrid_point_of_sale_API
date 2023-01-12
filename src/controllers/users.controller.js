const { get, getById, update, destroy } = require("../services/users.service")

const getUsers = async (req,res,next) => {
    try {
        const response = await get();
        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
}
const getUser = async (req,res,next) => {
    try {
        const response = await getById(req);
        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
}
const updateUser = async (req,res,next) => {
    try {
        const response = await update(req);
        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
}
const deleteUser = async (req,res,next) => {
    try {
        const response = await destroy(req);
        res.status(200). json(response);
    } catch (error) {
        next(error);
    }
}
module.exports = {
    getUsers,
    getUser,
    updateUser,
    deleteUser
}