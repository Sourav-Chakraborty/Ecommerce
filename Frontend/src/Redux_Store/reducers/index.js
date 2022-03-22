import cartAmount from "./cartAmount";
import loginReducers from "./loginReducers";
import { combineReducers } from "redux";
import cartItemNoReducers from "./cartItemNo";
import compareReducers from "./compareReducers";

const allReducers=combineReducers({
    loginReducers,
    cartAmount,
    cartItemNoReducers,
    compareReducers
})
export default allReducers

