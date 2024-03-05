import React, { useRef, useEffect } from "react";


export function useAlerter(callback = event=>{}, outsideClick = true, keypresses = ["Escape"] ,value = null) {
  const wrapRef = useRef(value)

  useEffect(() => {

    function handleClickOutside(event) {
      if (wrapRef.current && !wrapRef.current.contains(event.target) && outsideClick) {
        callback(event);
      }
    }

    function handleKeydown(event){
      if (wrapRef.current && wrapRef.current.contains(event.target) && keypresses.findIndex(k=>k===event.key) >= 0) {
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
  return wrapRef;
}