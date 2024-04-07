import React, { useRef, useEffect } from "react";
import {signal, effect} from "@preact/signals-react"

export function useAlerter(callback:(event:MouseEvent|KeyboardEvent)=>void = (event)=>{}, outsideClick = true, keypresses = ["Escape"] ,value = null) {
  const wrapRef = useRef<any>(value)

  useEffect(() => {
    function handleClickOutside(event:MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(event.target) && outsideClick) {
        callback(event);
      }
    }

    function handleKeydown(event:KeyboardEvent){
      if (wrapRef.current && wrapRef.current.contains(event.target) && keypresses.includes(event.key)) {
        callback(event);
      }
    }

    document.addEventListener("keydown", handleKeydown)
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("keydown", handleKeydown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
    
  }, [wrapRef]);
  return (instance:any=value)=>wrapRef.current = instance;
}


export function useSignalAlerter(callback:(event:MouseEvent|KeyboardEvent)=>void = (event)=>{}, outsideClick = true, keypresses = ["Escape"] ,value = null) {
  // const wrapRef = useRef<any>(value)
  const wrapRefSignal = signal<any>(value)

  effect(() => {
    function handleClickOutside(event:MouseEvent) {
      if (wrapRefSignal.value && !wrapRefSignal.value.contains(event.target) && outsideClick) {
        callback(event);
      }
    }

    function handleKeydown(event:KeyboardEvent){
      if (wrapRefSignal.value && wrapRefSignal.value.contains(event.target) && keypresses.includes(event.key)) {
        callback(event);
      }
    }

    document.addEventListener("keydown", handleKeydown)
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("keydown", handleKeydown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
    
  });
  return (instance:any=value)=>wrapRefSignal.value = instance;
}