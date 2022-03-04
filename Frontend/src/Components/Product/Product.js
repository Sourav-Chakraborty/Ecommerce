import React, { Component } from 'react'
import "./product.css"
import {Link} from "react-router-dom"

export default class Product extends Component {

  render() {
    const {img,desc,name,id,price}=this.props
    return (
      <div className='productCard'>
          <div className="productImg">
              <img className='productImg' src={img} alt="" />
          </div>
          <div className="productBody">
              <h5 className="productBodyHeader">{name}</h5>
                <h6 className="productBodyHeader">Rs {price}</h6>
              <p className="content">
                  {desc} 
              </p>
              <div className="buttons">
                 <button className='mx-2 cardBtnGreen'>Add Cart</button> 
                 <Link className='mx-2 cardBtnRed' to="/product/100">view</Link> 

              </div>
          </div>
      </div>
    )
  }
}
