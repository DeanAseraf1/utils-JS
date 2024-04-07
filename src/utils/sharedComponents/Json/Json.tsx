import React, { ReactElement, useEffect, useRef, useState } from "react"
import { useForm } from 'react-hook-form';

const getNewLineName = (name:string, newLine=false) => {
    return name ? <>{`${name}: `}{newLine && <br/>}</> : ""
}

const ValueToElement = (props:any) => {
    const {name, value, options, keyName, getJsonState, setJsonState} = props
    const {labelRenederer} = options
    let result;
    switch (typeof(value)){
        // case "string":
        //     result = <React.Fragment key={keyName}>
        //         {getName(name)}<JsonItem value={value} keyName={keyName} register={register}/><br/>
        //     </React.Fragment>
        //     break;

        // case "number":
        //     result = <React.Fragment key={keyName}>
        //         {getName(name)}<JsonItem value={value} keyName={keyName} register={register}/><br/>
        //     </React.Fragment>
        //     break;

        // case "boolean":
        //     result = <React.Fragment key={keyName}>
        //         {getName(name)}<JsonItem value={value} keyName={keyName} register={register}/><br/>
        //     </React.Fragment>
        //     break;

        case "string":
        case "number":
        case "boolean":
            result = <React.Fragment key={keyName}>
                {labelRenederer ? labelRenederer(name, false) : getNewLineName(name, false)}
                <JsonItem value={value} options={options} keyName={keyName} getJsonState={getJsonState} setJsonState={setJsonState}/><br/>
            </React.Fragment>
            break;

        case "object":
            if(Array.isArray(value)){
                result = <React.Fragment key={keyName}>
                    {labelRenederer ? labelRenederer(name, true) : getNewLineName(name, true)}
                    <ArrayItem value={value} options={options} keyName={keyName} getJsonState={getJsonState} setJsonState={setJsonState}/>
                </React.Fragment>
                break;
            }
            result = <React.Fragment key={keyName}>
                {labelRenederer ? labelRenederer(name, true) : getNewLineName(name, true)}
                <ObjectItem value={value} options={options} keyName={keyName} getJsonState={getJsonState} setJsonState={setJsonState}/>
            </React.Fragment>
            break;

        default: 
            result = <span style={{display:"none"}} key={keyName}></span>
            break;
    }

    return result
}

const JsonItem = (props:any) => {
    const {value, keyName, options, getJsonState, setJsonState} = props;
    const {InputRenderer} = options;

    const realType = typeof(value) === "string" ? "text" :
    typeof(value) === "number" ? "number" : 
    typeof(value) === "boolean" ? "checkbox" : undefined;

    const onChange = typeof(value) === "string" ? (e:any)=> setJsonState(keyName, e.target.value) :
    typeof(value) === "number" ? (e:any) => setJsonState(keyName, +e.target.value):
    (e:any) => setJsonState(keyName, (prev:any)=>!prev);

    onChange({target: {value: value}});
    const inputProps = {type: realType, value:getJsonState(keyName), checked: getJsonState(keyName), defaultValue:value, defaultChecked:value, onChange:onChange}
    const result = InputRenderer ? InputRenderer(inputProps) : <input {...inputProps}/>
    return result;
} 

// const StringItem = (props:any) => {
//     const {value, keyName, register} = props
//     // const [objectState, setObjectState] = useState<string>(value)
//     // return <input type="text" value={objectState} onChange={e=>setObjectState(e.target.value+"")}/>
//     return <input type="text" defaultValue={value} {...register(keyName)}/>
// }

// const NumberItem = (props:any) => {
//     const {value, keyName, register} = props
//     // const [objectState, setObjectState] = useState<number>(value)
//     // return <input type="number" value={objectState} onChange={e=>setObjectState(+e.target.value)}/>
//     return <input type="number" defaultValue={value} {...register(keyName)}/>
// }

// const BooleanItem = (props:any) => {
//     const {value, keyName, register} = props
//     // const [objectState, setObjectState] = useState<boolean>(value)
//     // return <input type="checkbox"  checked={objectState} onChange={e=>setObjectState(prev=>!prev)}/>
//     return <input type="checkbox" defaultChecked={value} {...register(keyName)}/>
// }

