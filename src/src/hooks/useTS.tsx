import { useState } from "react"

export const useStatableArray = (initialState:any[]=[], identifier:string|null=null) => {
    const [state, setState] = useState<any[]>(initialState);
    return [
        state,
        {
            /**
            * Adding a new item to the array.
            * @param {any[]|any} item The item to add to the array, use an array to add multiple items.
            * @param {null|number} index The index to add the item, defaults to null.
            */
            add: (item:any[]|any, index: null | number = null) => {
                if(Array.isArray(item)){
                    if(!index || typeof(index) !== "number"){
                        setState(prev=>[...prev, ...item])
                    }
                    else{
                        setState(prev=>prev.splice(index, 0, ...item));
                    }
                }else{
                    if(!index || typeof(index) !== "number"){
                        setState(prev=>[...prev, item])
                    }
                    else{
                        setState(prev=>prev.splice(index, 0, item));
                    }
        
                }
            },

            /**
            * Updating a certain item in the array.
            * @param {string|number} id The existing identifier|index to update the item.
            * @param {any|(any)=>any} item The new item, or a function that returns such item.
            */
            update: (id: string | number, item: any | ((v:any) => any)) => {
                if(!identifier || typeof(identifier) !== "string"){
                    if(typeof(item) !== "function"){
                        setState(prev=>prev.map((p, i) => i === id ? item : p));
                    }
                    else{
                        setState(prev=>prev.map((p, i) => i === id ? item(p) : p));
                    }
                }
                else{
                    if(typeof(item) !== "function"){
                        setState(prev=>prev.map((p) => p[identifier] ? item : p));
                    }
                    else{
                        setState(prev=>prev.map((p, i) => p[identifier] === id ? item(p) : p));
                    }
                }
            },

            /**
            * Removing an existing item from the array.
            * @param {string|number|string[]|number[]} id The existing identifier|index to remove the item, use an array to remove multiple items.
            */
            remove: (id: string | number | string[] | number[]) => {
                if(Array.isArray(id)){
                    const arr = [...id]
                    if(!identifier || typeof(identifier) !== "string"){
                        setState(prev=>prev.filter((p, i)=>!arr.includes(i)))
                    }
                    else{
                        setState(prev=>prev.filter((p)=>!arr.includes(p[identifier])))
                    }
                }else{
                    if(!identifier || typeof(identifier) !== "string"){
                        setState(prev=>prev.filter((p, i)=>i!== id))
                    }
                    else{
                        setState(prev=>prev.filter((p)=>p[identifier] !== id))
                    }
                }
            },

            /**
            * Duplicating an existing item from the array.
            * @param {string|number|string[]|number[]} id The existing identifier|index to duplicate the item, use an array to duplicate multiple items.
            */
            duplicate: (id: string | number | string[] | number[]) => {
                if(Array.isArray(id)){
                    const arr = [...id]
                    if(!identifier || typeof(identifier) !== "string"){
                        setState((prev:any[])=>[...prev, ...prev.filter((p:any, i:number)=>arr.includes(i))]);
                    }
                    else{
                        setState(prev=>[...prev, ...prev.filter((p:any)=>arr.includes(p[identifier]))]);
                    }
                }else{
                    if(!identifier || typeof(identifier) !== "string"){
                        setState(prev=>[...prev, prev[id]]);
                    }
                    else{
                        setState(prev=>[...prev, prev.find(p=>p[identifier] === id)]);
                    }
                }
            },

            /**
            * Updating the index of a certain item.
            * @param {number} oldIndex The index of the item to move.
            * @param {number} newIndex The index of the item to insert.
            */
            updateIndex: (oldIndex: number, newIndex: number) => {
                const item = state[oldIndex];
                let pre = [...state];
                pre.splice(oldIndex, 1);
                pre.splice(newIndex, 0, item);
                setState(pre);
            },

            /**
            * Sorting the array by the predicate return value.
            * @param {(any)=>any} predicate The predicate function for each item value.
            * @param {boolean} isDecending The sorting direction.
            */
            sortBy: (predicate: (val: any) => any = (val:any)=>val, isDecending: boolean = false) => {
                setState((prev:any[])=>prev.sort((a,b)=>{
                        const aValue = predicate(a);
                        const bValue = predicate(b);
                        if(aValue > bValue) return isDecending ? 1 : -1;
                        else if(bValue > aValue) return isDecending ? -1 : 1;
                        else return 0;
                    })
                )
            }
        }
    ]
}