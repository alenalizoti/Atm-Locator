const express = require("express");
const router = express.Router();
const cardController = require("../controllers/cardController");
const { validateStoreCard } = require("../validators/cardValidator");
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
  validateStoreCard,
  handleValidation,
  cardController.storeCard
);
router.post("/set/main", cardController.setMain);
router.delete("/destroy", cardController.removeCard);

module.exports = router;
