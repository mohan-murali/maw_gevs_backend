import bodyParser from "body-parser";
import cookieSession from "cookie-session";
import * as dotenv from "dotenv";
import express from "express";
import { connectDB } from "./config/dbConfig";
import { errorHander } from "./middleware/errorHandler";
import { routeNotFoundHander } from "./middleware/routeNotFoundHandler";
import { authRouter } from "./routes/authRoutes";
import { voterRouter } from "./routes/voterRoutes";

const app = express();

dotenv.config();

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
