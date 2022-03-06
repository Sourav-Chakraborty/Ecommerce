import {add} from "../../Redux_Store/actions/counterActions"
import React, { Component } from "react";
import "./cartitem.css";
import { connect } from "react-redux";
class CartItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cost:this.props.cost,
      qty: 1,
    };
  }
  handleChange = (e) => {
    const n = e.target.value;
    const prevN=this.state.qty
    this.setState((prevstate) => {
      prevstate.qty = n;
      return prevstate;
    });
    const changeInAmount=(n-prevN)*this.state.cost
    this.props.add(changeInAmount)
  }
  componentDidMount(){
    this.props.add(this.props.cost)
  }
 
  
  render() {
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
          <p>Price {this.state.cost} rupees per qty</p>
          <h2>
            Need to pay: Rs  
            <span style={{ color: "red" }}>{this.state.qty * this.state.cost}</span>
          </h2>
          <button type="button" class="btn btn-danger my-4">
            remove from cart 
          </button>
        </div>
        <div className="cartItemRight">
          <img
            className="cartItemImg"
            src={this.props.img}
            alt=""
          />

          <select onChange={this.handleChange} name="qty" id="cars">
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