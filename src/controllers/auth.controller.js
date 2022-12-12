const authService = require('./../services/auth.service.js');

const register = async (req,res,next) => {
    try {
        const response = await authService.register(req);
        res.status(201).json(response);
    } catch (error) {
        next(error);
    }
}

const login = async (req,res,next) => {
    try {
        const response = await authService.login(req);
        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
}

module.exports = {
    register,login
}