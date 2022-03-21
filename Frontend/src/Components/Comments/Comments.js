import React, { Component } from "react";
import { Comment } from 'antd'
import { Avatar } from "@material-ui/core";
import "./comment.css"
import axios from "axios";
export default class Comments extends Component {
  constructor(props) {
    super(props);
    this.state = {
        replyBoxVisible:false,
        comment:''
    };
  }
  handleChange=(e)=>{
    this.setState((prevState)=>{
      prevState[e.target.name]=e.target.value
      return prevState
    })
  }
  childComments = () => {
    const { allComments,id } = this.props;
    return allComments.filter((c) => c.parent === id);
  };
  handleSubmit=async (e)=>{
    // console.log("The parent is ",this.props.parent)
    e.preventDefault()
     const configure={
       headers: {
         "auth-token": localStorage.getItem("token"),
       },
     }
     const response=await axios.post("http://localhost:5000/addComment",{comment:this.state.comment,product:this.props.product,parent:this.props.comment._id},configure)
     document.getElementById("text").value=""
     this.setState((prevState)=>{
      prevState.replyBoxVisible=false
      return prevState
    })
     this.props.fetchProductCmt()
  }
  changeReplyBoxVisibility=()=>{

      const currentStatus=this.state.replyBoxVisible
    
      this.setState((prevState)=>{

          prevState.replyBoxVisible=!currentStatus
          return prevState
      })
  }
  render() {
    const {comment,allComments}=this.props
    
    return <div>
        <Comment
      author={
        
          comment.user.name
      
      }
       avatar={
       
        <Avatar>{ comment.user.name[0]}</Avatar>
       
      }
      content={
          <>
        <h6 >{ comment.body} </h6>
        <p className="replyBtn" onClick={this.changeReplyBoxVisibility}>Reply</p>
        {this.state.replyBoxVisible && <form className="my-2" onSubmit={this.handleSubmit}>
            <textarea id="text" cols={150} onChange={this.handleChange} className="replyBox" type="text" placeholder="Type your reply"  name="comment"></textarea>
            <button type="submit">Submit</button>
        </form>}

        </>
      }
    
    >
    {
      this.childComments().map(c => (
        <Comments 
          fetchProductCmt={this.props.fetchProductCmt}
          product={this.props.product}
          id={c._id}
          key={c._id} 
          comment={c} 
          allComments={allComments}
        
        />
      ))
    }
    </Comment>
    </div>;
  }
}
