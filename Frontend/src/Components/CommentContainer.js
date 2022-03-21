import React, { Component } from 'react'
import data from "../comment_data"
import Comments from './Comments/Comments'
export default class CommentContainer extends Component {
    constructor(props){
        super(props)
        this.state={
            allComments:data
        }
    }
    getParentCmt=()=>{
        const parentCmts=[]
        this.state.allComments.map(c=>{
            if(!c.parent)
                parentCmts.push(c)
        })
        return parentCmts

    }
  render() {
    return (
      <div>
        CommentContainer
        {
            this.getParentCmt().map(c=> <Comments key={c.id} id={c.id} comment={c} allComments={this.state.allComments}/>)
        }
      </div>
    )
  }
}
