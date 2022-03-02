import { Button, Grid, Paper, TextField } from "@material-ui/core";
import React, { Component } from "react";
import axios from "axios";
import { Link, withRouter } from "react-router-dom";
import { login } from "../Redux_Store/actions/loginAction";
import { connect } from "react-redux";
class ChangePassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      code: "",
      password: "",
      confirmPassword: "",
    };
  }
  paperStyle = {
    padding: "20px",

    width: "258px",
    margin: "30px auto",
  };
  buttonStyle = {
    backgroundColor: "#3f51b5",
    color: "white",
    marginBottom: "5px",
  };
  handleChange = (e) => {
    this.setState((prevstate) => {
      prevstate[e.target.name] = e.target.value;
      return prevstate;
    });
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (this.state.password !== this.state.confirmPassword) return;
      const response = await axios.post(
        "http://localhost:5000/forgetPassword/changePassword",
        {
          token: this.state.code,
          email: localStorage.getItem("email"),
          newPassword: this.state.password,
        }
      );
      if (response.data.authToken) {
        console.log("Password changed successfully");
        localStorage.clear();
        localStorage.setItem("token", response.data.authToken);
        this.props.login(true)
        this.props.history.push("/dashboard")
        
        this.props.changeAlert(
          true,
          "success",
          "Password Changed Successfully"
        );
        setTimeout(() => {
          this.props.changeAlert(false);
        }, 5000);
      }
    } catch {
      this.props.changeAlert(
        true,
        "error",
        "Some error occured,please try after some time"
      );
      setTimeout(() => {
        this.props.changeAlert(false);
      }, 5000);
    }
  };

  render() {
    return (
      <>
        {localStorage.getItem("email") ? (
          <div>
            <Link id="dashboard" to="/dashboard"></Link>

            <Link id="forgetPassword" to="/forget-password"></Link>
            <Grid align="center">
              <Paper style={this.paperStyle}>
                <h5 style={{ marginBottom: "30px" }}>Change your password</h5>
                <TextField
                  onChange={this.handleChange}
                  style={{ marginBottom: "25px" }}
                  name="code"
                  id="email"
                  type="text"
                  label="Pass Code sent by email"
                  variant="outlined"
                  placeholder="Type secret code"
                  fullWidth
                  required
                />
                <TextField
                  onChange={this.handleChange}
                  style={{ marginBottom: "25px" }}
                  name="password"
                  id="password"
                  type="password"
                  label="New Password"
                  variant="outlined"
                  placeholder="Type your new Password"
                  fullWidth
                  required
                />
                <TextField
                  onChange={this.handleChange}
                  style={{ marginBottom: "15px" }}
                  name="confirmPassword"
                  type="password"
                  id="confirmPassword"
                  label="Confirm Password"
                  variant="outlined"
                  placeholder="Type the password again"
                  fullWidth
                  required
                />
                {this.state.password !== "" &&
                  this.state.confirmPassword !== "" &&
                  this.state.password !== this.state.confirmPassword && (
                    <p style={{ color: "red" }}>Password didn't match</p>
                  )}

                <Button
                  style={this.buttonStyle}
                  onClick={this.handleSubmit}
                  variant="contained"
                  fullWidth
                >
                  Submit
                </Button>
                <Grid align="center">
                  Don't have an account?
                  <Link to="/register">SignUp</Link>
                </Grid>
              </Paper>
            </Grid>
          </div>
        ) : (
          <div>
            <Grid>
              <Paper style={this.paperStyle}>
                please go to <Link to="/forget-password">Forget password</Link>{" "}
                to get secret key
              </Paper>
            </Grid>
          </div>
        )}
      </>
    );
  }
}

const mapDispatchToProps=(dispatch)=>{
  return{
    login:(name)=>{
        dispatch(login(name))
    }
  }
}
export default connect(null,mapDispatchToProps)(withRouter(ChangePassword))

