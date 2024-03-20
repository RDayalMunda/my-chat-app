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

export const memoiseInstance = Memoise()