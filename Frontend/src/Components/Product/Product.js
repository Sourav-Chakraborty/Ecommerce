import React, { Component } from 'react'
import "./product.css"
import {Link} from "react-router-dom"
import { connect } from "react-redux";
import {incrementCartVal} from "../../Redux_Store/actions/cartAction"
import axios from 'axios';
 class Product extends Component {
  addToCart =async () => {
    const id  = this.props.id;
    const config = {
      headers: {
        "auth-token": localStorage.getItem("token"),
      },
    };
    const response=await axios.put(`http://localhost:5000/addToCart/${id}`,{},config)
    if(response.data.success){
      this.props.incrementCart()   
      this.props.changeAlert(true,"success",'Added to cart')
      setTimeout(()=>{
      this.props.changeAlert(false)

      },5000)
    }else{
      this.props.changeAlert(true,"error",'already in cart')
      setTimeout(()=>{
      this.props.changeAlert(false)

      },5000)
    }
   
  };
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
                <button className='mx-2 cardBtnGreen' onClick={this.addToCart} disabled={!this.props.isLoggedin && true}>Add Cart</button> 
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
const mapDispatchToProps=(dispatch)=>{
  return{
    incrementCart:()=>{
      dispatch(incrementCartVal())
    }
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(Product)