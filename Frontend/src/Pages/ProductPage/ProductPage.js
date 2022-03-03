import { Button, Card, Container, Grid } from "@material-ui/core";
import React, { Component } from "react";
import "./productpage.css";
export default class ProductPage extends Component {
  render() {
    return (
      <div className="productPage">
        <Grid align="center">
          <Card className="heading">
            <h2>Samsung Mobiles</h2>
          </Card>
        </Grid>
        <Container className="productContainer">
          <Grid container spacing={2}>
            <Grid item xs={5}>
              <Card className="imgCard">
                <img
                  className="productPageImg"
                  src="data:image/jpeg;base64,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"
                  alt=""
                />
              </Card>
            </Grid>
            <Grid item xs={6}>
              <Card className="productInfo">
                <Grid xs={3} className="specs">
                  <h6 style={{ marginBottom: "0" }}>Brand</h6>
                  Samsung
                </Grid>
                <Grid xs={3} className="specs">
                  <h6 style={{ marginBottom: "0" }}>Brand</h6>
                  Samsung
                </Grid>
                <Grid xs={3} className="specs">
                  <h6 style={{ marginBottom: "0" }}>Brand</h6>
                  Samsung
                </Grid>
                <Grid xs={3} className="specs">
                  <h6 style={{ marginBottom: "0" }}>Brand</h6>
                  Samsung
                </Grid>
                <Grid xs={3} className="specs">
                  <h6 style={{ marginBottom: "0" }}>Brand</h6>
                  Samsung
                </Grid>
                <Grid xs={3} className="specs">
                  <h6 style={{ marginBottom: "0" }}>Brand</h6>
                  Samsung
                </Grid>
                <Grid xs={3} className="specs">
                  <h6 style={{ marginBottom: "0" }}>Brand</h6>
                  Samsung
                </Grid>
                <Grid xs={3} className="specs">
                  <h6 style={{ marginBottom: "0" }}>Brand</h6>
                  Samsung
                </Grid>
              </Card>
            </Grid>
          </Grid>
          <Grid className="productPageFooter" xs={12}>

            <Grid className="productPageBtns" xs={5}>
              <Button className="productPageBtn red mx-2" variant="contained" color="success">
                Add to Cart
              </Button>
              <Button className="productPageBtn green mx-2" variant="contained" color="success">
                Buy 
              </Button>
            </Grid>
            <Grid xs={6} className="productPagePrice">
                <h2>Price Rs. 10,000</h2>
            </Grid>
          </Grid>
          
        </Container>
      </div>
    );
  }
}
