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
    time:{
        type:String,
        required:true
    },
    status:{
        type:String,
        default:"Order placed"
    },
    products:{
        type:Array,
        default:[]
    },
    
})
const Order=mongoose.model("Order",orders)
module.exports=Order