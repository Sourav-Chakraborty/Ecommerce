import {
  Card,
  Container,
  TextareaAutosize,
  TextField,
} from "@material-ui/core";
import axios from "axios";
import { withRouter } from "react-router-dom";

import React, { Component } from "react";
import { connect } from "react-redux";
import "./createProduct.css";
import { Autocomplete } from "@material-ui/lab";
class CreateProduct extends Component {
  constructor(props) {
    super(props);
    if (!this.props.isAdmin) this.props.history.push("/");
    this.state = {
      name: "",
      type: "",
      company: "",
      model: "",
      country: "",
      year: "",
      rating: "",
      price: "",
      desc: "",
      productImg: "",
      brands:[],
      categories:[]
    };
  }
  fetchCategories=()=>{
    axios.get("http://localhost:5000/getAllCategories").then(res=>{
      this.setState((prevstate)=>{
        prevstate.categories=res.data
        return prevstate
      })
    })
  }
  fetchBrands=()=>{
    axios.get("http://localhost:5000/getAllBrands").then(res=>{
      this.setState((prevstate)=>{
        prevstate.brands=res.data
        return prevstate
      })
    })
  }
  handleChange = (e) => {
    this.setState((prevstate) => {
      if (e.target.name === "productImg")
        prevstate[e.target.name] = e.target.files[0];
      else prevstate[e.target.name] = e.target.value;
      return prevstate;
    });
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    const config = {
      headers: {
        "auth-token": localStorage.getItem("token"),
      },
    };
    const formData = new FormData();
    formData.append("name", this.state.name);
    formData.append("type", this.state.type);
    formData.append("company", this.state.company);
    formData.append("model", this.state.model);
    formData.append("country", this.state.country);
    formData.append("mfg", this.state.year);
    formData.append("rating", this.state.rating);
    formData.append("price", this.state.price);
    formData.append("desc", this.state.desc);
    formData.append("pImg", this.state.productImg);

    const response = await axios.post(
      "http://localhost:5000/createProduct",
      formData,
      config
    );
    this.props.history.push("/");
  };
  handleBrand = (e, value = 0) => {
    this.setState((prevstate)=>{
      prevstate.company=value
      return prevstate
    })
  };
  handleCategory=(e,value=0)=>{
    this.setState((prevstate)=>{
      prevstate.type=value
      return prevstate
    })
  } 
componentDidMount(){
  this.fetchBrands()
  this.fetchCategories()
}
  render() {
    console.log(this.state)
    return (
      <div className="createProduct">
        <Container>
          <Card>
            <h3 className="d-flex justify-content-center">Create Product</h3>
            <form
              className="createProductForm"
              onSubmit={(event) => this.handleSubmit(event)}
            >
              <label htmlFor="photo">Product Img</label>
              <input
                required
                onChange={this.handleChange}
                type="file"
                name="productImg"
                id=""
              />
              <div className="formRow">
                <TextField
                  required
                  name="name"
                  id="outlined-name"
                  label="Product Name"
                  onChange={this.handleChange}
                />
                <Autocomplete
                  name="oldBrand"
                  freeSolo={true}
                  style={{ width: "150px" }}
                  id="combo-box-demo"
                  onChange={(e, value) => this.handleCategory(e, value)}
                  options={this.state.categories.map((option) => option.name)}
                  renderInput={(params) => (
                    <TextField {...params} label="Category" name="type" onChange={this.handleChange}/>
                  )}
                />
                <Autocomplete
                  name="oldBrand"
                  freeSolo={true}
                  style={{ width: "150px" }}
                  id="combo-box-demo"
                  onChange={(e, value) => this.handleBrand(e, value)}
                  options={this.state.brands.map((option) => option.name)}
                  renderInput={(params) => (
                    <TextField {...params} label="Brand" name="company" onChange={this.handleChange}/>
                  )}
                />
              </div>
              <div className="formRow">
                <TextField
                  required
                  name="model"
                  id="outlined-name"
                  label="Model No."
                  onChange={this.handleChange}
                />
                <TextField
                  required
                  name="country"
                  id="outlined-name"
                  label="Country of origin"
                  onChange={this.handleChange}
                />
                <TextField
                  required
                  name="year"
                  id="outlined-name"
                  label="year of manufacture"
                  onChange={this.handleChange}
                />
              </div>
              <div className="formRow">
                <TextField
                  required
                  name="rating"
                  id="outlined-name"
                  label="Rating"
                  onChange={this.handleChange}
                />
                <TextField
                  required
                  name="price"
                  id="outlined-name"
                  label="Price"
                  onChange={this.handleChange}
                />
              </div>

              <div className="rowForDesc">
                <TextareaAutosize
                  required
                  onChange={this.handleChange}
                  name="desc"
                  aria-label="minimum height"
                  minRows={3}
                  placeholder="Short description"
                  style={{
                    width: 500,
                    marginRight: "auto",
                    marginLeft: "auto",
                  }}
                />
              </div>
              <div className="d-flex justify-content-center">
                <button
                  style={{ marginRight: "125px", marginTop: "20px" }}
                  type="submit"
                  className="btn btn-info"
                >
                  Submit
                </button>
              </div>
            </form>
          </Card>
        </Container>
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    isLoggedin: state.loginReducers.isLoggedin,
    isAdmin: state.loginReducers.isAdmin,
  };
};
export default connect(mapStateToProps)(withRouter(CreateProduct));
