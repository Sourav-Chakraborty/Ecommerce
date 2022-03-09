const mongoose=require("mongoose")
const {Schema}=mongoose
const orders=new Schema({
    email:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        default:new Date
    },
    products:{
        type:Array,
        default:[]
    },
    
})
const Order=mongoose.model("Order",orders)
module.exports=Order