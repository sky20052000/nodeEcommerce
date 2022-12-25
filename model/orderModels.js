const mongoose = require("mongoose"); 
//const validator = require("validator");

const orderSchema = new mongoose.Schema({
    shippingInfo:{
        address:{
            type:String,
            required:true,
            maxlength: 100
        },
        city:{
            type:String,
            required:true,
            maxlength:20
        },
        state:{
            type:String,
            required:true,
            maxlength:20
        },
        pincode:{
            type:Number,
            required:true
        },
        phoneNumber:{
            type:Number,
            required:true
        },
    },
    orderItems:[
        {
            name:{
                type:String,
                required:true
            },
            price:{
                type:String,
                required:true
            },
            quantity:{
                type:String,
                required:true
            },

            image:{
                type:String,
                required:true
            },

            product:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"Product",
                required:true
            },
        }
    ],
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    paymentInfo:{
          paymentId:{
            type:String,
            required:true
          },
          status:{
            type:String,
            required:true
          },
    },
    paidAt:{
        type:Date,
        required:true
    },
    itemsPrice:{
        type:Number,
        required:true,
        default:0
    },
    taxPrice:{
        type:Number,
        required:true,
        default:0
    },
    shippingPrice:{
        type:Number,
        required:true,
        default:0
    },
    totalPrice:{
        type:Number,
        required:true,
        default:0
    },

    orderStatus:{
        type:String,
        required:true,
        enum : ['Processing',"Pending", "Shipping","Cancel","Reject","Deliver"],
        default:"Processing"
    },
     deliveredAt:Date,
     createdAt:{
        type:Date,
        default:Date.now()
     }
});


module.exports = new mongoose.model("Order", orderSchema);