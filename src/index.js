const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
const errorHander = require("./middleware/errorHandler");
const routeNotFoundHander = require("./middleware/routeNotFoundHandler");
const authRouter = require("./routes/authRoutes");
const voterRouter = require("./routes/voterRoutes");
const express = require("express");
const connectDB = require("./config/dbConfig");

const app = express();

require("dotenv").config();

connectDB();

app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieSession({ keys: ["laskdjf"] }));
app.use(authRouter, voterRouter);

app.use(errorHander);

app.use(routeNotFoundHander);

const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log(`the application is listening on port ${port}`);
});
