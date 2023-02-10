const router = require('express').Router();
const productController = require('./../controllers/product.controller');
const verifyLogin = require('./../middlewares/verifyUser.middleware');
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })

router.post('/', upload.single('product_img'), productController.createProduct);
router.get('/',  productController.getAllProduct);
router.get('/:id', productController.getProductById);
router.put('/:id', verifyLogin, upload.single('product_img'), productController.updateProduct);
router.delete('/:id', verifyLogin, productController.deleteProduct);
router.patch('/archive/:id', verifyLogin, productController.archiveProduct);
module.exports = router;