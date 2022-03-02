import React, { Component } from 'react'
import axios from "axios"
import { Avatar, Button, Grid, Paper, TextField } from "@material-ui/core";
import {Link} from "react-router-dom"

export default class ForgetPassword extends Component {
  constructor(props){
    super(props)
    this.state={
      email:""
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
    try{
    const response=await axios.post("http://localhost:5000/forgetPassword",{
      email:this.state.email
    })
    console.log(response)
    if(response.data.msg){
      this.props.changeAlert(true,"error","email is not registered with us,please sign up")
      setTimeout(()=>{
        this.props.changeAlert(false)
      },5000)
    }
    else{
      localStorage.setItem("email",this.state.email)
      this.props.changeAlert(true,"success","Verification code sent to your email. please check")
      setTimeout(()=>{
        this.props.changeAlert(false)
      },5000)
      document.getElementById("changePassword").click()
    }
  }catch{
    this.props.changeAlert(true,"error","User is not registered with us,please Sign up")
    setTimeout(()=>{
      this.props.changeAlert(false)
    },5000)
  }

  } 

  render() {
    return (
     <>
       <Grid>
         <Link id='changePassword' to="/changePassword"></Link>
          <Paper style={this.paperStyle} elevation={10}>
            <Grid align="center" style={{marginBottom:"25px"}}>
              <Avatar style={this.avatarStyle} src="/broken-image.jpg" />
              <h5>Forget password? <br/> Don't worry we are here to help</h5>
            </Grid>
            <TextField style={{marginBottom:"25px"}} onChange={this.handleChange} name="email" type="email" id="outlined-basic" label="Email" variant="outlined" placeholder="Type your Email" fullWidth required/>
            <Button style={this.buttonStyle} onClick={this.handleSubmit} variant="contained" fullWidth>Submit</Button>
            <Grid align="center">
              Don't have an account?
              <Link to="/register">SignUp</Link>
            </Grid>
          </Paper>
        </Grid>
     </>
    )
  }
}
