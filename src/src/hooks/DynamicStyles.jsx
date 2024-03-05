/*/ Dynamic CSS Classes /*/
//get
export const getDClass = (name) => 
    isClassRuleExist(name) === true ? name : "";

export const getDClasses = (names) => 
    (" " + (names.map(n => isClassRuleExist(n) === true ? (n  + " ") : "")) + " ");

//update
export const updateDClass = (name, styles = {}, pseudoStyles = {}, createIfNotExist = true) => 
    updateClass(name, styles, pseudoStyles, createIfNotExist);

//create
export const createDClass = (name, styles = {}, pseudoStyles = {}, updateIfExist = true) => 
    createClass(name, styles, pseudoStyles, updateIfExist);
        
export const createDClasses = (styles = {}) => {
    const names = [];
    foreachField(styles, (key, val)=>{
        const res = createClass(key, val)
        if(res)
        names.push(res);
    })
    return names.join(" ");
};


/*/ Dynamic CSS Variables /*/
//get
export const getDVar = (propName) => getVar(propName);
    
 //update
export const updateDVar = (propName, propValue) => updateVar(propName, propValue);
    
//create
export const createDVar = (propName, propValue) => createVar(propName, propValue);

export const createDVars = (vars = {}) => foreachField(vars, (key, val)=>{
    createVar(key, val)
});





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

const objToVal = (val) => {
    return camelCaseToDashcase(JSON.stringify(val).replaceAll(",", ";").replaceAll(`"`, ""))
}

const otv = (obj) => {
    let style = "";
    foreachField(obj, (key, val) => {
        if(typeof(val) === "string"){
            if(!key.includes(":") && !key.includes("@"))
            style += `${camelCaseToDashcase(key)}: ${val};\n`;
        }
        else if (typeof(val) === "object"){
            if(key.includes(":") && !key.includes("@"))
            style += `&${camelCaseToDashcase(key)} {${otv(val)}}\n`;
            else if(key.includes(":") && key.includes("@"))
            style += `&{${camelCaseToDashcase(key)} {${otv(val)}}}\n`;
        }
    })
    return style;
}

