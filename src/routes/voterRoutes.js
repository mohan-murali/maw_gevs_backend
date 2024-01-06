const { Router } = require("express");
const authHandler = require("../middleware/authHandler");
const CandidateModel = require("../models/candidate");
const PartyModel = require("../models/party");
const VoterModel = require("../models/voter");

const voterRouter = Router();

voterRouter.get("/candidate", authHandler, async (req, res) => {
  try {
    const user = req.user;
    const candidates = await CandidateModel.find({
      constituency: user.constituency,
    });
    if (candidates) {
      res.status(200).json({
        success: true,
        candidates,
      });
    } else {
      res.status(500).json({
        success: false,
        message: "cannot find any candidates",
      });
    }
  } catch (e) {
    res.status(500).json({
      success: false,
      message: `cannot fetch the candidate list`,
    });
  }
});

voterRouter.post("/vote", authHandler, async (req, res) => {
  try {
    const { user, candidate } = req;
    await VoterModel.findByIdAndUpdate(user._id, {
      hasVoted: true,
    });
    await CandidateModel.findByIdAndUpdate(candidate._id, {
      voteCount: candidate.voteCount + 1,
    });

    res.status(202).json({
      success: true,
      message: "voted successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: `Not able to vote due to the error: ${err}`,
    });
  }
});

voterRouter.post("/candidate", async (req, res) => {
  try {
    const { candidate, party, constituency } = req;
    const newCandidate = new CandidateModel({
      candidate,
      party,
      constituency,
      voterCount: 0,
    });
    await newCandidate.save();
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: `Not able to vote due to the error: ${err}`,
    });
  }
});

voterRouter.post("/party", async (req, res) => {
  try {
    const { party } = req;
    const newParty = new PartyModel({
      party,
      seatCount: 0,
    });
    await newParty.save();
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: `Not able to vote due to the error: ${err}`,
    });
  }
});

module.exports = voterRouter;
