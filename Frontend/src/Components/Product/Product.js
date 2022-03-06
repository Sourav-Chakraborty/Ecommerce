import React, { Component } from 'react'
import "./product.css"
import {Link} from "react-router-dom"
import { connect } from "react-redux";

 class Product extends Component {

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
                   {desc.length>50? desc.slice(0,50)+"...": desc}
              </p>
              <div className="buttons">
                <button className='mx-2 cardBtnGreen' disabled={!this.props.isLoggedin && true}>Add Cart</button> 
                 <Link className='mx-2 cardBtnRed' to={`/product/${id}`}>view</Link> 
              </div>
          </div>
      </div>
    )
  }
}
const mapStateToProps=(state)=>{
  return {
    isLoggedin:state.loginReducers.isLoggedin
  }
}

export default connect(mapStateToProps)(Product)