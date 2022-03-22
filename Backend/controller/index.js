const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const date = require("date-and-time");
const Razorpay = require("razorpay");
const User = require("../model/user");
const Product = require("../model/product");
const paypal = require("paypal-rest-sdk");
const Address = require("../model/address");
const Order = require("../model/Orders");
const Category = require("../model/category");
const Company = require("../model/company");
const Comment=require("../model/comment")
const { findOne } = require("../model/user");
const sendEmail = require("../sendEmailSendgrid");
const { response } = require("express");
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
  let user = await User.find({ email });
  if (user.length) return res.json({ msg: "Sorry user already exists" });
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);

  user = await User.create({ name, email, password: hash });
  const data = {
    user: {
      email: email,
    },
  };
  const authToken = jwt.sign(data, JSONSECRET);
  console.log(data);
  res.json({ authToken, isAdmin: false, cartItem: 0,compareItem:0 });
};

const signInController = async (req, res) => {
  const { email, password } = req.body;

  let user = await User.findOne({ email });

  if (!user) return res.json({ msg: "Invalid user name or password" });

  const compairPassword = await bcrypt.compare(password, user.password);

  if (!compairPassword)
    return res.json({ msg: "Invalid user name or password" });
  const data = {
    user: {
      email: email,
    },
  };
  const cartItem = user.cart.length;
  const compareItem=user.compare.length
  const authToken = jwt.sign(data, JSONSECRET);
  
  res.json({ authToken, isAdmin: user.isAdmin, cartItem,compareItem });
};

