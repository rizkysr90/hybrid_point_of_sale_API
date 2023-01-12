const { product_category } = require('../../models/index.js');
const { errors : throwError, success } = require('../utils/response.util.js');

const create = async (req) => {
    const {name} = req.body;
    const getProductCategory = await product_category.findOne({
        where : {
            name
        }
    })
    if (getProductCategory) {
        throwError(400, {}, 'nama kategori sudah ada');
    }
    await product_category.create({name});
    return success(201, {}, 'berhasil membuat kategori');
}

module.exports = {
    create
}