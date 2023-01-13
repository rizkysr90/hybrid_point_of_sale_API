const { createProductCategory, getProductCategory, getProductCategoryId, updateCategory, deleteCategory } = require('../controllers/productCategory.controller');
const router = require('express').Router();


router.post('/', createProductCategory);
router.get('/', getProductCategory);
router.get('/:id', getProductCategoryId);
router.put('/:id', updateCategory);
router.delete('/:id', deleteCategory);
module.exports = router;