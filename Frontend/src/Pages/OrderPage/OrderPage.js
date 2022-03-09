import axios from 'axios'
import React, { Component } from 'react'
import SingleDayOrder from '../../Components/SingleDayOrder'

export default class OrderPage extends Component {

  constructor(props){
    super(props)
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
    console.log(this.state.orders)
    return (
      <div>
        <h2 className='text-center'>Your Orders</h2>
        {
          this.state.orders.map((order)=>(
            <SingleDayOrder key={order._id} date={order.data} products={order.products}/>
          ))
        }
      </div>
    )
  }
}
