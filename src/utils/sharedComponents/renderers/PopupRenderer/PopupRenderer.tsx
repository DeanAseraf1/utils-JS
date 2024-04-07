import styles from "./PopupRenderer.module.css";
import { useAlerter } from "../../../hooks/useAlerter";
import { useState } from "react";
import { TWindowedComponentProps } from "../ShardTypes";
import { useWindowed } from "../SharedFunctions";

export const PopupRenderer = ({
    children,
    className = "",
    includeCloseButton = true,
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
            className: `${styles.popup} ${styles.popupStyling} ${className}`, 
            children: children
        }, 
        closeButtonProps = {
            onClick: reset,
            className: closeButtonClassName,
            children: closeButtonChildren
        }
    ) => includeCloseButton === true ? <span {...props}><button {...closeButtonProps}/>{props.children}</span> : <span {...props}/>,

    wrapperRenderer = (
        props = {
            children:<></>, 
            ref:ref
        }
    ) => <span {...props}/>

} : TWindowedComponentProps) => {
    const {isOpen, ref, toggle, reset} = useWindowed(closeOnClickOutside, closeOnClickEscape);
    // const [isOpen, setIsOpen] = useState(false);
    // const ref = useAlerter((e)=>setIsOpen(false), closeOnClickOutside, closeOnClickEscape ? ["Escape"] : []);

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
                    className: `${styles.popup} ${styles.popupStyling} ${className}`,
                    children: children
                }, 
                includeCloseButton === true ? {
                    onClick: reset, 
                    children: closeButtonChildren,
                    className: closeButtonClassName
                } : {
                    onClick: ()=>{}, 
                    className: ""
                })}
            </>,
            ref: ref
        })
    } </>
}