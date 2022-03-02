import React, { Component } from "react";

export default class Carousel extends Component {
  render() {
    return (
      <div className="s">
        <div
          id="carouselExampleInterval"
          className="carousel slide"
          data-bs-ride="carousel"
        >
          <div className="carousel-inner">
            <div className="carousel-item active" data-bs-interval="2000">
              <img
                style={{ width: "150px", height: "400px" }}
                src="https://us.123rf.com/450wm/vectorlab/vectorlab1901/vectorlab190100066/123179129-flash-sale-hot-advertising-horizontal-poster-business-ecommerce-discount-promotion-gradient-template.jpg?ver=6"
                className="d-block w-100"
                alt="..."
              />
            </div>
            <div className="carousel-item" data-bs-interval="2000">
              <img
                style={{ width: "150px", height: "400px" }}
                src="https://thumbs.dreamstime.com/z/e-commerce-illustration-concept-character-template-banner-presentation-social-media-poster-advertising-promotion-164704980.jpg"
                className="d-block w-100"
                alt="..."
              />
            </div>
            <div className="carousel-item" data-bs-interval="2000">
              <img
                style={{ width: "150px", height: "400px" }}
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQMvJ2BtTbO7gZsRBqWfX9HgBziR_c0ZxjoZg&usqp=CAU"
                className="d-block w-100"
                alt="..."
              />
            </div>
          </div>
          <button
            className="carousel-control-prev"
            type="button"
            data-bs-target="#carouselExampleInterval"
            data-bs-slide="prev"
          >
            <span
              className="carousel-control-prev-icon"
              aria-hidden="true"
            ></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button
            className="carousel-control-next"
            type="button"
            data-bs-target="#carouselExampleInterval"
            data-bs-slide="next"
          >
            <span
              className="carousel-control-next-icon"
              aria-hidden="true"
            ></span>
            <span className="visually-hidden">Next</span>
          </button>
        </div>
      </div>
    );
  }
}
