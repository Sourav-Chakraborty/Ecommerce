import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { logout } from "../../Redux_Store/actions/loginAction";
import AddShoppingCartIcon from "@material-ui/icons/AddShoppingCart"
import CompareIcon from "@material-ui/icons/Compare"

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
      <div className="fixed-top">
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
              
             {(this.props.isLoggedin && !this.props.isAdmin ) && <>
             
              <Link 
                    to="/compare"
                    style={{
                      color: "white",
                      marginRight: "15px",
                      textDecoration: "none",
                      font: "caption",
                    }}
                  >
                   <CompareIcon/><span className="cartItemNo">{this.props.compareItem}</span>
                  </Link>
             
             <Link style={{
                          color: "white",
                          marginRight: "10px",
                          textDecoration: "none",
                          font: "caption",
              }} to="/cart"><AddShoppingCartIcon/><span className="cartItemNo">{this.props.cartItem}</span> </Link>
              <Link
                    to="/orders"
                    style={{
                      color: "white",
                      marginRight: "10px",
                      textDecoration: "none",
                      font: "caption",
                    }}
                  >
                   All Orders
                  </Link>
                  </>
              }
                       
              { this.props.isAdmin && <div className="mx-4">
              <Link
                    to="/allOrders"
                    style={{
                      color: "white",
                      marginRight: "18px",
                      textDecoration: "none",
                      font: "caption",
                    }}
                  >
                   View Orders
                  </Link>
                
                <Link
                    to="/createProduct"
                    style={{
                      color: "white",
                      marginRight: "18px",
                      textDecoration: "none",
                      font: "caption",
                    }}
                  >
                   Create Product
                  </Link>
                  <Link
                    to="/manageCat&Brand"
                    style={{
                      color: "white",
                      marginRight: "10px",
                      textDecoration: "none",
                      font: "caption",
                    }}
                  >
                   Manage Brands & Categories
                  </Link>
                  </div>}
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
                 
                </div>
              ) : (
                <div>
                
                  <Link to="#"
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
  
  return {
    isLoggedin: state.loginReducers.isLoggedin,
    isAdmin:state.loginReducers.isAdmin,
    cartItem:state.cartItemNoReducers.item,
    compareItem:state.compareReducers.item
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
