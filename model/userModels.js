const mongoose = require("mongoose"); 
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../config/config");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
     name:{
        type:String,
        required:true,
        maxlength:[30],
        minlength:[3]
     },
     email:{
        type:String,
        required:true,
        unique:true,
        validate:[validator.isEmail]
     },
     password:{
        type:String,
        required:true,
        maxlength:[8],
        minlength:[3],
        select:false
     },

     profilePic:{
             type:String,
            
     },

     role:{
        type:String,
        enum : ['user,admin'],
        default:"user"
     },
     token:{
        type:String,
     },

     resetPasswordToken:String,
     resetPasswordExpires:Date

},{timestamps:true});


/// hash password
userSchema.pre("save", async function(next){
        if(!this.isModified("password")){
         next();
        }
        this.password = await bcrypt.hash(this.password, 10)
});

// generate token 
userSchema.methods.generateToken = async function(){
     return  jwt.sign({id:this._id}, config.JWT_SECRET_KEY,{
      expiresIn:"2d"
     });
}

// compare password
userSchema.methods.comparePassword = async function(enterPassword){
   return await bcrypt.compare(enterPassword, this.password)
}


/// generating reset token 
userSchema.methods.generateResetPasswordToken = function(){
   // generating token 
   const resetToken = crypto.randomBytes(15).toString("hex");

   // Hashing and adding resetPassword token to userSchema 
   this.resetPasswordToken = crypto.createHash("sha256")
                              .update(resetToken)
                              .digest("hex");
   this.resetPasswordExpires = Date.now() + 15 * 60 * 1000;
   return resetToken;
}



module.exports = new mongoose.model("User", userSchema);