const router = require("express").Router();
const on_order_controller = require("./../controllers/on_order.controller");
const verifyLogin = require("./../middlewares/verifyCust.middleware");
const verifyAuth = require("./../middlewares/verifyLogin.middleware");
const verifyAdmin = require("./../middlewares/verifyUser.middleware");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

router.post("/", on_order_controller.createOrder);
router.get("/", on_order_controller.getMyOrder);
router.get("/finish", on_order_controller.getFinishOrder);
router.get("/all", verifyAdmin, on_order_controller.getAllOrder);
router.get("/:id", verifyLogin, on_order_controller.getOrderById);
router.get("/:id/admin", verifyAdmin, on_order_controller.getOrderById);
router.put(
  "/payment",
  verifyLogin,
  upload.single("evidence_of_tf"),
  on_order_controller.updatePaymentOrder
);
router.put("/verify", verifyAdmin, on_order_controller.verifyOrder);
router.delete("/:transaction_id", verifyAdmin, on_order_controller.cancelOrder);
module.exports = router;
