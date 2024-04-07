import {useRef, useEffect} from "react";

//To Test
export const usePostMessage = (listeners:Object = {}) => {
    const isAddedRef = useRef(false);
    useEffect(()=>{
        if(!isAddedRef.current){
            const keys = Object.keys(listeners);
            const values = Object.values(listeners);
            for(let i = 0; i<keys.length; i++){
                window.addEventListener(
                    "message",
                    (event:any) => {
                        if(typeof(event.data) === "string" && event.data.includes("{")){
                            try{
                                const res = JSON.parse(event.data || {});
                                if (res.id === keys[i]){
                                    values[i](res.msg);
                                }
                            }
                            catch(err){
                                console.log(err);
                            }
                        }
                    },
                    false,
                );
            }
            isAddedRef.current = true;
        }
    },[isAddedRef.current])

    useEffect(()=>{
        // const keys = Object.keys(prevObj.current);
        // const values = Object.values(prevObj.current);
        // for(let i = 0; i<keys.length; i++){
        //     window.removeEventListener()
        // }
    }, [listeners])

    return (id:string, msg:string) => window.postMessage(JSON.stringify({id, msg}) , "*")
    // return [
    //     (id, msg) => window.postMessage(JSON.stringify({id, msg}) , "*"),
    //     (id, callback = (msg)=>{}) => {
    //         // if(obj[id]){
    //             // return;
    //         // }
    //         // setObj(prev=>{return{...prev, [id]: callback}})
    //         window.addEventListener(
    //             "message",
    //             (event) => {
    //                 if(typeof(event.data) === "string" && event.data.includes("{")){
    //                     try{
    //                         const res = JSON.parse(event.data || {});
    //                         if (res.id === id){
    //                             callback(res.msg);
    //                         }
    //                     }
    //                     catch(err){
    //                         console.log(err);
    //                     }
    //                 }
    //             },
    //             false,
    //         );
    //     }
    //     //(id) => params.get(id),
    //     //(id, value, replace = true) => update(id, value, replace)
    // ]
}