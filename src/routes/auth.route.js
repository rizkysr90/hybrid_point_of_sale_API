const router = require('express').Router();
const authController = require('./../controllers/auth.controller.js');
const jwtValidation = require('./../middlewares/jwt.middleware.js');
const { body, validationResult } = require('express-validator');
const validator = require('./../middlewares/validator.middleware');


router.post('/register/users', authController.register);
router.post('/login/users', 
    body('email').isEmail().withMessage('Email yang dimasukkan tidak valid').bail(),
    body('password').isLength({ min: 5 }).withMessage('Minimal panjang password 5 karakter'),
    validator,authController.login);
router.delete('/logout/users', authController.logout);
router.get('/me', authController.me);
router.post('/register/customers', authController.registerCustomer);
router.post('/login/customers', authController.loginCustomer);
router.get('/veryprivate', jwtValidation, (req,res,next) => {
    res.json({ok:"ok"});
})





module.exports = router;