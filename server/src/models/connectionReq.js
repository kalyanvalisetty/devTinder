const mongoose = require("mongoose")

const connectionReqSchema = new mongoose.Schema({
    fromUserId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    status: {
        type: String,
        enum: {
            values: ["ignored", "interested", "accepted", "rejected"],
            message: '{VALUES} is not supported'
        },
        required: true,
    }
},{
    timestamps: true
})

connectionReqSchema.index({fromUserId: 1, toUserId: 1})
connectionReqSchema.pre("save", function(next){
    const connectionReq = this;
    if(connectionReq.fromUserId.equals(connectionReq.toUserId)){
        throw new Error("Invalid Request")
    }
    next()
})

const ConnectionReq = mongoose.model("connections",connectionReqSchema)

module.exports = ConnectionReq