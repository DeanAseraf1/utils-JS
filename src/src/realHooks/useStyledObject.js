const getStylesheet = () => {
    let customStyleSheet;
    if (!document.querySelector("#custom-stylesheet")) {
        customStyleSheet = document.createElement("style")
        customStyleSheet.setAttribute("id", "custom-stylesheet")
        document.head.appendChild(customStyleSheet)
    }else{
        customStyleSheet = document.querySelector("#custom-stylesheet");
    }
    return customStyleSheet;
}

//Recursive
const objectToStyledString = (obj) => {
    let style = "";
    let styledObj = {defaults: {}, pseudos: {}, medias: {}}
    foreachField(obj, (key, val) => {
        if(typeof(val) === "string"){
            if(!key.includes(":") && !key.includes("@")){
                style += `${camelCaseToDashcase(key)}: ${val};`;
                styledObj.defaults = {...styledObj.defaults, [key]: val};
            }
        }
        else if (typeof(val) === "object"){
            if(!key.includes(":") && !key.includes("@")){
                const prop = camelCaseToDashcase(key);
                foreachField(val,  (key, newVal)=>{
                    let r = newVal + ";";
                    if(typeof(newVal) === "object")
                    r = objectToStyledString(newVal)

                    if(key === "default"){
                        style += `${prop}: ${r}`;
                        styledObj.defaults = {...styledObj.defaults, [prop]: r};
                    }
                    else if(key.includes(":") && !key.includes("@")){
                        style += `&${camelCaseToDashcase(key)} {${prop}: ${r}}`;
                        styledObj.pseudos = {...styledObj.pseudos, [key]:{...styledObj.pseudos[key], [prop]: r}}
                    }
                    else if(key.includes(":") && key.includes("@")){
                        style += `&{${camelCaseToDashcase(key)} {${prop}: ${r}}}`;
                        styledObj.medias = {...styledObj.medias, [key]:{...styledObj.medias[key], [prop]: r}}
                    }
                })
            }
            else if(key.includes(":") && !key.includes("@")){
                style += `&${camelCaseToDashcase(key)} {${objectToStyledString(val)}}`;
                //styledObj.pseudos[key] = {...styledObj.pseudos[key], ...objectToStyledString(val)}
            }
            else if(key.includes(":") && key.includes("@")){
                style += `&{${camelCaseToDashcase(key)} {${objectToStyledString(val)}}}`;
                //styledObj.medias[key] = {...styledObj.medias[key], ...objectToStyledString(val)}
            }

        }
    })
    console.log(style);
    console.log(styledObj);
    return style;
}


const foreachField = (styles = {}, predicate  = (key, val, i)=>val) => {
    const keys = Object.keys(styles);
    const values = Object.values(styles);
    for(let i = 0; i < keys.length; i++){
        predicate(keys[i], values[i], i);
    }
}

const camelCaseToDashcase = (text) => {
    return text.replace(/[A-Z]/g, m => "-" + m.toLowerCase());
}

const isClassRuleExist = (name) => {
    let customStyleSheet = getStylesheet()
    for(let i = 0; i<customStyleSheet.sheet.cssRules.length; i++){
        if(customStyleSheet.sheet.cssRules[i].selectorText === `.${name}`){
            return true
        }
    }
    return false;
}

//Recursive
const additiveObject = (baseObj = {}, additiveObj = {}) => {
    let res = {...baseObj};
    foreachField(additiveObj, (key, val)=>{
        if(res[key] && typeof(res[key]) === "object" && typeof(val) === "object"){
            res[key] = {...additiveObject(res[key], val)}
        }
        else{
            res[key] = val;
        }
    })
    return res;
}


export const useStyledObject = (initStyles = {}, defaultName = "so") => {
    let index = 0;
    let obj = {};
    foreachField(initStyles, (key, val)=>{
        obj[key] = key;
    })
    return {
        styles: obj,
        getClass: (...classNames) => {
            let res = {};

            for(let i = 0; i<classNames.length; i++){
                if(initStyles[classNames[i]]){
                    res = additiveObject(res, initStyles[classNames[i]]);
                }
            }
            let name =`${defaultName}-${index}`;
            let customStyleSheet = getStylesheet();
            const classDef = `.${name} {\n${objectToStyledString(res)}}\n\n`
            if(isClassRuleExist(name) === false){
                customStyleSheet.sheet.insertRule(classDef, customStyleSheet.sheet.cssRules.length);
                index++;
            }
            else{
                for(let i = 0; i<customStyleSheet.sheet.cssRules.length; i++){
                    if(customStyleSheet.sheet.cssRules[i].selectorText === `.${name}`){
                        customStyleSheet.sheet.deleteRule(i);
                        customStyleSheet.sheet.insertRule(classDef, i);
                        break;
                    }
                }
            }
            return name;
        }
    }
}

export const updateObject = (obj, newValFunc = (val) => val, ...propNames) => {
    let currVal = {...obj};
    console.log(currVal);
    for(let i = 0; i<propNames.length; i++){
        currVal = currVal[propNames[i]];
    }
    const res = newValFunc(currVal);
    let newObj = {};
    for(let i = 0; i<propNames.length; i++){
        if(i<propNames.length-1){
            newObj = {...obj[propNames[i]]};
        }
        else{
            newObj[propNames[i]] = res;
        }
    }
    return {...obj, [propNames[0]]: newObj};

}

export const styleNumberPred = (pred=val=>val, units="px") => {
    return (val) => numberToStyleValue(pred(styleValueToNumber(val, units)), units)
}

export const styleValueToNumber = (value, units = "px") => {
    return +value.replace(units, "")
}
export const numberToStyleValue = (value, units = "px") => {
    return value + units;
}