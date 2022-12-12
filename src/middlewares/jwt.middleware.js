const jwt = require('jsonwebtoken');
const jwtValidation = (req,res,next) => {
    try {
        const token = req.get('authorization');
        if (token) {
            const getToken = token.split(' ')[1];
            jwt.verify(getToken,process.env.JWT_SECRET)
            next();
        } else {
            throwError('tidak ada token yang diberikan',401,{});
        }
    } catch (error) {
       error.error_code = 401;
       error.data = {};
       next(error);
    }
    
}

module.exports = jwtValidation;