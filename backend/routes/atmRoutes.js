const express = require("express");
const router = express.Router();
const atmController = require("../controllers/atmController");
const {
  validateBulkAtms,
  validateGetAtms,
} = require("../validators/atmValidator");
const { validationResult } = require("express-validator");

const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  next();
};

// Ruta za dodavanje bankomata sa validacijom
router.post(
  "/store",
  validateBulkAtms,
  handleValidation,
  atmController.storeAtms
);
//Ruta za dodavanje najblizih bankomata
router.post(
  "/get-atms",
  validateGetAtms,
  handleValidation,
  atmController.getAtms
);
//dodavanje bankomata u favorites
router.post("/add-favorite", atmController.addFavoriteAtm);
//dohvatanje atma omocu id-a
router.get("/get-atm/:id", atmController.getAtmById);

router.delete("/remove-favorite", atmController.removeFavoriteAtm);
// router.get('/get/favorites', atmController.getFavorite)

module.exports = router;
