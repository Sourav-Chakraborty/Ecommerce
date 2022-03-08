import {add} from "../../Redux_Store/actions/counterActions"
import React, { Component } from "react";
import "./cartitem.css";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import axios from "axios";

class CartItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cost:0,
      qty: 0,
    };
  }
  static getDerivedStateFromProps(props,state){
    if(props.cost!==state.cost){
      console.log("state value changed")
      return {
        cost:parseInt(props.cost),
        qty:parseInt(props.qty)
      }
    }
    return null
  }
  handleChange = async (e) => {
    const n = e.target.value;
    const prevN=this.state.qty
    this.setState((prevstate) => {
      prevstate.qty = n;
      return prevstate;
    });

    const changeInAmount=(n-prevN)*this.state.cost
    this.props.add(changeInAmount)
    const configure={
      headers: {
        "auth-token": localStorage.getItem("token"),
      },
    }
    const response=await axios.put(`http://localhost:5000/editCartItem/${this.props.id}/${n}`,{},configure)
    console.log(response)

  }
  componentDidMount(){
    this.props.add(this.props.cost*this.props.qty)
  }
  handleDelete=()=>{
    const id=this.props.id
    const amount=this.state.qty * this.state.cost
    this.props.deleteCartItem(id,amount)
  }
  componentDidUpdate(){
    console.log("component updated")
  }
  render() {
    
    
    const amount=this.state.cost * this.state.qty
    const arrayOfNo = Array.from({ length: 20 }, (_, i) => i + 1);
    return (
      <div className="cartItem container">
        <div className="cartItemLeft">
         
          <h5
            className="productName"
            style={{ display: "inline", marginTop: "10px" }}
          >
            {this.props.name}
          </h5>
          <p>Price {this.props.cost} rupees per qty</p>
          <h2>
            Need to pay: Rs  
            <span style={{ color: "red" }}>{amount}</span>
          </h2>
          <button type="button" className="btn btn-danger my-4" onClick={this.handleDelete}>
            remove from cart 
          </button>
        </div>
        <div className="cartItemRight">
          <img
            className="cartItemImg"
            src={this.props.img}
            alt=""
          />

          <select onChange={this.handleChange} value={this.state.qty} name="qty" id="cars">
            {arrayOfNo.map((N) => (
              <option key={N} value={N}>
                {N}
              </option>
            ))}
          </select>
        </div>
      </div>
    );
  }
}
const mapDispatchToProps=(dispatch)=>{
    return {
      add:(amount)=>{
        dispatch(add(amount))
      }
    }
}
export default connect(null,mapDispatchToProps)(CartItem)