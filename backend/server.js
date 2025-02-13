// import experss from "experess";
import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route.js";
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";
// import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5012;
// console.log(process.env.PORT);

app.use(express.json()); //allows us to parse json data in the body of the request
app.use(cookieParser());
// app.use(cookieParser());
//routes
app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  console.log("Server is running on http://localhost:" + PORT);
  connectDB();
});
