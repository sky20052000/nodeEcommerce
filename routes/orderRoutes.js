const express = require("express");
const  router = express.Router();

const orderController = require("../controller/orderController");
const {isAuthenticatedUser , authorizeRoles}= require("../middleware/auth");

// create order 
router.post("/create",isAuthenticatedUser, orderController.createOrder );

// get single order  
router.get("/me/getSignleOrder/:id",isAuthenticatedUser,orderController.getsingleOrder );


// get all order  -- admin
router.get("/admin/getAllOrder",isAuthenticatedUser, authorizeRoles("admin"),orderController.getAllOrder );

// Login user show his all order
router.get("/me/getUserOrder",isAuthenticatedUser,orderController.getAllOrdeLoginUser );

// admin update order
router.put("/admin/updateOrder/:id",isAuthenticatedUser,authorizeRoles("admin"),orderController.UpdateOrder );


// admin delete order by id
router.delete("/admin/deleteOrder/:id",isAuthenticatedUser,authorizeRoles("admin"),orderController.deleteOrder );



module.exports = router;