import { Router } from "express";
import { VoterModel } from "../models/voter";

const authRouter = Router();
const JWT_KEY = process.env.JWT_KEY || "";

authRouter.post("/register", async (req, res) => {
    try {
        const { voterId, password, name, dob, uvcCode, constituency } = req.body;
        if (voterId && password && name && dob && uvcCode && constituency) {
            const existingVoter = VoterModel.findOne({ voterId})
            if (existingVoter) {
                res.status(400).json({
                  success: false,
                  message: "User already exists",
                });
            }

            const voter = {
                voterId,
                name,
                password,
                dob,
                uvcCode,
                constituency,
                isAdmin: false
            }
            let newVoter = new VoterModel(voter);
            const salt = await bcrypt.genSalt(10);
            newVoter.password = await bcrypt.hash(newVoter.password, salt);
            newVoter = await newVoter.save();

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
          message: `cannot register user, error: ${err}`,
        });
    }
})