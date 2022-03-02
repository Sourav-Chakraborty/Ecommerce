const mongoose=require('mongoose')

const mongoURI=process.env.MONGOURL

const connectToMongo=()=>{
    mongoose.connect(mongoURI,()=>{
        console.log("mongodb connected")
    })
}

module.exports=connectToMongo