const router = require('express').Router();
const on_order_controller = require('./../controllers/on_order.controller');
const verifyLogin = require('./../middlewares/verifyCust.middleware');
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })


router.post('/', on_order_controller.createOrder);
router.get('/', on_order_controller.getMyOrder);
router.get('/:id', on_order_controller.getOrderById);
router.put('/payment', verifyLogin, upload.single('evidence_of_tf'), on_order_controller.updatePaymentOrder);
module.exports = router;