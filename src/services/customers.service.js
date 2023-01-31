const { Customer_Address } = require('../../models/index.js');
const {success, errors : throwError} = require('../utils/response.util');

const getAddrs = async (req) => {
    const get = await Customer_Address.findAll({where : {CustomerId : req.session.customerId}});

    return success(200,get,'sukses mendapatkan data');
}
const createAddrs = async (req) => {
    // const {
    //     recipient_name,
    //     recipient_phone_number,
    //     street,
    //     province,
    //     state,
    //     district,
    //     village,
    //     postal_code,
    //     CustomerId
    // } = req.body;
    if (!req.body.recipient_name) {
        throwError(400, {}, 'data nama penerima wajib diisi');
    };
    req.body.CustomerId = req.session.customerId;
    await Customer_Address.create(req.body);
    return success(201,{},'berhasil menambahkan alamat');
}
// const getAddrs = async (req) => {
//     const {id} = req.params;
//     const getAdd
// }
module.exports = {
    createAddrs,
    getAddrs
}