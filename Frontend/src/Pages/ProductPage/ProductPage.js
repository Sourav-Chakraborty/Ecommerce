import { Button, Card, Container, Grid } from "@material-ui/core";
import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import axios from "axios";
import "./productpage.css";
import { connect } from "react-redux";
import Rating from '@material-ui/lab/Rating';
import { incrementCartVal } from "../../Redux_Store/actions/cartAction";
import {addToCompare} from "../../Redux_Store/actions/compareAction"
import CommentContainer from "../../Components/CommentContainer/CommentContainer";
class ProductPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      type: "",
      company: "",
      model: "",
      country: "",
      mfg: "",
      rating: "",
      desc: "",
      price: "",
      img: "",
    };
  }
  fetchProductInfo = async () => {
    const { id } = this.props.match.params;
    const response = await axios.get(`http://localhost:5000/getProduct/${id}`);
    const data = response.data;
    const {
      name,
      type,
      company,
      model,
      country,
      mfg,
      rating,
      desc,
      price,
      img,
    } = data;
    this.setState((prevState) => {
      prevState.name = name;
      prevState.type = type;
      prevState.company = company;
      prevState.model = model;
      prevState.country = country;
      prevState.mfg = mfg;
      prevState.rating = rating;
      prevState.desc = desc;
      prevState.price = price;
      prevState.img = img;
      return prevState;
    });
  };
  addToCart =async () => {
    const { id } = this.props.match.params;
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
    }
    else{
      this.props.changeAlert(true,"error",'already in cart')
      setTimeout(()=>{
      this.props.changeAlert(false)

      },5000)
    }
    
    
   
  };

  handleAddToCompare=async()=>{
    const { id } = this.props.match.params;
    const config = {
      headers: {
        "auth-token": localStorage.getItem("token"),
      },
    };
    const response=await axios.put("http://localhost:5000/addToCompare",{id},config)
    if(response.data.msg==="Successfully added to your compare list"){
      this.props.incrementCompare()
      this.props.changeAlert(true,"success",response.data.msg)
      setTimeout(()=>{
      this.props.changeAlert(false)

      },5000)
    }
    else{
      this.props.changeAlert(true,"error",response.data.msg)
      setTimeout(()=>{
      this.props.changeAlert(false)

      },5000)
    }
  }
  componentDidMount() {
    this.fetchProductInfo();
  }
  render() {
    const rationg=this.state.rating
    return (
      <div className="productPage">
        <Grid align="center">
          <Card className="heading">
            <h2>{this.state.name}</h2>
          </Card>
        </Grid>
        <Container className="productContainer">
          <Grid container spacing={2}>
            <Grid item xs={5}>
              <Card className="imgCard">
                <img style={{height:"300px",width:"400px"}} src={`/${this.state.img}`} alt="" />
              </Card>
            </Grid>
            <Grid item xs={6}>
              <Card className="productInfo">
                <Grid xs={3} className="specs">
                  <h6 style={{ marginBottom: "0" }}>Brand</h6>
                  {this.state.company}
                </Grid>
                <Grid xs={3} className="specs">
                  <h6 style={{ marginBottom: "0" }}>Model</h6>
                  {this.state.model}
                </Grid>
                <Grid xs={3} className="specs">
                  <h6 style={{ marginBottom: "0" }}>type</h6>
                  {this.state.type}
                </Grid>
                <Grid xs={3} className="specs">
                  <h6 style={{ marginBottom: "0" }}>Country</h6>
                  {this.state.country}
                </Grid>
                <Grid xs={3} className="specs">
                  <h6 style={{ marginBottom: "0" }}>Mfg year</h6>
                  {this.state.mfg}
                </Grid>
                <Grid xs={3} className="specs">
                  <h6 style={{ marginBottom: "0" }}>Rating</h6>
                  <Rating name="half-rating-read" value={rationg} precision={0.5} readOnly />
                  
                </Grid>
              </Card>
              {this.state.desc}
            </Grid>
          </Grid>
          <Grid className="productPageFooter" xs={12}>
            <Grid className="productPageBtns" xs={5}>
              <Button
                className="productPageBtn red mx-2"
                variant="contained"
                color="success"
                onClick={this.addToCart}
                disabled={!this.props.isLoggedin && true}
              >
                Add to Cart
              </Button>
              <Button
                className="productPageBtn green mx-2"
                variant="contained"
                color="success"
                onClick={this.handleAddToCompare}
                disabled={!this.props.isLoggedin && true}
              >
                Add to Compair
              </Button>
            </Grid>
            <Grid xs={6} className="productPagePrice">
              <h2>Price Rs. {this.state.price}</h2>
            </Grid>
          </Grid>
          <Card className="productCmt p-3 m-3">

          <CommentContainer product={this.props.match.params.id}/>
          </Card>

        </Container>
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    isLoggedin: state.loginReducers.isLoggedin,
  };
};
const mapDispatchToProps=(dispatch)=>{
  return{
    incrementCart:()=>{
      dispatch(incrementCartVal())
    },
    incrementCompare:(n=1)=>{
      dispatch(addToCompare(n))
    }
  }
}
export default connect(mapStateToProps,mapDispatchToProps)(withRouter(ProductPage));
