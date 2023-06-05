const {
  On_order,
  Customer,
  Cart,
  Cart_detail,
  Product,
  On_orders_detail,
  sequelize,
} = require("../../models/index.js");
const convertToCountryCode = require("./../utils/sanitizeCountryCodePhone.js");
const { errors: throwError, success } = require("../utils/response.util");
const queryInterface = sequelize.getQueryInterface();
const { Op } = require("sequelize");
const pagination = require("../utils/pagination.util");
const cloudinary = require("../utils/cloudinary.util");
const uploaderImg = async (path, opts) =>
  await cloudinary.uploadCloudinary(path, opts);

const getSuccessOrder = async (req) => {
  let { startDate, endDate } = req.query;
  let { search } = req.query;

  if (!search) {
    [startDate] = startDate.split("T");
    [endDate] = endDate.split("T");
    startDate = startDate + " " + "00:00:00.000";
    endDate = endDate + " " + "23:59:59.999";
  }
  let { offset } = req.query;
  let { page, row } = pagination(offset, 20);
  let opts = {};
  let opts2 = {};
  opts.where = {
    createdAt: {
      [Op.between]: [startDate, endDate],
    },
    [Op.or]: [
      {
        status: "selesai",
      },
      {
        status: "batal",
      },
    ],
  };
  opts.limit = row;
  opts.offset = page;
  opts.order = [["createdAt", "DESC"]];
  if (search) {
    opts.where = {
      id: search,
    };
  }
  // for meta data required
  let aggregations1 = null;
  if (req.query?.meta) {
    opts2 = { ...opts, order: null, limit: null, offset: null };
    opts2.attributes = [
      [sequelize.fn("SUM", sequelize.col("amount")), "sum_of_orders"],
      [sequelize.fn("COUNT", sequelize.col("id")), "count_of_orders"],
    ];
    opts2.where = {
      createdAt: {
        [Op.between]: [startDate, endDate],
      },
      [Op.or]: [
        {
          status: "selesai",
        },
      ],
    };
    aggregations1 = await On_order.findAll(opts2);
  }

  const findOrder = await On_order.findAll(opts);
  let getSumOrderValue = aggregations1
    ? aggregations1[0].dataValues.sum_of_orders
    : null;
  let getCountOrderValue = aggregations1
    ? aggregations1[0].dataValues.count_of_orders
    : null;
  let response = {
    orders: findOrder,
    meta: {
      sum_of_orders: getSumOrderValue,
      count_of_orders: getCountOrderValue,
      page: req.query.offset,
      row: 20,
    },
  };

  return success(200, response, "berhasil mendapatkan data");
};
const processOrder = async (req) => {
  const { orderId } = req.body;
  const { onProcess, readyPickup, finish } = req.query;
  let status = "";
  if (onProcess) {
    status = "diproses";
  }
  if (readyPickup) {
    status = "ready_to_pickup";
  }
  if (finish) {
    status = "selesai";
  }
  const findOrder = await On_order.findOne({
    where: {
      id: orderId,
    },
  });
  if (!findOrder) {
    throwError(404, {}, "order tidak ditemukan");
  }
  await On_order.update(
    {
      status,
    },
    {
      where: {
        id: orderId,
      },
    }
  );
  return success(200, {}, "berhasil memproses pesanan");
};
const create = async (req) => {
  // Verifikasi validasi produk
  const sanitasiNomorHp = convertToCountryCode(req.body.whatsapp);
  let orderedProductId = [];
  req.body.products.forEach((elm) => {
    orderedProductId.push(elm.id);
  });
  let findOrderedProducts = await Product.findAll({
    where: {
      id: {
        [Op.in]: orderedProductId,
      },
    },
  });
  if (findOrderedProducts.length !== orderedProductId.length) {
    throwError(404, {}, "produk tidak ditemukan");
  }

  findOrderedProducts.forEach((elm, idx) => {
    if (elm.stock < req.body.products[idx].Cart_detail.qty) {
      throwError(400, {}, "produk habis");
    }
    if (!elm.is_active || !elm.is_sold_online) {
      throwError(400, {}, "produk tidak aktif");
    }
  });
  let idOrder = "";
  for (let i = 0; i < 3; i++) {
    idOrder += `${Math.floor(Math.random() * 10)}`;
  }
  await Promise.all(
    req.body.products.map(async (elm, idx) => {
      // console.log(elm);
      // console.log(findOrderedProducts[idx]);
      await Product.update(
        {
          stock:
            Number(findOrderedProducts[idx].stock) -
            Number(elm.Cart_detail.qty),
        },
        {
          where: {
            id: elm.id,
          },
        }
      );
    })
  );

  let unixTime = String(Date.now()).slice(-3);
  const creationOrder = await On_order.create({
    id: `${req.session.customerId}-${idOrder}-${unixTime}`,
    CustomerId: req.session.customerId,
    notes: req.body.notes,
    status: req.body.status,
    amount: req.body.amount,
    pay_status: req.body.pay_status,
    evidence_of_tf: req.body.evidence_of_tf,
    shipping_method: req.body.shipping_method,
    shipping_distance: req.body.shipping_distance,
    shipping_address: req.body.shipping_address,
    qty_product: req.body.qty_product,
    whatsapp: sanitasiNomorHp,
    lat: req.body.lat,
    lng: req.body.lng,
    pay_method: req.body.pay_method,
  });
  let newArr = [];
  newArr = req.body.products.map((elm, idx) => {
    return {
      OnOrderId: creationOrder.id,
      ProductId: elm.id,
      qty: elm.Cart_detail.qty,
      sum_price_each: elm.Cart_detail.qty * elm.sell_price,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  });
  const findMyCart = await Cart.findOne({
    where: {
      customer_id: req.session.customerId,
    },
  });
  await Cart_detail.destroy({
    where: {
      CartId: findMyCart.id,
      deletedAt: null,
    },
  });
  await queryInterface.bulkInsert("On_orders_details", newArr);
  return success(
    201,
    { orderId: creationOrder.id },
    "berhasil menambahkan data order"
  );

  // return success(201, {order_id : creationOrder.id}, 'berhasil menambahkan data order');
};
const updatePayment = async (req) => {
  if (!req.file) {
    throwError(400, {}, "mohon lampirkan bukti transfer");
  }
  if (!req.session.customerId) {
    throwError(401, {}, "anda tidak memiliki akses");
  }
  const findTransaction = await On_order.findByPk(req.body.orderId);
  if (!findTransaction) {
    throwError(404, {}, "data transaksi tidak ditemukan");
  }
  if (findTransaction.dataValues.CustomerId !== req.session.customerId) {
    throwError(401, {}, "anda tidak memiliki akses");
  }
  if (findTransaction.dataValues.pay_status) {
    throwError(400, {}, "transaksi sudah dibayar");
  }
  const optionsCloudinary = {
    type: "image",
    folder: "skripsi/images/bukti_tf",
  };
  const up = await uploaderImg(req.file.path, optionsCloudinary);
  const { eager } = up;
  const secure_url = eager[0].secure_url;

  await On_order.update(
    {
      status: "dibayar",
      evidence_of_tf: secure_url,
      paidAt: new Date(),
    },
    {
      where: {
        id: req.body.orderId,
      },
    }
  );
  return success(200, {}, "berhasil mengupload bukti pembayaran");
};
const getAllAdmin = async (req) => {
  if (!req.session.userId) {
    throwError(401, {}, "anda tidak memiliki akses");
  }
  const { page, row } = pagination(req.body.page, req.body.row);
  const opt = {
    order: [["createdAt", "DESC"]],
    include: [
      {
        model: Product,
        attributes: ["id", "name", "url_img"],
      },
      {
        model: Customer,
        attributes: ["id", "email"],
      },
    ],
    attributes: [
      "id",
      "createdAt",
      "amount",
      "qty_product",
      "pay_status",
      "status",
      "shipping_method",
      "pay_method",
    ],
    limit: row,
    offset: page,
  };
  const getData = await On_order.findAll(opt);
  return success(200, getData, "sukses mendapatkan data");
};
const getAll = async (req) => {
  if (!req.session.customerId) {
    throwError(401, {}, "anda tidak memiliki akses");
  }
  const { page, row } = pagination(req.body.page, req.body.row);
  const opt = {
    where: {
      CustomerId: req.session.customerId,
    },
    order: [["createdAt", "DESC"]],
    include: [
      {
        model: Product,
        attributes: ["id", "name", "url_img"],
      },
    ],
    attributes: [
      "id",
      "createdAt",
      "amount",
      "qty_product",
      "pay_status",
      "status",
      "shipping_method",
      "pay_method",
    ],
    limit: row,
    offset: page,
  };
  const getData = await On_order.findAll(opt);
  return success(200, getData, "sukses mendapatkan data");
};

const getById = async (req) => {
  // req.params.id
  const opt = {
    include: [
      {
        model: Product,
      },
    ],
  };
  const getData = await On_order.findByPk(req.params.id, opt);
  return success(200, getData, "sukses mendapatkan data");
};
const cancelled = async (req) => {
  const { transaction_id } = req.params;
  const findTrx = await On_order.findOne({
    where: {
      id: transaction_id,
    },
  });
  if (!findTrx) {
    // kalo transaksi tidak ditemukan
    throwError(404, {}, "transaksi tidak ditemukan");
  }
  if (findTrx.status === "batal") {
    throwError(
      400,
      {},
      "gagal membatalkan, transaksi sudah dibatalkan sebelumnya"
    );
  }
  const transactionInfo = await On_orders_detail.findAll({
    where: {
      OnOrderId: transaction_id,
    },
  });
  if (transactionInfo)
    if (transactionInfo) {
      await Promise.all(
        transactionInfo.map(async (elm) => {
          let productInfo = await Product.findOne({
            where: {
              id: elm.ProductId,
            },
          });
          // change stock
          await Product.update(
            {
              stock: productInfo.stock + elm.qty,
            },
            {
              where: {
                id: elm.ProductId,
              },
            }
          );
        })
      );
    }
  await On_order.update(
    { status: "batal", pay_status: false },
    {
      where: {
        id: transaction_id,
      },
    }
  );
  return success(200, {}, "berhasil membatalkan transaksi");
};

module.exports = {
  create,
  getAll,
  getById,
  getAllAdmin,
  updatePayment,
  processOrder,
  getSuccessOrder,
  cancelled,
};
