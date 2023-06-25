const { validationResult } = require("express-validator");

const validator = (req, res, next) => {
  // Finds the validation errors in this request and wraps them in an object with handy functions
  const errors = validationResult(req);
  const listError = errors.array();
  console.log(errors);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      metadata: {
        status: 400,
        msg: listError[0]?.msg,
      },
      data: {},
    });
  } else {
    next();
  }
};

module.exports = validator;
