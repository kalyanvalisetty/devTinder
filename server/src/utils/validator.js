
const signupValidate = (req) =>{
    const {age} = req.body;
    if(age<18){
        throw new Error("You must be above 18");
    }
}

const validateEditProfileData = (req) =>{
     const ALLOWED_UPDATES = ["firstName","lastName","photoUrl","about","location","skills","age"]
      const keys = Object.keys(req.body);
      console.log(keys)
      const isUpdateAllowed = keys.map((k)=>ALLOWED_UPDATES.includes(k));
      console.log(isUpdateAllowed)
      if(isUpdateAllowed.includes(false)){
        throw new Error("Updated is Not Allowed");
      }
      if(req.body.skills){
        if(req?.body?.skills.length>5){      
          throw new Error("You Can Only add Up to 5 Skills");
        }
      }
}

const validateEditPasword = (req) =>{
    const {emailId, password} = req.body;
    if(!emailId || !password){
       throw new Error("Enter email and password");
    }
    const ALLOWED_UPDATES = ["emailId", "password"];
    const keys = Object.keys(req.body);
     const isUpdateAllowed = keys.map((k)=>ALLOWED_UPDATES.includes(k));
     if(isUpdateAllowed.includes(false)){
       throw new Error("Updated is Not Allowed");
     }
}

module.exports = {signupValidate, validateEditProfileData, validateEditPasword}