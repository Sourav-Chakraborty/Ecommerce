import cartAmount from "./cartAmount";
import loginReducers from "./loginReducers";
import { combineReducers } from "redux";
import cartItemNoReducers from "./cartItemNo";
import compareReducers from "./compareReducers";
import fetchHistoryReducer from "./fetchHistoryReducers"
const allReducers=combineReducers({
    loginReducers,
    cartAmount,
    cartItemNoReducers,
    compareReducers,
    fetchHistoryReducer
})
export default allReducers

