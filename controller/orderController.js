const Order = require("../model/orderModels");
const Product = require("../model/productModels");
const orderController = {
    createOrder:async(req,res)=>{
        try{
            // console.log("hello", req.body)
          const {shippingInfo,orderItems,
            paymentInfo,itemsPrice,
            taxPrice,shippingPrice,totalPrice} =
          req.body;

          const createOrder = await Order.create({
            shippingInfo,
            orderItems,
            paymentInfo,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
            paidAt:Date.now(),
            user:req.user._id
          });
          return res.status(201).json({
            success:true,
            message:"Order created successfully!",
            data:createOrder
          })

        }catch(e){
            console.log(e,"error")
            return res.status(500).json({
                success:false,
                message:"Internal server error"
            })
        }
    },
 
    /// get single order- me(user)
  getsingleOrder:async(req,res)=>{
    try{
       const getOrder = await Order.findById(req.params.id).populate(
        "user",
        "name email"
       );
       if(!getOrder){
        return res.status(404).json({
            success:false,
            message:`No order found for this partucular:${req.params.id}`
        })
       }

      return res.status(200).json({
        success:true,
        message:"User can see the order details  with particular Id!",
        data:getOrder
      })

    }catch(e){
        console.log(e,"error")
        return res.status(500).json({
            success:false,
            message:"Internal server error"
        })
    }
  },

    /// get All order- -- admin 
    getAllOrder:async(req,res)=>{
        try{
           const getAll = await Order.find();
           let totalAmount =0;
           getAll.forEach(order => {
                totalAmount += order.totalPrice;
           });
            
          return res.status(200).json({
            success:true,
            message:"Admin can see the single our order with Id!",
            data:getAll,
            data:totalAmount
          })
    
        }catch(e){
            console.log(e,"error")
            return res.status(500).json({
                success:false,
                message:"Internal server error"
            })
        }
      },

       /// get order(logged user)
       getAllOrdeLoginUser:async(req,res)=>{
        try{
           const order = await Order.find({user:req.user._id})
            
          return res.status(200).json({
            success:true,
            message:"Logged in user find his all order",
            data:order
          })
    
        }catch(e){
            // console.log(e,"error")
            return res.status(500).json({
                success:false,
                message:"Internal server error"
            })
        }
      },

        /// update Order ---admin
        UpdateOrder:async(req,res)=>{
          try{
             const order = await Order.findById(req.params.id);
             if(!order){
              return  res.status(400).json({
                  sucess:false,
                  message:`Order does not exists ${req.params.id}` 
              })
          }
             if(order.orderStatus === "Delivered"){
              return res.status(400).json({
                success:false,
                message:"Your order is all ready delivered"
              });
             }
             order.orderItems(async(order)=>{
              await updatestock(order.product, order.quantity)
             });

             order.orderStatus = req.body.status;
             if(req.body.status === "Delivered"){
              order.deliveredAt= Date.now();
             }

             await order.save();
              
            return res.status(200).json({
              success:true,
              message:"Order status update successfully",
              data:order
            })
      
          }catch(e){
              // console.log(e,"error")
              return res.status(500).json({
                  success:false,
                  message:"Internal server error"
              })
          }
        },


  /// delete order by id --- admin 
  deleteOrder:async(req,res)=>{
    try{
       
        const order = await Order.findById(req.params.id);
        if(!order){
            return  res.status(400).json({
                sucess:false,
                message:`Order does not exists ${req.params.id}` 
            })
        }
          await order.remove();
          return res.status(200).json({
            success:true,
            message:"Order delete successfully",
            data:order
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

/// method for order update
async function updatestock(id, quantity){
      const product = await Product.findById(id);
      product.stock -= quantity;
      await product.save();
}


module.exports = orderController;