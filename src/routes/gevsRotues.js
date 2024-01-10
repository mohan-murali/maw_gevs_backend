const { Router } = require("express");
const ElectionModel = require("../models/election");
const authHandler = require("../middleware/authHandler");
const CandidateModel = require("../models/candidate");
const PartyModel = require("../models/party");

const gevsRouter = Router();

gevsRouter.put("/constituency/:name", authHandler, async (req, res) => {
  try {
    const { name } = req.params;
    const candidates = await CandidateModel.find({ constituency: name });
    const result = candidates.map((candidate) => ({
      name: candidate.candidate,
      party: candidate.party,
      vote: candidate.voteCount,
    }));
    res.status(200).json({
      constituency: name,
      result,
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: "could not retrieve the requested data",
    });
  }
});

gevsRouter.get("/result", authHandler, async (req, res) => {
  try {
    const election = await ElectionModel.findOne({});
    if (election.status === "Completed") {
      const seats = await PartyModel.find({});
      res.status(200).json({
        status: election.status,
        winner: election.winner,
        seats,
      });
    } else {
      res.status(200).json({
        status: election.status,
      });
    }
  } catch (e) {
    res.status(500).json({
      success: false,
      message: "could not retrieve the requested data",
    });
  }
});

module.exports = gevsRouter;
