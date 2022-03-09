import {Container, Grid } from '@material-ui/core'
import axios from 'axios'
import React, { Component } from 'react'
import {withRouter} from "react-router-dom"
import PaypalExpressBtn from 'react-paypal-express-checkout';
import { setCartVal } from '../../Redux_Store/actions/cartAction';
import { connect } from 'react-redux';
// import "./paypage.css"
class PayPage extends Component {
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
    onSuccess =async (payment) => {
        const config = {
            headers: {
              "auth-token": localStorage.getItem("token"),
            },
        }
                console.log("The payment was succeeded!", payment);
                const response=await axios.put("http://localhost:5000/emptyCart",{},config)
                if(response.data.msg){
                    this.props.history.push("/")
                    this.props.cartItem(0)
                }


    }
    onError = (err) => {
        
        console.log("Error!", err);
    }
    onCancel = (data) => {
        
        console.log('The payment was cancelled!', data);
       
    }
  render() {
    let env = 'sandbox'; 
    let currency = 'USD'; 
    let total = parseInt(this.state.totalCost)/75
    const client = {
        sandbox:    'Ad1WEixlbXi4CJmoihX3P6F8jLpxFSD_wPSyC_Jlctlw3SzwKJGrB1ws7tvwonrdfrkq8a-ZhesH7v6G',
        production: 'YOUR-PRODUCTION-APP-ID',
    }
    return (
      <div>
          <Container style={{height:'80vh'}}>
              <Grid align="center" className='midOfScreen'>
                    <h6>Remember all transaction will be through us dollar only Rs {this.state.totalCost} = {parseInt(this.state.totalCost)/75} USD</h6>
                    <PaypalExpressBtn env={env} client={client} currency={currency} total={Math.round(total)} onError={this.onError} onSuccess={this.onSuccess} onCancel={this.onCancel} />
                </Grid>
          </Container>
      </div>
    )
  }
}
const mapDispatchToProps=(dispatch)=>{
    return{
      cartItem:(val)=>{
        dispatch(setCartVal(val))
      }
    }
  }
export default connect(null,mapDispatchToProps)(withRouter(PayPage))