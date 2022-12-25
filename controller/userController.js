
const User = require("../model/userModels");
const validator = require("validator");
const sendToken = require("../utils/jwtToken");
const config  = require("../config/config");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const { resourceUsage } = require("process");

const userController = {
    register:async(req,res)=>{

        try{
       const {name, email, password,role} = req.body;
       if(!(name && email && password)){
        return res.status(400).json({
            success:false,
            message:"These fields are required."
        });
       }
       const userExist = await User.findOne({email});
       if(userExist){
        return res.status(400).json({
            success:false,
            message:"User already exists Please login!"
        });
       }
       const user = await User.create({
        name,
        email,
        password,
        role
       });
        const token = await user.generateToken();
       return res.cookie("jwt", token,{
            httpOnly:true,
       }).status(201).json({
        success:true,
        message:"User register successfully!.",
        data:user,
        
    })
       //sendToken(user, 201, res);

        }catch(e){
            return res.status(500).json({
                success: false,
                message:"Internal server error!.", e
            });
        }0
    },

    login:async(req,res)=>{

        try{
            const {email, password} = req.body;
            if(!( email && password)){
                return res.status(400).json({
                    success:false,
                    message:"These credentail is not empty for login!."
                });
               }
               const validateEmail = validator.isEmail(email);
               if(!validateEmail){
                return res.status(400).json({
                    success:false,
                    message:"Invalid email format"
                });
               }

               const user = await User.findOne({email}).select("+password");

               if(!user){
                return res.status(400).json({
                    success:false,
                    message:"User does not exists please register first."
                });
               }

               const isMatchPassword  = await  user.comparePassword(password);
               if(!isMatchPassword){
                return res.status(400).json({
                    success:false,
                    message:"Password Mismatch."
                });
               }
                const token = await user.generateToken();
                return res.cookie("jwt", token,{
                    httpOnly:true}).status(200).json({
                    success:true,
                    message:"User login successfully!.",
                    data:user,
                })

        }catch(e){
            console.log(e,"err")
            return res.status(500).json({
                success: false,
                message:"Internal server error!.", 
              
            });
        }
    },

    
    logoutUser:async(req,res)=>{
        try{
        res.cookie("jwt", null,{
            expires : new Date(Date.now()),
            httpOnly:true
        });

        return res.status(200).json({
            success:true,
            messsage:"Logout successfully done!"
        })
        }catch(e){
            console.log(e,"err")
            return res.status(500).json({
                success: false,
                message:"Internal server error!.", 
              
            });
        }
    },
    
    /// forget password
    forgetPassword:async(req,res)=>{
        
          const user = await User.findOne({email:req.body.email});
          if(!user){
            return res.status(400).json({
                success:false,
                message:"User not found!"
            })
          }

          // generate reset password token 
          const resetToken = user.generateResetPasswordToken();
         await user.save({validateBeforeSave:false});

         /// sending mail 
         const resetPasswordUrl = `http://localhost:4300/api/user/password/reset/${resetToken}`
         const message = `Your reset password url : -\n\n ${resetPasswordUrl} , please 
         reset your password`
        try{
           await sendEmail({
            email:user.email,
            subject: "Ecommere password Recovery", 
            message:message
           });
          return res.status(200).json({
            success:true,
            message:`Email send to ${user.email} Successfully `
          });

        }catch(e){
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;
            await user.save({validateBeforeSave:false});
            console.log(e,"err")
            return res.status(500).json({
                success: false,
                message:"Internal server error!.", 
              
            });
        }
      
    },

    /// Reset password 
    resetPassword:async(req,res)=>{
        try{
        // creating hash token 
        const resetPasswordToken = crypto.createHash("sha256")
        .update(req.params.token)
        .digest("hex");
       const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpires:{$gt:Date.now()}
       });

       if(!user){
        return res.status(400).json({
            success:false,
            message:"Reset paasword token is invalid or token has been expired!"
        });
      }
      if(req.body.password !== req.body.confirmPassword){
        return res.status(400).json({
            success:false,
            message:"Password mismatch!"
        });
      }
     user.password = req.body.password;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
       await user.save();

       const token = await user.generateToken();
       return res.cookie("jwt", token,{
           httpOnly:true}).status(200).json({
           success:true,
           message:"Reset password successfully done!.",
           data:user,
       })

        }catch{
            console.log(e,"err")
            return res.status(500).json({
                success: false,
                message:"Internal server error!.", 
              
            });
        }
    }, 

    // get user details 
    getDetails:async(req,res)=>{
        try{
          const user = await User.findById(req.user.id);
          if(!user){
            return res.status(400).json({
                success:false,
                message:"Something went wrong!"
            });
          }
          return res.status(200).json({
            success:true,
            message:"Profile get successfully!",
            data:user
          })
        }catch(e){
            //console.log(e,"err")
            return res.status(500).json({
                success: false,
                message:"Internal server error!.", 
              
            });
        }
    },

    /// update password
    updatePassword:async(req,res)=>{
        try{
            
          const user = await User.findById(req.user.id).select("+password");
          const isMatchPassword  = await  user.comparePassword(req.body.oldPassword);
          if(!isMatchPassword){
           return res.status(400).json({
               success:false,
               message:"You have entered incorrect oldPassword."
           });
          }

          if(req.body.newPassword !== req.body.confirmPassword){
            return res.status(400).json({
                success:false,
                message:"confirm password and new password does not match"
            });
          }

          user.password = req.body.newPassword;
          await user.save();
         
          const token = await user.generateToken();
          return res.cookie("jwt", token,{
              httpOnly:true}).status(200).json({
              success:true,
              message:"Change password successfully done!.",
              data:user,
          })
        }catch(e){
            console.log(e,"err")
            return res.status(500).json({
                success: false,
                message:"Internal server error!.", 
              
            });
        }
    },

    /// update profile 
    updateProfile:async(req,res)=>{
        try{
            let updateProfile = {
                name:req.body.name,
                email:req.body.email
            }
            const update = await User.findByIdAndUpdate(req.user.id,updateProfile,{
                new:true,
                runValidators:true,
                userFindAndModify:false
            });

            return res.status(200).json({
                success:true,
                message:"User profile updated successfully!.",
                data:update
            })
         
        }catch(e){
            console.log(e,"err")
            return res.status(500).json({
                success: false,
                message:"Internal server error!.", 
              
            });
        }
    },

    // getAll user by admin 
    getAllUser:async(req,res)=>{
        try{ 
            const user = await User.find();
            return res.status(200).json({
                success:true,
                message:"Get all user",
                data:user
            })

        }catch{
            console.log(e,"err")
            return res.status(500).json({
                success: false,
                message:"Internal server error!.", 
              
            });
        }
    },

     // Single user  details by admin 
     getSingleUser:async(req,res)=>{
        try{ 
            const user = await User.find(req.params.id);
             if(!user){
                return res.status(400).json({
                    success:false,
                    message:` Your does not found ${req.params.id}`,
                });
             }
            return res.status(200).json({
                success:true,
                message:"Get all user",
                data:user
            })

        }catch{
            console.log(e,"err")
            return res.status(500).json({
                success: false,
                message:"Internal server error!.", 
              
            });
        }
    },

     /// update user role
     updateUserRole:async(req,res)=>{
        try{
            let updateRole = {
                name:req.body.name,
                email:req.body.email, 
                role:req.body.role
            }
            const update = await User.findByIdAndUpdate(req.params.id,updateRole,{
                new:true,
                runValidators:true,
                userFindAndModify:false
            });

            return res.status(200).json({
                success:true,
                message:"User role updated successfully!.",
                data:update
            })
         
        }catch(e){
            console.log(e,"err")
            return res.status(500).json({
                success: false,
                message:"Internal server error!.", 
              
            });
        }
    },

     /// delete user by id --- admin 
     deleteSingleUser:async(req,res)=>{
        try{
           
            const user = await User.findById(req.params.id);
            if(!user){
                return  res.status(400).json({
                    sucess:false,
                    message:`User does not exists ${req.params.id}` 
                })
            }
              await user.remove();
              return res.status(200).json({
                success:true,
                message:"User delete successfully"
              })
        }catch(e){
            console.log(e,"err")
            return res.status(500).json({
                success: false,
                message:"Internal server error!.", 
              
            });
        }
    },
}

module.exports = userController;