import bodyParser from "body-parser";
import cookieSession from "cookie-session";
import * as dotenv from "dotenv";
import express from "express";
import { connectDB } from "./config/dbConfig";

const app = express();

dotenv.config();

connectDB();

app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieSession({ keys: ["laskdjf"] }));

const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log(`the application is listening on port ${port}`);
});
