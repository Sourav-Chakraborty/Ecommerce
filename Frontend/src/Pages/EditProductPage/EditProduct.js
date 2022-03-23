import {
  Card,
  Container,
  Grid,
  IconButton,

  styled,
  TextareaAutosize,
  TextField,
} from "@material-ui/core";
import { PhotoCamera } from "@material-ui/icons";
import { Autocomplete } from "@material-ui/lab";
import axios from "axios";
import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

class EditProduct extends Component {
  constructor(props) {
    super(props);
    if (!this.props.isAdmin) this.props.history.push("/");
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
      changeImg:"",
      brands:[],
      categories:[],
      searchKeys:""
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
      searchKeys
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
      prevState.searchKeys=searchKeys.join(",")
      return prevState;
    });
  };
  handleChange = (e) => {
    this.setState((prevState) => {
      prevState[e.target.name] = e.target.value;
      return prevState;
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
    formData.append("mfg", this.state.mfg);
    formData.append("rating", this.state.rating);
    formData.append("price", this.state.price);
    formData.append("desc", this.state.desc);
    formData.append("searchkeys", this.state.searchKeys);
    formData.append("id", this.props.match.params.id);
    console.log(formData)
     const response = await axios.put(
       "/editProduct",
       formData,config
     
     );
     this.props.history.push("/");
  };
  handleImgChange=(e)=>{
    this.setState((prevState)=>{
        prevState[e.target.name]=e.target.files[0]
        return prevState
    })
      
  }
  handleImgSubmit=(e)=>{
      e.preventDefault()
      const config={
          headers:{
              "auth-token":localStorage.getItem("token"),
            //   "content-type":"multipart/form-data"
          }
      }
      const formData=new FormData()
      const id=this.props.match.params.id
      formData.append("id",id)
      formData.append("productImg",this.state.changeImg)
      axios.put("http://localhost:5000/changeProductImg",formData,config).then((res)=>{
          if(res.data.img){    
          this.setState((prevState)=>{
              prevState.img=res.data.img
              return prevState
          })
        }
      })
  }
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
  componentDidMount() {
    this.fetchProductInfo();
    this.fetchBrands()
    this.fetchCategories()
  }
  render() {
    const Input = styled('input')({
        display: 'none',
      });
    return (
      <div>
        <Container>
          <Card>
            <h3 className="d-flex justify-content-center">Edit Product</h3>
            <Grid align="center">
              <img
                className="text-center"
                src={"/" + this.state.img}
                alt=""
                style={{
                  height: "200px",
                  width: "350px",
                  marginLeft: "auto",
                  marginRight: "auto",
                }}
              />
              <br />
              <br />
                <form onSubmit={this.handleImgSubmit}>
              <label htmlFor="icon-button-file" >
                <Input name="changeImg" accept="image/*" id="icon-button-file" type="file" onChange={this.handleImgChange} />
                <IconButton
                  color="primary"
                  aria-label="upload picture"
                  component="span"
                >
                  <PhotoCamera />
                </IconButton>
              </label>
              <h6>Change product image</h6>
              <button
               
                  type="submit"
                  className="btn btn-info"
                >
                  Upload 
                </button>
              </form>
            </Grid>
            <form
              className="createProductForm"
              onSubmit={(event) => this.handleSubmit(event)}
            >
              <label htmlFor="photo">Change Product Img</label>

              <div className="formRow">
                <TextField
                  required
                  name="name"
                  value={this.state.name}
                  id="outlined-name"
                  label="Product Name"
                  onChange={this.handleChange}
                />
                <Autocomplete
                  name="oldBrand"
                  freeSolo={true}
                  style={{ width: "150px" }}
                  id="combo-box-demo"
                  value={this.state.type}
                  onChange={(e, value) => this.handleCategory(e, value)}
                  options={this.state.categories.map((option) => option.name)}
                  renderInput={(params) => (
                    <TextField {...params} value={this.state.type} label="Category" name="type" onChange={this.handleChange}/>
                  )}
                />
                <Autocomplete
                  name="oldBrand"
                  freeSolo={true}
                  style={{ width: "150px" }}
                  id="combo-box-demo"
                  value={this.state.company}
                  onChange={(e, value) => this.handleBrand(e, value)}
                  options={this.state.brands.map((option) => option.name)}
                  renderInput={(params) => (
                    <TextField {...params} label="Brand" value={this.state.company} name="company" onChange={this.handleChange}/>
                  )}
                />
              </div>
              <div className="formRow">
                <TextField
                  required
                  name="model"
                  value={this.state.model}
                  id="outlined-name"
                  label="Model No."
                  onChange={this.handleChange}
                />
                <TextField
                  required
                  value={this.state.country}
                  name="country"
                  id="outlined-name"
                  label="Country of origin"
                  onChange={this.handleChange}
                />
                <TextField
                  value={this.state.mfg}
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
                  value={this.state.rating}
                  name="rating"
                  id="outlined-name"
                  label="Rating"
                  onChange={this.handleChange}
                />
                <TextField
                  required
                  value={this.state.price}
                  name="price"
                  id="outlined-name"
                  label="Price"
                  onChange={this.handleChange}
                />
              </div>

              <div className="rowForDesc">
              <TextareaAutosize
                  defaultValue={this.state.searchKeys}
                  required
                  onChange={this.handleChange}
                  name="searchKeys"
                  aria-label="minimum height"
                  minRows={3}
                  placeholder="Comma separated search keys"
                  style={{
                    width: 500,
                    marginRight: "auto",
                    marginLeft: "auto",
                  }}
                />
                <TextareaAutosize
                  defaultValue={this.state.desc}
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
    isAdmin: state.loginReducers.isAdmin,
  };
};

export default connect(mapStateToProps)(withRouter(EditProduct));
