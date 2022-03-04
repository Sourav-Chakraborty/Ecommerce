import React, { Component } from "react";
import Carousel from "../../Components/Carousel";
import {Grid } from "@material-ui/core";
import Product from "../../Components/Product/Product";
import axios from "axios"
import "./Homepage.css";
export default class Homepage extends Component {
  constructor(props){
    super(props)
    this.state={
      product:[]
    }
  }
  fetchAllProducts=async()=>{
      const response=await axios.get("http://localhost:5000/getAllProduct")
      const productsArray=(response.data.length? response.data:[])
      this.setState((prevState)=>{
        prevState.product=productsArray
        return prevState
      })

  }
  componentDidMount(){
    this.fetchAllProducts()
  }
  render() {
  
    return (
      <>
        <Carousel />
        <Grid align="center">
          <h3 className="my-3">Our products</h3> 
        </Grid>
        <div className="caroselView">

           {
             this.state.product.map(p=> <Product key={p._id} name={p.name} price={p.price} img={p.img} desc={p.desc} id={p._id}/>)
            
            }
           
          </div>
      </>
    );
  }
}
