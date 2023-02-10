const { Product, product_category } = require('../../models/index.js');
const cloudinary = require('../utils/cloudinary.util');
const pagination = require('../utils/pagination.util.js');
const { success, errors:throwError } = require('../utils/response.util.js');

const uploaderImg = async (path,opts) => await cloudinary.uploadCloudinary(path,opts);

const create = async (req) => {
    const optionsCloudinary = {
        type: "image",
        folder: "skripsi/images/products"
    }
    // console.log(req.file);
    const up = await uploaderImg(req.file.path, optionsCloudinary);
    const {public_id, eager} = up;
    const secure_url = eager[0].secure_url;
    req.body.url_img = secure_url;
    req.body.id_cloudinary_img = public_id;
    await Product.create(req.body);
    return success(201, {}, 'berhasil menambahkan produk');
}

const getAll = async (req) => {
    const {page, row} = pagination(req.body.page, req.body.row);
    const opt = {
        order : [
            ['name', 'ASC']
        ],
        include : {
            model : product_category
        },
        limit: row,
        offset: page

    }

    const getData = await Product.findAll(opt);

    return success(200,getData,'sukses mendapatkan data');
}
const getById = async (req) => {
    const opt = {
        order : [
            ['name', 'ASC']
        ],
        include : {
            model : product_category
        }
    }
    const getData = await Product.findByPk(req.params.id, opt);
    return success(200,getData,'sukses mendapatkan data');

}

const update = async (req) => {
    console.log('DEBUGGING',req.file);
    const optionsCloudinary = {
        type: "image",
        folder: "skripsi/images/products"
    }
    if (req.file) {
        const up = await uploaderImg(req.file.path, optionsCloudinary);
        const {public_id, eager} = up;
        const secure_url = eager[0].secure_url;
        req.body.url_img = secure_url;
        req.body.id_cloudinary_img = public_id;
    }
    await Product.update(req.body,{
        where : {
            id : req.params.id
        }
    })

    return success(200,{},'sukses update data');
}

const destroy = async (req) => {
    await Product.destroy({
        where : {
            id : req.params.id
        }
    })
    return success(200, {}, 'berhasil menghapus produk');
}

const archive = async (req) => {
    const {is_active} = req.query
    await Product.update({is_active}, {
        where : {
            id : req.params.id
        }
    })
    return success(200,{},'sukses update data');
}

module.exports = {
    create,
    getAll,
    getById,
    update,
    destroy,
    archive
}