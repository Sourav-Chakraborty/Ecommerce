import React, { Component } from 'react'
import { Alert } from "@material-ui/lab";

export default class AlertBox extends Component {

  render() {
    const {alertShow,alertMsg,alertType}=this.props
    
    return (
      <div>

           {alertShow && <Alert variant="filled" severity={alertType}>
                {alertMsg}
            </Alert>}

      </div>
    )
  }
}
