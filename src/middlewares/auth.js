
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

const userAuth = (req,res,next)=>{
    const token = "xyz";
    const isuserAuth = token === "xyz"
    if(!isuserAuth){
        res.status(404).send("User is not Authorized");
    }
    else{
        next()
    }

}

module.exports = {adminAuth, userAuth}
    
    