export const Memoise = function(){
    const cache = {}
    function returnFunction(key, calculator){
        
        if (!cache.hasOwnProperty(key)){
            cache[key] = calculator()
        }
        return cache[key]
    }
    returnFunction.setValue = function(key, value){ cache[key] = value }
    return returnFunction
}

export const Debounce = function ( func, delay=1000 ){
    let timeout = null
    return function(...args){
        clearTimeout(timeout)
        timeout = setTimeout( (  )=>{
            func(...args)
        }, delay )
    }
}

export const memoiseInstance = Memoise()