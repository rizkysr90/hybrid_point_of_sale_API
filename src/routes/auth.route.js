const router = require('express').Router();
const authController = require('./../controllers/auth.controller.js');
const jwtValidation = require('./../middlewares/jwt.middleware.js');

router.post('/register/users', authController.register);
router.post('/login/users', authController.login);
router.delete('/logout/users', authController.logout);
router.get('/me', authController.me);
router.post('/register/customers', authController.registerCustomer);
router.post('/login/customers', authController.loginCustomer);
router.get('/veryprivate', jwtValidation, (req,res,next) => {
    res.json({ok:"ok"});
})





module.exports = router;