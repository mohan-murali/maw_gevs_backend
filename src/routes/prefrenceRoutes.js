const { Router } = require("express");
const authHandler = require("../middleware/authHandler");
const PrefrenceModel = require("../models/prefrence");

const prefrenceRounter = Router();

prefrenceRounter.post("/submit", authHandler, async (req, res) => {
  try {
    const { user } = req;
    const { prefrence1, prefrence2, prefrence3 } = req.body;
    const newPrefrence = new PrefrenceModel({
      emailId: user.emailId,
      prefrence1,
      prefrence2,
      prefrence3,
    });
    await newPrefrence.save();
    res.status(200).json({
      success: true,
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: "could not retrieve the requested data",
    });
  }
});

prefrenceRounter.get("/", authHandler, async (req, res) => {
  try {
    const { user } = req;
    const prefrence = await PrefrenceModel.findOne({ emailId: user.emailId });
    if (prefrence) {
      res.status(200).json({
        status: "success",
        prefrence,
      });
    } else {
      res.status(400).json({
        status: "failure",
        message: "Could not retrieve prefrence for the user",
      });
    }
  } catch (e) {
    res.status(500).json({
      success: false,
      message: "could not retrieve the requested data",
    });
  }
});

module.exports = prefrenceRounter;
