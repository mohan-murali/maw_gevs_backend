// const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
const errorHander = require("./middleware/errorHandler");
const routeNotFoundHander = require("./middleware/routeNotFoundHandler");
const authRouter = require("./routes/authRoutes");
const voterRouter = require("./routes/voterRoutes");
const gevsRouter = require("./routes/gevsRoutes");
const adminRouter = require("./routes/adminRoutes");
const express = require("express");
const connectDB = require("./config/dbConfig");
const cors = require("cors");

const app = express();

require("dotenv").config();

connectDB();
app.use(cors());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded());

app.use(cookieSession({ keys: ["laskdjf"] }));
app.use("/api/auth", authRouter);
app.use("/api/voter", voterRouter);
app.use("/api/admin", adminRouter);
app.use("/gevs", gevsRouter);

app.use(errorHander);

app.use(routeNotFoundHander);

const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log(`the application is listening on port ${port}`);
});
