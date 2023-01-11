const { User } = require('./../../models/index.js');
const {errors : throwError} = require('./../utils/response.util.js');

const onlyAdmin = async (req,res,next) => {
    try {
        if (req.user.role !== 'admin' && req.user.role !== 'superadmin') {
            throwError(400,{}, 'anda tidak memiliki akses');
        }
        next();

    } catch (error) {
        next(error);        
    }
}

module.exports = onlyAdmin;