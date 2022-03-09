import React, { Component } from 'react'

export default class OrderItem extends Component {
  render() {
    return (
      <div>
        <div className="cartItem container">
        <div className="cartItemLeft">
         
          <h2
            className="productName text-center"
            // style={{ display: "inline", marginTop: "10px" }}
          >
            {this.props.name}
          </h2>
          <h5 className='text-center'>Qty:{this.props.qty}</h5>
          <p className='text-center'>Price {this.props.price} rupees per qty</p>
          <h4 className='text-center'>
            You paid : Rs  
            <span style={{ color: "red" }}>{parseInt(this.props.qty)*parseInt(this.props.price)} for {this.props.qty}</span>
          </h4>
         
        </div>
        <div className="cartItemRight">
          <img
            className="cartItemImg"
            src={this.props.img}
            alt=""
          />

         
        </div>
      </div>

      </div>
    )
  }
}
