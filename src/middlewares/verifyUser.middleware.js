const { User } = require('./../../models/index.js');
const {errors : throwError} = require('./../utils/response.util.js');

const verifyUser = async (req,res,next) => {
    try {

        if(!req.session.userId){
            throwError(401,{},'anda harus login untuk mendapatkan akses!');
        }
        const user = await User.findOne({
            where: {
                id: req.session.userId
            }
        });
        if(!user) throwError(404,{},'user tidak ditemukan');

        req.user = user;
        next();

    } catch (error) {
        next(error);        
    }
}

module.exports = verifyUser;