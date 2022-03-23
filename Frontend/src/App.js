import React, { Component } from "react";

import {
  Navbar,
  Login,
  Register,
  ForgetPassword,
  Dashboard,
  ChangePassword,
  AlertBox,
} from "./Components";
import CartPage from "./Pages/CartPage/CartPage";
import CreateProduct from "./Pages/CreateProductPage/CreateProduct";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Footer from "./Components/Footer/Footer";
import "./App.css";
import ProductPage from "./Pages/ProductPage/ProductPage";
import AddressPage from "./Pages/AddressPage/AddressPage";
import PayPage from "./Pages/PayPage/PayPage";
import OrderPage from "./Pages/OrderPage/OrderPage";
import EditProduct from "./Pages/EditProductPage/EditProduct";
import ManageCatBrand from "./Pages/ManageCat&Brand/ManageCatBrand";
import Homepage from "./Pages/Homepage/Homepage";
import AllOrderPage from "./Pages/AllOrdersPage/AllOrderPage";
import CompairPage from "./Pages/CompairPage/CompairPage";
export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      alertShow: false,
      alertType: "",
      alertMsg: "",
      isLoggedin: false,
    };
    this.changeAlert = this.changeAlert.bind(this);
    this.changeLoggedinStatus = this.changeLoggedinStatus.bind(this);
  }

  changeAlert = (alertShow, alertType = "", alertMsg = "") => {
    this.setState((prevstate) => {
      prevstate.alertShow = alertShow;
      prevstate.alertType = alertType;
      prevstate.alertMsg = alertMsg;
      return prevstate;
    });
  };

  changeLoggedinStatus = (status) => {
    this.setState((prevstate) => {
      prevstate.isLoggedin = status;
      return prevstate;
    });
  };

  render() {

    return (
      <div>
        <Router>
          <Navbar
            loggedinStatus={this.state.isLoggedin}
            changeAlert={this.changeAlert}
          />
          <AlertBox
            alertType={this.state.alertType}
            alertMsg={this.state.alertMsg}
            alertShow={this.state.alertShow}
          />
          <div className="Body">
            <Switch>
              <Route exact path="/">
                <Homepage changeAlert={this.changeAlert} />
              </Route>
              <Route path="/login">
                <Login changeAlert={this.changeAlert} />
              </Route>
              <Route path="/register">
                <Register changeAlert={this.changeAlert} />
              </Route>
              <Route path="/dashboard">
                <Dashboard changeAlert={this.changeAlert} />
              </Route>
              <Route path="/forget-password">
                <ForgetPassword changeAlert={this.changeAlert} />
              </Route>
              <Route path="/changePassword">
                <ChangePassword changeAlert={this.changeAlert} />
              </Route>
              <Route path="/product/:id">
                <ProductPage changeAlert={this.changeAlert} />
              </Route>
              <Route path="/createProduct">
                <CreateProduct changeAlert={this.changeAlert} />
              </Route>
              <Route path="/editProduct/:id">
                <EditProduct changeAlert={this.changeAlert} />
              </Route>
              <Route path="/cart">
                <CartPage changeAlert={this.changeAlert} />
              </Route>
              <Route path="/address">
                <AddressPage changeAlert={this.changeAlert} />
              </Route>
              <Route path="/pay">
                <PayPage changeAlert={this.changeAlert} />
              </Route>
              <Route path="/orders">
                <OrderPage changeAlert={this.changeAlert} />
              </Route>
              <Route path="/manageCat&Brand">
                <ManageCatBrand changeAlert={this.changeAlert} />
              </Route>
              <Route path="/allOrders">
                <AllOrderPage changeAlert={this.changeAlert} />
              </Route>
              <Route path="/compare">
                <CompairPage changeAlert={this.changeAlert} />
              </Route>
            </Switch>
          </div>
          <Footer />
        </Router>
      </div>
    );
  }
}
