import { useState } from "react";
import { useAlerter } from "../../hooks/useAlerter";

export const useWindowed = (closeOnClickOutside:boolean, closeOnClickEscape:boolean) => {
    const state = useState(false);
    const [isOpen, setIsOpen] = state;
    const ref = useAlerter((e)=>setIsOpen(false), closeOnClickOutside, closeOnClickEscape ? ["Escape"] : [])

    const toggle = () => setIsOpen(prev=>!prev)
    const reset = ()=>setIsOpen(false)

    return{
        isOpen,
        ref,
        toggle,
        reset
    }
}