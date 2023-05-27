const router = require("express").Router();
const cartController = require("./../controllers/cart.controller");
const verifyCust = require("../middlewares/verifyCust.middleware");

router.get("/count", verifyCust, cartController.countProductInCart);
router.post("/add", verifyCust, cartController.addProductInCart);
router.get("/", verifyCust, cartController.getProductInCart);
router.put("/update/products", verifyCust, cartController.updateQtyInCart);
router.delete(
  "/remove/products/:ProductId",
  verifyCust,
  cartController.removeProductInCart
);

module.exports = router;
