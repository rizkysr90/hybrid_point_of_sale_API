const router = require('express').Router();
const authController = require('./../controllers/auth.controller.js');
const jwtValidation = require('./../middlewares/jwt.middleware.js');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/veryprivate', jwtValidation, (req,res,next) => {
    res.json({ok:"ok"});
})





module.exports = router;