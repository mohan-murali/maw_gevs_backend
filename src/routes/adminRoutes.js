const { Router } = require("express");
const ElectionModel = require("../models/election");
const authHandler = require("../middleware/authHandler");

const adminRouter = Router();

adminRouter.put("/election", authHandler, async (req, res) => {
  try {
    const { status } = req;
    const election = await ElectionModel.findOneAndUpdate({}, { status });
    res.status(200).json({
      success: true,
      election,
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: `could not update the status of election`,
    });
  }
});

adminRouter.get("/election-status", authHandler, async (req, res) => {
  try {
    const election = await ElectionModel.findOne({});
    res.status(200).json({
      success: true,
      election,
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: "could not retrieve election result",
    });
  }
});

module.exports = adminRouter;
