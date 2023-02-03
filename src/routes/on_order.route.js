const router = require('express').Router();
const on_order_controller = require('./../controllers/on_order.controller');


router.post('/', on_order_controller.createOrder);
router.get('/', on_order_controller.getMyOrder);
router.get('/:id', on_order_controller.getOrderById);

module.exports = router;