const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const date = require("date-and-time");
const Razorpay=require("razorpay")
const User = require("../model/user");
const Product = require("../model/product");
const paypal = require("paypal-rest-sdk");
const Address = require("../model/address");
const Order = require("../model/Orders");
const { findOne } = require("../model/user");
const sendEmail=require("../sendEmailSendgrid")
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
  res.json({ authToken, isAdmin: false, cartItem: 0 });
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
  const authToken = jwt.sign(data, JSONSECRET);
  console.log("no of item in cart", cartItem);
  res.json({ authToken, isAdmin: user.isAdmin, cartItem });
};

const forgetPassword = async (req, res) => {
  const { email } = req.body;
  const randomNumber = generate();
  let user = await User.find({ email });
  if (!user.length) return res.json({ msg: "Email is not registered with us" });
  await User.updateOne({ email }, { passCodeForForgetPassword: randomNumber });
  sendEmail(email,randomNumber)
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
    userOrders.push({ data: orders[i].date, products: productList });
  }
  res.json({ userOrders });
};



const payWithRazorpay =async (req, res) => {
  const {amount}=req.body
  const instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_SECRET,
  });

  const options = {
    amount: parseInt(amount)*100, // amount in smallest currency unit
    currency: "INR",
    receipt: "receipt_order_74394",
  };

  const order = await instance.orders.create(options);

  if (!order) return res.status(500).send("Some error occured");

  res.json(order);
};

const googleLogin=async (req,res)=>{
  const {name,email}=req.body
  const user=await User.findOne({email})
  if(user){
    const data = {
      user: {
        email: email,
      },
    };
    const authToken = jwt.sign(data, JSONSECRET);
    return res.json({authToken,isAdmin:user.isAdmin,cartItem:user.cart.length})
  }
  else{
    user = await User.create({ name, email, password: "Google login" });
    const data = {
      user: {
        email: email,
      },
    };
    const authToken = jwt.sign(data, JSONSECRET);
    return res.json({authToken,isAdmin:false,cartItem:0})
  }

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
  googleLogin
};
