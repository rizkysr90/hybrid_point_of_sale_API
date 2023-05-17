const {
  create,
  getById,
  getAll,
  cancelled,
} = require("./../services/of_order.service");

const createOrder = async (req, res, next) => {
  try {
    const response = await create(req);
    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
};

const getOrderById = async (req, res, next) => {
  try {
    const response = await getById(req);
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};
const getAllOrder = async (req, res, next) => {
  try {
    const response = await getAll(req);
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};
const destroyOrder = async (req, res, next) => {
  try {
    const response = await cancelled(req);
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  getOrderById,
  getAllOrder,
  destroyOrder,
};
