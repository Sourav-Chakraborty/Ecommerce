const mongoose=require("mongoose")

const {Schema}=mongoose

const user=new Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    joinDate:{
        type:Date,
        default:Date.now
    },
    passCodeForForgetPassword:{
        type:String,
        default:0
    },
    img:{
        type:String,
        default:""
    },
    cart:{
        type:Array,
        default:[]
    },
    isAdmin:{
        type:Boolean,
        default:false
    }
})

const User=mongoose.model("User",user)
module.exports=User