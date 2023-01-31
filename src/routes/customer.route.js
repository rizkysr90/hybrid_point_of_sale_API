const router = require('express').Router();
const Customer = require('../controllers/customer.controller');


router.post('/newAddress', Customer.addNewAddress);
router.get('/address', Customer.getAddress);

module.exports = router;
