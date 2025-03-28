const express = require("express");
const connectDB = require("./config/database");

const cookieParser = require("cookie-parser");
const cors = require("cors");
const app = express();
const port = 3199;

app.use(cookieParser());
app.use(express.json());
app.use(cors());

const authRouter = require("./routes/auth.js");
const profileRouter = require("./routes/profile.js");
const requestRouter = require("./routes/requestRouter.js");
const userRouter = require("./routes/userRouter.js")


app.use('/auth', authRouter);
app.use('/profile', profileRouter);
app.use('/request', requestRouter);
app.use('/user', userRouter);

connectDB()
  .then(() => {
    console.log("Connected to Database");
    app.listen(port, () => {
      console.log(`Server is Up and running at ${port}`);
    });
  })
  .catch((err) => {
    console.error("Error connecting to DB: " + err.message);
  });
