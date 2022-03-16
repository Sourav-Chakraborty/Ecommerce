import { Container, Grid } from '@material-ui/core';
import axios from 'axios';
import React, { Component } from 'react'
import Carousel from '../../Components/Carousel';

export default class Homepage2 extends Component {
    constructor(props) {
        super(props);
        this.state = {
          allproducts: [],
          product: [],
        };
        this.deleteProduct.bind(this);
      }
      fetchAllProducts = async () => {
        const response = await axios.get("http://localhost:5000/getAllProduct");
        const productsArray = response.data.length ? response.data : [];
        this.setState((prevState) => {
          prevState.allproducts = productsArray;
          prevState.product = productsArray;
          return prevState;
        });
      };
      handleChange = (e) => {
        const productsArray = [];
        console.log(this.state.allproducts);
        this.state.allproducts.forEach((p) => {
          if (p.name.toLowerCase().includes(e.target.value.toLowerCase()))
            productsArray.push(p);
        });
        this.setState((prevState) => {
          prevState.product = productsArray;
          return prevState;
        });
      };
    
      deleteProduct = async (id) => {
        const config = {
          headers: {
            "auth-token": localStorage.getItem("token"),
          },
        };
        const response = await axios.delete(
          `http://localhost:5000/deleteProduct/${id}`,
          config
        );
        console.log(response);
        if (response.data.status) {
          this.fetchAllProducts();
        }
      };
    
      componentDidMount() {
        this.fetchAllProducts();
      }
  render() {

    return (
      <div>
            <Carousel />
           <Container>
                <Grid style={{display:"flex"}} item xs={12} md={12}>
                    <Grid item xs={4} md={4}>
                        grid with xs={4}
                    </Grid>
                    <Grid item xs={8} md={8}>
                        Grid with xs={8}
                    </Grid>
                </Grid>



           </Container>
      </div>
    )
  }
}
