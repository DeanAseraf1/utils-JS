import React, { useRef, useEffect } from "react";


export function useOutsideAlerter(callback = event=>{},value = null) {
  const wrapRef = useRef(value)
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapRef.current && !wrapRef.current.contains(event.target)) {
        // alert("You clicked outside of me!");
        callback(event);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapRef]);
  return wrapRef;
}