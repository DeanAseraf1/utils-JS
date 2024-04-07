import {useState} from "react"

//To Test
export const useLocalStorage = (initialStates = {}) => {
    const [get, set] = useState(false);

    const rerender = () => {
        set(prev=>!prev);
    }

    const update = (id:string, value:any) => {
        if(typeof(value) === "string"){
            localStorage.setItem(id, value);
        }
        else if (typeof(value) === "function"){
            const res = value(localStorage.getItem(id))
            localStorage.setItem(id, res);
        }
        else{
            localStorage.setItem(id, JSON.stringify(value))
        }
    }

    const keys = Object.keys(initialStates);
    const values = Object.values(initialStates);
    for(let i = 0; i<keys.length; i++){
        if(localStorage.getItem(keys[i]) === null)
        update(keys[i], values[i]);
    }

    return {
        addStorage: (id:string) => {
            return[
            localStorage.getItem(id),
            (value:any) =>  {
                update(id, value);
                rerender();
            }
        ]},
        resetStorage: (id:string) => {
            localStorage.removeItem(id);
            rerender();
        }
    
    }
    // return {
    //     get: (id) => {
    //         return localStorage.getItem(id);
    //     },
    //     getNonString: (id) => {
    //         return JSON.parse(localStorage.getItem(id));
    //     },
    //     set: (id, value) => {
    //         localStorage.setItem(id, value);
    //     },
    //     setNonString: (id, nonString) => {
    //         localStorage.setItem(id, JSON.stringify(nonString));
    //     }
    // }
}

// export const useLocalStorage2 = (states) => {
//     const [res, setRes] = useState(states);
//     const keys = Object.keys(res);
//     let obj = {...keys.map((key)=>{
//         return {
//             get [key](){
//                 return res[key];
//             },
//             set [key](value){
//                 setRes(prev=>{return{...prev, [key]: value}});
//             }
//         }
//     })};
//     return obj;
// }