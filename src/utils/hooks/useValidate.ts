import { useEffect, useRef, useState } from "react"
/*/
    The useValidate() hook definition
/*/

type InputProps = {
    ref: (instance:HTMLInputElement | null) => void, 
    onChange: React.ChangeEventHandler<HTMLInputElement>, 
    onBlur: React.FocusEventHandler<HTMLInputElement>,
    type?:string,
    checked?:boolean,
    value?:string|boolean,
    className?:string,
    style?:Object,
}

type InputRefProps = {
    props: InputProps,
    message?: string,
    validateField: (isRerender?: boolean, isFocus?: boolean, oldValue?: any, newValue?: any) => boolean,
    resetField: () => void,
    focusField:() => void
}

type RegisterOptionsProps = {
    // type?:string
    initialValue?:string,
    emptyValue?:string,
    
    classNameFunction?:(isInvalid:boolean)=>string,
    styleFunction?:(isInvalid:boolean)=>Object,

    validateOnMount?:boolean,

    onChange?:React.ChangeEventHandler<HTMLInputElement>, 
    validateOnChange?:boolean, 

    onBlur?:React.FocusEventHandler<HTMLInputElement>, 
    validateOnBlur?:boolean, 
    focusOnBlur?:boolean,

    logging?: boolean,
}

const mapFields = (obj:Object, predicate:(key:string, val:any, i:number)=>Object = (key, val, i) => val) => {
    const keys = Object.keys(obj);
    const values = Object.values(obj);
    const res:any = {};
    for(let i = 0; i < keys.length; i++){
        const currentRes = predicate(keys[i], values[i], i)
        res[keys[i]] = currentRes;
    }
    return res;
}

const mapTypes = (type:string, value?:string, checked?:boolean) => {
    switch(type){
        case "checkbox":
        case "radio":
            return checked ?? false;
        case "date":
            return new Date(value ?? "");
        case "number":
            return +(value ?? 0)
        default:
            return value ?? "";
    }
}


