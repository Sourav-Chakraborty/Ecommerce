const express=require("express")
require('dotenv').config()
const cors=require("cors");
const bodyParser = require('body-parser');
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)
const fileUpload=require('express-fileupload')
const connectToMongo=require("./db")
const routes=require("./routes/index")
const app=express()
app.use(cors()) 
app.use(bodyParser.urlencoded({ extended: true,limit: '50mb' }));

app.use(bodyParser.json())

app.use(express.json({limit: '50mb'}))   
app.use(fileUpload());


app.use("/",routes)
app.listen(5000,()=>{
    connectToMongo()
    console.log("Server is running at port 5000")
})