const { Router } = require("express");
const ElectionModel = require("../models/election");
const authHandler = require("../middleware/authHandler");
const CandidateModel = require("../models/candidate");

const adminRouter = Router();

adminRouter.put("/election", authHandler, async (req, res) => {
  try {
    const { status } = req;
      if (status === "Completed") {
          const redCandidates = await CandidateModel.find({ party: "Red Party" });
          const blueCandidates = await CandidateModel.find({ party: "Blue Party" });
          const yellowCandidates = await CandidateModel.find({ party: "Yellow Party" });
          const independentCandidates = await CandidateModel.find({ party: "Independent" });

          const redVotes = redCandidates.reduce((s, c) => s + c.voteCount, 0);
          const blueVotes = blueCandidates.reduce((s, c) => s + c.voteCount, 0);
          const yellowVotes = yellowCandidates.reduce((s, c) => s + c.voteCount, 0);
          const independentVotes = independentCandidates.reduce((s, c) => s + c.voteCount, 0);

          const max = Math.max(redVotes, blueVotes, yellowVotes, independentVotes);
          let winner;
          if (max === redVotes) {
              winner = "Red Party";
          } else if (max === blueVotes) {
              winner = "Blue Party"
          } else if (max === yellowVotes) {
              winner = "Yellow Party"
          } else {
              winner = "Independent"
          }

          const election = await ElectionModel.findOneAndUpdate({}, { status, winner });
          res.status(200).json({
              success: true,
              election,
          });
      } else {
          const election = await ElectionModel.findOneAndUpdate({}, { status });
          res.status(200).json({
              success: true,
              election,
          });
      }
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

adminRouter.get("")

module.exports = adminRouter;
