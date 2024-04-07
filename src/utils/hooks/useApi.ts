import { useEffect, useRef, useState } from "react"

const API:{get:any, put:any} = {
    get:(apiName:string, route:string, options:Object)=>{
        return new Promise(res=>res({isSuccessful: true, data: {id: "1"}}));
    }, 
    put:(apiName:string, route:string, options:Object)=>{
        return new Promise(res=>res({isSuccessful: true}));
    }
};

export const useDbState = (apiName:string, getRoute: string, updateRoute:string, defaultValue?:any, onError = (err:any)=>console.log(err)) => {
    const [state, setState] = useState(defaultValue);
    // const ref = useRef(defaultValue);
    const flagRef = useRef(false);
    useEffect(()=>{
        if(!flagRef.current){
            refresh(undefined, onError);
        } 
    },[]);
    
    const updateDb = (onSuccess = () => {}, onError = (err:any) => console.log(err)) => {
        API.put(apiName, updateRoute, {
            body: {
                item: state
            }
        }).than((res:any)=>{
            if(res.isSuccessful){
                onSuccess();
            }else{
                onError && onError(res.err);
            }
        }).catch((err:any)=>{
            onError && onError(err);
        })
    }
    
    const refresh = (onSuccess = () => {}, onError = (err:any) => console.log(err)) => {
        API.get(apiName, getRoute, {}).then((res:any)=>{
            if(res.isSuccessful){
                setState(res.data);
                // ref.current = res.data;
                flagRef.current = true;
                onSuccess && onSuccess();
            }else{
                onError && onError(res.err);
            }
        }).catch((err:any)=>{
            onError && onError(err);
        })
    }

    return [state, setState, updateDb, refresh];
}