const router = require('express').Router();
const productController = require('./../controllers/product.controller');

const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })

router.post('/', upload.single('product_img'), productController.createProduct);
router.get('/', productController.getAllProduct);
router.get('/:id', productController.getProductById);
router.put('/:id', upload.single('product_img'), productController.updateProduct);
router.delete('/:id', productController.deleteProduct);
module.exports = router;