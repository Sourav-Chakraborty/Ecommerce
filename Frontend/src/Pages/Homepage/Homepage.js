import React, { Component } from "react";
import Carousel from "../../Components/Carousel";
import { Container, Grid, TextField } from "@material-ui/core";
import Product from "../../Components/Product/Product";
import axios from "axios";
import "./Homepage.css";
export default class Homepage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allproducts:[],
      product: [],
    };
    this.deleteProduct.bind(this)
  }
  fetchAllProducts = async () => {
    const response = await axios.get("http://localhost:5000/getAllProduct");
    const productsArray = response.data.length ? response.data : [];
    this.setState((prevState) => {
      prevState.allproducts=productsArray
      prevState.product = productsArray;
      return prevState;
    });
  };
  handleChange=(e)=>{
    const productsArray=[]
    console.log(this.state.allproducts)
    this.state.allproducts.forEach((p)=>{
      if(p.name.toLowerCase().includes(e.target.value.toLowerCase()))
        productsArray.push(p)
    })
    this.setState((prevState)=>{
      prevState.product=productsArray
      return prevState
    })

  }

  deleteProduct=async (id)=>{
    const config = {
      headers: {
        "auth-token": localStorage.getItem("token"),
      },
    };
    const response=await axios.delete(`http://localhost:5000/deleteProduct/${id}`,config)
    console.log(response)
    if(response.data.status){
      this.fetchAllProducts()
    }
  }



  componentDidMount() {
    this.fetchAllProducts();
  }
  render() {
    return (
      <>
        <Carousel />
        <Container>

          <Grid align="center">
            <h3 className="my-3">Our products</h3>
        <TextField onChange={this.handleChange} id="outlined-basic"  variant="outlined" placeholder="Search for items" style={{width:"60%",height:"10px",marginBottom:"38px"}}/>
          </Grid>
          <div className="caroselView my-3">
            {this.state.product.map((p) => (
              <Product
                deleteProduct={this.deleteProduct}
                changeAlert={this.props.changeAlert}
                key={p._id}
                name={p.name}
                price={p.price}
                img={p.img}
                desc={p.desc}
                id={p._id}
              />
            ))}
          </div>
        </Container>
      </>
    );
  }
}
