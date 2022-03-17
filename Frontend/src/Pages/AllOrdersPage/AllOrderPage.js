import { Container } from '@material-ui/core'
import axios from 'axios'
import React, { Component } from 'react'
import SingleOrderAdmin from '../../Components/SingleOrderAdmin'

export default class AllOrderPage extends Component {
  constructor(props){
      super(props)
      this.state={
          allOrders:[]
      }
  }
  fetchAllOrders=()=>{
      const config={
          headers:{
              "auth-token":localStorage.getItem("token")
          }
      }
      axios.get("http://localhost:5000/getAllOrders",config).then((response)=>{
          response.data.reverse()
          this.setState((prevState)=>{
              prevState.allOrders=response.data
              return prevState
          })
      })
  }
  componentDidMount(){
      this.fetchAllOrders()
  }
  render() {
      
    return (
      <div style={{minHeight:"77vh"}}>
          <h1 className='text-center'>All orders</h1>
        <Container>
            {
                this.state.allOrders.map(order=>(

                    <SingleOrderAdmin key={order.id} order={order} changeAlert={this.props.changeAlert}/>
                )
                )
            }
        </Container>

      </div>
    )
  }
}
