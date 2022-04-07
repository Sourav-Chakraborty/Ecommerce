import axios from "axios";
import React, { Component } from "react";
import { connect } from "react-redux";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import "./history.css";
import Product from "../Product/Product";
import {
  CarouselProvider,
  Slider,
  Slide,
  ButtonBack,
  ButtonNext,
} from "pure-react-carousel";
import "pure-react-carousel/dist/react-carousel.es.css";
class History extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [],
    };
  }
  fetchHistory = async () => {
    const config = {
      headers: {
        "auth-token": localStorage.getItem("token"),
      },
    };
    const response = await axios.get(
      "http://localhost:5000/getHistory",
      config
    );
    if (response.data.length) {
      const productsArray=response.data.reverse()
      this.setState((prevState) => {
        prevState.products = productsArray;
        return prevState;
      });
    }
  };
  componentDidUpdate(prevProps){
    console.log("history updated")
  }
  componentDidMount() {
    if(this.props.isLoggedin)
        this.fetchHistory()
    
  }
  render() {
    return (
      <div>
        {this.props.isLoggedin && (
          <>
            {" "}
            <h3 className="text-center">Previously viewed</h3>
            <Carousel
              showThumbs={false}
              centerMode="true"
              infiniteLoop="true"
              showArrows="true"
            ></Carousel>
            <CarouselProvider
              naturalSlideWidth={100}
              naturalSlideHeight={100}
              totalSlides={this.state.products.length}
              visibleSlides={3}
              infinite={true}
            >
              <Slider>
                {this.state.products.map((p) => (
                  <Slide>
                    <Product
                      key={p.id}
                      name={p.name}
                      price={p.price}
                      img={p.img}
                      desc={p.desc}
                      id={p._id}
                    />
                  </Slide>
                ))}
              </Slider>
             
            </CarouselProvider>
          </>
        )}
      </div>
    );
  }
}
const mapStateToProps = (state) => {
 
  return {
    productHistory: state.fetchHistoryReducer.isFetch,
    isLoggedin: state.loginReducers.isLoggedin,
  };
};

export default connect(mapStateToProps)(History);
