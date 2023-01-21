const router = require('express').Router();
const of_order_controller = require('./../controllers/of_order.controller');


router.post('/', of_order_controller.createOrder);
router.get('/:id', of_order_controller.getOrderById);
module.exports = router;