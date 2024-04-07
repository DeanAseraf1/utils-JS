import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

export const useIdPortal = (id:string) => {
    const ref = useRef<any|null>(null);
    useEffect(()=>{
        ref.current = document.getElementById(id);
    },[]);
    return {
      Initiator: (props:any) => {
        //
        return <>{ref.current && createPortal(props.children || "", ref.current)}</>
      },
    }
  }

  export const useRefPortal = () => {
    const ref = useRef<any[]>([]);
    const elm = useRef<any|null>(null);
    useEffect(()=>{
      elm.current = (props:any) => <>{ref.current.map(elem => elem && createPortal(props.children || "", elem))}</>
    },[])
    return {
      Initiator: (props:any) => {
        //
        return <>{elm.current && elm.current(props)}</>
        // return <>{ref.current[index.current] && createPortal(props.children || "", ref.current[index.current])}</>
      },
      ref: (element:any) => {!ref.current.includes(element) && ref.current.push(element);console.log(ref)}
    }
  }