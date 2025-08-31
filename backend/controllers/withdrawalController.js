const { Withdrawal } = require("../models");
const crypto = require("crypto");
const { Op } = require("sequelize");
const QRCode = require("qrcode");

const store = async (req, res) => {
  const { user_id, card_id, atm_id, amount, method, receipt } = req.body;
  try {
    let token = null
    const expires_at = new Date(Date.now() + 60 * 60 * 1000);

    if(method === 'QR')
    {
      token =  crypto.randomBytes(5).toString("hex");
    }else if(method == 'PIN'){
      token = crypto.randomInt(10000, 100000).toString()
    }else{
      return res.status(400).json({message : 'Method not selected!'})
    }

    await Withdrawal.create({
      user_id,
      card_id,
      atm_id,
      amount,
      method,
      token,
      expires_at,
      receipt
    });

    return res
      .status(201)
      .json({
        message: "Withdrawal created successfully!",
        token,
        expires_at,
      });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

const getAll = async (req, res) => {
  try {
    const user_id = req.params.id;
    const withdrawals = await Withdrawal.findAll({
      where: {
        user_id,
      },
    });
    if (!withdrawals)
      return res.status(404).json({ message: "Withdrawals not found!" });
    console.log(withdrawals)

    res
      .status(200)
      .json({ message: "Withdrawals successfully fetched", data: withdrawals });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getUsed = async (req, res) => {
  const user_id = req.params.id;
  try {
    const usedWithdrawals = await Withdrawal.findAll({
      where: {
        is_used: true,
        user_id,
      },
    });
    if (!usedWithdrawals) {
      res.status(400).json({ message: "There are not used withdrawals!" });
    }

    res
      .status(200)
      .json({
        message: "Used withdrawals successfully fetched",
        data: usedWithdrawals,
      });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getActive = async (req, res) => {
  const user_id = req.params.id;
  try {
    const now = new Date();
    const activeWithdrawals = await Withdrawal.findAll({
      where: {
        user_id: user_id,
        is_used: false,
        expires_at: {
          [Op.gt]: now,
        },
      },
    });

    if (!activeWithdrawals) {
      return res.status(400).json({ message: "No active withdrawals!" });
    }

    const withdrawalsWithQR = await Promise.all(
      activeWithdrawals.map(async (element) => {
        const qrCode = await QRCode.toDataURL(element.token);

        return {
          ...element.toJSON(),
          qrCode,
        };
      })
    );
    res
      .status(200)
      .json({
        message: "Active withdrawals successfully fetched",
        data: withdrawalsWithQR,
      });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const removeWithdrawal = async(req,res) => {
  const withdrawal_id = req.params.id
  try{
    if(isNaN(withdrawal_id)){
      return res.status(400).json({message : 'Withdrawal id must be number!'})
    }
    const withdrawal = await Withdrawal.findOne({
      where : {id : withdrawal_id}
    })

    if(!withdrawal){
      return res.status(404).json({message : 'Withdrawal not found!'})
    }

    await withdrawal.destroy()
    res.status(200).json({message : 'Withdrawal deleted successfully!'})
  }catch(err){
    res.status(500).json({error : err.message})
  }
  
}

module.exports = {
  store,
  getUsed,
  getActive,
  getAll,
  removeWithdrawal
};
