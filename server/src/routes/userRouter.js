const express = require("express");
const { userAuth } = require("../middlewares/auth.js");
const ConnectionReq = require("../models/connectionReq.js");
const User = require("../models/user.js");
const userRouter = express.Router();

const USER_SAFE_DATA = "firstName lastName age skills gender";
//get all the pending requests of the user 
userRouter.get("/requests", userAuth, async(req,res)=>{
    try{
        const loggedInUser = req.user;
        const connectionRequests = await ConnectionReq.find({toUserId: loggedInUser._id, status: "interested"}).populate("fromUserId",["firstName","lastName"]);
        if(connectionRequests.length==0){
            return res.json({success: false, message:"No Pending requests found"});
        }
        res.json({success: true, message: "fetched request", connectionRequests})
    }catch(err){
        res.json({success: false, message: err.message})
    }
})


//get all the co requests of the user 
userRouter.get("/connections", userAuth, async(req,res)=>{
    try{
        const loggedInUser = req.user;
        const connections = await ConnectionReq.find({
            $or: [{toUserId: loggedInUser._id, status: "accepted"},
                  {fromUserId: loggedInUser._id, status: "accepted"}]
                }).populate("fromUserId", USER_SAFE_DATA).populate("toUserId", USER_SAFE_DATA);
        
        if(connections.length==0){
            return res.json({success: false, message:"No connections found"});
        }

        const data = connections.map((row)=>{
            if(row.fromUserId._id.toString() === loggedInUser._id.toString()){
                return row.toUserId;
            }
            return row.fromUserId;
        });

        res.json({success: true, message: "fetched request", data})
    }catch(err){
        res.json({success: false, message: err.message})
    }
})

userRouter.get("/feed", userAuth, async(req, res)=>{
    try{
        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        limit = limit>10 ? 10: limit;
        const skip = (page-1)*limit;

        const loggedInUser = req.user;
        const connectionsReq = await ConnectionReq.find({
            $or: [{fromUserId: loggedInUser._id}, {toUserId: loggedInUser._id}]}).select("fromUserId toUserId");

        const hideUsersFromFeed = new Set();
        connectionsReq.forEach((req)=>{
            hideUsersFromFeed.add(req.fromUserId.toString());
            hideUsersFromFeed.add(req.toUserId.toString());
        })

        const usersFeed = await User.find({
            $and: [
                {_id: {$nin: Array.from(hideUsersFromFeed)}},
                {_id: {$ne: loggedInUser._id}}
            ]
        }).select(USER_SAFE_DATA).skip(skip).limit(limit)
        
        res.json({success: true, message: usersFeed})
    }catch(err){
        res.json({success: false, message: err.message})
    }
})


module.exports = userRouter;