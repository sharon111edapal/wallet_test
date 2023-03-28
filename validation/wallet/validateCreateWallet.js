const Validator = require("validator");
const isEmpty = require("../isEmpty");

module.exports = function validateCreateWallet(data) {
  let errors = {};

  data.userId = !isEmpty(data.userId) ? data.userId  : "";

  if (Validator.isEmpty(data.userId)) {
    errors.userId = "Invalid userId";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