const forgetPassword = async (req, res) => {
  const { email } = req.body;
  const randomNumber = generate();
  let user = await User.find({ email });
  if (!user.length) return res.json({ msg: "Email is not registered with us" });
  await User.updateOne({ email }, { passCodeForForgetPassword: randomNumber });
  sendEmail(email, randomNumber);
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
  const userToken = token;
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

const getUserData = async (req, res) => {
  const userInfo = await User.findOne({ email: req.user });
  const { name, email, img, ...otherInfo } = userInfo;
  res.json({ name, email, img });
};

const editUserData = async (req, res) => {
  const { email, name } = req.body;
  if (req.user !== email) {
    const user = await User.findOne({ email });
    if (user) return res.json({ msg: "email already exists" });
    const userUpdated = await User.findOneAndUpdate(
      { email: req.user },
      { email, name: name }
    );

    const data = {
      user: {
        email: email,
      },
    };
    const authToken = jwt.sign(data, JSONSECRET);

    return res.json({ authToken });
  }
  const userUpdated = await User.findOneAndUpdate(
    { email: req.user },
    { name: name }
  );
  const data = {
    user: {
      email: email,
    },
  };
  const authToken = jwt.sign(data, JSONSECRET);

  res.json({ authToken });
};

const uploadImg = async (req, res) => {
  const profileImg = req.files.profile;

  const date = Date.now() + ".jpg";
  const imgPath = __dirname.slice(0, -19) + "/Frontend/public/" + date;
  profileImg.mv(imgPath, async (err) => {
    if (err) return console.log(err);
    await User.findOneAndUpdate({ email: req.user }, { img: date });
    res.json({ img: date });
  });
};

const changePassword = async (req, res) => {
  const { oldPass, newPass } = req.body;
  const user = await User.findOne({ email: req.user });
  const compairPassword = await bcrypt.compare(oldPass, user.password);

  if (!compairPassword) return res.json({ wrongPass: true });
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(newPass, salt);
  await User.findOneAndUpdate({ email: req.user }, { password: hash });
  res.json({ msg: "password changed successfully" });
};

const createProduct = async (req, res) => {
  const user = await User.findOne({ email: req.user });
  if (!user.isAdmin) {
    return res.json({ msg: "You are not an admin" });
  }
  const productImg = req.files.pImg;

  const date = Date.now() + ".jpg";
  const imgPath = __dirname.slice(0, -19) + "/Frontend/public/" + date;

  productImg.mv(imgPath, async (err) => {
    if (err) return console.log(err);
    console.log("Uploaded");
  });
  const { name, type, company, model, country, mfg, rating, desc, price } =
    req.body;

  const isProductExists = await Product.findOne({
    $and: [{ name }, { model }],
  });

  if (isProductExists) return res.json({ msg: "Product already exists" });

  Category.findOne({ name: type.toLowerCase() }).then((res) => {
    if (!res) Category.create({ name: type.toLowerCase() });
  });

  Company.findOne({ name: company.toLowerCase() }).then((res) => {
    if (!res) Company.create({ name: company.toLowerCase() });
  });

  const product = await Product.create({
    name,
    type,
    company,
    model,
    country,
    mfg,
    rating,
    desc,
    price,
    img: date,
  });
  // console.log(product,date)
  res.json(product);
};

const deleteProduct = async (req, res) => {
  const id = req.params.id;
  const user = await User.findOne({ email: req.user });
  if (user.isAdmin === false) return res.json({ msg: "You are not admin" });
  await Product.findByIdAndRemove(id);
  res.json({ status: "200", msg: "Removed successfully" });
};

const editProduct = async (req, res) => {
  const user = await User.findOne({ email: req.user });
  if (user.isAdmin === false) return res.json({ msg: "You are not admin" });

  const { name, type, company, model, country, mfg, rating, desc, price, id } =
    req.body;
  Category.findOne({ name: type.toLowerCase() }).then((res) => {
    if (!res) Category.create({ name: type.toLowerCase() });
  });

  Company.findOne({ name: company.toLowerCase() }).then((res) => {
    if (!res) Company.create({ name: company.toLowerCase() });
  });

  await Product.findByIdAndUpdate(id, {
    name,
    type,
    company,
    model,
    country,
    mfg,
    rating,
    desc,
    price,
  });
  return res.json({ status: "200", msg: "Successfully edited" });
};

const changeProductImg = async (req, res) => {
  const user = await User.findOne({ email: req.user });
  if (user.isAdmin === false) return res.json({ msg: "You are not admin" });
  const productImg = req.files.productImg;

  const date = Date.now() + ".jpg";
  const imgPath = __dirname.slice(0, -19) + "/Frontend/public/" + date;
  productImg.mv(imgPath, (err) => {
    if (err) return console.log(err);
    console.log("Successfully uploaded");
  });

  const { id } = req.body;
  await Product.findByIdAndUpdate(id, { img: date });
  res.json({ img: date, msg: "Uploaded" });
};

const getAllProducts = async (req, res) => {
  const product = await Product.find({});
  res.json(product);
};

const getProduct = async (req, res) => {
  const id = req.params.id;
  const product = await Product.findById(id);
  res.json(product);
};

const addToCart = async (req, res) => {
  const productId = req.params.id;
  let user = await User.findOne({
    email: req.user,
    "cart.productId": productId,
  });
  if (user) return res.json({ msg: "Already exists in cart" });
  user = await User.findOne({ email: req.user });

  await user.updateOne({ $push: { cart: { productId, qty: 1 } } });
  res.json({ msg: "added to cart", success: true });
};

const getCartItems = async (req, res) => {
  const user = await User.findOne({ email: req.user });
  console.log("From fast");
  const cartItems = [];
  for (let i = 0; i < user.cart.length; i++) {
    let product = await Product.findById(user.cart[i].productId);

    cartItems.push({ product, qty: user.cart[i].qty });
  }
  res.json({ cartItems });
};

const editCartItem = async (req, res) => {
  const id = req.params.id;
  const no = req.params.no;
  await User.updateOne(
    { email: req.user, "cart.productId": id },
    { $set: { "cart.$.qty": no } }
  );
  return res.json({ msg: "updated" });
};

const removeFromCart = async (req, res) => {
  const productId = req.params.id;

  const user = await User.updateOne(
    { email: req.user, "cart.productId": productId },
    { $pull: { cart: { productId } } }
  );

  res.json({ msg: "removed from cart" });
};

const returnCartTotal = async (req, res) => {
  const user = await User.findOne({ email: req.user });

  let cartTotal = 0;
  for (let i = 0; i < user.cart.length; i++) {
    let product = await Product.findById(user.cart[i].productId);
    const totalPrice = parseInt(product.price);
    cartTotal += totalPrice * parseInt(user.cart[i].qty);
  }
  res.json({ cartTotal });
};

const addAdress = async (req, res) => {
  const { name, mobile, address } = req.body;
  const email = req.user;
  const newAddress = await Address.updateOne(
    { email },
    { name, mobile, address },
    { upsert: true, new: true }
  );
  console.log(newAddress);
  res.json({ msg: "Address set successfully", success: true });
};
const getAddress = async (req, res) => {
  const address = await Address.findOne({ email: req.user });
  res.json(address);
};

const emptyCart = async (req, res) => {
  const user = await User.findOne({ email: req.user });
  const userCart = user.cart;
  const updatedUser = await User.findOneAndUpdate(
    { email: req.user },
    { cart: [] }
  );
  const d = date.format(new Date(), "YYYY/MM/DD HH:mm:ss");

  const order = await Order.create({
    email: req.user,
    products: userCart,
    date: d,
    time:
      new Date().getHours() +
      ":" +
      new Date().getMinutes() +
      ":" +
      new Date().getSeconds(),
  });
  res.json({ msg: "Removed successfully" });
};

const getOrders = async (req, res) => {
  const email = req.user;
  const orders = await Order.find({ email });
  const userOrders = [];
  for (let i = 0; i < orders.length; i++) {
    const productList = [];
    for (let j = 0; j < orders[i].products.length; j++) {
      const product = await Product.findById(orders[i].products[j].productId);
      productList.push({
        name: product.name,
        price: product.price,
        img: product.img,
        qty: orders[i].products[j].qty,
      });
    }
    userOrders.push({
      data: orders[i].date,
      time: orders[i].time,
      products: productList,
      status:orders[i].status
    });
  }
  res.json({ userOrders });
};

const payWithRazorpay = async (req, res) => {
  const { amount } = req.body;
  const instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_SECRET,
  });

  const options = {
    amount: parseInt(amount) * 100, // amount in smallest currency unit
    currency: "INR",
    receipt: "receipt_order_74394",
  };

  const order = await instance.orders.create(options);

  if (!order) return res.status(500).send("Some error occured");

  res.json(order);
};

