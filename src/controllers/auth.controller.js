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
const logout = async (req,res,next) => {
    req.session.destroy((err)=>{
        if(err) return res.status(400).json({metadata : {
            status: 400,
            msg : 'Akun anda gagal logout',
        },
        data : {}});
        res.status(200).json({metadata : {
            status: 200,
            msg : 'Akun anda berhasil logout',
        },
        data : {}});
    });
}
const registerCustomer = async (req,res,next) => {
    try {
        const response = await authService.registerCustomer(req);
        res.status(201).json(response);
    } catch (error) {
        next(error);
    }
}
const loginCustomer = async (req,res,next) => {
    try {
        const response = await authService.loginCustomer(req);
        res.status(200).json(response);
    } catch (error) {
        next(error)
    }
}
const refreshOtp = async (req,res,next) => {
    try {
        const response = await authService.refreshOtpReg(req);
        res.status(200).json(response);
    } catch (error) {
        next(error)
    }
}
const verifyNewCust = async (req,res,next) => {
    try {
        const response = await authService.verifyNewCust(req);
        res.status(200).json(response);
    } catch (error) {
        next(error)
    }
}
const forgotPassword = async (req,res,next) => {
    try {
        const response = await authService.forgot_password(req);
        res.status(200).json(response);
    } catch (error) {
        next(error)
    }
}
const verifyForgotPass = async (req,res,next) => {
    try {
        const response = await authService.verifyForgotPass(req);
        res.status(200).json(response);
    } catch (error) {
        next(error)
    }
}
const resetPassword = async (req,res,next) => {
    try {
        const response = await authService.resetPassword(req);
        res.status(200).json(response);
    } catch (error) {
        next(error)
    }
}
const me = async (req,res,next) => {
    try {
        const response = await authService.me(req);
        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
}


module.exports = {
    register,login,logout,me,registerCustomer,loginCustomer,
    refreshOtp,verifyNewCust,forgotPassword, verifyForgotPass,
    resetPassword
}