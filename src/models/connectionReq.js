const mongoose = require("mongoose");

const connectionReqSchema = new mongoose.Schema({
        fromUserId : {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        toUserId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        status: {
            type: String,
            enum: {
                values: ["ignore","interested","accepted","rejected"],
                message: '{VALUE} is Not Supported'
            },
            required: true
        }
},
{timestamps: true
}) 

const ConnectionReqModel = mongoose.model("connections", connectionReqSchema);

module.exports = ConnectionReqModel