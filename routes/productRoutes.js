const express = require("express");
const  router = express.Router();

const productController = require("../controller/productController");
const {isAuthenticatedUser , authorizeRoles}= require("../middleware/auth");

/// add new product
router.post("/add",isAuthenticatedUser,authorizeRoles("admin"),productController.create);

// get all product
router.get("/getAll",isAuthenticatedUser, productController.getAllproduct);

// update product
router.patch("/update/:id",isAuthenticatedUser,authorizeRoles("admin"), productController.updateproduct);

// update product
router.delete("/delete/:id",isAuthenticatedUser,authorizeRoles("admin"), productController.deleteproduct)

// get product details 
router.get("/details/:id", productController.getproductDetails)


module.exports = router;