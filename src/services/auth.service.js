require('dotenv').config();
const { User } = require('../../models/index.js');
const { errors : throwError, success } = require('../utils/response.util.js');
const { hash,compare } = require('../utils/bcrypt.util.js');
const jwt = require('jsonwebtoken');

const register = async (req) => {
    let { email,password,role } = req.body;
    let findUserByEmail = await User.findOne({ where : { email } });
    if (findUserByEmail) {
        // if user with the email provided by client is found then 
        // register will failed because 1 email for 1 user (unique)
        throwError('email sudah pernah digunakan',400,{});
    };
    let hashedPassword = await hash(password);
    let dataToBeInsertToDatabase = {
        email,
        password : hashedPassword,
        role
    };
    let newUser = await User.create(dataToBeInsertToDatabase);

    return success('berhasil membuat user baru',{ id: newUser.id },201);

}
const login = async (req,res,next) => {
    let {
        email,
        password
     } = req.body;
     const findUserByEmail = await User.findOne({
         where : {
             email
         }
     });
     if (!findUserByEmail) {
         throwError('data pengguna tidak ditemukan',404,{});
     };
     const comparingPassword = await compare(password,findUserByEmail.password);
     if (!comparingPassword) {
        throwError('email atau password salah',400,{});
    };
    const payload = {
        id : findUserByEmail.id,
        role : findUserByEmail.role
    }
    const token = jwt.sign(payload,process.env.JWT_SECRET,{expiresIn: '30 days'});
    const resBody = {
        id : findUserByEmail.id,
        role : findUserByEmail.role,
        token
    }
    return success('login berhasil',resBody,200);
}
module.exports = {
    register,
    login
}