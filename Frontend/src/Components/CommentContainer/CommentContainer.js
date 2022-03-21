import React, { Component } from 'react'
import data from "../../comment_data"
import Comments from '../Comments/Comments'
import "./commentContainer.css"
import axios from "axios"
import { connect } from 'react-redux'
 class CommentContainer extends Component {
    constructor(props){
        super(props)
        this.state={
            allComments:[],
            cmt:""
        }
        this.fetchProductCmt.bind(this)
    }
    getParentCmt=()=>{
        const parentCmts=[]
        this.state.allComments.map(c=>{
           
             if(!c.parent.length )
                parentCmts.push(c)
        })
        return parentCmts

    }
    fetchProductCmt=async ()=>{
      const response=await axios.get(`http://localhost:5000/getProductComments/${this.props.product}`)
      this.setState((prevState)=>{
        prevState.allComments=response.data
        return prevState
      })
    }
    handleChange=(e)=>{
      this.setState((prevState)=>{
        prevState[e.target.name]=e.target.value
        return prevState
      })
    }
    handleFormSubmit=async (e)=>{
      e.preventDefault()
      const configure={
        headers: {
          "auth-token": localStorage.getItem("token"),
        },
      }
      const response=await axios.post("http://localhost:5000/addComment",{comment:this.state.cmt,product:this.props.product},configure)
      this.setState((prevState)=>{
        prevState.cmt=""
        return prevState
      })
      this.fetchProductCmt()
    }
    componentDidMount(){
      this.fetchProductCmt()
    }
  render() {
    return (
      <div>
        {this.props.isLoggedin && <form onSubmit={this.handleFormSubmit}>
          <input value={this.state.cmt} required className='cmtBox' type="text" placeholder='Add your Comment' name="cmt" onChange={this.handleChange}/>
          <button className='my-2' type='submit'>Submit</button>
        </form>}
        {
            this.getParentCmt().map(c=> <Comments fetchProductCmt={this.fetchProductCmt} product={this.props.product}  key={c._id} id={c._id} comment={c} allComments={this.state.allComments}/>)
        }
      </div>
    )
  }
}
const mapStateToProps = (state) => {
 
  return {
    isLoggedin: state.loginReducers.isLoggedin,
    isAdmin:state.loginReducers.isAdmin,
    cartItem:state.cartItemNoReducers.item
  };
};
export default connect(mapStateToProps)(CommentContainer)