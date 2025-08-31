const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.get("/", userController.getAllUsers);
router.get("/profile/:id", userController.profile); // kartice, podaci o korisniku, istorija withdrawals, omiljeni bankomati
router.put("/update/:id", userController.editUser);

module.exports = router;
