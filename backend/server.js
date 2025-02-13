// import experss from "experess";
import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route.js";
import { connectDB } from "./lib/db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5010;
// console.log(process.env.PORT);

app.use(express.json()); //allows us to parse json data in the body of the request

//routes
app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  console.log("Server is running on http://localhost:" + PORT);
  connectDB();
});
