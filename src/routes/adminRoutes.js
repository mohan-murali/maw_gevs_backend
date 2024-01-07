const { Router } = require("express");
const ElectionModel = require("../models/election");

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

module.exports = adminRouter;
