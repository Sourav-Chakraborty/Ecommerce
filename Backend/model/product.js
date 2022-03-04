const mongoose=require("mongoose")
const {Schema}=mongoose
const product=new Schema({
    name:{
        type:"String",
        required:true
    },
    type:{
        type:"String",
        required:true
    },
    company:{
        type:"String",
        
    },
    model:{
        type:"String",
        
    },
    country:{
        type:"String",
        
    },
    mfg:{
        type:"String",
        
    },
    rating:{
        type:"String",
      
    },
    desc:{
        type:"String",     
    },
    price:{
        type:"String",     
        required:true
    }
})

const Product=mongoose.model("Product",product)
module.exports=Product