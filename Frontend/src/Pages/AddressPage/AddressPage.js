import {
  Button,
  Card,
  Container,
  Grid,
  TextareaAutosize,
  TextField,
} from "@material-ui/core";
import axios from "axios";
import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import "./address.css";
class AddressPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      mobile: "",
      address: "",
    };
  }
  handleChange = (e) => {
    this.setState((prevstate) => {
      prevstate[e.target.name] = e.target.value;
      return prevstate;
    });
  };
  fetchAddress = async () => {
    const config = {
      headers: {
        "auth-token": localStorage.getItem("token"),
      },
    };
    const response = axios
      .get("http://localhost:5000/getAddress", config)
      .then((res) => {
        if (res.data) {
          this.setState((prevstate) => {
            prevstate.name = res.data.name;
            prevstate.mobile = res.data.mobile;
            prevstate.address = res.data.address;
            return prevstate;
          });
        }
      });
  };
  handleSubmit = async (e) => {
    e.preventDefault();
    const address = {
      name: this.state.name,
      mobile: this.state.mobile,
      address: this.state.address,
    };
    localStorage.setItem("address", address);
    const config = {
      headers: {
        "auth-token": localStorage.getItem("token"),
      },
    };
    const response = await axios.post(
      "http://localhost:5000/addAddress",
      {
        name: this.state.name,
        mobile: this.state.mobile,
        address: this.state.address,
      },
      config
    );
    this.props.history.push("/pay");
  };

  componentDidMount() {
    this.fetchAddress();
  }
  render() {
    return (
      <Container className="my-2 py-3">
        <Grid align="center">
          <Card className="formCard">
            <h3>Give your address Details</h3>
            <form type="post" onSubmit={this.handleSubmit}>
              <TextField
                name="name"
                onChange={this.handleChange}
                value={this.state.name}
                className="my-3"
                id="outlined-basic"
                label="Name"
                variant="outlined"
                required
              />
              <TextField
                name="mobile"
                onChange={this.handleChange}
                value={this.state.mobile}
                className="my-3"
                id="outlined-basic"
                label="phone no."
                variant="outlined"
                required
              />
              <TextareaAutosize
                name="address"
                onChange={this.handleChange}
                defaultValue={this.state.address}
                aria-label="minimum height"
                className="my-3"
                minRows={3}
                placeholder="Your Full address with pincode"
                style={{ width: 200 }}
                required
              />

              <Button
                className="my-4 btn"
                type="submit"
                variant="contained"
                fullWidth
                style={{ backgroundColor: "#3f51b5", color: "white" }}
              >
                Continue
              </Button>
            </form>
          </Card>
        </Grid>
      </Container>
    );
  }
}
export default withRouter(AddressPage);
