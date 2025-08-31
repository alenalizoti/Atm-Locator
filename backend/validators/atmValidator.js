const { body } = require("express-validator");

const validateBulkAtms = [
  body("atms")
    .isArray({ min: 1 })
    .withMessage("Atms must be a non-empty array"),
  body("atms.*.atm_id").notEmpty().withMessage("ATM ID is required"),
  body("atms.*.address").notEmpty().withMessage("Address is required"),
  body("atms.*.latitude")
    .isFloat({ min: -90, max: 90 })
    .withMessage("Latitude must be a valid number"),
  body("atms.*.longitude")
    .isFloat({ min: -180, max: 180 })
    .withMessage("Longitude must be a valid number"),
  body("atms.*.bankName").notEmpty().withMessage("Bank name is required"),
];

const validateGetAtms = [
  body("latitude")
    .notEmpty()
    .withMessage("Latitude is required")
    .isFloat({ min: -90, max: 90 })
    .withMessage("Latitude must be a valid number"),

  body("longitude")
    .notEmpty()
    .withMessage("Longitude is required")
    .isFloat({ min: -180, max: 180 })
    .withMessage("Longitude must be a valid number"),

  body("count")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Count must be a positive integer"),
];

module.exports = {
  validateBulkAtms,
  validateGetAtms,
};
