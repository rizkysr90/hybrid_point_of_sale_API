const {
  of_orders,
  Product,
  of_orders_details,
  Snap_product,
  User,
  sequelize,
} = require("../../models/index.js");
const { success } = require("../utils/response.util.js");
const { Op } = require("sequelize");
const queryInterface = sequelize.getQueryInterface();
const pagination = require("../utils/pagination.util");
const { errors: throwErr } = require("../utils/response.util.js");
const cancelled = async (req) => {
  const { transaction_id } = req.params;
  const transactionInfo = await of_orders_details.findAll({
    where: {
      ofOrderId: transaction_id,
    },
  });
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
  await of_orders.update(
    { status: "batal" },
    {
      where: {
        id: transaction_id,
      },
    }
  );
  return success(200, {}, "berhasil membatalkan transaksi");
};
const create = async (req) => {
  if (!req.body.pay_amount) {
    throwErr(400, {}, "masukkan jumlah pembayaran dengan sesuai");
  }
  const creationOrder = await of_orders.create({
    id: `TRX-${Date.now()}`,
    status: req.body.status,
    amount: req.body.amount,
    pay_amount: req.body.pay_amount,
    user_id: req.user.id,
  });
  const newArr = await Promise.all(
    req.body.products.map(async (elm, idx) => {
      let findSnap = await Snap_product.findOne({
        where: {
          product_id: elm.product_id,
        },
        order: [["createdAt", "ASC"]],
      });
      let productInfo = await Product.findOne({
        where: {
          id: elm.product_id,
        },
      });
      if (productInfo.stock <= 0) {
        throwErr(400, {}, `stok produk ${productInfo.name} habis`);
      }
      if (productInfo.stock < elm.qty) {
        throwErr(400, {}, `stok produk ${productInfo.name} tidak mencukupi`);
      }
      // change stock
      await Product.update(
        {
          stock: productInfo.stock - elm.qty,
        },
        {
          where: {
            id: elm.product_id,
          },
        }
      );
      return {
        ofOrderId: creationOrder.id,
        ProductId: elm.product_id,
        qty: elm.qty,
        sum_price_each: elm.amount,
        createdAt: new Date(),
        updatedAt: new Date(),
        snap_product_id: findSnap.id,
      };
    })
  );
  await queryInterface.bulkInsert("of_orders_details", newArr);

  return success(
    201,
    { order_id: creationOrder.id },
    "berhasil menambahkan data order"
  );
};
const getAll = async (req) => {
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
  };
  opts.limit = row;
  opts.offset = page;
  opts.order = [["createdAt", "DESC"]];
  // if search for transaction
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
      ...opts2.where,
      status: "selesai",
    };
    aggregations1 = await of_orders.findAll(opts2);
  }
  const findOrder = await of_orders.findAll(opts);
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
const getById = async (req) => {
  const opt = {
    include: [
      {
        model: User,
      },
    ],
  };
  const opt1 = {
    where: {
      ofOrderId: req.params.id,
    },
    include: [
      {
        model: Snap_product,
      },
    ],
  };
  const getOrders = await of_orders.findByPk(req.params.id, opt);
  const getOrdersDetails = await of_orders_details.findAll(opt1);
  const response = { order: getOrders, order_details: getOrdersDetails };
  return success(200, response, "sukses mendapatkan data");
};

const destroy = async (req) => {
  const { transaction_id } = req.params;
  const transactionInfo = await of_orders_details.findAll({
    where: {
      ofOrderId: transaction_id,
    },
  });
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
  await of_orders_details.destroy({
    where: {
      ofOrderId: transaction_id,
    },
  });
  await of_orders.destroy({
    where: {
      id: transaction_id,
    },
  });
  return success(200, {}, "berhasil menghapus data");
};
module.exports = {
  create,
  destroy,
  getById,
  getAll,
  cancelled,
};
