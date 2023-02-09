const { getUsers, getUser, updateUser, deleteUser } = require('../controllers/users.controller');
const router = require('express').Router();
const onlyAdmin = require('../middlewares/onlyAdmin.middleware');
const verifyLogin = require('../middlewares/verifyUser.middleware');

router.get('/', verifyLogin, onlyAdmin, getUsers);
router.get('/:userId', verifyLogin, onlyAdmin, getUser);
router.put('/:userId', verifyLogin, onlyAdmin,  updateUser);
router.delete('/:userId', verifyLogin, onlyAdmin, deleteUser);

module.exports = router;