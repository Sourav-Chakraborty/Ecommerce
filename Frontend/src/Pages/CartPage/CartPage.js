import axios from "axios";
import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { CartItem } from "../../Components";
import { makeZero, add } from "../../Redux_Store/actions/counterActions";
import { decrementCartVal } from "../../Redux_Store/actions/cartAction";
import WishList from "../../Components/WishList/WishList"
import "./cartpage.css";
class CartPage extends Component {
  constructor(props) {
    super(props);
    if (!this.props.isLoggedIn) this.props.history.push("/login");
    this.props.makeZero();
    this.state = {
      cartItem: [],
      wishList:[]
    };
    this.deleteCartItem.bind(this);
    this.fetchCartitems.bind(this);
    this.fetchWishList.bind(this)
  }
  deleteCartItem = async (id, amount) => {
    const config = {
      headers: {
        "auth-token": localStorage.getItem("token"),
      },
    };
    const response = await axios.put(
      `http://localhost:5000/removeFromCart/${id}`,
      {},
      config
    );
    this.props.changeAlert(true, "success", "Deleted from cart");
    setTimeout(() => {
      this.props.changeAlert(false);
    }, 5000);
    this.props.decrementCart();
    this.props.add(-amount);
    this.fetchCartitems();
    this.fetchWishList()
  };
  fetchCartitems = async () => {
    const config = {
      headers: {
        "auth-token": localStorage.getItem("token"),
      },
    };
    const response = await axios.get(
      "http://localhost:5000/getCartItems",
      config
    );
    console.log(response);
    if (response.data.cartItems) {
      this.setState((prevState) => {
        prevState.cartItem = response.data.cartItems;
        return prevState;
      });
      console.log("cart items ", response.data.cartItems);
    }
  };
  fetchWishList=async ()=>{
    const config = {
      headers: {
        "auth-token": localStorage.getItem("token"),
      },
    };
    const response = await axios.get(
      "http://localhost:5000/getWishList",
      config
    );
   this.setState((prevState)=>{
     prevState.wishList=response.data
     return prevState
   })
  }
  componentDidMount() {
    this.fetchCartitems();
    this.fetchWishList()
  }
  componentWillUnmount() {
    this.props.makeZero();
  }
  render() {
    return (
      <div style={{minHeight:"89vh"}}>
        <div className="center" >
          <h2>Your Cart items</h2>
          <div className="cartList">
            {this.state.cartItem.map((cart, index) => {
              return (
                <CartItem
                  qty={cart.qty}
                  id={cart.product._id}
                  key={index}
                  handleTotalChange={this.handleTotalChange}
                  cost={parseInt(cart.product.price)}
                  name={cart.product.name}
                  img={cart.product.img}
                  deleteCartItem={this.deleteCartItem}
                />
              );
            })}
          </div>
        </div>
        <div className="cartFooter container">
          <button
            className="totalBtn btn btn-success"
            onClick={() => this.props.history.push("/address")}
          >
            Total Cost Rs{" "}
            <span style={{ color: "yellow" }}>{this.props.totalCost}</span>
            ,click to proceed
          </button>
        </div>
        <div className="wishList">
          <h2 className="text-center">
            Your Wish List
          </h2>
          {
            this.state.wishList.map((p)=>{
              return <WishList fetchCartitems={this.fetchCartitems} fetchWishList={this.fetchWishList}  key={p.id} id={p._id} name={p.name} cost={p.price} img={p.img}/>
            })
          }
        </div>
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.loginReducers.isLoggedin,
    totalCost: state.cartAmount.val,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    makeZero: () => {
      dispatch(makeZero());
    },
    add: (amount) => {
      dispatch(add(amount));
    },
    decrementCart: () => {
      dispatch(decrementCartVal());
    },
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(CartPage));
