import { Avatar, Button, Grid, Paper, TextField } from "@material-ui/core";
import {Link} from "react-router-dom"
import axios from "axios"
import React, { Component } from "react";
import { withRouter } from "react-router-dom"; 
import { login } from "../Redux_Store/actions/loginAction";
import { connect } from "react-redux";
class Register extends Component {
  constructor(props){
      super(props)
      this.state={
        name:"",
        email:"",
        password:"",
        confirmPassword:""
      }
  } 
  paperStyle = {
    padding: "20px",
    
    width: "258px",
    margin: "30px auto",
  };
  avatarStyle={
    backgroundColor:"#3f51b5"
  };
  buttonStyle={
    backgroundColor:"#3f51b5",
    color:"white",
    marginBottom:"5px"
  }
  handleChange=(e)=>{
    this.setState((prevState)=>{
      prevState[e.target.name]=e.target.value
      return prevState
    })

  }
  handleSubmit=async (e)=>{
    e.preventDefault()
   
    const {password,confirmPassword}=this.state
    if(password!==confirmPassword)
        return
    const response=await axios.post("http://localhost:5000/signup",{
        email: this.state.email,
        password: this.state.password,
        name: this.state.name,
    })
   
    if(response.data.authToken){
      localStorage.setItem("token", response.data.authToken);
     
      this.props.login(response.data.isAdmin);
      this.props.history.push("/")
      this.props.changeAlert(true,"success","Account created Successfully")
      setTimeout(()=>{
        this.props.changeAlert(false)
      },5000)
    }
    else{ 
    this.props.changeAlert(true,"error","User already exists,please sign in")
    setTimeout(()=>{
      this.props.changeAlert(false)
    },5000)
  
  }
  }



  render() {
    
   
    return (
      <>
        <Link id='dashboard' to="/dashboard"></Link>

        <Grid>
          <Paper style={this.paperStyle} elevation={10}>
            <Grid align="center" style={{marginBottom:"25px"}}>
              <Avatar style={this.avatarStyle} src="/broken-image.jpg" />
              <h2>Sign up</h2>

            </Grid>
            <form onSubmit={this.handleSubmit} method="POST">
            <TextField onChange={this.handleChange} style={{marginBottom:"25px"}} name="name" id="name" label="Name" variant="outlined" placeholder="Type your name" fullWidth required/>
            <TextField onChange={this.handleChange} style={{marginBottom:"25px"}} name="email" id="email" type="email"  label="Email" variant="outlined" placeholder="Type your Email" fullWidth required/>
            <TextField onChange={this.handleChange} style={{marginBottom:"25px"}} name="password" id="password" type="password" label="Password" variant="outlined" placeholder="Type your Password" fullWidth required/>
            <TextField onChange={this.handleChange} style={{marginBottom:"15px"}} name="confirmPassword"  type="password" id="confirmPassword"  label="Confirm Password" variant="outlined" placeholder="Type the password again" fullWidth required/>
            {(this.state.password!=="" && this.state.confirmPassword!=="" && this.state.password!==this.state.confirmPassword) && <p style={{color:"red"}}>Password didn't match</p> }
            <Button type="submit" style={this.buttonStyle} variant="contained" fullWidth>Submit</Button>
            </form>
            <Grid align="center">
              <Link to="/login">Signin</Link>
            </Grid>
          </Paper>
        </Grid>
      </>
    );
  }
}


const mapDispatchToProps=(dispatch)=>{
  return{
    login:(name)=>{
        dispatch(login(name))
    },
    
  }
}

export default connect(null,mapDispatchToProps)(withRouter(Register));
