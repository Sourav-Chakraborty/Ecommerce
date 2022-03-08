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
router.post("/createProduct",fetchUser,controllers.createProduct)
router.get("/getAllProduct",controllers.getAllProducts)
router.get("/getProduct/:id",controllers.getProduct)
router.put("/addToCart/:id",fetchUser,controllers.addToCart)
router.put("/editCartItem/:id/:no",fetchUser,controllers.editCartItem)
router.get("/getCartItems",fetchUser,controllers.getCartItems)
router.put("/removeFromCart/:id",fetchUser,controllers.removeFromCart)
router.post("/addAddress",fetchUser,controllers.addAdress)
router.get("/getAddress",fetchUser,controllers.getAddress)
router.get("/totalCartPrice",fetchUser,controllers.returnCartTotal)
module.exports=router