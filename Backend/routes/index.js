const express=require("express")
const controllers=require("../controller")
const router=express.Router()
const fetchUser=require("../middleware/fetchUser")



router.post("/signup",controllers.signUpController)
router.post("/signin",controllers.signInController)
router.post("/forgetPassword",controllers.forgetPassword)
router.post("/forgetPassword/changePassword",controllers.changeOldPasswordForgetPassword)
router.get("/getUser",fetchUser,controllers.getUserData)
router.put("/editUser",fetchUser,controllers.editUserData)
router.post("/uploadImg",fetchUser,controllers.uploadImg)
router.put("/changePassword",fetchUser,controllers.changePassword)
module.exports=router