import { Router } from "express";
import { authHandler } from "../middleware/authHandler";
import { CandidateModel } from "../models/candidate";
import { VoterModel } from "../models/voter";

const voterRouter = Router();
const JWT_KEY = process.env.JWT_KEY || "";

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

export { voterRouter };
