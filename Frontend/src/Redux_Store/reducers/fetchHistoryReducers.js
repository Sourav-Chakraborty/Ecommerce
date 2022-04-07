import axios from "axios"
const initialState={
  isFetch:false
}





const fetchHistoryReducer=(state=initialState,action)=>{
 
    switch (action.type) {
        case "FETCH":
         
          return {
            isFetch:action.value
          }
           
    
        default:
         
            return state
    }
}


export default fetchHistoryReducer