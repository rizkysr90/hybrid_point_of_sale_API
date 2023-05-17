const { User } = require("../../models/index.js");
const { errors: throwError, success } = require("../utils/response.util.js");
const { hash } = require("../utils/bcrypt.util.js");

const get = async () => {
  const getUsers = await User.findAll();
  return success(200, getUsers, "sukses mendapatkan data", {
    attributes: { exclude: ["password"] },
  });
};
const getById = async (req) => {
  const { userId } = req.params;
  const getUser = await User.findByPk(userId, {
    attributes: {
      exclude: ["password"],
    },
  });
  if (!getUser) {
    throwError(404, {}, "data pengguna tidak ditemukan");
  }
  return success(200, getUser, "sukses mendapatkan data");
};
const update = async (req) => {
  let { name, email, phone_number, password, confirm_password, role } =
    req.body;
  const { userId } = req.params;
  let findUser = await User.findByPk(userId);
  let isUnique = true;
  if (email !== findUser.email) {
    if (
      await User.findOne({
        where: {
          email,
        },
      })
    ) {
      isUnique = false;
    }
  }
  if (phone_number !== findUser.phone_number) {
    if (
      await User.findOne({
        where: {
          phone_number,
        },
      })
    ) {
      isUnique = false;
    }
  }
  if (!isUnique) {
    throwError(400, {}, "email atau nomor hp sudah pernah digunakan");
  }
  if (password) {
    if (confirm_password !== password) {
      throwError(400, {}, "konfirmasi password tidak sesuai");
    }
    let hashedPassword = await hash(password);
    password = hashedPassword;
  }
  let dataToBeUpdated = {
    name,
    email,
    password,
    role,
    phone_number,
  };
  await User.update(dataToBeUpdated, {
    where: {
      id: userId,
    },
  });
  return success(200, {}, "sukses update data user");
};

const destroy = async (req) => {
  const { userId } = req.params;
  await User.destroy({
    where: {
      id: userId,
    },
  });
  return success(200, {}, "berhasil menghapus pengguna");
};

module.exports = {
  get,
  getById,
  update,
  destroy,
};
