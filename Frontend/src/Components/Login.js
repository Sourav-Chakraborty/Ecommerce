import React, { Component } from 'react'
import axios from "axios"
import { connect } from 'react-redux';
import { login } from '../Redux_Store/actions/loginAction';
import { Avatar, Button, Grid, Paper, TextField } from "@material-ui/core";
import {Link} from "react-router-dom"

class Login extends Component {

  constructor(props){
      super(props)
      this.state={
        email:"",
        password:""
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
    const response=await axios.post("http://localhost:5000/signin",{
      email:this.state.email,
      password:this.state.password
    })
    console.log("response is ",response)
    if(response.data.authToken){
      localStorage.setItem("token", response.data.authToken);
      this.props.login(response.data.isAdmin)
      document.getElementById("dashboard").click()
      this.props.changeAlert(true,"success","Log in Successful")
      setTimeout(()=>{
        this.props.changeAlert(false)
      },5000)
    }
    else{   
      this.props.changeAlert(true,"error","Invalid user name or password")
      setTimeout(()=>{
        this.props.changeAlert(false)
      },5000)
    
    }
    
  }


  render() {
    
    return (
      <div >
        <Link id='dashboard' to="/dashboard"></Link>
          <Grid>
          <Paper style={this.paperStyle} elevation={10}>
            <Grid align="center" style={{marginBottom:"25px"}}>
              <Avatar style={this.avatarStyle} src="/broken-image.jpg" />
              <h2>Sign In</h2>
            </Grid>
            <form onSubmit={this.handleSubmit}>
                <TextField style={{marginBottom:"25px"}} onChange={this.handleChange}  name="email" type="email" id="email" label="Email" variant="outlined" placeholder="Type your Email" fullWidth required/>
                <TextField style={{marginBottom:"25px"}}  onChange={this.handleChange} name="password"  type="password" id="password" label="Password" variant="outlined" placeholder="Type your Password" fullWidth required/>
                <Button style={this.buttonStyle} type="submit" name="password" variant="contained" fullWidth>Submit</Button>
            </form>
            <Grid align="center">
              Don't have an account?
              <Link to="/register">SignUp</Link>  <br/>
            
              <Link to="/forget-password">Forget Password</Link>  <br/>
            </Grid>
          </Paper>
        </Grid>
      </div>
    )
  }
}

const mapDispatchToProps=(dispatch)=>{
  return{
    login:(isAdmin)=>{
        dispatch(login(isAdmin))
    }
  }
}


export default connect(null,mapDispatchToProps)(Login)