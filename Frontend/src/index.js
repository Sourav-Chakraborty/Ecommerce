import React from "react";
import axios from 'axios';
import ReactDOM from "react-dom";
import 'antd/dist/antd.css';
import { PersistGate } from 'redux-persist/integration/react'
import getStore from "./configureStore"
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { Provider } from "react-redux";
const {store,persistor}=getStore()


axios.defaults.baseURL=process.env.REACT_APP_BASE_URL
axios.defaults.headers.common={
  "auth-token":localStorage.getItem("token")
}

ReactDOM.render(
  <Provider store={store}>
     <PersistGate loading={null} persistor={persistor}>
    <React.StrictMode>
     
      <App />
      
    </React.StrictMode>
    </PersistGate>
  </Provider>,

  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
