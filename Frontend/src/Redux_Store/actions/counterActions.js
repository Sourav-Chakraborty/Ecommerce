const increment=()=>{
    return{
        type:"INCREMENT",
        payload:10

    }
}

const decrement=()=>{
    return{
        type:"DECREMENT",
        payload:10

    }
}

export {increment,decrement}