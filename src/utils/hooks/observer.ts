import { useEffect } from "react";

export const observable = () => {
    let observers:((data:any)=>void)[] = [];

    const contains = (func:(data:any)=>void) => {
        return observers.find(observer=> observer === func) ? true : false;
    }

    const subscribe = (func:(data:any)=>void) => {
        if(!contains(func)){
            observers.push(func);
        }
    }

    const unsubscribe = (func:(data:any)=>void) => {
        if(contains(func)){
            observers = observers.filter(observer=> observer !== func);
        }
    }
    
    const emmit = (data:any) => {
        observers.forEach((observer)=>observer(data));
    }

    return {
        subscribe,
        unsubscribe,
        emmit,
        contains
    }
}