const stylesToRule = (name, styles = {}) => {
    // let style = "";
    // foreachField(styles, (key, val) => {
    //     if(typeof(val) === "string"){
    //         if(!key.includes(":") && !key.includes("@"))
    //         style += `${camelCaseToDashcase(key)}: ${val};\n`;
    //     }
    //     else if (typeof(val) === "object"){
    //         if(key.includes(":") && !key.includes("@"))
    //         style += `&${camelCaseToDashcase(key)} {${otv(val)}}\n`;
    //         else if(key.includes(":") && key.includes("@"))
    //         style += `&{${camelCaseToDashcase(key)} {${otv(val)}}}\n`;

    //     }
    // })
    return `.${name} {\n${otv(styles)}}\n\n`;
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

const isClassRuleExist = (name) => {
    let customStyleSheet = getStylesheet()
    for(let i = 0; i<customStyleSheet.sheet.cssRules.length; i++){
        if(customStyleSheet.sheet.cssRules[i].selectorText === `.${name}`){
            return true
        }
    }
    return false;
}

const getRuleIndex = (selector) => {
    let customStyleSheet = getStylesheet()
    for(let i = 0; i<customStyleSheet.sheet.cssRules.length; i++){
        if(customStyleSheet.sheet.cssRules[i].selectorText === selector){
            return i;
        }
    }
    return -1;
}

const createClass = (name, styles = {}, pseudoStyles = {}, updateIfExist=true) => {
    let customStyleSheet = getStylesheet()
    if(isClassRuleExist(name) === false){
        customStyleSheet.sheet.insertRule(stylesToRule(name, styles));
        foreachField(pseudoStyles, (key, val) =>{
            customStyleSheet.sheet.insertRule(stylesToRule(name + key, val));
        })
        return name
    }
    else{
        if(updateIfExist){
            updateClass(name, styles, pseudoStyles, false);
        }
        else{
            console.warn(name + " ALREADY EXIST!");
        }
        return name;
    }
    
}

const func = (stylesObject = {}) => {
    const classNames = Object.keys(stylesObject);
    const values = Object.values(stylesObject);
    const cssClasses = {};
    console.log(stylesObject)
    for(let i = 0; i<classNames.length; i++){
        const classname = classNames[i];
        cssClasses[classname] = {};
        if(typeof(values[i]) === "object"){
            const firstLevelKeys = Object.keys(values[i]);
            const firstLevelValues = Object.values(values[i]);
            for(let j = 0; j<firstLevelKeys.length; j++){
                if(typeof(firstLevelValues[j]) === "object"){
                    if(firstLevelKeys[j] === "default"){
                        //CLASSNAME ==> DEFAULT {...}
                        cssClasses[classname] = {...cssClasses[classname], ...firstLevelValues[j]}
                    }
                    else if(firstLevelKeys[j].includes(":") && !firstLevelKeys[j].includes("@")){
                        const pseudo = firstLevelKeys[j];
                        //CLASSNAME ==> :Pseudo {...}
                        cssClasses[classname + pseudo] = {...cssClasses[classname + pseudo], ...firstLevelValues[j]}
                    }
                    else if(firstLevelKeys[j].includes("@")){
                        const media = firstLevelKeys[j]
                        //CLASSNAME ==> @Media {...}
                        
                        if(!cssClasses[`${media}`]){
                            cssClasses[`${media}`] = {[`.${classname}`]: firstLevelValues[j]}
                        }
                        else{
                            if(cssClasses[`${media}`][`.${classname}`])
                                cssClasses[`${media}`][`.${classname}`] = {...cssClasses[`${media}`][`.${classname}`], ...firstLevelValues[j]}
                            else
                                cssClasses[`${media}`][`.${classname}`] = firstLevelValues[j]

                        }
                    }
                    else{
                        //CLASSNAME ==> "" {...}
                        const propKey = firstLevelKeys[j];
                        const secondLevelKeys = Object.keys(firstLevelValues[j]);
                        const secondLevelValues = Object.values(firstLevelValues[j]);
                        for(let z = 0; z<secondLevelKeys.length; z++){
                            if(secondLevelKeys[z] === "default"){
                                //CLASSNAME ==> "" {default: ""}
                                cssClasses[classname] = {...cssClasses[classname], [propKey]: secondLevelValues[z]}
                            }
                            else if(secondLevelKeys[z].includes(":") && !secondLevelKeys[z].includes("@")){
                                const pseudo = secondLevelKeys[z];
                                //CLASSNAME ==> "" {:hover: ""}
                                cssClasses[classname + pseudo] = {...cssClasses[classname + pseudo], [propKey] : secondLevelValues[z]}
                            }
                            else if(secondLevelKeys[z].includes("@")){
                                const media = secondLevelKeys[z];
                                if(!cssClasses[`${media}`]){
                                    cssClasses[`${media}`] = {[`.${classname}`]: {[propKey] : secondLevelValues[z]}}
                                }
                                else{
                                    if(cssClasses[`${media}`][`.${classname}`])
                                        cssClasses[`${media}`][`.${classname}`] = {...cssClasses[`${media}`][`.${classname}`], [propKey] : secondLevelValues[z]}
                                    else
                                        cssClasses[`${media}`][`.${classname}`] = {[propKey] : secondLevelValues[z]}
                                }
                                //cssClasses[`${secondLevelKeys[z]}{${classname}}`]  = {...cssClasses[`${secondLevelKeys[z]}{${classname}}`], [firstLevelKeys[j]] : secondLevelValues[z]}
                            }
                            else{
                            }
                        }
                    }
                }
                else if(typeof(firstLevelValues[j]) === "string"){
                    cssClasses[classname] = {...cssClasses[classname], [firstLevelKeys[j]]: firstLevelValues[j]}
                }
            }
        }
    }
    return cssClasses;
}

// Classname ==> DEFAULT || CSS Property || Pseudo Elements || Media Queries ==> CSS Value || CSS Property || Pseudo Elements || Media Queries
const exmpale = {
    class2: {
        color: "blue"
    },
    class1: {
        color: "red",
    },
    
}

export const exmp = () => {
    console.log(exmpale);
    const rules = func(exmpale);
    const medias = [];
    foreachField(rules, (key, val)=>{
        if(!key.includes("@")){
            createClass(key, val);
        }
        else{
            medias.push(`${key} ${camelCaseToDashcase(JSON.stringify(val)).replace(`:`, "").replaceAll(",", ";").replaceAll(`"`, "")}`);
        }
    })
    let customStyleSheet = getStylesheet()
    medias.forEach(val=>{
        customStyleSheet.sheet.insertRule(val, customStyleSheet.sheet.cssRules.length);
    })
}

const updateRules = (name, styles = {}, createIfNotExist=true) => {
    let customStyleSheet = getStylesheet()
    if(isClassRuleExist(name)){
        for(let i = 0; i<customStyleSheet.sheet.cssRules.length; i++){
            if(customStyleSheet.sheet.cssRules[i].selectorText === `.${name}`){
                foreachField(styles, (key, val) => {
                    //console.log(styles, key, val);
                    customStyleSheet.sheet.cssRules[i].style[key] = val;
                })
                break;
            }
        }
    }
    else{
        if(createIfNotExist){
            createClass(name, styles, {}, false);
        }
        else{
            console.warn(name + " IS NOT EXIST!")
        }
    }
}

const updateClass = (name, styles = {}, pseudoStyles = {}, createIfNotExist=true) => {
    updateRules(name, styles, createIfNotExist);
    foreachField(pseudoStyles, (key, val) => {
        updateRules(name + key, val, createIfNotExist);
    })
}

const createVar = (propName, propValue) => {
    let customStyleSheet = getStylesheet()
    // let hasRoot = false;
    const index = getRuleIndex(`:root`)
    if(index >= 0){
        customStyleSheet.sheet.cssRules[index].style.setProperty(`--${propName}`,propValue);
    }
    // for(let i = 0; i<customStyleSheet.sheet.cssRules.length; i++){
    //     if(customStyleSheet.sheet.cssRules[i].selectorText === `:root`){
    //         hasRoot = true;
    //         customStyleSheet.sheet.cssRules[i].style.setProperty(`--${propName}`,propValue);
    //         return;
    //     }
    // }
    else{
        customStyleSheet.sheet.insertRule(`:root {\n--${propName}: ${propValue};\n}`)
    }
    return `var(--${propName})`;
}

const updateVar = (propName, propValue) => {
    let customStyleSheet = getStylesheet()
    const index = getRuleIndex(`:root`)
    if(index >= 0){
        customStyleSheet.sheet.cssRules[index].style.setProperty(`--${propName}`,propValue);
    }
    // for(let i = 0; i<customStyleSheet.sheet.cssRules.length; i++){
    //     if(customStyleSheet.sheet.cssRules[i].selectorText === `:root`){
    //         customStyleSheet.sheet.cssRules[i].style.setProperty(`--${propName}`,propValue);
    //         return;
    //     }
    // }
}

const getVar = (propName) => {
    let customStyleSheet = getStylesheet()
    const index = getRuleIndex(`:root`)
    if(index >= 0){
        return customStyleSheet.sheet.cssRules[index].style.getPropertyValue(`--${propName}`);
    }
    // for(let i = 0; i<customStyleSheet.sheet.cssRules.length; i++){
    //     if(customStyleSheet.sheet.cssRules[i].selectorText === `:root`){
    //         return customStyleSheet.sheet.cssRules[i].style.getPropertyValue(`--${propName}`);
    //     }
    // }
}





export const useDStyles = (initStyles = {}) => {
    //console.log({styles})
    let index = 0;
    let obj = {};
    foreachField(initStyles, (key, val)=>{
        obj[key] = key;
    })
    return {
        styles: obj,
        combine: (...classNames) => {
            let res = {};

            for(let i = 0; i<classNames.length; i++){
                if(initStyles[classNames[i]]){
                    res = {...res, ...initStyles[classNames[i]]}
                    // let hasEffect = false;
                    // foreachField(styles[classNames[i]], (key, val)=>{
                    //     if(typeof(val) === "object"){
                    //         hasEffect = true;
                    //     }
                    // })
                    // if(!hasEffect){
                    // }
                    // else{
                    //     foreachField(styles[classNames[i]], (cssProp, val)=>{
                    //         if(typeof(val) === "object"){
                    //             foreachField(val, (effect, cssVal)=>{
                    //                 if(effect === "default"){
                    //                     res = {...res, [cssProp]: cssVal}
                    //                 }
                    //                 else if(effect.includes(":") && !effect.includes("@")){
                    //                     pseudos = {...pseudos, [effect]: {[cssProp]: cssVal}}
                    //                     //res = {...res, [`&${effect}`]: {[cssProp]: cssVal}}
                    //                 }
                    //                 else if(effect.includes("@")){
                    //                     medias = {...medias, [effect]: {[cssProp]: cssVal}}
                    //                 }
                    //             })
                    //         }
                    //         else{
                    //             res = {...res, [cssProp]: val}
                    //         }
                    //     })
                    // }
                }
            }
            let name = "cs" + index;
            //let cls = createClass2("cs" + index, res);
            let customStyleSheet = getStylesheet();
            //console.log(stylesToRule(name, styles))
            if(isClassRuleExist(name) === false){
                customStyleSheet.sheet.insertRule(`.${name} {\n${otv(res)}}\n\n`, customStyleSheet.sheet.cssRules.length);
            }
            index++;
            return name;
            // foreachField(pseudos, (key, val)=>{
            //     createClass2("cs" + index + key, val)
            // })
            // let customStyleSheet = getStylesheet()

            // foreachField(medias, (key, val)=>{
            //     let rule = `${key} {.cs${index}
            //         ${camelCaseToDashcase(JSON.stringify(val)).replaceAll(",", ";").replaceAll(`"`, "")}
            //     }`
            //     customStyleSheet.sheet.insertRule(rule, customStyleSheet.sheet.cssRules.length);
            // })
        
            //return cls;
        }
    }
}

const createClass2 = (name, styles = {}) => {
    let customStyleSheet = getStylesheet();
    console.log(stylesToRule(name, styles))
    if(isClassRuleExist(name) === false){
        customStyleSheet.sheet.insertRule(stylesToRule(name, styles), customStyleSheet.sheet.cssRules.length);
    }
    return name;
    
}


export const g2 = (styles) => {
    let newStyles = {};
    foreachField(styles, (className, classStyles) => {
        newStyles = {...newStyles, [className]: {}}
        let classStyleRes = {defaults: {}, pseudos: {}, medias: {}};
        foreachField(classStyles, (def, val)=>{
            if(typeof(val) !== "object"){
                //newStyles = {...newStyles, [className]: {...newStyles[className], [def]: val}}
                classStyleRes.defaults = {...classStyleRes.defaults, [def]: val}
            }
            else if(typeof(val) === "object"){
                const r = processObject(val, def);
                //console.log({r});
                classStyleRes.defaults = {...classStyleRes.defaults, ...r.defaults}
                //newStyles = {...newStyles, [className]: {...newStyles[className], ...mapBy(r.defaults, (k, v)=>{return {[def] : v}})}}
                classStyleRes.pseudos = {...classStyleRes.pseudos, ...r.pseudos};
                classStyleRes.medias = {...classStyleRes.medias, ...r.medias};
            }
        })
        // foreachField(classDef, (def, val)=>{
        //     if(typeof(val) === "object" && !def.includes(":") && !def.includes("@")){
        //         const cssProp = def;
        //     }
        //     else if(typeof(val) === "object"){
        //         
        //     }
        // })
        // const {defaults, pseudos, medias} = processObject(classDef);
        // console.log({defaults, pseudos, medias})
        console.log(classStyleRes);
    })
}

const processObject = (definition, currentProp) => {
    let defaults = {};
    let pseudos = {};
    let medias = {};

    foreachField(definition, (propName, propValue)=>{
        console.log(propName)
        if(propName === "default"){
            // if(typeof(propValue) === "object"){
            //     console.log("!!!!");
            //     const r = processObject(propValue, currentProp);
            //     defaults = {...defaults, ...mapBy(r.defaults, (k, v)=>{return {[currentProp] : v}})};
            //     pseudos = {...pseudos, ...mapBy(r.pseudos, (k, v)=>{return{[propName]: {[currentProp]: v}}})};
            //     medias = {...medias, ...mapBy(r.medias, (k, v)=>{return{[propName]: {[currentProp]: v}}})};
            // }
            // else{
                defaults = {...defaults, [currentProp]: propValue};
            // }
        }
        else if(propName.includes(":") && !propName.includes("@")){
            if(typeof(propValue) === "object"){
                const r = processObject(propValue, currentProp);
                //defaults = {...defaults, ...mapBy(r.defaults, (k, v)=>{return {[currentProp] : v}})};
                pseudos = {...pseudos, ...mapBy(r.defaults, (k, v)=>{return{[propName]: {[currentProp]: v}}})};
                pseudos = {...pseudos, ...mapBy(r.pseudos, (k, v)=>{return{[propName]: {[currentProp]: v[currentProp]}}})};
                pseudos = {...pseudos, ...mapBy(r.medias, (k, v)=>{return{[propName]: {[currentProp]: v[currentProp]}}})};
            }
            else{
                pseudos = {...pseudos, [propName]: {[currentProp]: propValue}};
            }
        }
        else if(propName.includes("@")){
            if(typeof(propValue) === "object"){
                const r = processObject(propValue, currentProp);
                console.log({r});
                medias = {...medias, ...mapBy(r.defaults, (k, v)=>{return {[propName]: {[currentProp]: v}}})};
                medias = {...medias, ...mapBy(r.pseudos, (k, v)=>{return{[propName]: {[currentProp]: v[currentProp]}}})};
                medias = {...medias, ...mapBy(r.medias, (k, v)=>{return{[propName]: {[currentProp]: v[currentProp]}}})};
            }
            else{
                medias = {...medias, [propName]: {[currentProp]: propValue}};
            }
        }
        // else{//CSS PropName
        //     if(typeof(propValue) === "object"){
        //         const r = processObject(propValue, currentProp);
        //         defaults = {...defaults, ...mapBy(r.defaults, (k, v)=>{return {[currentProp] : v}})};
        //         pseudos = {...pseudos, ...mapBy(r.pseudos, (k, v)=>{return{[propName]: {[currentProp]: v}}})};
        //         medias = {...medias, ...mapBy(r.medias, (k, v)=>{return{[propName]: {[currentProp]: v}}})};
        //     }
        //     else{
        //         defaults = {...defaults, [currentProp]: propValue};
        //     }
        // }
    })

    return {defaults, pseudos, medias};
}

const mapBy = (obj, predicate = (key, val)=>val) => {
    let res = {};
    const keys = Object.keys(obj);
    const vals = Object.values(obj);
    for(let i = 0; i<keys.length; i++){
        res = {...res, ...predicate(keys[i], vals[i])}
    }
    return res;
}