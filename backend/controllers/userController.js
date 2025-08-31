const { User, Card, Withdrawal, Atm } = require("../models");

const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const profile = async (req, res) => {
  const user_id = req.params.id;
  try {
    const user = await User.findByPk(user_id, {
      include: [Card, Withdrawal],
    });

    if (!user) return res.status(400).json({ message: "User not found!" });
    res
      .status(200)
      .json({ message: "User profile successfully fetched", user });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

const editUser = async (req, res) => {
  const id = req.params.id;
  const { fullName } = req.body;
  try {
    const user = await User.findOne({ where: { id: id } });

    if (!user) {
      return res.status(400).json({ message: "User not found!" });
    }

    const [firstName, lastName] = fullName.split(" ");
    user.first_name = firstName;
    user.last_name = lastName;

    await user.save();

    res.status(200).json({ message: "User successfully updated!" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getCards = async (req, res) => {
  const user_id = req.params.id;

  try {
    // Check if user exists (optional but good practice)
    const user = await User.findOne({ where: { id: user_id } });
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    // Fetch cards for the user
    const cards = await Card.findAll({ where: { user_id } });

    res.status(200).json({ message: "User cards successfully fetched", cards });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getAllUsers,
  profile,
  editUser,
  getCards,
};
