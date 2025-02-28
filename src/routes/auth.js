const express = require("express");
const authRouter = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/user");
const { userAuth } = require("../middlewares/auth");
const {signupValidate} = require("../utils/validator");

authRouter.get('/');


authRouter.post("/signup", async (req, res) => {
    try {
      signupValidate(req);
      req.body.password = bcrypt.hashSync(req.body.password, 10);
      const user = new User(req.body);
      await user.save();
      res.status(200).send("User successfully added");
    } catch (error) {
      res.status(400).send("Error: " + error.message);
    }
  });
  
  authRouter.post("/login", async(req,res)=>{
    try{
      const user = await User.findOne({emailId: req.body.emailId});
      if(!user){
        res.send("Invalid Credentials");
      }
      const isValidUser = user.validatePassword(req);
      if(!isValidUser){
        res.send("Invalid Credentials");
      }
      const token = await user.getJWT();
      res.cookie("token", token);
      res.send("Logged in Successfully")
  
    }catch(err){
      res.status(400).send("Error "+err.message)
    }
  });

  authRouter.post("/logout", async(req,res)=>{
      res.clearCookie("token");
      res.send("Logged out Successfully")
  });




module.exports = authRouter;
