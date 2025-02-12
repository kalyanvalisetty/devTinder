const mongoose = require("mongoose");

const connectDB = async()=>{
     await mongoose.connect("mongodb+srv://kalyan33633:mhV2rSkOBgZPD1gO@infinixgroup.lxotl.mongodb.net/devTinder");
}

module.exports = connectDB;