const initialState={
    val:0
}

const countReducer=(state=initialState,action)=>{
    switch(action.type){
        case "INCREMENT":
            return{
                val:state.val+action.payload
            }
        case "DECREMENT":
            if(state.val===0)
                return state
            return {
                val:state.val-action.payload
            }

        default:
           return state

    }
}
export default countReducer
