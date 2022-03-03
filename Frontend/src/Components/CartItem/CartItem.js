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
            Mobile phone
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
            src="data:image/jpeg;base64,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"
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