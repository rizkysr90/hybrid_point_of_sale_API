require("dotenv").config();
const express = require("express");
const session = require("express-session");
const { sequelize: configDb } = require("./models/index.js");
const sequelizeStore = require("connect-session-sequelize");
const morgan = require("morgan");
const cors = require("cors");
const app = express();
const authRoutes = require("./src/routes/auth.route.js");
const verifyUser = require("./src/middlewares/verifyUser.middleware.js");
const usersRoutes = require("./src/routes/users.route.js");
const productCategoriesRoutes = require("./src/routes/productCategory.route.js");
const productRoutes = require("./src/routes/product.route");
const of_orders = require("./src/routes/of_order.route");
const on_orders = require("./src/routes/on_order.route");
const regionRoutes = require("./src/routes/region.route");
const customerRoutes = require("./src/routes/customer.route");
const cartRoutes = require("./src/routes/cart.route");

const sessionStore = sequelizeStore(session.Store);
const store = new sessionStore({
  db: configDb,
});
app.use(morgan("tiny"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    credentials: true,
    origin: [
      "http://localhost:3001",
      "https://pos-skripsi-ui.vercel.app",
      "https://ecommerce-skripsi.vercel.app",
    ],
  })
);
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: store,
    cookie: {
      secure: "true",
      httpOnly: true,
      sameSite: "none",
      maxAge: 3 * 24 * 60 * 60 * 1000, //user won't have to login for 3 days
    },
  })
);
app.get("/", (req, res) => {
  res.json("Hello World");
});
app.use("/regions", regionRoutes);
app.use("/customers", customerRoutes);
app.use("/auth", authRoutes);
app.use("/users", usersRoutes);
app.use("/carts", cartRoutes);
app.use("/productCategories", productCategoriesRoutes);
app.use("/products", productRoutes);
app.use("/ofOrders", of_orders);
app.use("/onOrders", on_orders);
app.get("/tes", (req, res, next) => {
  res.status(200).json("Helllo mang");
});
app.get("/getAdmin", verifyUser, (req, res, next) => {
  res.status(200).json({
    msg: "ok",
  });
});
// app.get
app.use((err, req, res, next) => {
  console.error(err);
  const statusCode = err.error_code || 500;
  const data = err.data || {};
  const resBody = {
    metadata: {
      status: statusCode,
      msg: err.message,
    },
    data,
  };
  res.status(statusCode).json(resBody);
});

module.exports = { store, app };
