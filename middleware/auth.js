const jwt = require("jsonwebtoken");
const config = require("../config/config");
const User = require("../model/userModels");

exports.isAuthenticatedUser  = async(req,res,next)=>{
    const token = req.cookies.jwt;
    //console.log(token)
    if(!token){
        return next(new Error,"Please login first to access this route", 401)
    }
    // decoded token
    const decodedData =  jwt.verify(token, config.JWT_SECRET_KEY);
    req.user = await User.findById(decodedData.id);
    //console.log(decodedData,"aaa")
    next();
};

exports.authorizeRoles = (...roles)=>{
     return (req,res,next)=>{
        if(!roles.includes(req.user.role)){
         return next(new Error, `Role:${req.user.role} this is not allowed route to accesss `, 403)
        }
        next();
     }
}

