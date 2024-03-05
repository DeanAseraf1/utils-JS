import {useSearchParams} from "react-router-dom"

export const useStatefulParams = (initialStates = {}) => {
    const [params, setParams] = useSearchParams(initialStates);

    const update = (id, value, replace) => {
        if(typeof(value) === "function"){
            const res = value(params.get(id));
            setParams(prev=>{
                prev.set(id, res);
                return prev;
            }, {replace: replace});
        }
        else if(typeof(value) === "string"){
            setParams(prev=>{
                prev.set(id, value);
                return prev;
            }, {replace: replace});
        }
        else{
            setParams(prev=>{
                prev.set(id, JSON.stringify(value));
                return prev;
            }, {replace: replace});
        }
    }
    return {
        addParam: (id, replace = true) => {
            // if(initialValue !== null && initialValue !== undefined){
            //     update(id, initialValue, replace);
            // }
            return [
                params.get(id),
                (value) => update(id, value, replace)
            ]
        },

        resetParam: (id, replace = true) => {
            setParams(prev=>{
                prev.set(id, null);
                return prev;
            }, {replace: replace});
        }
    }
}