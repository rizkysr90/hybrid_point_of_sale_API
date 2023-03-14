const { Customer } = require('./../../models/index.js');
const {errors : throwError} = require('./../utils/response.util.js');

const verifyCust = async (req,res,next) => {
    try {

        if(!req.session.customerId){
            throwError(401,{},'anda harus login untuk mendapatkan akses!');
        }
        const user = await Customer.findOne({
            where: {
                id: req.session.customerId
            }
        });
        if(!user) throwError(404,{},'user tidak ditemukan');

        req.user = user;
        next();

    } catch (error) {
        next(error);        
    }
}

module.exports = verifyCust;