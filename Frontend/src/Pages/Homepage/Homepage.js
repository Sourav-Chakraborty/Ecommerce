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
import { Autocomplete, Pagination } from "@material-ui/lab";
import CheckBoxOutlineBlank from "@material-ui/icons/CheckBoxOutlineBlank";
import CheckBox from "@material-ui/icons/CheckBox";
import History from "../../Components/History/History"; 
export default class Homepage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allproducts: [],
      filteredProducts:[],
      product: [],
      products:[],
      brands: [],
      categories: [],
      price: [100, 99000],
      userBrands: [],
      userCate: [],
      autoSuggestion: [],
      totalPage:0,
      activePage:1
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
      prevState.filteredProducts=productsArray
      prevState.product = productsArray.slice(0,9);
      prevState.autoSuggestion = suggestions;
      prevState.totalPage=Math.ceil((productsArray.length)/9)
      return prevState;
    });
  };
  handleChange = (e,reason="") => {
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
    for(let i=0;i<this.state.allproducts.length;i++){
      if(!productsArray.includes(this.state.allproducts[i])){
        for(let j=0;j<this.state.allproducts[i].searchKeys.length;j++){
            if(this.state.allproducts[i].searchKeys[j].toLowerCase().includes(e.toLowerCase())){
                productsArray.push(this.state.allproducts[i]);
                break
            }
        }
      }
        
    }
    this.setState((prevState) => {
      prevState.filteredProducts = productsArray;
      prevState.activePage=1
      prevState.product=productsArray.slice(0,9)
      prevState.totalPage=Math.ceil(productsArray.length/9)
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
    console.log("userproduct",userProducts.length,userProducts)
    let userProducts2 = [];
    if (this.state.userCate.length) {
      this.state.userCate.forEach((uc) => {
        userProducts.forEach((up) => {
          if (up.type.toLowerCase() === uc.toLowerCase())
            userProducts2.push(up);
        });
      });
    } else userProducts2 = userProducts;
    console.log("userproduct2",userProducts2.length,userProducts2)

    let finalProducts = [];
    userProducts2.forEach((up) => {
      if (
        parseInt(this.state.price[0]) <= parseInt(up.price) &&
        parseInt(this.state.price[1]) >= parseInt(up.price)
      ) {
       
        finalProducts.push(up);
      }
    });
    console.log("finalProducts ",finalProducts.length,finalProducts)
    this.setState((prevState) => {
      prevState.filteredProducts = finalProducts;
      prevState.activePage=1
      prevState.product=finalProducts.slice(0,9)
      prevState.totalPage=Math.ceil(finalProducts.length/9)
      return prevState;
    });
  };
  handlePageChange=(page)=>{
    const start=(page-1)*9,end=page*9
    this.setState((prevState)=>{
      prevState.activePage=page
      prevState.product=this.state.filteredProducts.slice(start,end)
      return prevState
    })

  }
  fetchHistory = async () => {
    

    const config = {
      headers: {
        "auth-token": localStorage.getItem("token"),
      },
    };
    const response = await axios.get(
      "http://localhost:5000/getHistory",
      config
    );
    if (response.data.length) {
      const productsArray=response.data.reverse()
      
      this.setState((prevState) => {
        prevState.products = productsArray;
        return prevState;
      });
    }
  };

  componentDidMount() {
    this.fetchAllProducts();
    this.fetchBrands();
    this.fetchCategories();
    this.fetchHistory()
  }
  render() {
    console.log("products ",this.state.products)
    setTimeout(() => {
      const close = document.getElementsByClassName(
        "MuiButtonBase-root MuiIconButton-root MuiAutocomplete-clearIndicator MuiAutocomplete-clearIndicatorDirty"
      )[0];
      close.style.display="none"
    }, 100);
    return (
      <>
        <Carousel />
        <Container >
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
                        label="Price range"
                        defaultValue={this.state.price}
                        onChange={(e, value) => this.handlePriceRange(e, value)}
                        valueLabelDisplay="auto"
                        getAriaValueText={this.valuetext}
                        min={100}
                        max={99000}
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
                {this.state.product.map((p,index) =>(
                  
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
          <Grid container justify = "center">
                <br /><br />
                {this.state.filteredProducts.length>9 && <Pagination page={this.state.activePage} count={this.state.totalPage} color="primary" onChange={(e,page)=> this.handlePageChange(page)}/>}
          </Grid>
            </Grid>
          </Grid>
        </Container>
        <History products={this.state.products}/>
      </>
    );
  }
}
