const express = require("express");
const profileRouter = express.Router();

const bcrypt = require("bcrypt");
const User = require("../models/user");
const { userAuth } = require("../middlewares/auth");
const { validateEditProfileData, validateEditPasword } = require("../utils/validator");


profileRouter.get("/view", userAuth, async (req, res) => {
    try {
      const user = req.user;
      res.status(200).json({success: true, messsage: user});
    } catch (err) {
      res.status(400).send({success: false, messsage: err.message});
    }
  });

profileRouter.patch("/edit-details", userAuth, async (req, res) => {
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
      res.status(200).json({success: true, messsage: "User details successfully updated"});
    } catch (err) {
      res.status(400).json({success: false, messsage: err.message});
    }
  });

profileRouter.patch("/edit-password", userAuth, async (req, res) => {
    try {
      validateEditPasword(req);
      const user = req.user;      
      user.password = await bcrypt.hash(req.body.password, 10);

      await user.save();
      res.status(200).json({success: true, messsage: "Password Updated"});
    } catch (err) {
      res.status(400).json({success: false, messsage: err.message});
    }
  });


module.exports = profileRouter