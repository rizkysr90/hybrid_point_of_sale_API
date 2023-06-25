const {
  create,
  getAll,
  getById,
  update,
  destroy,
  archive,
  getNewProduct,
  getSummaryStock,
} = require("./../services/product.service");
const XLSX = require("xlsx");
const fs = require("fs");
const stringify = require("csv-stringify").stringify;

const createProduct = async (req, res, next) => {
  try {
    const response = await create(req);
    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
};

const getAllProduct = async (req, res, next) => {
  try {
    const response = await getAll(req);
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};
const getProductById = async (req, res, next) => {
  try {
    const response = await getById(req);
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};
const summaryStock = async (req, res, next) => {
  try {
    const response = await getSummaryStock(req);
    stringify(
      response.data,
      {
        header: true,
        columns: ["name", "stock"],
      },
      function (err, str) {
        const path = "./files/" + Date.now() + ".csv";
        if (!fs.existsSync("./files")) {
          fs.mkdirSync("./files");
        }
        fs.writeFile(path, str, function (err) {
          if (err) {
            console.error(err);
            return res
              .status(400)
              .json({ success: false, message: "An error occurred" });
          }

          res.status(200).download(path, "Laporan Stok Produk.csv");
        });
      }
    );
    // res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

const summaryExcel = async (req, res, next) => {
  try {
    const response = await getSummaryStock(req);
    const newArr = response.data.map((elm) => {
      return elm.dataValues;
    });
    const workSheet = XLSX.utils.json_to_sheet(newArr);

    const workBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workBook, workSheet, "Sheet 1");
    const path = "./temp/" + Date.now() + ".xlsx";
    if (!fs.existsSync("./temp")) {
      fs.mkdirSync("./temp");
    }
    XLSX.writeFile(workBook, path);
    res.status(200).download(path, "Laporan Stok Produk.xlsx");
  } catch (error) {
    next(error);
  }
};
const getNewProd = async (req, res, next) => {
  try {
    const response = await getNewProduct(req);
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};
const updateProduct = async (req, res, next) => {
  try {
    const response = await update(req);
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};
const deleteProduct = async (req, res, next) => {
  try {
    const response = await destroy(req);
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};
const archiveProduct = async (req, res, next) => {
  try {
    const response = await archive(req);
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};
module.exports = {
  createProduct,
  getAllProduct,
  getProductById,
  updateProduct,
  deleteProduct,
  summaryStock,
  archiveProduct,
  getNewProd,
  summaryExcel,
};
