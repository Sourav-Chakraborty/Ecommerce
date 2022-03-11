import { Box, Button, Container, Grid, Modal, Typography } from "@material-ui/core";
import axios from "axios";
import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import PaypalExpressBtn from "react-paypal-express-checkout";
import { setCartVal } from "../../Redux_Store/actions/cartAction";
import { connect } from "react-redux";

// import "./paypage.css"
class PayPage extends Component {
  constructor(props) {
    super(props);
    if (!this.props.isLoggedin) this.props.history.push("/login");
    this.state = {
      open:false,
      totalCost: 0,
      env: "sandbox",
      currency: "USD",
    };
  }
  style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };
  loadScript = (src) => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  handleRazorpay = async () => {
    const config = {
      headers: {
        "auth-token": localStorage.getItem("token"),
      },
    };
    const res = await this.loadScript(
      "https://checkout.razorpay.com/v1/checkout.js"
    );
    if (!res) {
      alert("Razorpay SDK failed to load. Are you online?");
      return;
    }
    const result = await axios.post(
      "http://localhost:5000/razorpay/orders",
      { amount: this.state.totalCost },
      config
    );
    if (!result) {
      alert("Server error. Are you online?");
      return;
    }

    const { amount, id: order_id, currency } = result.data;

    const options = {
      key: "rzp_test_0YO9lZ0C5COz1r", // Enter the Key ID generated from the Dashboard
      amount: amount.toString(),
      currency: currency,
      name: "Ecommerce Company",
      description: "Test Transaction",

      order_id: order_id,
      handler: async (response) => {
        const data = {
          orderCreationId: order_id,
          razorpayPaymentId: response.razorpay_payment_id,
          razorpayOrderId: response.razorpay_order_id,
          razorpaySignature: response.razorpay_signature,
        };

        const result = await axios.put(
          "http://localhost:5000/emptyCart",
          data,
          config
        );
        console.log("result is", result);
        if (result.data.msg) {
          this.handleModalOpen()
        }
      },

      notes: {
        address: "Ecommerce Corporate Office",
      },
      theme: {
        color: "#61dafb",
      },
    };
    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };
  handleModalOpen=()=>{
    this.setState((prevstate)=>{
      prevstate.open=true
      return prevstate
    })
  }
  handlePayment = async () => {
    const config = {
      headers: {
        "auth-token": localStorage.getItem("token"),
      },
    };
    const response = await axios.post("http://localhost:5000/pay", {}, config);
    console.log(response);
  };
  fetchTotalCost = () => {
    const config = {
      headers: {
        "auth-token": localStorage.getItem("token"),
      },
    };
    axios.get("http://localhost:5000/totalCartPrice", config).then((res) => {
      this.setState((prevstate) => {
        prevstate.totalCost = res.data.cartTotal;
        return prevstate;
      });
    });
  };
  componentDidMount() {
    this.fetchTotalCost();
  }
  onSuccess = async (payment) => {
    const config = {
      headers: {
        "auth-token": localStorage.getItem("token"),
      },
    };
    console.log("The payment was succeeded!", payment);
    const response = await axios.put(
      "http://localhost:5000/emptyCart",
      {},
      config
    );
    if (response.data.msg) {
      this.handleModalOpen()
    }
  };
  onError = (err) => {
    console.log("Error!", err);
  };
  onCancel = (data) => {
    console.log("The payment was cancelled!", data);
  };
  handleClose=()=>{
    this.setState((prevstate)=>{
      prevstate.open=false
      return prevstate
    })
    this.props.changeAlert(true, "success", "Successfully paid");
      setTimeout(() => {
        this.props.changeAlert(false);
      }, 5000);
      this.props.history.push("/");
      this.props.cartItem(0);
  }
  render() {
    let env = "sandbox";
    let currency = "USD";
    let total = parseInt(this.state.totalCost) / 75;
    const client = {
      sandbox:
        "Ad1WEixlbXi4CJmoihX3P6F8jLpxFSD_wPSyC_Jlctlw3SzwKJGrB1ws7tvwonrdfrkq8a-ZhesH7v6G",
      production: "YOUR-PRODUCTION-APP-ID",
    };
    return (
      <div>
        <Container style={{ height: "80vh" }}>
          <Grid align="center" className="midOfScreen">
            

           {parseInt(this.state.totalCost)>0? <>
            <h6>
              Remember for paypal transaction will be through us dollar only
              that is Rs {this.state.totalCost} ={" "}
              {parseInt(this.state.totalCost) / 75} USD
            </h6>
           
            <PaypalExpressBtn
              env={env}
              client={client}
              currency={currency}
              total={Math.round(total)}
              onError={this.onError}
              onSuccess={this.onSuccess}
              onCancel={this.onCancel}
            />
            <Button
              variant="contained"
              onClick={this.handleRazorpay}
              style={{
                backgroundColor: "green",
                color: "white",
                marginTop: "20px",
                cursor: "pointer",
                borderRadius: "31%",
              }}
              color="success"
            >
              pay by card/upi/net banking
            </Button></>:<>
              <h2 className="text-center">Your cart is empty,add something to pay </h2>
            
            </>
            }
          
            <Modal
        open={this.state.open}
        onClose={this.handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={this.style}>
          <Typography id="modal-modal-title" style={{color:"green"}} variant="h4" component="h1">
           Success,
          </Typography>
          <Typography style={{color:"red"}} id="modal-modal-description" sx={{ mt: 2 }}>
            You have Successfully paid & placed your order
          </Typography>
        </Box>
      </Modal>
          </Grid>
        </Container>
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    isLoggedin: state.loginReducers.isLoggedin,
    isAdmin: state.loginReducers.isAdmin,
    cartItem: state.cartItemNoReducers.item,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    cartItem: (val) => {
      dispatch(setCartVal(val));
    },
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(PayPage));
