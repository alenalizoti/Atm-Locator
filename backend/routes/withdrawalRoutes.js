const { Withdrawal } = require("../models");
const express = require("express");
const router = express.Router();
const withdrawalController = require("../controllers/withdrawalController");
const { validateWithdrawal } = require("../validators/withdrawalValidator");
const { validationResult } = require("express-validator");

const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  next();
};

router.post(
  "/store",
  validateWithdrawal,
  handleValidation,
  withdrawalController.store
);
router.get("/all/:id", withdrawalController.getAll);
router.get("/used/:id", withdrawalController.getUsed);
router.get("/active/:id", withdrawalController.getActive);
router.delete("/destroy/:id", withdrawalController.removeWithdrawal);

module.exports = router;
