const router = require('express').Router();
const verifyUser = require('../middlewares/verifyUser.middleware');
const of_order_controller = require('./../controllers/of_order.controller');


router.post('/', verifyUser, of_order_controller.createOrder);
router.get('/:id', of_order_controller.getOrderById);
router.get('/', of_order_controller.getAllOrder);
router.delete('/:transaction_id', of_order_controller.destroyOrder);

module.exports = router;