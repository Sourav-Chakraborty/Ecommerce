import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Grid,
  Slider,
  Typography,
} from "@material-ui/core";
import ExpandMore from "@material-ui/icons/ExpandMore";
import React, { Component } from "react";
import OrderItem from "./OrderItem";
export default class SingleDayOrder extends Component {
  render() {
    let statusVal=""
    if(this.props.status==="Order placed")
      statusVal="0"
    else if(this.props.status==="Shipped")
        statusVal="25"
    else if(this.props.status==="Reached Delivary office")
        statusVal="50"
    else if(this.props.status==="Out for delivery")
        statusVal="80"
    else
        statusVal="100"
    
    const marks = [
      {
        value: "0",
        label: "Order placed",
      },
      {
        value: 25,
        label: "Packed & Shipped",
      },
      {
        value: 50,
        label: "Reach delivery office",
      },
      {
        value: 80,
        label: "Out for delivery",
      },
      {
        value: 100,
        label: "Delivered",
      },
    ];

    return (
      <div>
        {/* <h5 className="text-center">On {this.props.date.slice(0,10)} at {this.props.time}</h5> */}
        <Accordion className="my-3">
          <AccordionSummary
            expandIcon={<ExpandMore />}
            aria-controls="panel1a-content"
            id="panel1a-header"
            style={{ width: "100%", display: "flex" }}
          >
            <Typography>
              Order on {this.props.date.slice(0, 10)} at {this.props.time}
            </Typography>
            <div className="mx-4">
              Status{" "}
              <span
                style={{
                  color:
                    this.props.status === "Order placed"
                      ? "red"
                      : this.props.status === "Delevired"
                      ? "green"
                      : "violet",
                }}
              >
                {this.props.status}
              </span>
            </div>
          </AccordionSummary>
          <AccordionDetails >
            <div className="text-center">

            </div>
            <Slider
              disabled
              style={{ color: "green",width:"600px",marginLeft:"25%" }}
              aria-label="Custom marks"
              defaultValue={statusVal}
              // getAriaValueText={valuetext}
              step={10}
              valueLabelDisplay="auto"
              marks={marks}
            />

           
            <br />
          </AccordionDetails>
          {this.props.products.map((p) => (
            <OrderItem
              img={p.img}
              name={p.name}
              key={p.img}
              price={p.price}
              qty={p.qty}
            />
          ))}
        </Accordion>
      </div>
    );
  }
}
