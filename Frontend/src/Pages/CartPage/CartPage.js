import axios from "axios";
import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { CartItem } from "../../Components";
import { makeZero } from "../../Redux_Store/actions/counterActions";
import "./cartpage.css";
class CartPage extends Component {
  constructor(props) {
    super(props);
    if(!this.props.isLoggedIn)
      this.props.history.push("/login")
    this.props.makeZero();
    this.state = {
      cartItem: [],
    };
  }

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
      console.log(response)
    if (response.data.cartItems) {
      this.setState((prevState) => {
        prevState.cartItem = response.data.cartItems;
        return prevState;
      });
    }
  };
  componentDidMount() {
    this.fetchCartitems();
  }
  componentWillUnmount() {
    this.props.makeZero();
  }
  render() {
    return (
      <>
        <div className="center">
          <h2>Your Cart items</h2>
          <div className="cartList">
            {this.state.cartItem.map((cart, index) => {
             
              return (
                <CartItem
                  key={index}
                  handleTotalChange={this.handleTotalChange}
                  cost={parseInt(cart.product.price)}
                  name={cart.product.name}
                  img={cart.product.img}
                />
              );
            })}
          </div>
        </div>
        <div className="cartFooter container">
          <button className="totalBtn btn btn-success">
            Total Cost Rs{" "}
            <span style={{ color: "yellow" }}>{this.props.totalCost}</span>
            ,click to proceed
          </button>
        </div>
      </>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    isLoggedIn:state.loginReducers.isLoggedin,
    totalCost: state.cartAmount.val,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    makeZero: () => {
      dispatch(makeZero());
    },
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(CartPage));
