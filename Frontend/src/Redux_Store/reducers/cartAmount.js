const initialState={
    val:0
}

const countReducer=(state=initialState,action)=>{
    switch(action.type){
        case "ADD":
            const a={val:state.val+action.payload}
            return a
        case "MAKE_ZERO":
            return {val:0}
        default:
           return state

    }
}
export default countReducer
