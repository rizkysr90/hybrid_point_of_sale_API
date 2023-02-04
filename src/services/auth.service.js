require('dotenv').config();
const { User, Customer, Cart } = require('../../models/index.js');
const { errors : throwError, success } = require('../utils/response.util.js');
const { hash,compare } = require('../utils/bcrypt.util.js');
const { Op } = require("sequelize");

const register = async (req) => {
    let { name,email, password, role, confirm_password, phone_number } = req.body;
    if (confirm_password !== password) {
        throwError(400, {}, 'konfirmasi password tidak sesuai');
    }
    let checkingUniqUsers = await User.findOne({ 
        where : {
            [Op.or]: [{ email }, { phone_number }] 
        }
    });
    if (checkingUniqUsers) {
        throwError(400,{},'email atau nomor hp sudah pernah digunakan');
    };
    
    let hashedPassword = await hash(password);
    let dataToBeInsertToDatabase = {
        name,
        email,
        password : hashedPassword,
        role,
        phone_number
    };
    let userCreation = await User.create(dataToBeInsertToDatabase);

    return success(201,{ id: userCreation.id },'sukses membuat user baru');

}
const loginCustomer = async (req) => {
    let {
        email,
        password
     } = req.body;
     const findCustomerByEmail = await Customer.findOne({
         where : {
             email
         }
     });
     if (!findCustomerByEmail) {
         throwError(404,{},'data pengguna tidak ditemukan');
     };
     const comparingPassword = await compare(password,findCustomerByEmail.password);
     if (!comparingPassword) {
        throwError(404,{},'email atau password salah');
    };
    req.session.customerId = findCustomerByEmail.id;
    return success(200,{id : findCustomerByEmail.id},'login berhasil');
}
const registerCustomer = async (req) => {
    let { fullname, email , password, confirm_password } = req.body;
    if (confirm_password !== password) {
        throwError(400, {}, 'konfirmasi password tidak sesuai');
    }
    let checkingUniqUsers = await Customer.findOne({ 
        where : {
            email
        }
    });
    if (checkingUniqUsers) {
        throwError(400,{},'email sudah pernah digunakan');
    };
    
    let hashedPassword = await hash(password);
    let dataToBeInsertToDatabase = {
        fullname,
        email,
        password : hashedPassword,
    };
    let customerCreation = await Customer.create(dataToBeInsertToDatabase);
    if (customerCreation) {
        await Cart.create({customer_id:customerCreation.id})
    }
    req.session.customerId = customerCreation.id;
    return success(201,{ id: customerCreation.id },'sukses membuat akun customer baru');

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
         throwError(404,{},'data pengguna tidak ditemukan');
     };
     const comparingPassword = await compare(password,findUserByEmail.password);
     if (!comparingPassword) {
        throwError(404,{},'email atau password salah');
    };
    req.session.userId = findUserByEmail.id;
    req.session.role = findUserByEmail.role;
    return success(200,{id : findUserByEmail.id, role : findUserByEmail.role},'login berhasil');
}

const me = async (req,res,next) => {
    if (!req.session.userId) {
        throwError( 400, {}, 'mohon login terlebih dahulu');

    }
    const findUserByEmail = await User.findOne({
        where : {
            id : req.session.userId
        }
    });
    if (!findUserByEmail) {
        throwError(404,{},'data pengguna tidak ditemukan');
    };
    return success(200, {id : findUserByEmail.id, email : findUserByEmail.email, role : findUserByEmail.role}, 'berhasil mendapatkan data');

}

module.exports = {
    register,
    login,
    me,
    loginCustomer,
    registerCustomer
}