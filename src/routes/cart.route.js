const router = require('express').Router();
const cartController = require('./../controllers/cart.controller');

router.get('/count', cartController.countProductInCart);
router.post('/add', cartController.addProductInCart);
router.get('/', cartController.getProductInCart);
router.put('/update/products', cartController.updateQtyInCart);
router.delete('/remove/products/:ProductId', cartController.removeProductInCart);


module.exports = router;
