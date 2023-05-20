module.exports = (phone) => {
  if (phone.substring(0, 2) === "08") {
    phone = "62" + phone.substring(1);
  }
  return phone;
};
