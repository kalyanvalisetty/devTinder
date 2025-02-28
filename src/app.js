const express = require("express");
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(cors());

const authRouter = require("./routes/auth.js");
const profileRouter = require("./routes/profile.js");
const requestRouter = require("./routes/requestRouter.js");


app.use('/', authRouter);
app.use('/', profileRouter);
app.use('/', requestRouter);

connectDB()
  .then(() => {
    console.log("Connected to Database");
    app.listen("3199", () => {
      console.log("Server is Up and running");
    });
  })
  .catch((err) => {
    console.error("Error connecting to DB: " + err.message);
  });
