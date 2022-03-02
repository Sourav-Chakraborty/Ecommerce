const initialState={
    isLoggedin:false,
    name:""
}

const loginReducers=(state=initialState,action)=>{
    switch (action.type) {
        case "SIGN_IN":
            return{
                isLoggedin:true,
                name:action.name
            }
        case "SIGN_OUT":
            return{
                isLoggedin:false,
                name:""
            }
        default:
            return state
    }
}

export default loginReducers