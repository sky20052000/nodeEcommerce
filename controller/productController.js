const Product = require("../model/productModels");
const Apifeatures = require("../utils/apiFeatures");

const productController = {
    create:async(req,res)=>{
        try{
           const createProduct = new Product(req.body);
           const saveProduct = await createProduct.save();
           if(!saveProduct){
            return res.status(400).json({
                success:false,
                message:"No product found"
            })
           }
           return res.status(201).json({
            success:true,
            message:"Product creaeted Succcessfully!.",
            data:saveProduct
           })
        }catch{
            return res.status(500).json({
                success: false,
                message:"Internal server error!."
            });
        }
    }, 
    getAllproduct:async(req,res)=>{
        try{
             ///const apiFetaure = new Apifeatures(Product.find(), req.query.keyword).search();
            const getProducts = await Product.find();
            return res.status(200).json({
                success:true,
                message:"Get all products!.",
                data:getProducts
            })
        }catch{
            return res.status(500).json({
                success: false,
                message:"Internal server error!."
            });
        }
    },

    getproductDetails:async(req,res)=>{
        try{
            const _id = req.params.id;
            const getDetails = await Product.findById(_id);
            return res.status(200).json({
                success:true,
                message:"Get products details!.",
                data:getDetails
            })
        }catch{
            return res.status(500).json({
                success: false,
                message:"Internal server error!."
            });
        }
    },

    updateproduct:async(req,res)=>{
        try{
          const _id = req.params.id;
          const updateProduct = await Product.findByIdAndUpdate(_id, req.body) ;
          if(!updateProduct){
            return res.status(400).json({
                success:false,
                message:"Something went wrong."
            });
          }
          return res.status(200).json({
            success:true,
            message:"Product updated Successfully.",
            data:updateProduct
          })
        }catch{
            return res.status(500).json({
                success: false,
                message:"Internal server error!."
            });
        }
    },

    deleteproduct:async(req,res)=>{
        try{
          const _id = req.params.id;
          const product = await Product.findByIdAndDelete(_id) ;
          if(!product){
            return res.status(400).json({
                success:false,
                message:"Something went wrong."
            });
          }
          return res.status(200).json({
            success:true,
            message:"Product Delete Successfully.",
            data:product
          })
        }catch{
            return res.status(500).json({
                success: false,
                message:"Internal server error!."
            });
        }
    }
} 

module.exports = productController;