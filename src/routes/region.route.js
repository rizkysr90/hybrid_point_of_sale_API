const router = require('express').Router();
const regionController = require('./../controllers/region.controller');


router.get('/getProvince', regionController.findProvince);
router.get('/getState/:id', regionController.findState);
router.get('/getDistrict/:id', regionController.findDistrict);
router.get('/getVillage/:id', regionController.findVillage);

module.exports = router;

