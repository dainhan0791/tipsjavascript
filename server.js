import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import mongoose from "mongoose";
import httpErrors from "http-errors";

// Local
import userRoute from "./routes/user.route.js";

const app = express();
dotenv.config();
app.use(helmet());
app.use(morgan("common"));

const PORT = process.env.PORT || 5000;

app.use("/v1/users", userRoute);

mongoose.connect(
  `mongodb+srv://thaidainhan:thaidainhan792001@atlascluster.xkah2nn.mongodb.net/tipsjavascript?retryWrites=true&w=majority`
);
mongoose.connection.on("connected", () => {
  console.log("Monggo connected");
});
mongoose.connection.on("error", (err) => {
  console.log(err.message);
});
mongoose.connection.on("disconnected", (err) => {
  console.log("Monggo disconnected");
});
process.on("SIGINT", async () => {
  await mongoose.connection.close();
  process.exit(0);
});

app.use((req, res, next) => {
  next(httpErrors(404, "Not Found"));
});
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    status: err.status || 500,
    message: err.message,
  });
});

app.listen(PORT, () => {
  console.log(`THE SERVER RUNNING AT PORT: ${PORT}`);
});
