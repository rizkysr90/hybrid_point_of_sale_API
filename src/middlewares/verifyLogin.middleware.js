const { Customer, User } = require('./../../models/index.js');
const {errors : throwError} = require('./../utils/response.util.js');

const verifyCust = async (req,res,next) => {
    try {

        if(!req.session){
            throwError(401,{},'anda harus login untuk mendapatkan akses!');
        }
        let user;
        if (req.session.customerId) {
            user = await Customer.findOne({
                where: {
                    id: req.session.customerId
                }
            });

        }
        if (req.session.userId) {
            user = await Customer.findOne({
                where: {
                    id: req.session.customerId
                }
            });
        }
        if(!user) throwError(404,{},'user tidak ditemukan');

        req.user = user;
        next();

    } catch (error) {
        next(error);        
    }
}

module.exports = verifyCust;