const googleLogin = async (req, res) => {
  const { name, email } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    const data = {
      user: {
        email: email,
      },
    };
    const authToken = jwt.sign(data, JSONSECRET);
    return res.json({
      authToken,
      isAdmin: user.isAdmin,
      cartItem: user.cart.length,
    });
  } else {
    user = await User.create({ name, email, password: "Google login" });
    const data = {
      user: {
        email: email,
      },
    };
    const authToken = jwt.sign(data, JSONSECRET);
    return res.json({ authToken, isAdmin: false, cartItem: 0 });
  }
};

const getAllCategories = (req, res) => {
  Category.find({}).then((response) => {
    res.json(response);
  });
};

const getAllBrands = (req, res) => {
  Company.find({}).then((response) => {
    res.json(response);
  });
};

const editCategory = (req, res) => {
  const { oldCate, newCate } = req.body;
  Category.findOneAndReplace(
    { name: oldCate },
    { name: newCate.toLowerCase() }
  ).then((response) => {
    res.json({ msg: "Successfully edited" });
  });
};

const editBrands = (req, res) => {
  const { oldBrand, newBrand } = req.body;
  Company.findOneAndReplace(
    { name: oldBrand },
    { name: newBrand.toLowerCase() }
  ).then((response) => {
    res.json({ msg: "Successfully edited" });
  });
};

const deleteCategory = (req, res) => {
  const category = req.params.cate;
  Category.findOneAndDelete({ name: category }).then((response) => {
    res.json({ msg: "Deleted successfully" });
  });
};

const deleteBrand = (req, res) => {
  const brand = req.params.brand;
  Company.findOneAndDelete({ name: brand.toLowerCase() }).then((response) => {
  
    res.json({ msg: "Deleted successfully" });
  });
};

