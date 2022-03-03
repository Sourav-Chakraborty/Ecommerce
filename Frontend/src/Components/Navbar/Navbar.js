import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { logout } from "../../Redux_Store/actions/loginAction";
import "./navbar.css"
import { AppBar, Box, Toolbar, Typography } from "@material-ui/core";
class Navbar extends Component {
 
  handleSignOut = () => {
    localStorage.removeItem("token");
    this.props.logout();
    this.props.changeAlert(true, "success", "Sign out done");
    this.props.history.push("/");

    setTimeout(() => {
      this.props.changeAlert(false);
    }, 5000);
  };

  render() {
    return (
      <div className="myd-5 fixed-top">
        <Link to="/login" id="login"></Link>
        <Link to="/register" id="register"></Link>

        <Box sx={{ flexGrow: 1 }}>
          <AppBar position="static">
            <Toolbar>
              <Typography
                variant="h6"
                component="div"
                sx={{ flexGrow: 1 }}
                style={{ flex: 1 }}
              >
                <Link style={{textDecoration:"none",color:"white"}} to="/">Ecommerce</Link>
              </Typography>
              {!this.props.isLoggedin ? (
                <div>
                  <Link
                    to="/register"
                    style={{
                      color: "white",
                      marginRight: "10px",
                      textDecoration: "none",
                      font: "caption",
                    }}
                  >
                    Register
                  </Link>
                  <Link
                    to="/login"
                    style={{
                      color: "white",
                      marginRight: "10px",
                      textDecoration: "none",
                      font: "caption",
                    }}
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/createProduct"
                    style={{
                      color: "white",
                      marginRight: "10px",
                      textDecoration: "none",
                      font: "caption",
                    }}
                  >
                   Create Product
                  </Link>
                </div>
              ) : (
                <div>
                  <p style={{
                      color: "white",
                      // marginRight: "10px",
                      textDecoration: "none",
                      font: "caption",
                    }}>{this.props.val}</p>
                  <Link
                    onClick={this.handleSignOut}
                    style={{
                      color: "white",
                      marginRight: "10px",
                      textDecoration: "none",
                      font: "caption",
                    }}
                  >
                    Sign Out
                  </Link>
                </div>
              )}
            </Toolbar>
          </AppBar>
        </Box>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  console.log(state)
  return {
    isLoggedin: state.loginReducers.isLoggedin,
    val:state.countReducer.val
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    logout: () => {
      dispatch(logout());
    },
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Navbar));
