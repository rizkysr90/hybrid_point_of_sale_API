const router = require('express').Router();
const cartController = require('./../controllers/cart.controller');

router.get('/count', cartController.countProductInCart);
router.post('/update', cartController.updateProductInCart);

module.exports = router;
