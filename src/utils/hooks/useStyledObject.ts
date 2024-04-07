
//To Test
export const g2 = (styles:Object) => {
    let newStyles = {};
    foreachField(styles, (className:string, classStyles:Object) => {
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

const processObject = (definition:string, currentProp:string) => {
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

const mapBy = (obj:Object, predicate = (key:string, val:any)=>val) => {
    let res = {};
    const keys = Object.keys(obj);
    const vals = Object.values(obj);
    for(let i = 0; i<keys.length; i++){
        res = {...res, ...predicate(keys[i], vals[i])}
    }
    return res;
}


const foreachField = (styles:Object = {}, predicate  = (key:string, val:any)=>val) => {
    const keys = Object.keys(styles);
    const values = Object.values(styles);
    for(let i = 0; i < keys.length; i++){
        predicate(keys[i], values[i]);
    }
}