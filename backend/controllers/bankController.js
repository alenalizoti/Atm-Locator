const { Bank } = require("../models");

const getBanks = async (req, res) => {
  try {
    const banks = await Bank.findAll();
    if (!banks) {
      res.status(400).json({ message: "Banks dont exist in db!" });
    }

    res
      .status(200)
      .json({ message: "Banks successfully fetched!", data: banks });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getBanks,
};
