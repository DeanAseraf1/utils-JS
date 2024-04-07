import {useSearchParams} from "react-router-dom"

//To Test
export const useStatefulParams = (initialStates = {}) => {
    const [params, setParams] = useSearchParams(initialStates);

    const update = (id:string, value:any, replace:boolean) => {
        if(typeof(value) === "function"){
            const res = value(params.get(id));
            setParams((prev:any)=>{
                prev.set(id, res);
                return prev;
            }, {replace: replace});
        }
        else if(typeof(value) === "string"){
            setParams((prev:any)=>{
                prev.set(id, value);
                return prev;
            }, {replace: replace});
        }
        else{
            setParams((prev:any)=>{
                prev.set(id, JSON.stringify(value));
                return prev;
            }, {replace: replace});
        }
    }
    return {
        addParam: (id:string, replace = true) => {
            // if(initialValue !== null && initialValue !== undefined){
            //     update(id, initialValue, replace);
            // }
            return [
                params.get(id),
                (value:any) => update(id, value, replace)
            ]
        },

        resetParam: (id:string, replace = true) => {
            setParams((prev:any)=>{
                prev.set(id, null);
                return prev;
            }, {replace: replace});
        }
    }
}