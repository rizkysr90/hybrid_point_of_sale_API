const { getUsers, getUser, updateUser, deleteUser } = require('../controllers/users.controller');
const router = require('express').Router();


router.get('/', getUsers);
router.get('/:userId', getUser);
router.put('/:userId', updateUser);
router.delete('/:userId', deleteUser);

module.exports = router;