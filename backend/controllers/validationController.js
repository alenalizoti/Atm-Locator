const { Withdrawal } = require("../models");
const crypto = require("crypto");

const validateQr = async (req, res) => {
  const { token, atmId, validationNumber } = req.body;
  const io = req.app.get("io");
  const userSocketMap = req.app.get("userSocketMap");

  try {
    const withdrawal = await Withdrawal.findOne({
      where: { token: token, atm_id: atmId },
    });
    if (!withdrawal) {
      return res.status(404).json({ message: "Token not found on that atm!" });
    }
    if (withdrawal.expires_at < new Date()) {
      return res.status(404).json({ message: "Token expired!" });
    }
    if (withdrawal.is_used == true) {
      return res.status(404).json({ message: "Token has been used!" });
    }

    const userId = withdrawal.user_id;
    const socketId = userSocketMap[userId];
    console.log(userSocketMap)

    let num1 = validationNumber;
    let num2 = validationNumber;

    while (
      num1 == validationNumber ||
      num2 == validationNumber ||
      num1 == num2
    ) {
      num1 = crypto.randomInt(1, 100);
      num2 = crypto.randomInt(1, 100);
    }
    let arrayOfNums = [];
    arrayOfNums.push(num1, num2, validationNumber);
    arrayOfNums.sort(() => Math.random() - 0.5);

    if (socketId) {
      const socket = io.sockets.sockets.get(socketId);

      if (socket) {
        socket.emit("validationArray", { arrayOfNums });
        socket.once("selectedNumber", async (data) => {
          const selected = data.selectedNumber;

          const isMatch = selected === validationNumber;
          console.log(`User selected: ${selected}, Match: ${isMatch}`);
          if (isMatch)
            await Withdrawal.update(
              { is_used: true },
              { where: { id: withdrawal.id } }
            );

          res
            .status(200)
            .json({
              code: isMatch ? 1 : 0,
              message: isMatch
                ? "Transaction successfully executed!"
                : "User pressed wrong number!",
              amount: withdrawal.amount,
              receipt: withdrawal.receipt,
            });
        });
      }
    } else {
      console.log(`No active socket found for user ${userId}`);
      res.status(200).json({ code: -1, message: "User disconnected!" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  validateQr,
};
