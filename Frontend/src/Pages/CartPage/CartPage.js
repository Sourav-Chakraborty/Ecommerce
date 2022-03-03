import React, { Component } from "react";
import { connect } from "react-redux";
import { CartItem } from "../../Components";
import { makeZero } from "../../Redux_Store/actions/counterActions";
import "./cartpage.css";
 class CartPage extends Component {
   constructor(props){
     super(props)
     this.props.makeZero()
   }
  componentWillUnmount(){
    this.props.makeZero()
  }
  render() {
    const cartItem=[10000,10000,10000,10000]
    return (
      
      <>
        <div className="center">
          <h2>Your Cart items</h2>
          <div className="cartList">
            {
              cartItem.map((cart,index)=>{
                
               return <CartItem key={index} handleTotalChange={this.handleTotalChange} cost={cart}/>

              })
            }
           
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
const mapStateToProps=(state)=>{
  return{
    totalCost:state.cartAmount.val
  }
}
const mapDispatchToProps=(dispatch)=>{
  return {
    makeZero:()=>{
      dispatch(makeZero())
    }
  }
}
export default connect(mapStateToProps,mapDispatchToProps)(CartPage)