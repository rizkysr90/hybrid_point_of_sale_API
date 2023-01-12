const { createProductCategory } = require('../controllers/productCategory.controller');
const router = require('express').Router();


router.post('/', createProductCategory);


module.exports = router;