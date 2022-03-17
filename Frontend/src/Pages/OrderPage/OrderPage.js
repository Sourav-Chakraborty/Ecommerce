import axios from 'axios'
import React, { Component } from 'react'
import {withRouter} from "react-router-dom"

import { connect } from 'react-redux'
import SingleDayOrder from '../../Components/SingleDayOrder'
import { Container } from '@material-ui/core'

class OrderPage extends Component {

  constructor(props){
    super(props)
     if(!this.props.isLoggedin)
     this.props.history.push("/login")
    this.state={
      orders:[]
    }
  }
  fetchOrders=()=>{
    const config = {
      headers: {
        "auth-token": localStorage.getItem("token"),
      },
    }
    axios.get("http://localhost:5000/getOrders",config).then(res=>{
      if(res.data.userOrders){
        res.data.userOrders.reverse()
      this.setState((prevstate)=>{
        prevstate.orders=res.data.userOrders
        return prevstate
      })
      }
    })
  }
  componentDidMount(){
    this.fetchOrders()
  }
  render() {
   
    return (
      <Container style={{minHeight:"77vh"}}>
        <h2 className='text-center'>Your Orders</h2>
        {
          this.state.orders.map((order)=>(
            <SingleDayOrder key={order._id} date={order.data} time={order.time} status={order.status} products={order.products}/>
          ))
        }
      </Container>
    )
  }
}
const mapStateToProps = (state) => {
  console.log(state)
  return {
    isLoggedin: state.loginReducers.isLoggedin,
   
  };
};
export default connect(mapStateToProps)(withRouter(OrderPage))