import { useState } from "react";
import { useOutsideAlerter } from "../../hooks/useOutsideAlerter";
import styles from "../Dropdown/Dropdown";

export const Dropdown = (props, renderer = (open)=><button onClick={()=>open()}>CLICK ME!</button>) => {
    const [isOpen, setIsOpen] = useState(false);
    const r = useOutsideAlerter(null, ()=>{console.log("!!")});

    return <div>
        {renderer ?? renderer(()=>setIsOpen(true))}
        <div ref={r}>
            {props.children}
        </div>
    </div>
}
