import React, { Component } from "react";
import { CartItem } from "../../Components";
import "./cartpage.css";
export default class CartPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      totalCost: 0,
    };
    this.handleTotalChange.bind(this)
  }
  handleTotalChange=(amount)=>{
   console.log("amount is",amount)
   const totalRightNow=this.state.totalCost
    const updatedTotal=totalRightNow+amount
     this.setState({
      totalCost:updatedTotal
    },()=> console.log(this.state))
    
  }
  render() {
    const cartItem=[10000,10000,10000,10000]
    return (
      <>
        <div className="center">
          <h2>Your Cart items</h2>
          <div className="cartList">
            {
              cartItem.map(cart=>{
                
               return <CartItem handleTotalChange={this.handleTotalChange} cost={cart}/>

              })
            }
           
          </div>
        </div>
        <div className="cartFooter container">
          <button className="totalBtn btn btn-success">
            Total Cost Rs{" "}
            <span style={{ color: "yellow" }}>{this.state.totalCost}</span>
            ,click to proceed
          </button>
        </div>
      </>
    );
  }
}
