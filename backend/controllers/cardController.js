const { Card } = require("../models");

const storeCard = async (req, res) => {
  const { user_id, bank_id, card_number, card_type, expiration_date, cvv } =
    req.body;
  try {
    const existingCard = await Card.findOne({
      where: {
        card_number,
        user_id,
      },
    });

    let is_main = true;
    const existingCardByUser = await Card.findOne({
      where: { user_id: user_id },
    });
    if (existingCardByUser) is_main = false;
    if (existingCard)
      return res.status(400).json({ message: "Card alredy exists!" });
    const newCard = await Card.create({
      user_id,
      bank_id,
      card_number,
      card_type,
      expiration_date,
      cvv,
      is_main,
    });

    return res.status(201).json({
      message: "Card successfully created!",
      card: newCard,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

const setMain = async (req, res) => {
  const { card_id, user_id } = req.body;
  try {
    const card = await Card.findOne({ where: card_id });

    if (!card) {
      return res.status(400).json({ message: "Card not found!" });
    }
    await Card.update({ is_main: false }, { where: { user_id: user_id } });
    card.is_main = true;
    await card.save();

    res.status(200).json({ message: "Main card set successfully!" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const removeCard = async (req, res) => {
  const { card_id, user_id } = req.body;
  try {
    const card = await Card.findOne({
      where: {
        user_id,
        id: card_id,
      },
    });
    if (!card) {
      return res.status(404).json({ message: "Card not found!" });
    }
    await card.destroy();
    res.status(200).json({ message: "Card removed successfully!" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  storeCard,
  setMain,
  removeCard,
};
