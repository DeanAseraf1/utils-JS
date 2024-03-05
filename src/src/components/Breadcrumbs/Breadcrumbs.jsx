import styles from "../Breadcrumbs/Breadcrumbs.module.css";
import {useEffect, useRef, useState} from "react"

export const Breadcrumbs = ({breadcrumbsArray = []}) => {
    return <>{breadcrumbsArray.map(breadcrumb=>
        <li key={breadcrumb.name}>
            <a href={breadcrumb.url}>{breadcrumb.name}</a>
        </li>)}
    </>
}

export const useBreadcrumbs = () => {
    const breadcrumbsArrayRef = useRef([]);
    const [get, set] = useState(false);

    const rerender = () => {
        set(prev=>!prev);
    }

    const add = (name, url) => {
        if(breadcrumbsArrayRef.current.findIndex(b=>b.name === name) < 0){
            breadcrumbsArrayRef.current = [...breadcrumbsArrayRef.current, {name, url}]
            rerender();
        }
    }

    return {
        addBreadcrumb: add,
        addBreadcrumbs: (breadcrumbs) => {
            if(Array.isArray(breadcrumbs)){
                for(let i = 0; i< breadcrumbs.length; i++){
                    add(breadcrumbs.name, breadcrumbs.url);
                }
            }
            else if(typeof(breadcrumbs) === "object"){
                const keys = Object.keys(breadcrumbs);
                const values = Object.values(breadcrumbs);
                for(let i = 0; i< keys.length; i++){
                    add(keys[i], values[i]);
                }
            }
        },
        breadcrumbsArray: breadcrumbsArrayRef.current
    }
}