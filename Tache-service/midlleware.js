const jwt =require("jsonwebtoken");
require("dotenv").config();

VerifiyToken= (req,res,next)=>{
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
      ) {
        token = req.headers.authorization.split(' ')[1];
      }
    if(!token){
        return res.status(403).json({message:"token required to authenticate"})
    }
    jwt.verify(token,process.env.Token_Secret,(err,user)=>{
        if(err){
            return res.status(404).json({message:"invalid token ",err})
        }
        req.user=user;
        next();
    })
}
module.exports={VerifiyToken};