const Fuse = require("fuse.js");
const { Atm, Bank, User } = require("../models");
const cyrillicToLatin = require("cyrillic-to-latin");
const {
  normalizeBankName,
  findBankInText,
} = require("../utils/bankNameNormalizer");
const { Op } = require("sequelize");

const bankNameMap = {
  raiffeisen: "Raiffeisen",
  intesa: "Banca Intesa",
  erste: "Erste",
  otp: "OTP",
  addiko: "Addiko",
  aik: "AIK",
  unicredit: "UniCredit",
  eurobank: "Eurobank",
  komercijalna: "Komercijalna",
  mobi: "Mobi Banka",
  "credit agricole": "Credit Agricole",
  "poštanska štedionica": "Poštanska Štedionica",
  multicard: "Multicard",
  yettel: "Yettel",
};

const storeAtms = async (req, res) => {
  const { atms } = req.body;

  if (!Array.isArray(atms) || atms.length === 0) {
    return res.status(400).json({ error: "Missing or invalid data" });
  }

  try {
    const bankCache = {};
    const atmData = [];

    for (const atm of atms) {
      const { bankName, atm_id, address, latitude, longitude } = atm;

      if (
        !bankName ||
        !atm_id ||
        !address ||
        latitude == null ||
        longitude == null
      ) {
        console.warn("Preskačem ATM zbog nedostajućih podataka:", atm);
        continue;
      }

      const matchedKey = findBankInText(bankName);
      const standardName = bankNameMap[matchedKey] || "Ostalo";

      if (!standardName) {
        console.warn("Nepoznata banka:", bankName);
        continue;
      }

      let bankInstance = bankCache[standardName];

      if (!bankInstance) {
        [bankInstance] = await Bank.findOrCreate({
          where: { name: standardName },
          defaults: { name: standardName, logo_url: "blabla" },
        });
        bankCache[standardName] = bankInstance;
      }
      atmData.push({
        api_atm_id: atm_id,
        address,
        latitude,
        longitude,
        bank_id: bankInstance.id,
      });
    }
    const inserted = await Atm.bulkCreate(atmData);

    res.status(201).json({
      message: "Bankomati su uspešno obrađeni",
      insertedCount: inserted.length,
    });
  } catch (err) {
    console.error("Sequelize error:", err);
    if (err.name === "SequelizeValidationError") {
      return res.status(400).json({
        error: "Validation error",
        details: err.errors.map((e) => ({
          message: e.message,
          path: e.path,
          value: e.value,
        })),
      });
    }

    res.status(500).json({ error: err.message });
  }
};

const haversineDistance = (coords1, coords2) => {
  const toRad = (value) => (value * Math.PI) / 180;

  const R = 6371; // Zemljin poluprečnik u km
  const dLat = toRad(coords2.lat - coords1.lat);
  const dLon = toRad(coords2.lon - coords1.lon);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(coords1.lat)) *
      Math.cos(toRad(coords2.lat)) *
      Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const getAtms = async (req, res) => {
  const { count, latitude, longitude, bank, bank_id, isFavorite, user_id } =
    req.body;

  if (!latitude || !longitude) {
    return res.status(400).json({ error: "Missing parameters" });
  }

  try {
    let filter = {};

    if (bank_id) {
      filter.bank_id = bank_id;
    } else if (bank) {
      const bankInstance = await Bank.findOne({ where: { name: bank } });
      if (!bankInstance) {
        return res.status(404).json({ error: "Bank not found" });
      }
      filter.bank_id = bankInstance.id;
    }

    const include = [];

    if (isFavorite && user_id) {
      include.push({
        model: Atm,
        as: "favorite_atms",
        through: { attributes: [] },
        where: filter,
        required: true,
      });

      const user = await User.findByPk(user_id, { include });
      if (!user) {
        return res.status(404).json({ message: "Atm not found" });
      }
      const atms = user.favorite_atms;

      const result = count
        ? atms
            .map((atm) => {
              const plainAtm = atm.get();
              return {
                ...plainAtm,
                distance: haversineDistance(
                  { lat: latitude, lon: longitude },
                  { lat: plainAtm.latitude, lon: plainAtm.longitude }
                ).toFixed(2),
              };
            })
            .sort((a, b) => a.distance - b.distance)
            .slice(0, count)
        : atms;
      return res.json({ data: result });
    }
    const atms = await Atm.findAll({ where: filter });

    const result = count
      ? atms
          .map((atm) => {
            const plainAtm = atm.get();
            return {
              ...plainAtm,
              distance: haversineDistance(
                { lat: latitude, lon: longitude },
                { lat: plainAtm.latitude, lon: plainAtm.longitude }
              ).toFixed(2),
            };
          })
          .sort((a, b) => a.distance - b.distance)
          .slice(0, count)
      : atms;

    res.json({ data: result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const addFavoriteAtm = async (req, res) => {
  const { user_id, atm_id } = req.body;
  try {
    const user = await User.findOne({
      where: { id: user_id },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    const atm = await Atm.findOne({
      where: { id: atm_id },
    });

    if (!atm) {
      return res.status(404).json({ message: "ATM not found!" });
    }

    await user.addFavorite_atm(atm);

    res.status(200).json({ message: "ATM added to favorites!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const removeFavoriteAtm = async (req, res) => {
  const { user_id, atm_id } = req.body;
  try {
    const user = await User.findOne({ where: { id: user_id } });
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    const atm = await Atm.findOne({ where: { id: atm_id } });
    if (!atm) {
      return res.status(404).json({ message: "Atm not found!" });
    }

    await user.removeFavorite_atm(atm);

    res.status(200).json({ message: "Atm successfully removed!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const getAtmById = async (req, res) => {
  const id = req.params.id;
  try {
    const atm = await Atm.findOne({ where: { id } });
    if (!atm) res.json({ message: "Atm with same id not found" });
    res.json(atm);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  storeAtms,
  getAtms,
  addFavoriteAtm,
  removeFavoriteAtm,
  getAtmById,
};
