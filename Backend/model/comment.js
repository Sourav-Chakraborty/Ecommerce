const mongoose=require("mongoose")

const {Schema}=mongoose
const comments=new Schema({
    product:{
        type:String,
        required:true
    },
    user:{
        type:Object,
        required:true       
    },
    parent:{
       
    },
    child:{
       
    },
    body:{
        type:String
    },
   
})

const Comment=mongoose.model("Comment",comments)

module.exports=Comment