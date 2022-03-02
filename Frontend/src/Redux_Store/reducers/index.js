import countReducer from "./countReducers";
import loginReducers from "./loginReducers";
import { combineReducers } from "redux";

const allReducers=combineReducers({
    loginReducers,
    countReducer,
})
export default allReducers