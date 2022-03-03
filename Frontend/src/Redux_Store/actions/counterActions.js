const add=(amount)=>{
    
    return {
        type:"ADD",
        payload:amount
    }
}
const makeZero=()=>{
    return {
        type:"MAKE_ZERO",
    }
}
export {add,makeZero}