import React, { Component } from "react";
import Carousel from "../../Components/Carousel";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Checkbox,
  Container,
  Grid,
  Slider,
  TextField,
  Typography,
} from "@material-ui/core";
import Product from "../../Components/Product/Product";
import axios from "axios";
import "./Homepage.css";
import { Autocomplete } from "@material-ui/lab";
import CheckBoxOutlineBlank from "@material-ui/icons/CheckBoxOutlineBlank";
import CheckBox from "@material-ui/icons/CheckBox";

export default class Homepage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allproducts: [],
      product: [],
      brands: [],
      categories: [],
      price: [1000, 50000],
      userBrands: [],
      userCate: [],
      autoSuggestion: [],
    };
    this.deleteProduct.bind(this);
  }
  fetchAllProducts = async () => {
    const response = await axios.get("http://localhost:5000/getAllProduct");
    const productsArray = response.data.length ? response.data : [];
    let suggestions = [];
    productsArray.forEach((element) => {
      suggestions.push({ label: element.name, price: element.price });
    });

    this.setState((prevState) => {
      prevState.allproducts = productsArray;
      prevState.product = productsArray;
      prevState.autoSuggestion = suggestions;
      return prevState;
    });
  };
  handleChange = (e,reason="") => {
    console.log(reason)
    if(e===null){
      this.setState((prevState)=>{
        prevState.product=this.state.allproducts
        return prevState
      })
      return
    }
    const productsArray = [];
    
    this.state.allproducts.forEach((p) => {
      if (p.name.toLowerCase().includes(e.toLowerCase()))
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

    if (response.data.status) {
      this.fetchAllProducts();
    }
  };
  fetchCategories = () => {
    const config = {
      headers: {
        "auth-token": localStorage.getItem("token"),
      },
    };
    axios.get("http://localhost:5000/getAllCategories", config).then((res) => {
      this.setState((prevstate) => {
        prevstate.categories = res.data;
        return prevstate;
      });
    });
  };
  fetchBrands = () => {
    const config = {
      headers: {
        "auth-token": localStorage.getItem("token"),
      },
    };
    axios.get("http://localhost:5000/getAllBrands", config).then((res) => {
      this.setState((prevstate) => {
        prevstate.brands = res.data;
        return prevstate;
      });
    });
  };
  handleBrands = (e, value) => {
    let arrayOfBrand = [];
    for (let i = 0; i < value.length; i++) arrayOfBrand.push(value[i].name);
    console.log("arrayOfBrand ", arrayOfBrand);
    this.setState(
      (prevstate) => {
        prevstate.userBrands = arrayOfBrand;
        return prevstate;
      },
      () => {
        this.userFilter();
      }
    );
  };
  handleCategory = (e, value) => {
    let arrayOfCate = [];
    for (let i = 0; i < value.length; i++) arrayOfCate.push(value[i].name);
    this.setState(
      (prevstate) => {
        prevstate.userCate = arrayOfCate;
        return prevstate;
      },
      () => {
        this.userFilter();
      }
    );
  };
  handlePriceRange = (e, value) => {
    this.setState(
      (prevstate) => {
        prevstate.price = value;
        return prevstate;
      },
      () => {
        this.userFilter();
      }
    );
  };
  userFilter = () => {
    let userProducts = [];

    if (this.state.userBrands.length) {
      this.state.allproducts.forEach((p) => {
        this.state.userBrands.forEach((ub) => {
          if (p.company.toLowerCase() === ub.toLowerCase())
            userProducts.push(p);
        });
      });
    } else userProducts = this.state.allproducts;
    let userProducts2 = [];
    if (this.state.userCate.length) {
      this.state.userCate.forEach((uc) => {
        userProducts.forEach((up) => {
          if (up.type.toLowerCase() === uc.toLowerCase())
            userProducts2.push(up);
        });
      });
    } else userProducts2 = userProducts;

    let finalProducts = [];
    userProducts2.forEach((up) => {
      if (
        parseInt(this.state.price[0]) < parseInt(up.price) &&
        parseInt(this.state.price[1]) > parseInt(up.price)
      ) {
        console.log("inside range");
        finalProducts.push(up);
      }
    });
    this.setState((prevState) => {
      prevState.product = finalProducts;
      return prevState;
    });
  };
  componentDidMount() {
    this.fetchAllProducts();
    this.fetchBrands();
    this.fetchCategories();
  }
  render() {
    setTimeout(() => {
      const close = document.getElementsByClassName(
        "MuiButtonBase-root MuiIconButton-root MuiAutocomplete-clearIndicator MuiAutocomplete-clearIndicatorDirty"
      )[0];
      close.addEventListener("click", () => {
        this.handleChange("");
      });
    }, 100);
    return (
      <>
        <Carousel />
        <Container>
          <Grid style={{ display: "flex", flexWrap: "wrap" }} item xs={12}>
            <Grid item xs={2} md={2} sm={12}>
              <div className="filter">
                <Card sx={{ minWidth: 275 }} className="card">
                  <CardContent>
                    <Typography variant="h5" component="div">
                      Filter Products
                    </Typography>

                    <Typography variant="body2">
                      <Autocomplete
                        multiple
                        id="checkboxes-tags-demo"
                        options={this.state.brands}
                        style={{ width: "120px" }}
                        disableCloseOnSelect
                        onChange={(e, value) => this.handleBrands(e, value)}
                        getOptionLabel={(option) => option.name}
                        renderOption={(option, selected, params) => (
                          <li {...params} style={{ width: "130px" }}>
                            {option.name}
                          </li>
                        )}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Brands"
                            placeholder="Filters"
                          />
                        )}
                      />
                      <Autocomplete
                        multiple
                        id="checkboxes-tags-demo"
                        options={this.state.categories}
                        style={{ width: "120px" }}
                        disableCloseOnSelect
                        onChange={(e, value) => this.handleCategory(e, value)}
                        getOptionLabel={(option) => option.name}
                        renderOption={(option, selected, params) => (
                          <li {...params} style={{ width: "130px" }}>
                            {option.name}
                          </li>
                        )}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Category"
                            placeholder="Filters"
                          />
                        )}
                      />
                      <br /> <br />
                      <p>Price range</p>
                      <Slider
                        disableSwap
                        label="Price range"
                        defaultValue={this.state.price}
                        onChange={(e, value) => this.handlePriceRange(e, value)}
                        valueLabelDisplay="auto"
                        getAriaValueText={this.valuetext}
                        min={1000}
                        max={50000}
                      />
                    </Typography>
                  </CardContent>
                </Card>
              </div>
            </Grid>

            <Grid item xs={10} md={10} sm={12}>
              <Grid align="center">
                <h3 className="my-3">Our products</h3>
                <Box>
                <Autocomplete
                  id="combo-box-demo"
                  freeSolo
                  clearIcon={()=> console.log("Hello")}
                  style={{width:'60%',padding:"1px"}}
                  onnClose={()=> console.log("closed")}
                  onChange={(e,value,reason)=> this.handleChange(value,reason)}
                  options={this.state.autoSuggestion.map((option) => option.label)}
                  renderInput={(params) => (
                    <TextField   {...params} label="Search for Items"  onChange={(e)=>this.handleChange(e.target.value)}/>
                  )}
                /></Box>
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
            </Grid>
          </Grid>
        </Container>
      </>
    );
  }
}
