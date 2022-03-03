import {
  Button,
  Grid,
  IconButton,
  Input,
  Paper,
  TextField,
} from "@material-ui/core";
import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { PhotoCamera } from "@material-ui/icons";
import { withRouter } from "react-router-dom";
import axios from "axios";
class Dashboard extends Component {
  constructor(props) {
    super(props);
    if (!this.props.isLoggedin) {
      this.props.history.push("/login");
    }
    this.state = {
      allowEdit: false,
      name: "",
      email: "",
      profilepic: "",
      userPic: "",
      changePass: false,
      oldPass:"",
      newPass:"",
      confirmNewPass:""
    };
  }

  paperStyle = {
    padding: "20px",

    width: "258px",
    margin: "25px auto",
  };
  avatarImg = {
    width: "75px !important",
    height: "75px !important",
  };
  buttonStyle = {
    backgroundColor: "#3f51b5",
    color: "white",
    marginBottom: "15px",
  };
  profileImgStyle = {
    width: "60px",
    height: "60px",
    borderRadius: "50%",
    objectFit: "cover",
  };

  handleChange = (e) => {
    this.setState((prevState) => {
      prevState[e.target.name] = e.target.value;
      return prevState;
    });
  };

  handleEditInfo = async (e) => {
    e.preventDefault();
    const response = await axios.put(
      "http://localhost:5000/editUser",
      {
        name: this.state.name,
        email: this.state.email,
      },
      {
        headers: {
          "auth-token": localStorage.getItem("token"),
        },
      }
    );

    if (response.data?.authToken) {
      console.log("Successfully updated");
      this.props.changeAlert(true, "success", "Updated successfully");
      this.setState((prevState) => {
        prevState.allowEdit = false;
        return prevState;
      });
      localStorage.setItem("token", response.data.authToken);
      setTimeout(() => {
        this.props.changeAlert(false);
      }, 5000);
    } else {
      console.log(" updation failed");
      this.props.changeAlert(true, "error", response.data.msg);
      setTimeout(() => {
        this.props.changeAlert(false);
      }, 5000);
    }
  };

