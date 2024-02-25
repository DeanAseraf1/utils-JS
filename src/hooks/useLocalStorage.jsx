import { useEffect, useRef, useState } from "react";
import {useSearchParams} from "react-router-dom";

export const useLocalStorage = (initialStates = {}) => {
    const [get, set] = useState(false);

    const rerender = () => {
        set(prev=>!prev);
    }

    const update = (id, value) => {
        if(typeof(value) === "string"){
            localStorage.setItem(id, value);
        }
        else if (typeof(value) === "function"){
            const res = value(localStorage.getItem(id))
            localStorage.setItem(id, res);
        }
        else{
            localStorage.setItem(id, JSON.stringify(value))
        }
    }

    const keys = Object.keys(initialStates);
    const values = Object.values(initialStates);
    for(let i = 0; i<keys.length; i++){
        if(localStorage.getItem(keys[i]) === null)
        update(keys[i], values[i]);
    }

    return {
        addStorage: (id) => {
            // if(initialValue !== null && initialValue !== undefined){
            //     update(id, initialValue);
            // }
            return[
            localStorage.getItem(id),
            (value) =>  {
                update(id, value);
                rerender();
            }
        ]},
        resetStorage: (id) => {
            localStorage.removeItem(id);
            rerender();
        }
    
    }
    // return {
    //     get: (id) => {
    //         return localStorage.getItem(id);
    //     },
    //     getNonString: (id) => {
    //         return JSON.parse(localStorage.getItem(id));
    //     },
    //     set: (id, value) => {
    //         localStorage.setItem(id, value);
    //     },
    //     setNonString: (id, nonString) => {
    //         localStorage.setItem(id, JSON.stringify(nonString));
    //     }
    // }
}

// export const useLocalStorage2 = (states) => {
//     const [res, setRes] = useState(states);
//     const keys = Object.keys(res);
//     let obj = {...keys.map((key)=>{
//         return {
//             get [key](){
//                 return res[key];
//             },
//             set [key](value){
//                 setRes(prev=>{return{...prev, [key]: value}});
//             }
//         }
//     })};
//     return obj;
// }


export const useStatfulParams = (initialStates = {}) => {
    const [params, setParams] = useSearchParams(initialStates);

    const update = (id, value, replace) => {
        if(typeof(value) === "function"){
            const res = value(params.get(id));
            setParams(prev=>{
                prev.set(id, res);
                return prev;
            }, {replace: replace});
        }
        else if(typeof(value) === "string"){
            setParams(prev=>{
                prev.set(id, value);
                return prev;
            }, {replace: replace});
        }
        else{
            setParams(prev=>{
                prev.set(id, JSON.stringify(value));
                return prev;
            }, {replace: replace});
        }
    }
    return {
        addParam: (id, replace = true) => {
            // if(initialValue !== null && initialValue !== undefined){
            //     update(id, initialValue, replace);
            // }
            return [
                params.get(id),
                (value) => update(id, value, replace)
            ]
        },

        resetParam: (id, replace = true) => {
            setParams(prev=>{
                prev.set(id, null);
                return prev;
            }, {replace: replace});
        }
    }
}

export const usePostMessage = (listeners = {}) => {
    const isAddedRef = useRef(false);
    useEffect(()=>{
        if(!isAddedRef.current){
            const keys = Object.keys(listeners);
            const values = Object.values(listeners);
            for(let i = 0; i<keys.length; i++){
                window.addEventListener(
                    "message",
                    (event) => {
                        if(typeof(event.data) === "string" && event.data.includes("{")){
                            try{
                                const res = JSON.parse(event.data || {});
                                if (res.id === keys[i]){
                                    values[i](res.msg);
                                }
                            }
                            catch(err){
                                console.log(err);
                            }
                        }
                    },
                    false,
                );
            }
            isAddedRef.current = true;
        }
    },[isAddedRef.current])

    useEffect(()=>{
        // const keys = Object.keys(prevObj.current);
        // const values = Object.values(prevObj.current);
        // for(let i = 0; i<keys.length; i++){
        //     window.removeEventListener()
        // }
    }, [listeners])

    return (id, msg) => window.postMessage(JSON.stringify({id, msg}) , "*")
    // return [
    //     (id, msg) => window.postMessage(JSON.stringify({id, msg}) , "*"),
    //     (id, callback = (msg)=>{}) => {
    //         // if(obj[id]){
    //             // return;
    //         // }
    //         // setObj(prev=>{return{...prev, [id]: callback}})
    //         window.addEventListener(
    //             "message",
    //             (event) => {
    //                 if(typeof(event.data) === "string" && event.data.includes("{")){
    //                     try{
    //                         const res = JSON.parse(event.data || {});
    //                         if (res.id === id){
    //                             callback(res.msg);
    //                         }
    //                     }
    //                     catch(err){
    //                         console.log(err);
    //                     }
    //                 }
    //             },
    //             false,
    //         );
    //     }
    //     //(id) => params.get(id),
    //     //(id, value, replace = true) => update(id, value, replace)
    // ]
}