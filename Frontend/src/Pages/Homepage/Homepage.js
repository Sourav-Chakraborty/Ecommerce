import React, { Component } from "react";
import Carousel from "../../Components/Carousel";
import {Grid } from "@material-ui/core";
import Product from "../../Components/Product/Product";
import "./Homepage.css";
export default class Homepage extends Component {
  render() {
    return (
      <>
        <Carousel />
        <Grid align="center">
          <h3 className="my-3">Our products</h3> 
        </Grid>
        <div className="caroselView">
            <Product />
           <Product />
            <Product />
            <Product />
            <Product />
            <Product />
            <Product /> 
            <Product /> 
            <Product /> 
            <Product /> 
            <Product /> 

            <Product />
          </div>
      </>
    );
  }
}
