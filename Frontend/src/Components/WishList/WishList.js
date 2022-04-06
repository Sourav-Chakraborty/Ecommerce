import React, { Component } from "react";
import { Container } from "@material-ui/core";
import axios from "axios";
import { incrementCartVal } from "../../Redux_Store/actions/cartAction";
import { connect } from "react-redux";

class WishList extends Component {
  addToCart = async () => {
    const id = this.props.id;
    const config = {
      headers: {
        "auth-token": localStorage.getItem("token"),
      },
    };
    const response = await axios.put(
      `http://localhost:5000/addToCart/${id}`,
      {},
      config
    );
    if (response.data.success) {
      this.props.incrementCart();
     this.removeFromWishList()
    }
  };
  removeFromWishList = async () => {
    const id = this.props.id;
    const config = {
      headers: {
        "auth-token": localStorage.getItem("token"),
      },
    };
    const response = await axios.put(
      `http://localhost:5000/removeFromWishList`,
      { productId: id },
      config
    );
    if (response.data.msg) {
      this.props.fetchCartitems();
      this.props.fetchWishList();
    }
  };

  render() {
    return (
      <Container>
        <div className="cartItem container">
          <div className="cartItemLeft">
            <h5 className=" text-center">{this.props.name}</h5>
            <p></p>
            <h2 className="text-center">
              Price
              <span style={{ color: "red" }}> {this.props.cost}</span> rupees
              per qty
            </h2>
            <div className="actionBtns text-center">
              <button
                type="button"
                className="btn btn-success my-2 mx-2"
                onClick={this.addToCart}
              >
                Add to Cart
              </button>
              <button
                type="button"
                className="btn btn-warning my-2 mx-2"
                onClick={this.removeFromWishList}
              >
                Remove from Wishlist
              </button>
            </div>
          </div>
          <div className="cartItemRight">
            <img
              className="cartItemImg"
              style={{ height: "100%" }}
              src={this.props.img}
              alt=""
            />
          </div>
        </div>
      </Container>
    );
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    incrementCart: () => {
      dispatch(incrementCartVal());
    },
  };
};
export default connect(null, mapDispatchToProps)(WishList);