  changeEditAllowStatus = () => {
    this.setState((prevState) => {
      prevState.allowEdit = true;
      return prevState;
    });
  };
  fetchUserInfo = async () => {
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        "auth-token": token,
      },
    };
    const response = await axios.get("http://localhost:5000/getUser", config);
    this.setState((prevState) => {
      prevState.name = response.data.name;
      prevState.email = response.data.email;
      prevState.userPic = response.data.img;
      return prevState;
    });
  };
  handleImgChange = (e) => {
    this.setState((prevState) => {
      prevState.profilepic = e.target.files[0];
      return prevState;
    });
    // this.handleImgSubmit()
  };
  handleImgSubmit = async () => {
    const config = {
      headers: {
        "auth-token": localStorage.getItem("token"),
      },
    };
    const formData = new FormData();
    formData.append("profile", this.state.profilepic);
    const response = await axios.post(
      "http://localhost:5000/uploadImg",
      formData,
      config
    );

    this.setState((prevstate) => {
      prevstate.userPic = response.data.img;

      return prevstate;
    });
    this.setState((prevState) => {
      prevState.profilepic = "";
      return prevState;
    });
  };


  handleChangePassword=async (e)=>{
    e.preventDefault()
    if(this.state.newPass!==this.state.confirmNewPass)
      return
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        "auth-token":token,
      },
      };
    const response=await axios.put("http://localhost:5000/changePassword",{
      oldPass:this.state.oldPass,
      newPass:this.state.newPass

    },config)
    if(response.data.wrongPass){
      this.props.changeAlert(true, "error", "Password doesn't match");
      setTimeout(() => {
        this.props.changeAlert(false);
      }, 5000)
    }
    else{
      this.props.changeAlert(true, "success", "Password changed successfully");
      setTimeout(() => {
        this.props.changeAlert(false);
      }, 5000)
    }
    this.changeStateOfPass()

  }
  changeStateOfPass=()=>{
    const prevVal=this.state.changePass
    this.setState((prevState)=>{
      prevState.changePass=!prevVal
      return prevState
    })
  }

  componentDidMount() {
    this.fetchUserInfo();
  }

  render() {
    return (
      <>
        <div>
          <Link id="signin" to="/login"></Link>

          <Grid>
            <Paper style={this.paperStyle}>
              <Grid align="center">
                <button onClick={()=> this.props.increment()}>+</button>
                <button onClick={()=> this.props.decrement()}>-</button>

                {this.state.userPic !== "" && (
                  <img
                    style={this.profileImgStyle}
                    src={this.state.userPic}
                    alt=""
                  />
                )}
                <br />
                {/* <form encType="multipart/form-data" > */}
                <label htmlFor="icon-button-file">
                  <Input
                    name="profile"
                    onChange={this.handleImgChange}
                    style={{ display: "none" }}
                    accept="image/*"
                    id="icon-button-file"
                    type="file"
                  />
                  {this.state.allowEdit && (
                    <IconButton
                      color="primary"
                      aria-label="upload picture"
                      component="span"
                    >
                      {this.state.profilepic === "" && <PhotoCamera />}
                    </IconButton>
                  )}
                  <br />
                  {this.state.profilepic !== "" && (
                    <Button
                      type="button"
                      onBlur={this.handleImgSubmit}
                      style={this.buttonStyle}
                      variant="contained"
                    >
                      Submit Image
                    </Button>
                  )}
                </label>
                {/* </form> */}
              </Grid>
              <TextField
                style={{ marginBottom: "20px" }}
                onChange={this.handleChange}
                name="name"
                type="text"
                id="name"
                label="Name"
                variant="outlined"
                placeholder="Type your Name"
                value={this.state.name}
                disabled={this.state.allowEdit ? false : true}
                fullWidth
              />
              <TextField
                style={{ marginBottom: "20px" }}
                onChange={this.handleChange}
                name="email"
                type="email"
                id="email"
                label="Email"
                variant="outlined"
                placeholder="Type your Email"
                value={this.state.email}
                disabled={this.state.allowEdit ? false : true}
                fullWidth
              />
              {!this.state.allowEdit && (
                <Button
                  style={this.buttonStyle}
                  onClick={this.changeEditAllowStatus}
                  variant="contained"
                  fullWidth
                >
                  Edit Information
                </Button>
              )}
              {this.state.allowEdit && (
                <Button
                  style={this.buttonStyle}
                  onClick={this.handleEditInfo}
                  variant="contained"
                  fullWidth
                >
                  Submit Information
                </Button>
              )}
              <Grid align="center">
              <Link to="#"
              
                onClick={this.changeStateOfPass}
              >
                Change Password
              </Link>

              {this.state.changePass && (
                <form onSubmit={this.handleChangePassword}>
                  <TextField
                    style={{marginTop:"20px", marginBottom: "20px" }}
                    onChange={this.handleChange}
                    name="oldPass"
                    type="password"
                    label="old password"
                    variant="outlined"
                    placeholder="your old password"
                    required
                    
                    fullWidth
                  />
                  <TextField
                    style={{ marginBottom: "20px" }}
                    onChange={this.handleChange}
                    name="newPass"
                    type="password"
                    label="New password"
                    variant="outlined"
                    placeholder="your Name password"
                    required
                  
                    fullWidth
                  />
                  <TextField
                    style={{ marginBottom: "20px" }}
                    onChange={this.handleChange}
                    name="confirmNewPass"
                    type="password"
                   
                    label="Confirm password"
                    variant="outlined"
                    placeholder="confirm new password"
                    required
                    fullWidth
                  />
                    {(this.state.newPass!=="" && this.state.confirmNewPass!=="" && this.state.newPass!==this.state.confirmNewPass) && <p style={{color:"red"}}>Password didn't match</p> }
                    <Button
                    type="submit"
                  style={this.buttonStyle}
                 
                  variant="contained"
                  fullWidth
                >
                  Change Password
                </Button>
                </form>
              )}
              </Grid>
            </Paper>
          </Grid>
        </div>
      </>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    isLoggedin: state.loginReducers.isLoggedin,
    
  };
};


export default connect(mapStateToProps)(withRouter(Dashboard));
