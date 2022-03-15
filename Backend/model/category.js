const mongoose=require("mongoose")
const {Schema}=mongoose

const other=new Schema({
    name:{
        type:String,
        required:true
    },
    
})
const Category=mongoose.model("Category",other)

module.exports=Category
