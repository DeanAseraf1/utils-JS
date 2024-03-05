export const formatString = (value, dictionary = {}, startSyntaxKey = "", endSyntaxKey = "") => {
    let result = value;
    if(Array.isArray(dictionary)){
        for(const [fromSyntax, toSyntax] of dictionary){
            if(typeof(fromSyntax) === "string"){
                const key = `${startSyntaxKey}${fromSyntax}${endSyntaxKey}`;
                if(typeof(toSyntax) === "string")
                    result = result.replaceAll(key, toSyntax);
                else if(typeof(toSyntax) === "function")
                    result = result.replaceAll(key, toSyntax(fromSyntax));
            }
            else if(fromSyntax instanceof RegExp){
                if(typeof(toSyntax) === "string")
                    result = result.replaceAll(fromSyntax, toSyntax);
                else if(typeof(toSyntax) === "function"){
                    const matches = result.match(fromSyntax);
                    for(const match of matches){
                        result = result.replaceAll(match, toSyntax(match));
                    }

                }
            }
        }
    }
    else if(typeof(dictionary) === "object"){
        const keys = Object.keys(dictionary);
        const vals = Object.values(dictionary)
        for(let i = 0; i<keys.length; i++){
            const key = `${startSyntaxKey}${keys[i]}${endSyntaxKey}`;
            if(typeof(vals[i]) === "string"){
                if(vals[i] && result.includes(key))
                    result = result.replaceAll(key, vals[i]);
            }
            else if(typeof(vals[i]) === "function"){
                const func = vals[i];
                if(func && result.includes(key))
                    result = result.replaceAll(key, func(key));
            }
            
        }
    }
    return result;
}

export const isNumberBetween = (value, expression) =>{
    //Validating all the charatcers in the expression
    if(!/[^0-9\&\|\.\[\]\s\t\n\r]*/gim.test(expression))
        throw new SyntaxError;
    expression = formatString(expression, [
        [/[ \t\n\r]*/gim, ''],
        ['&', ' && '], //And syntaxes
        ['|', ' || '], //Or syntaxes
        ['[', ' ( '], //Opening Bracket syntaxes
        [']', ' ) '], //Closing Bracket syntaxes
        [' ', ''],
        [/(?<=(?:\D|^))\.\.\.(\d+)/g, 'num <= $1'], //Smaller syntaxes
        [/(\d+)\.\.\.(?=(?:\D|$))/g, 'num >= $1'], //Bigger syntaxes
        [/(\d+)\.\.\.(\d+)/g, '$1 <= num && num <= $2'] //IsBetween syntaxes
    ]);
    const evaluatedFunction = new Function('num', 'return ' + expression);
    return evaluatedFunction(value);
}

export const formatNumber = (value, integerDigits = 0, fractionDigits = -1) => {
    const max = Math.pow(10, integerDigits - 1);
    const offset = integerDigits - (Math.round(value) + "").length;
    const dec = Math.floor(value) - value;

    const startPad = "0".repeat(offset > 0 ? offset : 0);

    if(dec === 0){
        return (value >= max) ? (value + "") : (startPad + value)
    }
    else{
        const fixed = (fractionDigits >= 0) ? (value.toFixed(fractionDigits)) : (value + "");
        return (value >= max) ? (fixed) : (startPad + fixed)
    }
}

export const formatNumberByExpression = (value, expression) => {
    const arr = expression.split(".");
    const digs = arr.length > 0 ? arr[0].length : 0;
    const fracs = arr.length > 1 ? arr[1].length : 0;

    return formatNumber(value, digs, fracs);
}   

export const sortArrayBy = (arr, predicate = val=>val, isDecending = false)=>{
    return arr.sort((a,b)=>{
        const aValue = predicate(a);
        const bValue = predicate(b);
        if(aValue > bValue) return isDecending ? 1 : -1;
        else if(bValue > aValue) return isDecending ? -1 : 1;
        else return 0;
    })
}

export const joinArrayBy = (arr, seperator = null, predicate = (item, i)=>item) => {
    let result = null;
    for(let i = 0; i < arr.length; i++){
        if(i === 0)
            result = predicate(arr[i], i)
        else
            result += predicate(arr[i], i);
        if(seperator && i < arr.length-1)
            result += seperator;
    }
    return result;
}

export const averageArrayBy = (arr, itemFunction = (item, i)=>item, filterFunction = (item, value, i)=>true) => {
    const res = [];
    for(let i = 0;i<arr.length; i++){
        const value = itemFunction(arr[i], i);
        if(filterFunction(arr[i], value, i))
            res.push(value)
    }
    return joinArrayBy(res)/res.length;
}

export const dateFormatDictionary =  (date) => {
    return [
        ["MS", formatNumber(date.getMilliseconds(), 3)],
        ["ms", date.getMilliseconds() + ""],
        ["S", formatNumber(date.getSeconds(), 2)],
        ["s", date.getSeconds() + ""],
        ["MI", formatNumber(date.getMinutes(), 2)],
        ["mi", date.getMinutes() + ""],
        ["H", formatNumber(date.getHours(), 2)],
        ["h", date.getHours() + ""],

        ["D", formatNumber(date.getDate(), 2)],
        ["d", date.getDate() + ""],
        ["MO", formatNumber(date.getMonth() + 1, 2)],
        ["mo", (date.getMonth() + 1) + ""],
        ["Y", formatNumber(date.getFullYear(), 4)],
        ["y", (date.getFullYear() + "").substring(2, 4)],
    ];
}

export const formatDate = (date, format = "D-MO-y h:MI:S.MS", startSyntaxKey = "", endSyntaxKey = "", dictionary = dateFormatDictionary(date)) => {
    return formatString(format, dictionary, startSyntaxKey, endSyntaxKey)
}

export const foreachField = (obj, predicate = (key, val, i) => val) => {
    const keys = Object.keys(obj);
    const values = Object.values(obj);
    for(let i = 0; i < keys.length; i++){
        predicate(keys[i], values[i], i);
    }
}