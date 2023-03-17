const { Product, product_category, Snap_product } = require('../../models/index.js');
const cloudinary = require('../utils/cloudinary.util');
const pagination = require('../utils/pagination.util.js');
const { success, errors:throwError } = require('../utils/response.util.js');
const { Op } = require('sequelize');

const uploaderImg = async (path,opts) => await cloudinary.uploadCloudinary(path,opts);

const create = async (req) => {
    const optionsCloudinary = {
        type: "image",
        folder: "skripsi/images/products"
    }
    const up = await uploaderImg(req.file.path, optionsCloudinary);
    const {public_id, eager} = up;
    const secure_url = eager[0].secure_url;
    req.body.url_img = secure_url;
    req.body.id_cloudinary_img = public_id;
    const prepSnapData = {
        name : req.body.name,
        url_img : secure_url,
        weight: req.body.product_weight,
        sell_price: req.body.sell_price,
        ship_weight: req.body.shipping_weight,
        description : req.body.description,
        sku : req.body.sku
    }
    const creationProduct = await Product.create(req.body);
    prepSnapData.product_id = creationProduct.id;
    await Snap_product.create(prepSnapData);
    return success(201, {}, 'berhasil menambahkan produk');
}
const getNewProduct = async (req) => {
    const opt = {
        order : [
            ['createdAt', 'DESC']
        ],
        limit : 12
    }
    const getData = await Product.findAll(opt);
    return success(200, getData, 'sukses mendapatkan data');

}
const getAll = async (req) => {
    req.query.page = req.query.page ? req.query.page : 1;
    const {page, row} = pagination(req.query.page, req.query.row);
    const { search } = req.query;
    const {c : category} = req.query;
    const { active } = req.query;
    const opt = {
        order : [
            ['name', 'ASC']
        ],
        include : {
            model : product_category
        },
        limit: 12,
        offset: page

    }
    if ( search ) {
        opt.where = {
            name : {
                [Op.iLike]: `%${search}%`
            }
        }
    }
    if (category) {
        opt.where = {
            product_category_id : Number(category)
        }
    }
    if (active === 'true') {
        opt.where = {
            ...opt.where, is_active : true
        }
    }
    const {count, rows} = await Product.findAndCountAll(opt);
    const response = {
        products : rows,
        meta : {
            count,
            page
        }
    }
    return success(200,response,'sukses mendapatkan data');
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
    const optionsCloudinary = {
        type: "image",
        folder: "skripsi/images/products"
    }
    const findProduct = await Product.findByPk(req.params.id);
    if (req.file) {
        const up = await uploaderImg(req.file.path, optionsCloudinary);
        const {public_id, eager} = up;
        const secure_url = eager[0].secure_url;
        req.body.url_img = secure_url;
        req.body.id_cloudinary_img = public_id;
    }
    const prepSnapData = {
        name : req.body.name,
        url_img : req.body.url_img ? req.body.url_img : findProduct.url_img ,
        weight: req.body.product_weight,
        sell_price: req.body.sell_price,
        ship_weight: req.body.shipping_weight,
        description : req.body.description,
        sku : req.body.sku,
        product_id : req.params.id
    }
    await Product.update(req.body,{
        where : {
            id : req.params.id
        }
    })
    await Snap_product.create(prepSnapData);

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
    archive,
    getNewProduct
}