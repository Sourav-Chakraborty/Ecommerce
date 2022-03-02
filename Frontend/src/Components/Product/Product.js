import React, { Component } from 'react'
import "./product.css"

export default class Product extends Component {
  render() {
    return (
      <div className='productCard'>
          <div className="productImg">
              <img className='productImg' src="https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500" alt="" />
          </div>
          <div className="productBody">
              <h5 className="productBodyHeader">Mobile</h5>
                <h6 className="productBodyHeader">Rs 100</h6>
              <p className="content">
                  Lorem ipsum dolor sit amet consectetur, adipisicing elit. Lorem ipsum dolor  
              </p>
              <div className="buttons">
                 <button className='mx-2 cardBtnGreen'>Add Cart</button> 
                 <button className='mx-2 cardBtnYellow'>view</button> 

              </div>
          </div>
      </div>
    )
  }
}
