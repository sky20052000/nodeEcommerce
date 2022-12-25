const mongoose = require("mongoose"); 
//const validator = require("validator");

const productSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,  "Please enter project Name"],
        trim:true
    },
    description:{
        type:String,
        required:[true,  "Please enter project Name"]
    },
   price:{
      type:Number,
      required:true,
      maxlength:[8]
   },

    ratings:{
        type:Number,
       default: 0
    }, 
    product_image:[
        {
            public_id:{
                type:String,
                required:true
            },
            url:{
                type:String,
                required:true
            }
        }
    ],
    category:{
        type:String,
        required:true
    },
    stock:{
        type:Number,
        required:true,
        maxlength:[4]
    }, 

    nofReviews:{
        type:Number,
        default:0
    },

    
    Reviews:[
        {
            name:{
                type:String,
                required:true
            },
            rating:{
                type:Number,
                required:true
            },
            comment:{
                type:String,
                
            },
            user:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"User"
            }
        }
    ]

},{timestamps:true});


module.exports = new mongoose.model("Product", productSchema);