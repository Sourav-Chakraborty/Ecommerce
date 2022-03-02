import React, { Component } from 'react'
import { Navbar,Login,Register, ForgetPassword,Dashboard,ChangePassword,AlertBox} from './Components'
import Homepage from "./Pages/Homepage/Homepage"
import {BrowserRouter as Router,Switch,Route} from "react-router-dom";
import Footer from './Components/Footer';
import "./App.css"
export default class App extends Component {
  constructor(props){
    super(props)
    this.state={
      alertShow:false,
      alertType:'',
      alertMsg:"",
      isLoggedin:false
    }
    this.changeAlert=this.changeAlert.bind(this)
    this.changeLoggedinStatus=this.changeLoggedinStatus.bind(this)
  }


  changeAlert=(alertShow,alertType="",alertMsg="")=>{
    this.setState((prevstate)=>{
        prevstate.alertShow=alertShow
        prevstate.alertType=alertType
        prevstate.alertMsg=alertMsg
        return prevstate
    })
  }

  changeLoggedinStatus=(status)=>{
      this.setState((prevstate)=>{
        prevstate.isLoggedin=status
        return prevstate
      })
  }



  render() {
    
    return (
      <div>
        <Router>
            <Navbar loggedinStatus={this.state.isLoggedin} changeAlert={this.changeAlert}/>
            <AlertBox alertType={this.state.alertType} alertMsg={this.state.alertMsg} alertShow={this.state.alertShow}/>
            <Switch>
            <Route exact path="/">
                <Homepage/>
            </Route>
            <Route  path="/login">
              <Login changeAlert={this.changeAlert}/>
            </Route>
            <Route  path="/register">
              <Register changeAlert={this.changeAlert}/>
            </Route>
            <Route  path="/dashboard">
              <Dashboard changeAlert={this.changeAlert}/>
            </Route>
            <Route  path="/forget-password">
              <ForgetPassword changeAlert={this.changeAlert}/>
            </Route>
            <Route  path="/changePassword">
              <ChangePassword changeAlert={this.changeAlert}/>
            </Route>
            </Switch>
            <Footer/>
        </Router>
      </div>
    )
  }
}

