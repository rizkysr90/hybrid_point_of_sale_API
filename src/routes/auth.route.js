const router = require("express").Router();
const authController = require("./../controllers/auth.controller.js");
const jwtValidation = require("./../middlewares/jwt.middleware.js");
const { body, param } = require("express-validator");
const validator = require("./../middlewares/validator.middleware");
const onlyAdmin = require("../middlewares/onlyAdmin.middleware");
const verifyLogin = require("../middlewares/verifyUser.middleware");

router.post(
  "/register/users",
  verifyLogin,
  onlyAdmin,
  body([
    "name",
    "email",
    "password",
    "role",
    "confirm_password",
    "phone_number",
  ])
    .notEmpty()
    .withMessage("data tidak boleh ada yang kosong")
    .bail(),
  body("password")
    .isLength({ min: 8 })
    .withMessage("minimal panjang password 8 karakter")
    .bail(),
  validator,
  authController.register
);
router.post(
  "/login/users",
  body("email").isEmail().withMessage("email tidak valid").bail(),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Minimal panjang password 8 karakter"),
  validator,
  authController.login
);
router.delete("/logout/users", authController.logout);
router.get("/me", authController.me);

router.post(
  "/register/customers",
  body("email").notEmpty().withMessage("email tidak boleh kosong").bail(),
  body("password").notEmpty().withMessage("password tidak boleh kosong").bail(),
  body("email").isEmail().withMessage("email tidak valid").bail(),
  body("password")
    .isLength({ min: 8 })
    .withMessage("minimal panjang password 8 karakter")
    .bail(),
  validator,
  authController.registerCustomer
);

router.post(
  "/refreshOtp/registration",
  body("email").notEmpty().withMessage("email tidak boleh kosong").bail(),
  body("id").notEmpty().withMessage("id tidak boleh kosong").bail(),
  body("email").isEmail().withMessage("email tidak valid").bail(),
  validator,
  authController.refreshOtp
);
router.post(
  "/newCust/validation",
  body("email").notEmpty().withMessage("email tidak boleh kosong").bail(),
  body("id").notEmpty().withMessage("id tidak boleh kosong").bail(),
  body("otp").notEmpty().withMessage("otp tidak boleh kosong").bail(),
  body("email").isEmail().withMessage("email tidak valid").bail(),
  body("otp")
    .isLength({ max: 4 })
    .withMessage("maksimal panjang otp 4 karakter")
    .bail(),
  validator,
  authController.verifyNewCust
);
router.post(
  "/login/customers",
  body("email").notEmpty().withMessage("email tidak boleh kosong").bail(),
  body("password").notEmpty().withMessage("password tidak boleh kosong").bail(),
  body("email").isEmail().withMessage("email tidak valid").bail(),
  validator,
  authController.loginCustomer
);

router.post(
  "/forgot-password",
  body("email").notEmpty().withMessage("email tidak boleh kosong").bail(),
  body("email").isEmail().withMessage("email tidak valid").bail(),
  validator,
  authController.forgotPassword
);
router.get(
  "/forgot-password/:userId/:token",
  param("token").notEmpty().withMessage("token tidak boleh kosong").bail(),
  param("userId").notEmpty().withMessage("user id tidak boleh kosong").bail(),
  param("token").isJWT().withMessage("token tidak valid").bail(),
  param("userId").isNumeric().withMessage("user id tidak valid").bail(),
  validator,
  authController.verifyForgotPass
);
router.post(
  "/forgot-password/:userId/:token",
  param("token").notEmpty().withMessage("token tidak boleh kosong").bail(),
  param("userId").notEmpty().withMessage("user id tidak boleh kosong").bail(),
  body("password").notEmpty().withMessage("password tidak boleh kosong").bail(),
  body("confirm_password")
    .notEmpty()
    .withMessage("password tidak boleh kosong")
    .bail(),
  param("token").isJWT().withMessage("token tidak valid").bail(),
  param("userId").isNumeric().withMessage("user id tidak valid").bail(),
  validator,
  authController.resetPassword
);
router.get("/veryprivate", jwtValidation, (req, res, next) => {
  res.json({ ok: "ok" });
});

module.exports = router;
