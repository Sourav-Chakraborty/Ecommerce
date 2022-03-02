const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../model/user");
const JSONSECRET = process.env.JSONSECRET;
function generate(n = 6) {
  var add = 1,
    max = 12 - add;

  if (n > max) {
    return generate(max) + generate(n - max);
  }

  max = Math.pow(10, n + add);
  var min = max / 10;
  var number = Math.floor(Math.random() * (max - min + 1)) + min;

  return ("" + number).substring(add);
}

const signUpController = async (req, res) => {
  const { name, email, password } = req.body;
  console.log({ name, email, password })
  let user = await User.find({ email });
  if (user.length)
    return res.json({ msg: "Sorry user already exists" });
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);

  user = await User.create({ name, email, password: hash });
  const data = {
    user: {
      email: email,
    },
  };
  const authToken = jwt.sign(data, JSONSECRET);
  console.log(data)
  res.json({ authToken });
};

const signInController = async (req, res) => {

 
    const { email, password } = req.body;
   
   
    let user = await User.findOne({ email });
    
    if (!user)
      return res.json({ msg: "Invalid user name or password" });

    const compairPassword = await bcrypt.compare(password, user.password);

    if (!compairPassword)
      return res.json({ msg: "Invalid user name or password" });
    const data = {
      user: {
        email: email,
      },
    };
    
    const authToken = jwt.sign(data, JSONSECRET);
    
    res.json({ authToken });
  
    

};

const forgetPassword = async (req, res) => {
  const { email } = req.body;
  const randomNumber = generate();
  let user = await User.find({ email });
  if (!user.length)
    return res.json({ msg: "Email is not registered with us" });
  await User.updateOne({ email }, { passCodeForForgetPassword: randomNumber });
  console.log(randomNumber);
  setTimeout(async () => {
    await User.updateOne({ email }, { passCodeForForgetPassword: 0 });
  }, 300000);
  res.json({ randomNumber });
};

const changeOldPasswordForgetPassword = async (req, res) => {
  const { token, email, newPassword } = req.body;
  let user = await User.findOne({ email });
  console.log(user);
  if (user === undefined)
    return res.status(401).json({ msg: "An error occured" });
  const userToken =token;
  if (user.passCodeForForgetPassword != userToken)
    return res.status(400).json({ msg: "Token didn't match" });
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(newPassword, salt);
  user = await User.findOneAndUpdate({ email }, { password: hash });
  const data = {
    user: {
      email: email,
    },
  };
  const authToken = jwt.sign(data, JSONSECRET);

  res.json({ authToken });
};


const getUserData=async (req,res)=>{

  const userInfo= await User.findOne({email:req.user})
  const {name,email,img,...otherInfo}=userInfo
  res.json({name,email,img})


}

const editUserData=async (req,res)=>{
  const {email,name}=req.body
  if(req.user!==email){
    const user=await User.findOne({email})
    if(user)
      return res.json({msg:"email already exists"})
    const userUpdated=await User.findOneAndUpdate({email:req.user},{email,name:name})
    
    const data = {
      user: {
        email: email,
      },
    };
    const authToken = jwt.sign(data, JSONSECRET);
  
   return res.json({authToken });
  }
  const userUpdated=await User.findOneAndUpdate({email:req.user},{name:name})
  const data = {
    user: {
      email: email,
    },
  };
  const authToken = jwt.sign(data, JSONSECRET);

  res.json({ authToken });
  

  
}

const uploadImg=async (req,res)=>{
   const profileImg=req.files.profile

   const date=Date.now()+".jpg"
  const imgPath=__dirname.slice(0,-19)+"/Frontend/public/"+date
  // const imgPath="../../Frontend/public/"+date
  profileImg.mv(imgPath,async (err)=>{
    if(err)
      return console.log(err)
    await User.findOneAndUpdate({email:req.user},{img:date})
    res.json({img:date})
  })

}

const changePassword=async (req,res)=>{
  const {oldPass,newPass}=req.body
  const user=await User.findOne({email:req.user})
  const compairPassword = await bcrypt.compare(oldPass, user.password);

  if (!compairPassword)
    return res.json({wrongPass:true });
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(newPass, salt);
  await User.findOneAndUpdate({email:req.user},{password:hash})
  res.json({msg:"password changed successfully"})
}


module.exports = {
  signUpController,
  signInController,
  forgetPassword,
  changeOldPasswordForgetPassword,
  getUserData,
  editUserData,
  uploadImg,
  changePassword
};
