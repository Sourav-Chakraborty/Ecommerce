const mongoose=require("mongoose")
const {Schema}=mongoose
const company=new Schema({
    name:{
        type:String,
        required:true
    }
})

const Company=mongoose.model("Company",company)

module.exports=Company