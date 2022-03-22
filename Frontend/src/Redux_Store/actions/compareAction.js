const addToCompare=(n)=>{
    console.log("Incrementing compare by ",n)
    return {
        type:"INCREMENT_COMPARE",
        n
    }
}

const removeFromCompare=(n)=>{
    return {
        type:"DECREMENT_COMPARE",
        n
    }
}

const setToCompare=(n)=>{
    return {
        type:"SET_COMPARE",
        n
    }
}

export {addToCompare,removeFromCompare,setToCompare}