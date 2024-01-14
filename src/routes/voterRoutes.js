const { Router } = require("express");
const authHandler = require("../middleware/authHandler");
const CandidateModel = require("../models/candidate");
const PartyModel = require("../models/party");
const VoterModel = require("../models/voter");
const UvcModel = require("../models/uvc.js");
const voterRouter = Router();

voterRouter.get("/", (req, res) => {
  res.status(200);
});

voterRouter.get("/candidate", authHandler, async (req, res) => {
  try {
    const user = req.user;
    console.log("the user is ", user);
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
    const { user } = req;
    const { candidate } = req.body;
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
    const { candidate, party, constituency } = req.body;
    console.log(candidate, party, constituency);
    const newCandidate = new CandidateModel({
      candidate,
      party,
      constituency,
      voteCount: 0,
    });
    await newCandidate.save();
    res.status(200).json({
      success: true,
    });
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
    const { party } = req.body;
    console.log(req);
    const newParty = new PartyModel({
      party,
      seatCount: 0,
    });
    await newParty.save();
    res.status(200).json({
      success: true,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: `Not able to vote due to the error: ${err}`,
    });
  }
});

voterRouter.post("/uvcCodes", async (req, res) => {
  try {
    console.log(req.body);
    const { uvcCode } = req.body;
    const newParty = new UvcModel({
      uvcCode,
      isUsed: false,
    });
    await newParty.save();
    res.status(200).json({
      success: true,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: `Not able to vote due to the error: ${err}`,
    });
  }
});

module.exports = voterRouter;
