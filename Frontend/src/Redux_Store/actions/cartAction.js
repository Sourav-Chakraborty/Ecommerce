const setCartVal=(n)=>{
    return {
        type:"SET_VALUE",
        value:n
    }
}
const incrementCartVal=()=>{
    return {
        type:"INCREMENT",
        value:1
    }
}

const decrementCartVal=()=>{
    return {
        type:"DECREMENT",
        value:1
    }
}
export {setCartVal,incrementCartVal,decrementCartVal}