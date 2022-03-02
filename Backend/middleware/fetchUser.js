const jwt=require("jsonwebtoken")
const JWTSecret=process.env.JSONSECRET

const fetchUser=(req,res,next)=>{
    try{
    const token=req.header("auth-token")
    const data=jwt.verify(token,JWTSecret)
    req.user=data.user.email
    next()
    }catch(err){
        console.log(err)
        res.json({msg:"Make sure you have sent jwt token"})
    }
}
module.exports=fetchUser