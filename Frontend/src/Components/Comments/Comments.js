import React, { Component } from "react";
import { Comment } from 'antd'
import { Avatar } from "@material-ui/core";
import "./comment.css"
export default class Comments extends Component {
  constructor(props) {
    super(props);
    this.state = {
        replyBoxVisible:false
    };
  }
  childComments = () => {
    const { allComments,id } = this.props;
    return allComments.filter((c) => c.parent === id);
  };
  changeReplyBoxVisibility=()=>{

      const currentStatus=this.state.replyBoxVisible
      console.log("currentStatus ",currentStatus)
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
        
          comment.user
      
      }
       avatar={
       
        <Avatar>{ comment.user[0]}</Avatar>
       
      }
      content={
          <>
        <p>{`${comment.id} - ${comment.body}`}</p>
        <p className="replyBtn" onClick={this.changeReplyBoxVisibility}>Reply</p>
        {this.state.replyBoxVisible && <form className="my-2" onSubmit={()=> console.log("Replying to id no",this.props.id)}>
            <textarea cols={150} className="replyBox" type="text" placeholder="Type your reply" ></textarea>
            <button type="submit">Submit</button>
        </form>}

        </>
      }
    
    >
    {
      this.childComments().map(c => (
        <Comments 
          id={c.id}
          key={c.id} 
          comment={c} 
          allComments={allComments}
        
        />
      ))
    }
    </Comment>
    </div>;
  }
}
