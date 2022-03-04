export const login=(isAdmin)=>{
    return {
        type:"SIGN_IN",
        isAdmin
    }
}
export const logout=()=>{
    return {
        type:"SIGN_OUT",
       
    }
}