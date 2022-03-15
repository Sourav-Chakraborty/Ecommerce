import { Button, TextField } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import axios from "axios";
import React, { Component } from "react";
import "./manage.css";
export default class ManageCatBrand extends Component {
  constructor(props){
    super(props)
    this.state={
      categories:[],
      brands:[],
      brand:'',
      category:'',
      newBrand:'',
      newCate:""
    }
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
  handleBrand = (e, value = 0) => {
    this.setState((prevstate)=>{
      prevstate.brand=value
      return prevstate
    })
  };
  handleCategory=(e,value=0)=>{
    this.setState((prevstate)=>{
      prevstate.category=value
      return prevstate
    })
  } 
  handleChange=(e)=>{
    this.setState((prevstate)=>{
      prevstate[e.target.name]=e.target.value
      return prevstate
    })
  }
  editCategory=()=>{
    if(this.state.category==='' || this.state.newCate==="")
      return
    const config={
      headers:{
        "auth-token":localStorage.getItem("token")
      }
    }
    axios.put('http://localhost:5000/editCategory',{oldCate:this.state.category,newCate:this.state.newCate},config).then((res)=>{
      if(res.data.msg){
        this.props.changeAlert(true,"success","successfully edited")
        setTimeout(()=>{
        this.props.changeAlert(false)

        },5000)
        this.fetchCategories()
      }
    })
  }
  editBrand=()=>{
    if(this.state.brand==="" || this.state.newBrand==="")
        return
    const config={
      headers:{
        "auth-token":localStorage.getItem("token")
      }
    }
    axios.put('http://localhost:5000/editBrand',{oldBrand:this.state.brand,newBrand:this.state.newBrand},config).then((res)=>{
      if(res.data.msg){
        this.props.changeAlert(true,"success","successfully edited")
        setTimeout(()=>{
        this.props.changeAlert(false)

        },5000)
        this.fetchBrands()
      }
    })
  }
  deleteBrand=()=>{
    if(this.state.brand==="" )
    return
    axios.delete(`http://localhost:5000/deleteBrand/${this.state.brand}`).then((res)=>{
      if(res.data.msg){
        this.props.changeAlert(true,"success","successfully Deleted")
        setTimeout(()=>{
        this.props.changeAlert(false)

        },5000)
        this.fetchBrands()
      }
    })
  }
  deleteCategory=()=>{
    if(this.state.category==="" )
      return
      axios.delete(`http://localhost:5000/deleteCategory/${this.state.category}`).then((res)=>{
      if(res.data.msg){
        this.props.changeAlert(true,"success","successfully Deleted")
        setTimeout(()=>{
        this.props.changeAlert(false)

        },5000)
        this.fetchCategories()
      }
    })
  }
  componentDidMount(){
    this.fetchBrands()
    this.fetchCategories()
  }
  render() {
    return (
      <div className="manageCat">
        <h3 className="text-center">Manage brands & categories</h3>
            <h5 className="text-center my-5">Manage Brands</h5>
        <div className="manageBrand container px-4">
          <Autocomplete
            name="oldBrand"
            style={{ width: "150px" }}
            id="combo-box-demo"
            onChange={(e, value) => this.handleBrand(e, value)}
            options={this.state.brands.map((option) => option.name)}
            renderInput={(params) => <TextField {...params} label="Brand" />}
          />
          <TextField name="newBrand" id="standard-basic" onChange={this.handleChange} label="Edit for Brands" variant="standard" />
          <Button variant="contained" className="green" onClick={this.editBrand}>Edit</Button>
          <Button variant="contained" className="red" onClick={this.deleteBrand}>Delete</Button>
        </div>
        <h5 className="text-center my-5">Manage Categories</h5>
        <div className="manageBrand container px-4">
          <Autocomplete
            name="oldBrand"
            style={{ width: "150px" }}
            id="combo-box-demo"
            onChange={(e, value) => this.handleCategory(e, value)}
            options={this.state.categories.map((option) => option.name)}
            renderInput={(params) => <TextField {...params} label="Category" />}
          />
          <TextField name="newCate" id="standard-basic" onChange={this.handleChange} label="Edit for category" variant="standard" />
          <Button variant="contained" onClick={this.editCategory}  className="green">Edit</Button>
          <Button variant="contained" className="red" onClick={this.deleteCategory}>Delete</Button>
        </div>
      </div>
    );
  }
}
