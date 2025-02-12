const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user")
const app = express();

app.use(express.json());

app.get("/feed", async(req, res)=>{
   try{
    const user = await User.findOne({emailId: req.body.emailId});
    res.status(200).send(user);
   } catch(err){
    res.status(400).send("Something Went wrong!");
   }
});

app.delete("/delete", async(req, res)=>{
  try{
   const user = await User.findByIdAndDelete({_id: req.body.userId});
   res.status(200).send("User Deleted");
  } catch(err){
   res.status(400).send("Something Went wrong!");
  }
});

app.post("/signup",async(req,res)=>{
  const user = new User(req.body)
  try{
    await user.save();
    res.status(200).send("User successfully added");
  }catch(error){
    console.log("Error: ",error);
  }
})

app.patch("/update",async(req,res)=>{
  try{
    const user = await User.findByIdAndUpdate({_id: req.body.userId}, req.body);
    res.status(200).send("User successfully Updated");
  }catch(error){
    console.log("Error: ",error);
  }
})

connectDB()
.then(()=>{
  console.log("Connected to Database");
  app.listen('3199',()=>{
    console.log("Server is Up and running");
  })
}).catch((err)=>{
  console.error("Error connecting to DB: "+err.message);
})
