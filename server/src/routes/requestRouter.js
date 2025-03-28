const express = require("express");
const { userAuth } = require("../middlewares/auth.js");
const ConnectionReq = require("../models/connectionReq.js");
const User = require("../models/user.js");
const requestRouter = express.Router();

requestRouter.post('/send/:status/:toUserId', userAuth, async(req,res)=>{
    try{
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;

        const allowed_status = ["ignore","interested"]
        if(!allowed_status.includes(status)){
            return res.status(400).json({success: false, message: "Invalid Status Type"})
        }

        const toUser = await User.findById(toUserId);
        if(!toUser){
            return res.status(404).json({success: false, message: "User Not Found"})
        }

        const existingConnectionRequest = await ConnectionReq.findOne({
            $or: [
                {fromUserId, toUserId},
                {fromUserId: toUserId, toUserId: fromUserId}
            ]
        })

        if(existingConnectionRequest){
            return res.status(400).json({success: false, message: "Request Already Sent"})
        }

        
        const connectionRequest = new ConnectionReq({
            fromUserId, toUserId, status
        })

        await connectionRequest.save();
        res.json({success: true, message: req.user.firstName + " "+ status+" "+ toUser.firstName})
    }
    catch(err){
        res.json({success: false, message: err.message})
    }
})

requestRouter.post('/review/:status/:requestId', userAuth, async(req,res)=>{
    try{
        const loggedInUser = req.user;
        const {status, requestId} = req.params;

        const allowed_status = ["accepted","rejected"]
        if(!allowed_status.includes(status)){
            return res.status(400).json({success: false, message: "Invalid Status Type"})
        }

        const connectionReq = await ConnectionReq.findOne({_id: requestId, toUserId: loggedInUser._id, status: "interested"}).populate("fromUserId",["firstName"]);

        if(!connectionReq){
            return res.status(404).json({success: false, message: "Request Not Found"})
        }

        connectionReq.status = status;        
        await connectionReq.save();
        res.status(200).json({success: true, message: `You have ${status} connection request from ${connectionReq.fromUserId.firstName}!`})
    }
    catch(err){
        res.json({success: false, message: err.message})
    }
})


module.exports = requestRouter;