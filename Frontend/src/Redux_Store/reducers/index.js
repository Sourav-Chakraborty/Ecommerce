import cartAmount from "./cartAmount";
import loginReducers from "./loginReducers";
import { combineReducers } from "redux";
import cartItemNoReducers from "./cartItemNo";

const allReducers=combineReducers({
    loginReducers,
    cartAmount,
    cartItemNoReducers,
    
})
export default allReducers

