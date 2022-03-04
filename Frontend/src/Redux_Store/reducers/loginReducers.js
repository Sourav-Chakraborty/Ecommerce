const initialState={
    isLoggedin:false,
    isAdmin:false
}

const loginReducers=(state=initialState,action)=>{
    switch (action.type) {
        case "SIGN_IN":
            return{
                isLoggedin:true,
                isAdmin:action.isAdmin
            }
        case "SIGN_OUT":
            return{
                isLoggedin:false,
                isAdmin:false
            }
        default:
            return state
    }
}

export default loginReducers