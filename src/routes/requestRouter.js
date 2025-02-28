const express = require("express");
const { userAuth } = require("../middlewares/auth.js");
const ConnectionReqModel = require("../models/connectionReq.js");
const User = require("../models/user.js");
const requestRouter = express.Router();

requestRouter.post('/request/send/:status/:toUserId', userAuth, async(req,res)=>{
    try{
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;

        const toUser = await User.findById(toUserId);
        if(!toUser){
            return res.status(404).json({sucess: false, message: "User Not Found"})
        }

        if(fromUserId == toUserId){
            return res.status(400).json({sucess: false, message: "Invalid User"})
        }

        const allowed_status = ["ignore","interested"]
        if(!allowed_status.includes(status)){
            return res.status(400).json({sucess: false, message: "Invalid Status Type"})
        }

        const existingConnectionReq = await ConnectionReqModel.findOne({
            $or:[
                {fromUserId, toUserId},
                {fromUserId: toUserId, toUserId:fromUserId},
            ]
        });
        if(existingConnectionReq){
            return res.status(400).json({sucess: false, message: "Request Already Sent"})
        }

        const connectionRequest = new ConnectionReqModel({
            fromUserId, toUserId, status
        })

        const data = await connectionRequest.save();
        res.json({sucess: true, message: data})

    }
    catch(err){
        res.json({sucess: false, message: err.message})
    }
})


module.exports = requestRouter;