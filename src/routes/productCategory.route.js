const { createProductCategory, getProductCategory, getProductCategoryId, updateCategory, deleteCategory } = require('../controllers/productCategory.controller');
const router = require('express').Router();
const verifyLogin = require('./../middlewares/verifyUser.middleware');



router.post('/', verifyLogin, createProductCategory);
router.get('/', getProductCategory);
router.get('/:id', getProductCategoryId);
router.put('/:id', verifyLogin,  updateCategory);
router.delete('/:id', verifyLogin, deleteCategory);
module.exports = router;