import React, { Component } from "react";
import axios from "axios";
import {connect} from "react-redux"
import {removeFromCompare} from "../../Redux_Store/actions/compareAction"
import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core";
import { incrementCartVal } from "../../Redux_Store/actions/cartAction";
 class CompairPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [],
    };
  }
  fetchCompareList = async () => {
    const config = {
      headers: {
        "auth-token": localStorage.getItem("token"),
      },
    };
    const response = await axios.get(
      "http://localhost:5000/getCompareList",
      config
    );
    if (response.data.compareList)
      this.setState((prevState) => {
        prevState.products = response.data.compareList;
        return prevState;
      });
  };
  addToCart=async (id)=>{
    const config = {
      headers: {
        "auth-token": localStorage.getItem("token"),
      },
    };
    const response=await axios.put(`http://localhost:5000/addToCart/${id}`,{},config)
    if(response.data.success){
      this.props.incrementCart()   
      this.props.changeAlert(true,"success",'Added to cart')
      setTimeout(()=>{
      this.props.changeAlert(false)

      },5000)
    }
    else{
      this.props.changeAlert(true,"error",'already in cart')
      setTimeout(()=>{
      this.props.changeAlert(false)

      },5000)
    }
  }
  removeFromCompare= async (id)=>{
    
    const config = {
      headers: {
        "auth-token": localStorage.getItem("token"),
      },
    };
    const response = await axios.put(
      "http://localhost:5000/removeFromCompare",{productId:id},
      config
    )
 
    if(response.data.done){
      this.props.changeAlert(true,"success","removed successfully")
      this.props.removeFromCompare()
      this.fetchCompareList()
      setTimeout(() => {
      this.props.changeAlert(false)
        
      }, 5000);
    }

  }
  componentDidMount() {
    this.fetchCompareList();
  }
  render() {
    return (
      <div className="container " style={{minHeight:"90vh"}}>
       {this.state.products.length>0? <>
       
        <h2 className="text-center">Compare Products</h2>
       <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Product Name</TableCell>
                <TableCell align="center">Image</TableCell>
                <TableCell align="center">Brand</TableCell>
                <TableCell align="center">Type</TableCell>
                <TableCell align="center">Model No</TableCell>
                <TableCell align="center">Origin Country</TableCell>
                <TableCell align="center">Manufacture year</TableCell>
                <TableCell align="center">Rating</TableCell>
                <TableCell align="center">Price</TableCell>
                <TableCell align="center">Add to Cart</TableCell>
                <TableCell align="center">Remove from Comparision</TableCell>


              </TableRow>
            </TableHead>
            <TableBody>
              {this.state.products.map((row) => (
                <TableRow
                  key={row.name}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {row.name}
                  </TableCell>
                  <TableCell align="center">
                    <img style={{width:"90%",height:"90%"}} src={row.img} alt="" />
                  </TableCell>
                  <TableCell align="center">{row.company}</TableCell>
                  <TableCell align="center">{row.type}</TableCell>
                  <TableCell align="center">{row.model}</TableCell>
                  <TableCell align="center">{row.country}</TableCell>
                  <TableCell align="center">{row.mfg}</TableCell>
                  <TableCell align="center">{row.rating}</TableCell>
                  <TableCell align="center">{row.price}</TableCell>
                  <TableCell align="center">
                    <Button style={{fontSize:"10px"}} onClick={(e,p=row._id)=> this.addToCart(p)} className="green compareBtn" variant="contained" color="success">Add to Cart</Button>
                  </TableCell>
                  <TableCell align="center">
                  <Button style={{fontSize:"11px"}} className="red compareBtn" onClick={(e,p=row._id)=> this.removeFromCompare(p)}  variant="contained">Remove from compair</Button>

                  </TableCell>

                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer></> :<>
                <h2  className="text-center">Add products to compare</h2>
        </>}
      </div>
    );
  }
}
const mapDispatchToProps=(dispatch)=>{
  return {
    incrementCart:()=>{
      dispatch(incrementCartVal())
    },
    removeFromCompare:(n=1)=>{
      dispatch(removeFromCompare(n))
    }
  }
}
export default  connect(null,mapDispatchToProps)(CompairPage)