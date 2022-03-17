import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@material-ui/core";
import axios from "axios"
import React, { Component } from "react";
import ExpandMore from "@material-ui/icons/ExpandMore";
import OrderItem from "./OrderItem";
export default class SingleOrderAdmin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orderStatus:this.props.order.status
    };
  }
  handleStatusChange=(e)=>{
    const config={
      headers:{
        "auth-token":localStorage.getItem("token")
      }
    }
    axios.put(`http://localhost:5000/changeOrderStatus/${this.props.order.id}`,{newStatus:e.target.value},config).then((res)=>{
    
    })
    this.setState((prevState)=>{
      prevState.orderStatus=e.target.value
      return prevState
    })
  }
  render() {
    
   
    return (
      <div>
        <Accordion className="my-3">
          <AccordionSummary
            expandIcon={<ExpandMore />}
            aria-controls="panel1a-content"
            id="panel1a-header"
            style={{ width: "100%", display: "flex" }}
          >
            <Typography>
              Order on {this.props.order.date.slice(0, 10)} at{" "}
              {this.props.order.time}
            </Typography>
            <div className="mx-4">
              Status{" "}
              <span
                style={{
                  color:
                  this.state.orderStatus === "Order placed"
                      ? "red"
                      : this.state.orderStatus === "Delevired"
                      ? "green"
                      : "violet",
                }}
              >
                {this.state.orderStatus}
              </span>
            </div>
          </AccordionSummary>
          <AccordionDetails>
            <div
              className="orderDetails"
              style={{ display: "flex", justifyContent: "space-between",flexWrap:"wrap"}}
            >
              <div className="userInfo">
                Name: {this.props.order.user} <br />
                Phone No: {this.props.order.phone} <br />
                Email: {this.props.order.email} <br />
                Full Address: {this.props.order.address}
              </div>
              <div className="changeStatus">
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">
                    Change Status
                  </InputLabel>
                  <Select
                    style={{width:"140px"}}
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={this.state.orderStatus}
                    label="Change status"
                    onChange={this.handleStatusChange}
                  >
                    <MenuItem value={"Order placed"}>Order placed</MenuItem>
                    <MenuItem value={"Shipped"}>Shipped</MenuItem>
                    <MenuItem value={"Delivary office"}>
                      Delivary office
                    </MenuItem>
                    <MenuItem value={"Out for delivery"}>
                      Out for delivery
                    </MenuItem>
                    <MenuItem value={"Delevired"}>Delevired</MenuItem>
                  </Select>
                </FormControl>
              </div>
            </div>
            <br />
           
          </AccordionDetails>
          {
                this.props.order.products.map(p=>
                 <OrderItem name={p.name} qty={p.qty} price={p.price} img={p.img}/>
                )
            }
        </Accordion>
      </div>
    );
  }
}
