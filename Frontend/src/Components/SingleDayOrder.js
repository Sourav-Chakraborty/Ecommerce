import React, { Component } from 'react'
import OrderItem from './OrderItem'
export default class SingleDayOrder extends Component {
  render() {
      console.log(this.props)
    return (
      <div>
          <h5 className="text-center">On {this.props.date.slice(0,10)} at {this.props.time}</h5>
          {
             this.props.products.map((p)=>(
                 <OrderItem img={p.img} name={p.name} key={p.img} price={p.price} qty={p.qty}/>
             ))
          }
        </div>
    )
  }
}
