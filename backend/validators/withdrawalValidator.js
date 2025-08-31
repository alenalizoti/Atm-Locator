const { body } = require("express-validator");

const validateWithdrawal = [
  body("user_id")
    .notEmpty()
    .withMessage("User ID is required")
    .isInt({ min: 1 })
    .withMessage("User ID must be a valid number"),

  body("card_id")
    .notEmpty()
    .withMessage("Card ID is required")
    .isInt({ min: 1 })
    .withMessage("Card ID must be a valid number"),

  body("atm_id")
    .notEmpty()
    .withMessage("ATM ID is required")
    .isInt({ min: 1 })
    .withMessage("ATM ID must be a valid number"),

  body("amount")
    .notEmpty()
    .withMessage("Amount is required")
    .isFloat({ gt: 0 })
    .withMessage("Amount must be a positive number"),

  body("method")
    .notEmpty()
    .withMessage("Withdrawal method is required")
    .isIn(["PIN", "QR"])
    .withMessage('Method must be either "cash" or "digital"'),
];

module.exports = {
  validateWithdrawal,
};
