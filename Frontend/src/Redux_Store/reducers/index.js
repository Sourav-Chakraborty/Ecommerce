import cartAmount from "./cartAmount";
import loginReducers from "./loginReducers";
import { combineReducers } from "redux";

const allReducers=combineReducers({
    loginReducers,
    cartAmount,
})
export default allReducers