import { useAlerter } from "../../../hooks/useAlerter";
import { TDirection, TWindowedComponentProps } from "../ShardTypes";
import { useWindowed } from "../SharedFunctions";
import styles from "./DropdownRenderer.module.css";
import { useState } from "react";

const directionToClassname = (direction:TDirection)=>{
    let res = "";
    if(direction.x === 0 && direction.y === 0)
        return `${styles.middleCenter}`

    if(direction.x === -1)
        res += styles.horizontalLeft;
    else if(direction.x === 0)
        res += styles.horizontalCenter;
    else if(direction.x === 1)
        res += styles.horizontalRight;

    if(res.length > 0)
        res +=  " ";

    if(direction.y === -1)
        res += styles.verticalBottom;
    else if(direction.y === 0)
        res += styles.verticalCenter;
    else if(direction.y === 1)
        res += styles.verticalTop;

    return res;
}

const defaultDirection:TDirection = {x:0, y:-1};

export const DropdownRenderer = ({
    children,
    className = "",
    includeCloseButton = false,
    openningDirection = {x:0, y:-1},
    closeOnClickOutside = true,
    closeOnClickEscape = true,
    
    buttonClassName = "",
    closeButtonClassName = "",
    buttonChildren = "Button Test",
    closeButtonChildren = "X",


    buttonRenderer = (
        props = {
            onClick: toggle,
            className: buttonClassName,
            children: buttonChildren,
        }
    ) => <button {...props}/>,

    renderer = (
        props = {
            className: `${styles.dropdown} ${styles.dropdownStyling} ${directionToClassname(openningDirection ?? defaultDirection)} ${className}`, 
            children: children
        },
        closeButtonProps = {
            onClick: reset,
            className: closeButtonClassName,
            children: closeButtonChildren
        }
    ) => includeCloseButton ? <span {...props}><button {...closeButtonProps}/>{props.children}</span> : <span {...props}/>,

    wrapperRenderer = (
        props = {
            children:<></>,
            className: styles.wrapper, 
            ref:ref
        }
    ) => <span {...props}/>

} : TWindowedComponentProps) => {
    const {isOpen, ref, toggle, reset} = useWindowed(closeOnClickOutside, closeOnClickEscape);
    // const [isOpen, setIsOpen] = useState(false);
    // const ref = useAlerter((e)=>setIsOpen(false), closeOnClickOutside, closeOnClickEscape ? ["Escape"] : [])

    // const toggle = () => setIsOpen(prev=>!prev)
    // const reset = ()=>setIsOpen(false)
    
    return <> {wrapperRenderer && 
        wrapperRenderer({
            children: <>
                {buttonRenderer && 
                buttonRenderer({
                    onClick: toggle,
                    className: buttonClassName,
                    children: buttonChildren
                }, isOpen)}

                {isOpen === true && 
                renderer && 
                renderer({
                    className: `${styles.dropdown} ${styles.dropdownStyling} ${directionToClassname(openningDirection ?? defaultDirection)} ${className}`, 
                    children: children
                }, 
                includeCloseButton ? {
                    onClick: reset, 
                    children: closeButtonChildren,
                    className: closeButtonClassName
                } : {
                    onClick: ()=>{}, 
                    className: ""
                })}
            </>,
            className: styles.wrapper, 
            ref: ref
        })
    } </>
}