const ArrayItem = (props:any) => {
    const {value, options, keyName, getJsonState, setJsonState} = props;
    const { ArrayRenderer, ArrayItemRenderer } = options || {};
    const result = <>
        {(value ?? []).map((value:any, i:number)=>{
                const k = `${keyName}->${i}`;
                const result = <ValueToElement value={value} options={options} key={k} keyName={k} getJsonState={getJsonState} setJsonState={setJsonState}/>
                return ArrayItemRenderer ? ArrayItemRenderer(result) : <React.Fragment key={k}>{result}</React.Fragment>
        })}</>
    return ArrayRenderer ? ArrayRenderer(result) : <div>{result}</div>
}

const ObjectItem = (props:any) => {
    const {value, options, keyName, getJsonState, setJsonState} = props;
    const {ObjectRenderer, ObjectItemRenderer} = options || {};
    const keys = Object.keys(value);
    const values = Object.values(value);

    const result = <>
        {(keys || []).map((value:string, i:number)=>{
            const k = keyName ? `${keyName}->${keys[i]}` : keys[i]
            const result = <ValueToElement name={value} value={values[i]} options={options} keyName={k} getJsonState={getJsonState} setJsonState={setJsonState}/>
            return ObjectItemRenderer ? ObjectItemRenderer(result) : <React.Fragment key={k}>{result}</React.Fragment>;
        })}
    </>
    return ObjectRenderer ? ObjectRenderer(result) : <div>{result}</div>
}


const setValueByKeys:(obj:any, keys:string[], value:any)=>any = (obj:any, keys:string[], value:any) => {
    const currentValue = Array.isArray(obj) ? obj[+keys[0]] : obj[keys[0]]
    let res = {
        ...obj, 
        [keys[0]]: keys.length > 1 ? (setValueByKeys(currentValue, keys.slice(1), value)) : 
            typeof(value) === "function" ? value(currentValue) : value
    };
    return res;
}

const getValueByKeys:(obj:any, keys:string[])=>any = (obj:any, keys:string[]) => {
    console.log(obj, keys)

    for(let i = 0; i<keys.length; i++){
        const currentValue = Array.isArray(obj) ? obj[+keys[i]] : obj[keys[i]]
        console.log(currentValue);
        obj = currentValue
    }
    return obj;
}

export const Json = (props:{
    value: any;
    setValue:any;
    keyName:string;
    options?: {
        JsonRenderer?: (value:any) => JSX.Element;
        ArrayRenderer?: (value:any) => JSX.Element;
        ArrayItemRenderer?:(value:any) => JSX.Element;
        ObjectRenderer?: (value:any) => JSX.Element;
        ObjectItemRenderer?: (value:any) => JSX.Element;
        InputRenderer?: (props:any) => JSX.Element;
        labelRenederer?: (name:string, newLine?:boolean) => JSX.Element;
    };
}) => {
    const [element, setElement] = useState<ReactElement|null>(null);
    const flagRef = useRef(false);
    const {value, setValue, options, keyName} = props;
    const {JsonRenderer} = options || {}
    const [state, setState] = useState<any>({});
    // const [s, setS] = useState<any>(value);

    const getVal = () => value;

    const getJsonState = (keyName:string) => {
        return state[keyName];
        //console.log(getValueByKeys(value, keyName.split("->").slice(1)))
        //return getValueByKeys(getVal(), keyName.split("->").slice(1));
    }
    const setJsonState = (keyName:string, value:any) => {
        setState((prev:any)=>{return {...prev, [keyName]: typeof(value) === "function" ? value(prev[keyName]) : value}});
        //setS((prev:any)=>keysToItem(prev, keyName.split("->").slice(1), value))
        setValue((prev:any)=>setValueByKeys(prev, keyName.split("->").slice(1), value))
    }
    // useEffect(()=>{
    //     if(flagRef.current === false){
    //         const result = value.map((val:any, i:number)=>{
    //             const k = `${keyName}->${i}`;
    //             return <ObjectItem value={val} options={options} keyName={k} key={k} setValue={setValue} rValue={value}/>;
    //         })
    //         setElement(()=>result);
    //         flagRef.current = true;
    //     }
    // },[])

    useEffect(()=>{
        if(flagRef.current === false){
            // const result = value.map((val:any, i:number)=>{
            //     return <ObjectItem value={val} options={options} keyName={k} key={k} setValue={setValue} rValue={value}/>;
            // })
            setElement(()=><ValueToElement value={value} options={options} keyName={keyName} getJsonState={getJsonState} setJsonState={setJsonState}/>);
            flagRef.current = true;
        }
    },[])
    return JsonRenderer ? JsonRenderer(element) : <div>{element}</div>;
}