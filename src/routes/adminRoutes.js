const { Router } = require("express");
const ElectionModel = require("../models/election");
const authHandler = require("../middleware/authHandler");
const CandidateModel = require("../models/candidate");
const PartyModel = require("../models/party");
const VoterModel = require("../models/voter");

const adminRouter = Router();

adminRouter.post("/election", async (req, res) => {
  try {
    const { status } = req.body;
    console.log(status);
    if (status === "Completed") {
      const redCandidates = await CandidateModel.find({ party: "Red Party" });
      const blueCandidates = await CandidateModel.find({ party: "Blue Party" });
      const yellowCandidates = await CandidateModel.find({
        party: "Yellow Party",
      });
      const independentCandidates = await CandidateModel.find({
        party: "Independent",
      });

      const redVotes = redCandidates.reduce((s, c) => s + c.voteCount, 0);
      const blueVotes = blueCandidates.reduce((s, c) => s + c.voteCount, 0);
      const yellowVotes = yellowCandidates.reduce((s, c) => s + c.voteCount, 0);
      const independentVotes = independentCandidates.reduce(
        (s, c) => s + c.voteCount,
        0
      );

      await PartyModel.findOneAndUpdate(
        { party: "Red Party" },
        { seatCount: redVotes }
      );
      await PartyModel.findOneAndUpdate(
        { party: "Blue Party" },
        { seatCount: blueVotes }
      );
      await PartyModel.findOneAndUpdate(
        { party: "Yellow Party" },
        { seatCount: yellowVotes }
      );
      await PartyModel.findOneAndUpdate(
        { party: "Independent" },
        { seatCount: independentVotes }
      );

      const max = Math.max(redVotes, blueVotes, yellowVotes, independentVotes);
      let winner;
      if (max === redVotes) {
        winner = "Red Party";
      } else if (max === blueVotes) {
        winner = "Blue Party";
      } else if (max === yellowVotes) {
        winner = "Yellow Party";
      } else {
        winner = "Independent";
      }

      const election = await ElectionModel.findOneAndUpdate(
        {},
        { status, winner },
        {
          new: true,
        }
      );

      await VoterModel.updateMany({ isAdmin: false }, { hasVoted: false });
      res.status(200).json({
        success: true,
        election,
      });
    } else {
      const election = await ElectionModel.findOneAndUpdate(
        {},
        { status, winner: "pending" },
        {
          new: true,
        }
      );
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

adminRouter.get("/election-status", async (req, res) => {
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
