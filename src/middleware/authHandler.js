const jwt = require("jsonwebtoken");
const UserModel = require("../models/user");

const JWT_KEY = process.env.JWT_KEY || "secret";
const authHandler = async (req, res, next) => {
  //Get token from header
  const token = req.header("x-auth-token");
  console.log(token);

  //Check if token is present
  if (!token) {
    return res
      .status(401)
      .json({ msg: "No token found. Authorization Denied" });
  }

  // Verify token
  try {
    console.log("JWT_Key is ->", JWT_KEY);
    const usr = jwt.verify(token, JWT_KEY);
    const user = await UserModel.findById(usr.userId);
req.user = user;
    next();
  } catch (err) {
    console.log(err);
    res.status(401).json({ msg: "Token invalid." });
  }
};

module.exports = authHandler;
