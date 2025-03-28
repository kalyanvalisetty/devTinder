const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt")


const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 4,
      maxLength: 50,
    },
    lastName: {
      type: String,
      required: true,
      minLength: 4,
      maxLength: 50,
    },
    about: {
      type: String,
      default: "This is About me!!",
      maxLength: 250,
    },
    photUrl: {
      type: String,
      default:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQG7WjONaOfilXR3bebrfe_zcjl58ZdAzJHYw&s",
    },
    emailId: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      trim: true,
      validate(value){
        if(!validator.isEmail(value)){
            throw new Error("Invalid Email ID")
        }
      }
    },
    password: {
      type: String,
      required: true,
      validate(value){
        if(!validator.isStrongPassword(value)){
          throw new Error("Not an Strong Password")
        }
      }
    },
    phone: {
      type: Number,
      minLength: 10,
      maxLength: 10,
    },
    location: {
      type: String,
    },
    gender: {
      type: String,
      validate(value) {
        if (!["male", "female"].includes(value)) {
          throw new Error("Gender is Not Valid!");
        }
      },
    },
    age:{
      type: Number
    },
    skills:{
        type:[String]
    }
  },
  {
    timestamps: true,
  }
);

userSchema.methods.getJWT = function(){
  const user = this;
  const token = jwt.sign({_id: user._id}, "KALa@12345",{expiresIn:"1d"});
  return token;
}

userSchema.methods.validatePassword = async function(passwordInputByUser){
  const user = this;
  const isValid = await bcrypt.compare(passwordInputByUser, user.password);
  return isValid;
}

const User = mongoose.model("users", userSchema);

module.exports = User;
