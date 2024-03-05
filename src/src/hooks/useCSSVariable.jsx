
export const useCSSVariable = (initVariables = []) => {
    let root = document.documentElement;
    if(root){
        for(let i = 0; i<initVariables.length; i++){
            const variable = initVariables[i];
            root.style.setProperty(`--${variable.key}`, variable.value);
        }
    }

    // const tweenValue = (key, from, to, units, time, offset) => {
    //     if(from < to){
    //         root.style.setProperty(`--${key}`, from + units);
    //         setTimeout(()=>{
    //             tweenValue(key, from + offset, to, units, time, offset)
    //         }, time);
    //     }
    // }

    return {
        updateVariable: (key, value) => {
            if(root){
                root.style.setProperty(`--${key}`, value);
            }
        },

        // tween: (key, from, to, units, time, offset) => {
        //     if(root){
        //         tweenValue(key, from, to, units, time, offset)
        //     }
        // },

        getVariable: (key) => {
            if(root){
                return root.style.getPropertyValue(`--${key}`);
            }
        }
    }
}

export const useDynamicStyleheet = (styles = {}) => {
    //let customStyleSheet = getStylesheet()
    
    foreachField(styles, (key, val)=>{
        createClass(key, val)
    })

    return dynamicStyles;
}

export const dynamicStyles = {
    /*/ Dynamic CSS Classes /*/
    //get
    getClass: (name) => 
        isRuleExist(name) === true ? name : "",

    getClasses: (names) => 
        names.map(n=>isRuleExist(n) === true ? n : "").join(" "),

    //update
    updateClass: (name, styles = {}, pseudoStyles = {}, createIfNotExist = true) => 
        updateClass(name, styles, pseudoStyles, createIfNotExist),

    //create
    createClass: (name, styles = {}, pseudoStyles = {}, updateIfExist = true) => 
        createClass(name, styles, pseudoStyles, updateIfExist),
        
    createClasses: (styles = {}) => {
        const names = [];
        foreachField(styles, (key, val)=>{
            const res = createClass(key, val)
            if(res)
            names.push(res);
        })
        return names.join(" ");
    },

    /*/ Dynamic CSS Variables /*/
    //get
    getVar: (propName) => getVar(propName),
    
    //update
    updateVar: (propName, propValue) => updateVar(propName, propValue),
    
    //create
    createVar: (propName, propValue) => createVar(propName, propValue),

    createVars: (vars = {}) => foreachField(vars, (key, val)=>{
        createVar(key, val)
    }),
}


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

const stylesToRule = (name, styles = {}) => {
    let style = "";
    foreachField(styles, (key, val) => {
        style += `${camelCaseToDashcase(key)}: ${val};\n`;
    })
    return `.${name} {\n${style}}\n\n`;
}

const foreachField = (styles = {}, predicate  = (key, val)=>val) => {
    const keys = Object.keys(styles);
    const values = Object.values(styles);
    for(let i = 0; i < keys.length; i++){
        predicate(keys[i], values[i]);
    }
}

const camelCaseToDashcase = (text) => {
    return text.replace(/[A-Z]/g, m => "-" + m.toLowerCase());
}

const isRuleExist = (name) => {
    let customStyleSheet = getStylesheet()
    for(let i = 0; i<customStyleSheet.sheet.cssRules.length; i++){
        if(customStyleSheet.sheet.cssRules[i].selectorText === `.${name}`){
            return true
        }
    }
    return false;
}

const createClass = (name, styles = {}, pseudoStyles = {}, updateIfExist=true) => {
    let customStyleSheet = getStylesheet()
    if(isRuleExist(customStyleSheet, name) === false){
        customStyleSheet.sheet.insertRule(stylesToRule(name, styles));
        foreachField(pseudoStyles, (key, val) =>{
            customStyleSheet.sheet.insertRule(stylesToRule(name + key, val));
        })
        return name
    }
    else{
        if(updateIfExist){
            updateClass(customStyleSheet, name, styles, pseudoStyles, false);
        }
        else{
            console.warn(name + " ALREADY EXIST!");
        }
        return name;
    }
    
}

const updateRules = (name, styles = {}, createIfNotExist=true) => {
    let customStyleSheet = getStylesheet()
    if(isRuleExist(customStyleSheet, name)){
        for(let i = 0; i<customStyleSheet.sheet.cssRules.length; i++){
            if(customStyleSheet.sheet.cssRules[i].selectorText === `.${name}`){
                foreachField(styles, (key, val) => {
                    console.log(styles, key, val);
                    customStyleSheet.sheet.cssRules[i].style[key] = val;
                })
                break;
            }
        }
    }
    else{
        if(createIfNotExist){
            createClass(customStyleSheet, name, styles, {}, false);
        }
        else{
            console.warn(name + " IS NOT EXIST!")
        }
    }
}

const updateClass = (name, styles = {}, pseudoStyles = {}, createIfNotExist=true) => {
    let customStyleSheet = getStylesheet()
    updateRules(customStyleSheet, name, styles, createIfNotExist);
    foreachField(pseudoStyles, (key, val) => {
        updateRules(customStyleSheet, name + key, val, createIfNotExist);
    })
}

const createVar = (propName, propValue) => {
    let customStyleSheet = getStylesheet()
    let hasRoot = false;
    for(let i = 0; i<customStyleSheet.sheet.cssRules.length; i++){
        if(customStyleSheet.sheet.cssRules[i].selectorText === `:root`){
            hasRoot = true;
            customStyleSheet.sheet.cssRules[i].style.setProperty(`--${propName}`,propValue);
            return;
        }
    }
    if(!hasRoot){
        customStyleSheet.sheet.insertRule(`:root {\n--${propName}: ${propValue};\n}`)
    }
    return `var(--${propName})`;
}

const updateVar = (propName, propValue) => {
    let customStyleSheet = getStylesheet()
    for(let i = 0; i<customStyleSheet.sheet.cssRules.length; i++){
        if(customStyleSheet.sheet.cssRules[i].selectorText === `:root`){
            customStyleSheet.sheet.cssRules[i].style.setProperty(`--${propName}`,propValue);
            return;
        }
    }
}

const getVar = (propName) => {
    let customStyleSheet = getStylesheet()
    for(let i = 0; i<customStyleSheet.sheet.cssRules.length; i++){
        if(customStyleSheet.sheet.cssRules[i].selectorText === `:root`){
            return customStyleSheet.sheet.cssRules[i].style.getPropertyValue(`--${propName}`);
        }
    }
}