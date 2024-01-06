const jwt = require("jsonwebtoken");
const VoterModel = require("../models/voter");

const authHandler = async (req, res, next) => {
  const JWT_KEY = process.env.JWT_KEY || "";
  //Get token from header
  const token = req.header("x-auth-token");

  //Check if token is present
  if (!token) {
    return res
      .status(401)
      .json({ msg: "No token found. Authorization Denied" });
  }

  // Verify token
  try {
    const usr = jwt.verify(token, JWT_KEY);
    const user = await VoterModel.findById(usr.userId);
    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token invalid." });
  }
};

module.exports = authHandler;
