const { Router } = require("express");
const UserModel = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authHandler = require("../middleware/authHandler");

const authRouter = Router();
const JWT_KEY = process.env.JWT_KEY || "secret";

authRouter.post("/register", async (req, res) => {
  try {
    const { emailId, password, name, role } = req.body;
    if (emailId && password && name && role) {
      const existingUser = UserModel.findOne({ emailId });
      if (existingUser._id) {
        res.status(400).json({
          success: false,
          message: "User already exists",
        });
      }

      const user = {
        emailId,
        name,
        password,
        role,
        approved: false,
      };
      let newUser = new UserModel(user);
      const salt = await bcrypt.genSalt(10);
      newUser.password = await bcrypt.hash(newUser.password, salt);
      newUser = await newUser.save();

      const token = jwt.sign({ userId: newUser._id }, JWT_KEY, {
        expiresIn: "24h",
      });

      res.status(200).json({
        user: {
          name: newUser.name,
          email: newUser.emailId,
          role: newUser.role,
        },
        token,
        success: true,
        message: "user created successfully",
      });
    } else {
      res.status(400).json({
        success: false,
        message: "You need to send email id, name, password, role",
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
    const { emailId, password } = req.body;
    console.log(emailId, password);

    if (emailId && password) {
      //Check if the emailId and password is correct
      const user = await UserModel.findOne({ emailId });

      if (user && user.approved) {
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
            message: "emailId and password did not match",
          });
        }
      }
      return res.status(401).json({
        success: false,
        message: "User not found or is not yet approved by admin",
      });
    } else
      res.status(400).json({
        success: false,
        message: "You need to send emailId and password",
      });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: `cannot retrieve user, error: ${err}`,
    });
  }
});

authRouter.get("/get-unapproved-user", async (req, res) => {
  try {
    const users = await UserModel.find({ approved: false });

    res.status(200).json({
      success: true,
      users,
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: "could not get the user list",
    });
  }
});

authRouter.put("/approve-user", authHandler, async (req, res) => {
  try {
    const { id } = req.body;
    const user = await UserModel.findById(id);
    await user.updateOne({ approved: true });

    res.status(200).json({
      success: true,
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: "could not approve the user",
    });
  }
});

authRouter.get("/get-all-user", authHandler, async (req, res) => {
  try {
    const users = await UserModel.find({});

    res.status(200).json({
      success: true,
      users,
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: "could not get the user list",
    });
  }
});

authRouter.get("/get-supervisors", authHandler, async (req, res) => {
  try {
    const users = await UserModel.find({ role: "Supervisor" });

    res.status(200).json({
      success: true,
      users,
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: "could not get the user list",
    });
  }
});

authRouter.delete("/delete-user/:id", authHandler, async (req, res) => {
  try {
    const { id } = req.params;
    const response = await UserModel.findByIdAndDelete(id);
    console.log(response);
    res.status(200).json({
      success: true,
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: "could not delete the user",
    });
  }
});

module.exports = authRouter;
