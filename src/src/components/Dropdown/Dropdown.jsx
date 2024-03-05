import { useState } from "react";
import { useAlerter } from "../../hooks/useAlerter";
import styles from "../Dropdown/Dropdown";

export const Dropdown = (props, renderer = (open)=><button onClick={()=>open()}>CLICK ME!</button>) => {
    const [isOpen, setIsOpen] = useState(false);
    const r = useAlerter(null, ()=>{console.log("!!")});

    return <div>
        {renderer ?? renderer(()=>setIsOpen(true))}
        <div ref={r}>
            {props.children}
        </div>
    </div>
}
