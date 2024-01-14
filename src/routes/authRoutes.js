const { Router } = require("express");
const uvcModel = require("../models/uvc");
const VoterModel = require("../models/voter");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const authRouter = Router();
const JWT_KEY = process.env.JWT_KEY || "secret";

authRouter.post("/register", async (req, res) => {
  try {
    const { voterId, password, name, dob, uvcCode, constituency } = req.body;
    if (voterId && password && name && dob && uvcCode && constituency) {
      const existingVoter = VoterModel.findOne({ voterId });
      if (existingVoter._id) {
        res.status(400).json({
          success: false,
          message: "User already exists",
        });
      }

      let usedUvcCode = uvcModel.findOne({ uvcCode });
      if (!usedUvcCode) {
        console.log("invalid uvc code");
        res.status(400).json({
          success: false,
          message: "invalid uvc code",
        });
      }
      if (usedUvcCode.isUsed) {
        console.log("uvc already used");
        res.status(400).json({
          success: false,
          message: "UVC code is already used",
        });
      }

      const voter = {
        voterId,
        name,
        password,
        dob,
        uvcCode,
        constituency,
        isAdmin: false,
      };
      let newVoter = new VoterModel(voter);
      const salt = await bcrypt.genSalt(10);
      newVoter.password = await bcrypt.hash(newVoter.password, salt);
      newVoter = await newVoter.save();
      await usedUvcCode.findOneAndUpdate(
        { uvcCode: usedUvcCode.uvcCode },
        { isUsed: true }
      );

      const token = jwt.sign({ userId: newVoter._id }, JWT_KEY, {
        expiresIn: "24h",
      });

      res.status(200).json({
        voter: {
          name: newVoter.name,
          voterId: newVoter.voterId,
        },
        token,
        success: true,
        message: "user created successfully",
      });
    } else {
      res.status(400).json({
        success: false,
        message:
          "You need to send voter id, name, password,dob, uvc code and constituency",
      });
    }
  } catch (e) {
    res.status(500).json({
      success: false,
      message: `cannot register user, error: ${e}`,
    });
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { voterId, password } = req.body;
    console.log(voterId, password);

    if (voterId && password) {
      //Check if the voterId and password is correct
      const user = await VoterModel.findOne({ voterId });

      if (user) {
        const passwordMatched = await bcrypt.compare(password, user.password);
        if (passwordMatched) {
          console.log("JWT key is ", JWT_KEY);
          const token = jwt.sign({ userId: user._id }, JWT_KEY, {
            expiresIn: "24h",
          });

          return res.status(200).json({
            success: true,
            user,
            token,
          });
        } else {
          return res.status(403).json({
            success: false,
            message: "voterId and password did not match",
          });
        }
      }
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    } else
      res.status(400).json({
        success: false,
        message: "You need to send voterId and password",
      });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: `cannot retrieve user, error: ${err}`,
    });
  }
});

module.exports = authRouter;
