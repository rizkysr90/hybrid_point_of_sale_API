require('dotenv').config();
const { User, Customer, Cart } = require('../../models/index.js');
const { errors : throwError, success } = require('../utils/response.util.js');
const { hash,compare } = require('../utils/bcrypt.util.js');
const mailer = require('../utils/mailer.util')
const { Op } = require("sequelize");
var jwt = require('jsonwebtoken')

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
     console.log(email, password);
     const findCustomerByEmail = await Customer.findOne({
         where : {
            [Op.and]: [{ email } ,{ is_verified: 1 }],      
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
    let { email , password, confirm_password } = req.body;
    if (confirm_password !== password) {
        throwError(400, {}, 'konfirmasi password tidak sesuai');
    }
    let checkingUniqUsers = await Customer.findOne({ 
        where : {
            [Op.and]: [{ email }, { is_verified: 1 }],      
        }
    });
    if (checkingUniqUsers) {
        throwError(400,{},'email sudah pernah digunakan');
    };
    
    let hashedPassword = await hash(password);
    let otp_reg = "";
    for(let i = 0; i < 4; i++) {
        otp_reg += `${Math.floor(Math.random() * 10)}`
    }
     // UNIX Timestamp expired 5mnts after generate Date.now
    let exp_otp_reg = Date.now() + 300000;
    let dataToBeInsertToDatabase = {
        email,
        password : hashedPassword,
        otp_reg,
        exp_otp_reg
    };
    let customerCreation = await Customer.create(dataToBeInsertToDatabase);
    if (customerCreation) {
        let emailContent = {
            from : `Rizki Plastik <${process.env.MAILER_EMAIL}>`,
            to : email,
            subject: "Verifikasi Akun E-Commerce Rizki Plastik",
            text: `Ini adalah kode verifikasi kamu : ${otp_reg}`,
            html: `<b>Ini adalah kode verifikasi kamu : ${otp_reg}</b>`
        }
        await mailer.sendMail(emailContent)
    }
    // // if (customerCreation) {
    // //     await Cart.create({customer_id:customerCreation.id})
    // // }
    // req.session.customerId = customerCreation.id;
    return success(201,{ id: customerCreation.id, email : customerCreation.email },'sukses mendaftarkan customer');

}
const login = async (req) => {
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
const refreshOtpReg = async (req) => {
    let {id, email} = req.body;
    const findUserByEmail = await Customer.findOne({
        where : {
            [Op.and]: [{ email }, { is_verified: 0 }, {id}]
        }
    });
    if (!findUserByEmail) {
        throwError(404,{},'data pengguna tidak ditemukan');
    };
    let otp_reg = "";
    for(let i = 0; i < 4; i++) {
        otp_reg += `${Math.floor(Math.random() * 10)}`
    }
     // UNIX Timestamp expired 5mnts after generate Date.now
    let exp_otp_reg = Date.now() + 300000;
    let userUpdate = await Customer.update({otp_reg,exp_otp_reg},{
        where : {
            [Op.and]: [{ email }, { is_verified: 0 }, {id}]
        }
    });
    if (userUpdate) {
        let emailContent = {
            from : `Rizki Plastik <${process.env.MAILER_EMAIL}>`,
            to : email,
            subject: "Verifikasi Akun E-Commerce Rizki Plastik",
            text: `Ini adalah kode verifikasi kamu : ${otp_reg}`,
            html: `<b>Ini adalah kode verifikasi kamu : ${otp_reg}</b>`
        }
        await mailer.sendMail(emailContent)

    }
    return success(201,{ id , email },'sukses mengirim otp');

}
const verifyNewCust = async (req) => {
    const {email,otp,id} = req.body;
    const findUserByEmail = await Customer.findOne({
        where : {
            [Op.and]: [{ email }, { is_verified: 0 }, {id}]
        }
    });
    if (!findUserByEmail) {
        throwError('data pengguna tidak ditemukan',404,{});
    };
    if (findUserByEmail.otp_reg === otp) {
        let currentTime = Date.now();
        if (currentTime > findUserByEmail.exp_otp_reg) {
            throwError('otp expired',400,{});
        }
        let verify = await Customer.update({is_verified : 1,otp_reg : null, exp_otp_reg : null},{
            where : {
                [Op.and]: [{ email }, { is_verified: 0 }, {id}]
            }
        })
        if (verify) {
            await Cart.create({customer_id: id})
            req.session.customerId = findUserByEmail.id;
            return success(200,{}, 'berhasil verifikasi customer')
        }
    }
    throwError(400, {}, 'otp tidak sesuai');
}
const forgot_password = async (req) => {
    const {email} = req.body;

    const findCust = await Customer.findOne({
        where : {
            [Op.and]: [{ email }, { is_verified: 1 }]
        }
    })
    if (!findCust) {
        throwError(404, {}, 'email tidak terdaftar')
    }
    let otp_forgot_pass = '';
    for(let i = 0; i < 4; i++) {
        otp_forgot_pass += `${Math.floor(Math.random() * 10)}`
    }
    const jwtSecret = process.env.JWT_SECRET + otp_forgot_pass;
    await Customer.update({otp_forgot_pass}, { where : {
        [Op.and]: [{ email }, { is_verified: 1 }]
    }})
    let token = jwt.sign({ id : findCust.id, email : findCust.email}, jwtSecret, {expiresIn : '1h'})
    let url = process.env.UI_HOST + '/forgot-password' + `/${findCust.id}` +`/${token}`;
    let emailContent = {
        from : `Rizki Plastik <${process.env.MAILER_EMAIL}>`,
        to : email,
        subject: "Reset Password Akun E-Commerce Rizki Plastik",
        text: `${url}`,
        html: `<b>${url}</b>`
    }
    await mailer.sendMail(emailContent)
    return success(200, {}, 'berhasil mengirim reset password')
}
const verifyForgotPass = async (req) => {
    const {token, userId} = req.params;
    const findCust = await Customer.findOne({
        where : {
            [Op.and]: [{ id : userId }, { is_verified: 1 }]
        }
    })
    if (!findCust) {
        throwError(404, {}, 'email tidak terdaftar')
    }
    const jwtSecret = process.env.JWT_SECRET + findCust.otp_forgot_pass;
    const decoded = jwt.verify(token, jwtSecret);
    if (decoded?.id !== userId && decoded?.email !== findCust.email) {
        throwError(401, {}, 'anda tidak memiliki akses');
    }
    return success(200, {}, 'sukses')
}
const resetPassword = async (req) => {
    const {token, userId} = req.params;
    const {password, confirm_password} = req.body;
    if (password !== confirm_password) {
        throwError(400, {}, 'konfirmasi password tidak sesuai');
    }
    const findCust = await Customer.findOne({
        where : {
            [Op.and]: [{ id : userId }, { is_verified: 1 }]
        }
    })
    if (!findCust) {
        throwError(404, {}, 'email tidak terdaftar')
    }
    const jwtSecret = process.env.JWT_SECRET + findCust.otp_forgot_pass;
    const decoded = jwt.verify(token, jwtSecret);
    if (decoded?.id !== userId && decoded?.email !== findCust.email) {
        throwError(401, {}, 'anda tidak memiliki akses');
    }
    let hashedPassword = await hash(password);
    await Customer.update({password : hashedPassword, otp_forgot_pass : null}, { where : {
        [Op.and]: [{ id : userId }, { is_verified: 1 }]
    }})
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
    verifyForgotPass,
    me,
    verifyNewCust,
    refreshOtpReg,
    resetPassword,
    forgot_password,
    loginCustomer,
    registerCustomer
}