const getAllOrders = (req, response) => {
  Order.find({}).then(async (res) => {
    let orders = [];
    for (let i = 0; i < res.length; i++) {
      let order = [];

      for (let j = 0; j < res[i].products.length; j++) {
        const res1 = await Product.findById(res[i].products[j].productId);

        order.push({
          name: res1.name,
          price: res1.price,
          img: res1.img,
          qty: res[i].products[j].qty,
        });
      }
      const user=await Address.findOne({email:res[i].email})
      orders.push({
        id: res[i]._id,
        user: user.name,
        phone:user.mobile,
        email:res[i].email,
        address:user.address,
        date: res[i].date,
        time: res[i].time,
        status: res[i].status,
        products: order,
      });
    }
    response.json(orders);
  });
};

const changeOrderStatus=(req,res)=>{
  const id=req.params.id
  const {newStatus}=req.body
  Order.findByIdAndUpdate(id,{status:newStatus}).then((response)=>{
    res.json(response)
  }) 
}

const addComment=async (req,res)=>{

  let parent=null,child=null
  
  if(req.body.parent)
      parent=req.body.parent
  else
    parent=""
  if(req.body.child)
    child=req.body.child
  else
    child=[]
  const user=await User.findOne({email:req.user})
  
  const comment=await Comment.create({
     parent,child,product:req.body.product,user:{id:user.id,name:user.name},body:req.body.comment
   })
   if(req.body.parent)
    await Comment.findByIdAndUpdate(req.body.parent,{$push:{child:comment.id}})
  res.json({msg:"Successfully posted"})
}

const getProductCmt=async (req,res)=>{
  const id=req.params.id
  const comments=await Comment.find({product:id})
  
  res.json(comments)
}

const isOwnerOfComment=async (req,res)=>{
  const id=req.params.id
  const comment=await Comment.findById(id)
  const user=await User.findOne({email:req.user})
  if(user.id===comment.user.id)
    return res.json({isOwner:true})
  else
    return res.json({isOwner:false})

}

const deleteComment=async (req,res)=>{
  const id=req.params.id
  const comment=await Comment.findById(id)
  const user=await User.findOne({email:req.user})
  if(user.id===comment.user.id){
    if(comment.child.length){
        
        await Comment.findByIdAndUpdate(id,{body:"[This message is deleted]"})  
    }
    else
      await Comment.findByIdAndDelete(id)
    if(comment.parent.length){
      
      await Comment.findByIdAndUpdate(comment.parent,{$pull:{child:id}})
    }

    return res.json({done:true})

  }
    
  else
    return res.json({done:false})
}

const editComment=async (req,res)=>{
  const id=req.params.id
  const comment=await Comment.findById(id)
  const user=await User.findOne({email:req.user})
  if(user.id===comment.user.id){
    await Comment.findByIdAndUpdate(id,{body:req.body.body})
    return res.json({done:true})
  }
  else
    return res.json({done:false})
  
}

const addToCompare=async (req,res)=>{
  const productId=req.body.id
  const user=await User.findOne({email:req.user})
  if(user.compare.includes(productId))
      return res.json({msg:"already in list"})
  else
    await user.updateOne({$push:{compare:productId}})
  return res.json({msg:"Successfully added to your compare list"})
}

module.exports = {
  signUpController,
  signInController,
  forgetPassword,
  changeOldPasswordForgetPassword,
  getUserData,
  editUserData,
  uploadImg,
  changePassword,
  createProduct,
  getProduct,
  addToCart,
  getCartItems,
  editCartItem,
  removeFromCart,
  getAllProducts,
  addAdress,
  getAddress,
  returnCartTotal,
  emptyCart,
  getOrders,
  payWithRazorpay,
  googleLogin,
  deleteProduct,
  editProduct,
  changeProductImg,
  getAllCategories,
  getAllBrands,
  editCategory,
  editBrands,
  deleteCategory,
  deleteBrand,
  getAllOrders,
  changeOrderStatus,
  addComment,
  getProductCmt,
  isOwnerOfComment,
  deleteComment,
  editComment,
  addToCompare
};
