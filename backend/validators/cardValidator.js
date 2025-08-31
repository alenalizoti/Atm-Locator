const { body } = require("express-validator");

const validateStoreCard = [
  body("user_id")
    .notEmpty()
    .withMessage("Latitude is required")
    .isInt({ min: 1 })
    .withMessage("User_id must be a valid number"),

  body("bank_id")
    .notEmpty()
    .withMessage("Bank_id is required")
    .isInt({ min: 1 })
    .withMessage("Bank_id must be a valid number"),

  body("card_number")
    .notEmpty()
    .isString()
    .withMessage("Card number must have 16 numbers!")
    .isLength({ min: 16, max: 16 })
    .withMessage("Card number must be exactly 19 characters"),

  body("card_type")
    .notEmpty()
    .withMessage("Card type is required")
    .isString()
    .withMessage("Card type must be a string")
    .isLength({ min: 3 })
    .withMessage("Card type must be at least 3 characters long"),

  body("expiration_date")
    .notEmpty()
    .withMessage("Expiration date is required")
    .isISO8601()
    .withMessage("Expiration date must be a valid date")
    .custom((value) => {
      const inputDate = new Date(value);
      const today = new Date();
      if (inputDate < today) {
        throw new Error("Expiration date must be in the future");
      }
      return true;
    }),

  body("cvv")
    .notEmpty()
    .withMessage("CVV is required")
    .isLength({ min: 3, max: 4 })
    .withMessage("CVV must be 3 or 4 digits")
    .matches(/^\d+$/)
    .withMessage("CVV must contain only numbers"),
];

module.exports = {
  validateStoreCard,
};
