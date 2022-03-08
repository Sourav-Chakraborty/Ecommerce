const mongoose=require("mongoose")
const {Schema}=mongoose
const address=new Schema({
    email:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    phone:{
        type:String,
        required:true
    },
    
    address:{
        type:String,
        required:true
    }
})
const Address=mongoose.model("Adress",address)
module.exports=Address

