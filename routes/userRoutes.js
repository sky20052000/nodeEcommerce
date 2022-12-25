const express = require("express");
const  router = express.Router();
const userController = require("../controller/userController");
const {isAuthenticatedUser , authorizeRoles}= require("../middleware/auth");

// register user
router.post("/add", userController.register);

// login user 
router.post("/loginUser", userController.login)
// logout user 
router.get("/logout", userController.logoutUser)

// forgetPassoword
router.post("/password/forget", userController.forgetPassword);

// resetPassoword
router.put("/password/reset/:token", userController.resetPassword);

// get user details
router.get("/getDetails", isAuthenticatedUser,userController.getDetails);

// update password or change password
router.put("/password/update", isAuthenticatedUser,userController.updatePassword);

// update user profile
router.put("/profile/update", isAuthenticatedUser,userController.updateProfile);

// get all user (admin)
router.get("/admin/users", isAuthenticatedUser,authorizeRoles("admin"),userController.getAllUser);


// get single user (admin)
router.get("/admin/user/details/:id", isAuthenticatedUser,authorizeRoles("admin"),userController.getSingleUser);

// update user  role(admin)
router.put("/admin/user/role/:id", isAuthenticatedUser,authorizeRoles("admin"),userController.updateUserRole);

// delete single user (admin)
router.delete("/admin/user/delete/:id", isAuthenticatedUser,authorizeRoles("admin"),userController.deleteSingleUser);

module.exports = router;