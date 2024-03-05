import React, { useEffect, useRef } from "react";
import styles from "./Grid.module.css";


export const Grid = ({ children, className, itemMinWidth="150px", itemMaxWidth="0.5fr", gridPadding="0px", gridJustify="center", uniqueKey=Date.now().toString() }) => {
    const gridRef = useRef(null);
    useEffect(()=>{
        if(!gridRef.current) return;

        gridRef.current.style.setProperty("--grid-padding", gridPadding)
        gridRef.current.style.setProperty("--item-max-width", itemMaxWidth)
        gridRef.current.style.setProperty("--item-min-width", itemMinWidth)
        gridRef.current.style.setProperty("--justify-content", gridJustify)
    },[]);
    return <section className={`${styles.grid_wrapper}`}>
        <ul ref={gridRef} className={`${styles.grid} ${className ? className : ""}`}>
            {React.Children.toArray(children).map((item, index) => {
                return <li key={uniqueKey + "-" + index} className={styles.item}>
                    {item}
                </li>
            })}
        </ul>
    </section>
}