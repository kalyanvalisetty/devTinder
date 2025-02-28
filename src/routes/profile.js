const express = require("express");
const profileRouter = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/user");
const { userAuth } = require("../middlewares/auth");
const { validateEditProfileData, validateEditPasword } = require("../utils/validator");


profileRouter.get("/profile/view", userAuth, async (req, res) => {
    try {
      const user = req.user;
      res.status(200).send(user);
    } catch (err) {
      res.status(400).send("Something Went wrong!");
    }
  });

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
    try {
      validateEditProfileData(req);
      const user = await User.findByIdAndUpdate(
        { _id: req.user._id },
        req.body,
        {
          returnDocument: "after",
          runValidators: true,
        }
      );
      res.status(200).send("User successfully Updated");
    } catch (error) {
      res.send("Error: "+error.message);
    }
  });

profileRouter.patch("/profile/edit-password", userAuth, async (req, res) => {
    try {
      validateEditPasword(req);
      const user = req.user;      
      user.password = bcrypt.hashSync(req.body.password, 10);
      
      await user.save();
      res.status(200).send("Password Updated");
    } catch (err) {
      res.status(400).send("message "+ err.message);
    }
  });


module.exports = profileRouter