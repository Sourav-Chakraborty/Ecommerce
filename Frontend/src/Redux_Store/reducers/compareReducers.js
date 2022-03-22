const initialState={
    item:0
}

const compareReducers=(state=initialState,action)=>{
    switch (action.type) {
        case "INCREMENT_COMPARE":
            
            return{
                item:state.item+action.n
            }
        case "DECREMENT_COMPARE":
            return {
                item:state.item-action.n
            }
        case "SET_COMPARE":
            return {
                item:action.n
            }    
        default:
            return state
    }
}

export default compareReducers