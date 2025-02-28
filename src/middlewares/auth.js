const jwt = require("jsonwebtoken");
const User = require("../models/user");

const adminAuth = (req,res,next)=>{
    const token = "xyz";
    const isAdminAuth = token === "xyz"
    if(!isAdminAuth){
        res.status(404).send("Admin is not Authorized");
    }
    else{
        next()
    }
}

const userAuth = async(req,res,next)=>{
    try{
    const {token} = req.cookies;
    if(!token){
        return res.status(404).send("Please Login");
    }
    const decodedMessage = await jwt.verify(token, 'KALa@12345');
    const user = await User.findById(decodedMessage._id);
    if(!user){
        res.status(404).send("User is not Authorized");
    }
    else{
        req.user = user;
        next()
    }
    } catch(err){
        res.status(400).send("Error: "+err.message);
    }

}

module.exports = {adminAuth, userAuth}
    
    