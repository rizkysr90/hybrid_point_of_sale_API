const router = require("express").Router();
const productController = require("./../controllers/product.controller");
const verifyLogin = require("./../middlewares/verifyUser.middleware");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const validate = require("../middlewares/validator.middleware");
const { body } = require("express-validator");
router.post(
  "/",
  verifyLogin,
  body([
    "name",
    "product_category_id",
    "stock",
    "product_weight",
    "buy_price",
    "sell_price",
  ])
    .notEmpty()
    .bail()
    .withMessage("field dengan keterangan wajib, wajib diisi"),
  validate,
  upload.single("product_img"),
  productController.createProduct
);
router.get("/summary", productController.summaryStock);
router.get("/summaryexcel", productController.summaryExcel);
router.get("/", productController.getAllProduct);
router.get("/new", productController.getNewProd);
router.get("/:id", productController.getProductById);
router.put(
  "/:id",
  verifyLogin,
  (req, res, next) => {
    next();
  },
  upload.single("product_img"),
  body([
    "name",
    "product_category_id",
    "stock",
    "product_weight",
    "buy_price",
    "sell_price",
  ])
    .notEmpty()
    .bail()
    .withMessage("field dengan keterangan wajib, wajib diisi"),
  validate,
  productController.updateProduct
);
router.delete("/:id", verifyLogin, productController.deleteProduct);
router.patch("/archive/:id", verifyLogin, productController.archiveProduct);
module.exports = router;
