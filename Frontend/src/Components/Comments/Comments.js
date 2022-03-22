import React, { Component } from "react";
import { Comment } from "antd";
import { Avatar } from "@material-ui/core";
import "./comment.css";
import axios from "axios";
import { connect } from "react-redux";
class Comments extends Component {
  constructor(props) {
    super(props);
    this.state = {
      replyBoxVisible: false,
      comment: "",
      isOwner: false,
      editMode: false,
      editTextArea:""
    };
  }
  handleChange = (e) => {
    this.setState((prevState) => {
      prevState[e.target.name] = e.target.value;
      return prevState;
    });
  };
  childComments = () => {
    const { allComments, id } = this.props;
    return allComments.filter((c) => c.parent === id);
  };
  handleSubmit = async (e) => {
    e.preventDefault();
    const configure = {
      headers: {
        "auth-token": localStorage.getItem("token"),
      },
    };
    const response = await axios.post(
      "http://localhost:5000/addComment",
      {
        comment: this.state.comment,
        product: this.props.product,
        parent: this.props.comment._id,
      },
      configure
    );
    document.getElementById("text").value = "";
    this.setState((prevState) => {
      prevState.replyBoxVisible = false;
      return prevState;
    });
    this.props.fetchProductCmt();
  };
  changeReplyBoxVisibility = () => {
    const currentStatus = this.state.replyBoxVisible;

    this.setState((prevState) => {
      prevState.replyBoxVisible = !currentStatus;
      return prevState;
    });
  };
  isOwner = async () => {
    const configure = {
      headers: {
        "auth-token": localStorage.getItem("token"),
      },
    };
    const response = await axios.get(
      `http://localhost:5000/isCommentOwner/${this.props.comment._id}`,
      configure
    );
    this.setState((prevState) => {
      prevState.isOwner = response.data.isOwner;
      return prevState;
    });
  };
  deleteComment = async () => {
    const configure = {
      headers: {
        "auth-token": localStorage.getItem("token"),
      },
    };
    const response = await axios.delete(
      `http://localhost:5000/deleteComment/${this.props.comment._id}`,
      configure
    );
    if (response.data.done) this.props.fetchProductCmt();
  };
  handleEditMode = () => {
    let currentStatus = this.state.editMode;
    this.setState((prevState) => {
      prevState.editMode = !currentStatus;
      return prevState;
    });
  };
  handleEdit=(e)=>{
    this.setState((prevState)=>{
      prevState[e.target.name]=e.target.value
      return prevState
    })
  }
  handleEditSubmit=async(e)=>{
    e.preventDefault()
    const configure = {
      headers: {
        "auth-token": localStorage.getItem("token"),
      },
    };
    const response=await axios.put(`http://localhost:5000/editComment/${this.props.comment._id}`,{body:this.state.editTextArea},configure)
    if(response.data.done){
    this.props.fetchProductCmt();
    this.handleEditMode()
    }
  }
  componentDidMount() {
    this.isOwner();
  }

  render() {
    const { comment, allComments } = this.props;
    let viewMode = {};
    let editMode = {};

    if (this.state.editMode) {
      viewMode.display = "none";
      editMode.display = "block";

    } else {
      editMode.display = "none";
      viewMode.display = "block";
    }
    return (
      <div>
        <Comment
          author={comment.user.name}
          avatar={<Avatar>{comment.user.name[0]}</Avatar>}
          content={
            <>
              <h6 style={viewMode}>{comment.body} </h6>
              <form onSubmit={this.handleEditSubmit}>
              <textarea id="editTextArea2" style={editMode}  name="editTextArea" cols="100" defaultValue={comment.body} onChange={this.handleEdit}></textarea>
              <button style={editMode} className="my-2" type="submit">Submit</button>
              </form>
              {this.props.isLoggedin && (
                <p
                  className="replyBtn mx-2"
                  onClick={this.changeReplyBoxVisibility}
                >
                  Reply
                </p>
              )}

              {this.state.isOwner && (
                <>
                  {" "}
                  <p
                    className="replyBtn mx-2"
                    onClick={this.handleEditMode}
                  >
                    Edit
                  </p>{" "}
                  <p className="replyBtn mx-2" onClick={this.deleteComment}>
                    Delete
                  </p>
                </>
              )}
              {this.state.replyBoxVisible && (
                <form className="my-2" onSubmit={this.handleSubmit}>
                  <textarea
                    id="text"
                    cols={100}
                    onChange={this.handleChange}
                    className="replyBox"
                    type="text"
                    placeholder="Type your reply"
                    name="comment"
                  ></textarea>
                  <button type="submit">Submit</button>
                </form>
              )}
            </>
          }
        >
          {this.childComments().map((c) => (
            <Comments
              fetchProductCmt={this.props.fetchProductCmt}
              isLoggedin={this.props.isLoggedin}
              product={this.props.product}
              id={c._id}
              key={c._id}
              comment={c}
              allComments={allComments}
            />
          ))}
        </Comment>
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    isLoggedin: state.loginReducers.isLoggedin,
    isAdmin: state.loginReducers.isAdmin,
    cartItem: state.cartItemNoReducers.item,
  };
};
export default connect(mapStateToProps)(Comments);
