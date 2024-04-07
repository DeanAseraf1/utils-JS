import { useState } from "react"

//To Test
export const useStatefulArray = (initialState=[], identifier:string|null=null) => {
    const [state, setState] = useState<any[]>(initialState);
    return [
        state,
        {
            /**
            * Adding a new item to the array.
            * @param {any[]|any} item The item to add to the array, use an array to add multiple items.
            * @param {null|number} index The index to add the item, defaults to null.
            */
            add: (item:any[]|any, index = null) => {
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
            update: (id:string|number, item:any | ((v:any)=>any)) => {
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
            * Updating a certain item fields in the array.
            * @param {string|number} id The existing identifier|index to update the item.
            * @param {any|(any)=>any} fieldsItem An item containing the updated fields, or a function that returns such item.
            */
            updateFields: (id:string|number, fieldsItem:any|((v:any)=>any)) => {
                if(!identifier || typeof(identifier) !== "string"){
                    if(typeof(fieldsItem) !== "function"){
                        setState(prev=>prev.map((p, i) => i === id ? {...p, ...fieldsItem} : p));
                    }
                    else{
                        setState(prev=>prev.map((p, i) => i === id ? {...p, ...fieldsItem(p)} : p));
                    }
                }
                else{
                    if(typeof(fieldsItem) !== "function"){
                        setState(prev=>prev.map((p) => p[identifier] ? {...p, ...fieldsItem} : p));
                    }
                    else{
                        setState(prev=>prev.map((p, i) => p[identifier] === id ? {...p, ...fieldsItem(p)} : p));
                    }
                }
            },

            /**
            * Updating the index of a certain item.
            * @param {number} oldIndex The index of the item to move.
            * @param {number} newIndex The index of the item to insert.
            */
            updateIndex: (oldIndex:number, newIndex:number) => {
                const item = state[oldIndex];
                let pre = [...state];
                pre.splice(oldIndex, 1);
                pre.splice(newIndex, 0, item);
                setState(()=>pre);
            },

            /**
            * Removing an existing item from the array.
            * @param {string|number|string[]|number[]} id The existing identifier|index to remove the item, use an array to remove multiple items.
            */
            remove: (id:string|number|string[]|number[]) => {
                if(Array.isArray(id)){
                    if(!identifier || typeof(identifier) !== "string"){
                        setState(prev=>prev.filter((p, i)=>id.findIndex(s=>s === i) < 0))
                    }
                    else{
                        setState(prev=>prev.filter((p)=>id.findIndex(s=>s === p[identifier]) < 0))
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
            * @param {string|number|string[]|number[]} id The existing identifier|index to duplicate the item from, use an array to duplicate multiple items.
            * @param {string|string[]|null} newId The new identifier to duplicate to the item, use an array when duplicating multiple items, one for each.
            */
            duplicate: (id:string|number|string[]|number[], newId:string|string[]|null = null) => {
                if(Array.isArray(id)){
                    if(!identifier || typeof(identifier) !== "string"){
                        setState(prev=>[...prev, ...prev.filter((p, i)=>id.findIndex(s=>s===i) >= 0)]);
                    }
                    else if(Array.isArray(newId)){
                        setState(prev=>[...prev, ...prev.filter((p)=>id.findIndex(s=>s===p[identifier]) >= 0).map((p, i)=>{return{...p, [identifier]: newId[i]}})]);
                    }
                }else{
                    if((!identifier || typeof(identifier) !== "string") && typeof(id) === "number"){
                        setState(prev=>[...prev, prev[id]]);
                    }
                    else if(typeof(identifier) === "string"){
                        setState(prev=>[...prev, {...prev.find(p=>p[identifier] === id), [identifier]: newId}]);
                    }
                }
            },

            /**
            * Sorting the array by the predicate return value.
            * @param {any=>any} predicate The index of the item to move.
            * @param {boolean} isDecending The index of the item to insert.
            */
            sortBy: (predicate = (val:any)=>val, isDecending = false) => {
                setState(prev=>prev.sort((a,b)=>{
                        const aValue = predicate(a);
                        const bValue = predicate(b);
                        if(aValue > bValue) return isDecending ? 1 : -1;
                        else if(bValue > aValue) return isDecending ? -1 : 1;
                        else return 0;
                    })
                )
            },

            filterBy: (predicate = (val:any) => val) =>{
                setState(prev=>prev.filter(p=>predicate(p)))
            },

            setState: setState
        }
    ]
}