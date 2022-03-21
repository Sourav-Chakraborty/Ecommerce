const mongoose=require("mongoose")

const {Schema}=mongoose
const comments=new Schema({
    product:{
        type:String,
        required:true
    },
    user:{
        type:String,
        required:true
    },
    parent:{
        type:String
    },
    child:{
        type:String
    },
    body:{
        type:String
    }
})

const Comment=mongoose.model("Comment",comments)

module.exports=Comment