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
        type:String,
       default:undefined
    },
    child:{
       type:Array,
       default:[]
    },
    body:{
        type:String
    },
   
})

const Comment=mongoose.model("Comment",comments)

module.exports=Comment