import { Button, Container, Grid } from '@material-ui/core'
import axios from 'axios'
import React, { Component } from 'react'
import PaypalExpressBtn from 'react-paypal-express-checkout';
// import "./paypage.css"
export default class PayPage extends Component {
    constructor(props){
        super(props)
        this.state={
            totalCost:0,
            env:"sandbox",
            currency:"USD",

        }
    }
    handlePayment=async()=>{
        const config = {
            headers: {
              "auth-token": localStorage.getItem("token"),
            },
        }
        const response=await axios.post("http://localhost:5000/pay",{},config)
        console.log(response)
    }
    fetchTotalCost=()=>{
        const config = {
            headers: {
              "auth-token": localStorage.getItem("token"),
            },
        }
        axios.get("http://localhost:5000/totalCartPrice",config).then((res)=>{
        
            this.setState((prevstate)=>{

                prevstate.totalCost=res.data.cartTotal
                return prevstate
            })
        })
    }
    componentDidMount(){
        this.fetchTotalCost()
    }
    onSuccess = (payment) => {
        
                console.log("The payment was succeeded!", payment);
                
    }
    onError = (err) => {
        
        console.log("Error!", err);
    }
    onCancel = (data) => {
        // User pressed "cancel" or close Paypal's popup!
        console.log('The payment was cancelled!', data);
        // You can bind the "data" object's value to your state or props or whatever here, please see below for sample returned data
    }
  render() {
    let env = 'sandbox'; 
    let currency = 'USD'; 
    let total = 1
    const client = {
        sandbox:    'Ad1WEixlbXi4CJmoihX3P6F8jLpxFSD_wPSyC_Jlctlw3SzwKJGrB1ws7tvwonrdfrkq8a-ZhesH7v6G',
        production: 'YOUR-PRODUCTION-APP-ID',
    }
    return (
      <div>
          <Container style={{height:'80vh'}}>
              <Grid align="center" className='midOfScreen'>
                    <h6>Remember all transaction will be through us dollar only</h6>
                    <PaypalExpressBtn env={env} client={client} currency={currency} total={total} onError={this.onError} onSuccess={this.onSuccess} onCancel={this.onCancel} />
                </Grid>
          </Container>
      </div>
    )
  }
}