export const useValidate = (props: {focusOnValidate?:boolean, onValidate?:(data:any)=>void} = {focusOnValidate: true}) => {
    const {focusOnValidate, onValidate} = props;
    const refs = useRef<any>({});
    const [getRerenderer, setRerenderer] = useState(false)
    const [callback, setCallback] = useState<(()=>void)|null>(null);

    useEffect(()=>{
        if(callback){
            callback();
        }
        return () => {
            setCallback(null);
        }
    },[callback]);

    const register = (id:string, validations?:((...args:any[])=>string|undefined)[], options?:RegisterOptionsProps) => {
        const {
            // type = undefined,
            initialValue = "",
            emptyValue = "",
            classNameFunction=undefined,
            styleFunction=undefined,
            validateOnMount = false,
            onChange=undefined,
            validateOnChange=true,
            onBlur=undefined,
            validateOnBlur=true,
            focusOnBlur = false,
            logging = false
        } = (options ?? {});
        
        const currentRef = refs?.current[id];
        const currentType = getType(id) === "text" ? "" : getType(id);
        const isCheckbox = currentType === "checkbox" || currentType === "radio"

        const currentOnChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
            let oldValue;
            let newValue;
            if(refs?.current[id]?.props){
                oldValue = isCheckbox ? refs.current[id].props.checked : refs.current[id].props.value;
                if(isCheckbox){
                    refs.current[id].props.checked = !refs?.current[id]?.props?.checked;
                }
                else{
                    refs.current[id].props.value = e?.target?.value ? e.target.value : emptyValue;
                }
                newValue = isCheckbox ? refs.current[id].props.checked : refs.current[id].props.value;
            }
            if(validateOnChange && refs?.current[id]?.validateField){
                refs.current[id].validateField(false, false, oldValue, newValue)
            }
            rerender();
            onChange && onChange(e)
        }
    
        const currentOnBlur:React.FocusEventHandler<HTMLInputElement> = (e) => {
            if (validateOnBlur && refs?.current[id]?.validateField) {
                refs.current[id].validateField(false, focusOnBlur)
                rerender();
            }
            if(onBlur !== undefined) onBlur(e)
        }

        const focusField = () => {
            if(refs?.current[id]?.props?.ref?.current){
                refs.current[id].props.ref.current.focus();
                refs.current[id].props.ref.current.scrollIntoView({ block: "nearest" });
            }
        }
    
        const validateField = (isRerender = true, isFocus = false, oldValue:any = "", newValue:any = "") => {
            let isValid = true;
            let index = -1;
            for (let i = 0; i < (validations ?? []).length; i++) {
                const func = (validations ?? [])[i];
                const value = isCheckbox ? refs.current[id].props.checked : refs.current[id].props.value;
                const res = func(value);
                if (res !== undefined) {
                    if (isValid) {
                        refs.current[id].message = res
                        index = i;
                    }
                    isValid = false;
                    
                }
            }
            if (isValid) {
                refs.current[id].message = undefined;
            }
            else{
                if(isFocus){
                    focusField();
                }
                if(logging && !isValid && refs?.current[id]){
                    if((!oldValue || !newValue) && (oldValue || newValue)){
                        console.log(`The validation at [${index}] index of "${id}" got activated,\nfrom ${oldValue} to ${newValue}.`);
                    }else{
                        console.log(`The validation at [${index}] index of "${id}" got activated.`);
                    }
                }
                
            }
            if (isRerender) {
                rerender();
            }
            return isValid;
        }
    
        const resetField = () => {
            refs.current[id].message = undefined;
        }

        const currentValue = getRawValue(id) ?? initialValue ?? emptyValue ?? (isCheckbox ? false : "");
        const valueObject = isCheckbox ? {checked: Boolean(currentValue)} : {value: String(currentValue)};
        
        const classNameObject = classNameFunction ? { className: classNameFunction(isInvalid(id)) } : {};
        const styleObject = styleFunction ? {style: styleFunction(isInvalid(id))} : {};

        const typeObject = (currentType ? {type: currentType} : 
            (refs?.current[id]?.props?.type ? {type: refs?.current[id]?.props?.type + ""} : 
        {}));

        const InputRefProps: InputRefProps = {
            props:{
                ref: (instance:HTMLInputElement | null) => refs.current[id].props.ref.current = instance,
                onChange: currentOnChange,
                onBlur: currentOnBlur,
                ...typeObject,
                ...valueObject,
                ...classNameObject,
                ...styleObject,
            },
            message: refs?.current[id]?.message ? refs.current[id].message : undefined,
            validateField,
            resetField,
            focusField
        }
    
        refs.current = {
            ...refs.current, 
            [id]: InputRefProps
        };
    
        if(callback === null && validateOnMount === true && refs?.current[id]){
            setCallback(()=>{
                refs.current[id].validateField && refs.current[id].validateField();
            });
        }
        
        return refs.current[id].props;
    }
    //Reused functions
    const rerender = () => setRerenderer(prev => !prev);

    const isInvalid:(id:string)=>boolean = (id:string) => refs?.current[id]?.message;

    const getType:(id:string)=>string = (id) => refs?.current[id]?.props?.type ?? refs?.current[id]?.props?.ref?.current?.type ?? "";
    const getMessage: (id:string) => string = (id) => refs?.current[id]?.message ?? "";

    const getRawValue: (id:string)=>string|boolean = (id) => {
        if(getType(id) === "checkbox" || getType(id) === "radio"){
            return refs?.current[id]?.props?.checked ?? refs?.current[id]?.props?.ref?.current?.checked ?? false;
        }
        return refs?.current[id]?.props?.value ?? refs?.current[id]?.props?.ref?.current?.value ?? "";
    }

    const getParsedValue: (id:string) => any = (id) => {
        if(!refs?.current[id]?.props){
            return;
        }
        const type = getType(id);
        return mapTypes(type, refs?.current[id]?.props?.value, refs?.current[id]?.props?.checked);
    }

    const validate = (ids: string[]|undefined = undefined, isRerender = true, includeIds = true) => {
        const keys = Object.keys(refs.current);
        const values:any[] = Object.values(refs.current);
        let isValid = true;
        for (let i = 0; i < keys.length; i++) {
            let res = true;
            if (ids === undefined || (ids.includes(keys[i]) && includeIds) || (!ids.includes(keys[i]) && !includeIds)){
                if(refs?.current[keys[i]]){
                res = refs.current[keys[i]].validateField ? refs?.current[keys[i]]?.validateField() : true;
                    if (res === false) {
                        if (isValid && focusOnValidate === true) {
                            values[i].focusField();
                        }
                        isValid = false;
                    }
                }
            }
        }
        if (isRerender) {
            rerender();
        }
        console.log(mapFields(refs.current, (k, v, i)=>v?.props?.type === "checkbox" ? v?.props?.checked : v?.props?.value))
        if(isValid){
            onValidate && onValidate(mapFields(refs.current, (k, v, i)=>v?.props?.type === "checkbox" ? v?.props?.checked : v?.props?.value))
        }
        return isValid;
    }

    const reset = (ids:string[]|undefined = undefined, isRerender = true, includeIds = true) => {
        const keys = Object.keys(refs.current);
        const values:any[] = Object.values(refs.current);
        for (let i = 0; i < values.length; i++) {
            if (ids === undefined || (ids.includes(keys[i]) && includeIds) || (!ids.includes(keys[i]) && !includeIds)) {
                values[i].resetField();
            }
        }
        if (isRerender) {
            rerender();
        }
    }

    const setError = (id:string, message:string, isRerender = true) => {
        if(refs?.current[id]){
            refs.current[id].message = message;
            if (isRerender) {
                rerender();
            }
        }
    }

    const setValue = (id:string, value:any, isRerender = true) => {
        if(refs?.current[id]?.props){
            if(typeof(value) === "boolean"){
                refs.current[id].props.checked = (value ?? false);
            }
            else{
                refs.current[id].props.value = (value ?? "");
            }
            if (isRerender) {
                rerender();
            }
        }
    }

    const messageRenderer = (id:string, callback:(msg:string)=>React.ReactNode) => {
        if (isInvalid(id)) {
            return callback(refs.current[id].message)
        }
        else{
            return null
        }
    }

    

    return {
        register,
        validate,
        reset,
        setError,
        setValue,
        messageRenderer,
        getMessage,
        getRawValue,
        getParsedValue,
        isInvalid,
        rerender,
    };
}



