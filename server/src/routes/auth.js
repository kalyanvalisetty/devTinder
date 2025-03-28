const express = require("express");
const authRouter = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/user");
const {signupValidate} = require("../utils/validator");

authRouter.post("/signup", async (req, res) => {
    try {
      signupValidate(req);
      req.body.password = await bcrypt.hash(req.body.password, 10);
      const user = new User(req.body);
      await user.save();
      res.status(200).json({success: true, messsage: "User successfully added"});
    } catch (err) {
      res.status(400).json({success: false, messsage: err.message});
    }
  });
  
authRouter.post("/login", async (req, res) => {
    try {
      const user = await User.findOne({ emailId: req.body.emailId });
      if (!user) {
        return res.json({success: false, messsage: "Invalid Credentials"});
      }
      const isValidUser = await user.validatePassword(req.body.password); // Await here
      if (!isValidUser) {
        return res.json({success: false, messsage: "Invalid Credentials"});
      }
      const token = await user.getJWT();
      res.cookie("token", token, {expires: new Date(Date.now() + 1*24*60*60*1000)});
      res.status(200).json({success: true, messsage: "Logged in Successfully"});
    } catch (err) {
      res.status(400).json({success: false, messsage: err.message});
    }
  });
  
authRouter.post("/logout", async(req,res)=>{
      res.clearCookie("token");
      res.status(200).json({success: true, messsage: "Logged out Successfully"});
  });


module.exports = authRouter;
