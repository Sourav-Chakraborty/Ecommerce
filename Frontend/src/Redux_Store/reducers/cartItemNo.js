const initialState={
    item:0
}

const cartItemNoReducers=(state=initialState,action)=>{
    switch(action.type){
        case "SET_VALUE":
            return{
                item:action.value
            }
        case "INCREMENT":
            return {
                item:state.item+1
            }
        case "DECREMENT":
            return {
                item:state.item-1
            }
        default:
            return state
    }
}
export default cartItemNoReducers