/*/
    The defaultValidations object definition
/*/
export const defaultValidations = {
    //General
    required: (message:string = "Required field") => (val:string|boolean) => !val ? message : undefined,

    //Dates
    date: (message:string = "Invalid date") => (val:string) => isNaN(new Date(val).getTime()) ? message : undefined,

    dateRange: (from:string | number | Date | null = null, to: string | number | Date | null = null, message:string = "Invalid date range", innerRanger = true) => (val:string) => {
        const dateValue = new Date(val);
        if(innerRanger){
            if(from !== null && dateValue.getTime() < new Date(from).getTime())
                return message;
            if(to !== null && dateValue.getTime() > new Date(to).getTime())
                return message;
            return undefined;
        }
        else{
            if(from !== null && dateValue.getTime() > new Date(from).getTime() && 
            to !== null && dateValue.getTime() < new Date(to).getTime())
                return message;
            return undefined;
        }
    },

    //Numbers
    minValue: (minValue:number, message:string = `Smaller than ${minValue}`) => (val:string) => (+val) < minValue ? message : undefined,

    maxValue: (maxValue:number, message:string = `Bigger than ${maxValue}`) => (val:string) => (+val) > maxValue ? message : undefined,

    rangeValue: (minValue:number, maxValue:number, message:string = `Not in range ${minValue}->${maxValue}`, innerRanger=true) => (val:string) => {
        if(innerRanger){
            return ((+val) < minValue || (+val) > maxValue) ? message : undefined;
        }
        else{
            return ((+val) > minValue && (+val) < maxValue) ? message : undefined;
        }
    },

    //Strings
    minLength: (minLength:number, message:string = `Smaller than ${minLength} characters`) => (val:string) => val.length < minLength ? message : undefined,

    maxLength: (maxLength:number, message:string = `Bigger than ${maxLength} characters`) => (val:string) => val.length > maxLength ? message : undefined,

    rangeLength: (minLength: number, maxLength:number, message:string = `Not in range ${minLength}->${maxLength} characters`, innerRanger=true) => (val:string) => {
        if(innerRanger){
            return (val.length) < minLength || (val.length) > maxLength ? message : undefined
        }
        else{
            return (val.length) > minLength && (val.length) < maxLength ? message : undefined
        }
    }
}