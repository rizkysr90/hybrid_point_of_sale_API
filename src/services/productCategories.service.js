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

const get = async () => {
    const getData = await product_category.findAll();
    return success(200,getData,'sukses mendapatkan data');
}
const getById = async (req) => {
    const getData = await product_category.findByPk(req.params?.id);
    if (!getData) {
        throwError(404, {}, 'data tidak ditemukan');
    }
    return success(200, getData, 'sukses mendapatkan data');
}

const update = async (req) => {
    const {id} = req.params;
    const {name} = req.body;
    const findById = await product_category.findByPk(id);
    if (!findById) {
        throwError(404, {}, 'data tidak ditemukan');
    }
    await product_category.update({
        name
    }, {
        where : {
            id 
        }
    })

    return success(200, {}, 'berhasil update data');
}

const destroy = async (req) => {
    const {id} = req.params;
    const {name} = req.body;
    const findById = await product_category.findByPk(id);
    if (!findById) {
        throwError(404, {}, 'data tidak ditemukan');
    }
    await product_category.destroy({where : {
        id
    }})
    return success(200, {}, 'berhasil menghapus data');

}

module.exports = {
    create,
    get,
    getById,
    update,
    destroy
}