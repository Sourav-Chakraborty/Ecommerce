const paypal = require('paypal-rest-sdk');

const configurePaypal=()=>{
    paypal.configure({
        'mode': 'sandbox', //sandbox or live
        'client_id': process.env.CLIENT_ID,
        'client_secret': process.env.CLIENT_SECRET
      });
      
}
module.exports=configurePaypal