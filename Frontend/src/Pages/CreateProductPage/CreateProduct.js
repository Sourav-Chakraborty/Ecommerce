import {
    Button,
  Card,
  Container,
  Grid,
  TextareaAutosize,
  TextField,
} from "@material-ui/core";
import React, { Component } from "react";
import "./createProduct.css";
export default class CreateProduct extends Component {
  render() {
    return (
      <div className="createProduct">
        <Container>
          <Card >
            <h3 className="d-flex justify-content-center">Create Product</h3>
            <form className="createProductForm">
              <div className="formRow">
                <TextField id="outlined-name" label="Name" />
                <TextField id="outlined-name" label="Name" />
                <TextField id="outlined-name" label="Name" />
              </div>
              <div className="formRow">
                <TextField id="outlined-name" label="Name" />
                <TextField id="outlined-name" label="Name" />
                <TextField id="outlined-name" label="Name" />
              </div>
              <div className="formRow">
                <TextField id="outlined-name" label="Name" />
                <TextField id="outlined-name" label="Name" />
                <TextField id="outlined-name" label="Name" />
              </div>
             
               
                <div className="rowForDesc">

                <TextareaAutosize 
                  aria-label="minimum height"
                  minRows={3}
                  placeholder="Short description"
                  style={{ width: 500,marginRight:"auto", marginLeft:"auto"}}
                />
                </div>
                   <div className="d-flex justify-content-center">
                    <button style={{marginRight:"125px"}} type="submit" className="btn btn-info">Submit</button>

                   </div>

            </form>
          </Card>
        </Container>
      </div>
    );
  }
}
