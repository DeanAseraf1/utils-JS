import { useEffect, useRef, useState } from "react"

// let signals = [];
// let index = 0;


export const useSignal = (function (){
    let signals = [];
    let index = 0;

    function createSignal(initVal){
        const currentIndex = index;
        const setSignal = newValue => {
            console.log("CREATE")
            let res = newValue;
            if(typeof(newValue) === "function"){
                res = newValue(signals[currentIndex] || initVal);
            }
            signals[currentIndex] = res;
            console.log(signals);
        }
        const getSignal = () => {
            return signals[currentIndex] || initVal;   
        }
        index++;
        return[getSignal, setSignal];
    }

    function createEffect(callback, depandancyArray, restrict = false){
        const currentIndex = index;
        (function () {
            const oldDeps = signals[currentIndex];
            let hasChanged = true;
            if(oldDeps){
                hasChanged = depandancyArray.some((dep, i)=>!Object.is(dep, oldDeps[i]));
                if(restrict && hasChanged) callback();
            }
            if(!restrict && hasChanged) callback();
            signals[currentIndex] = depandancyArray;
        })();
        index++;
    }

    return {
        createSignal,
        createEffect
    }
})

// export const React2 = (function() {
//     let hooks = [];
//     let index = 0;
//     let root;
//     function createElement(tag, props, ...children){
//         if(typeof tag === "function")
//             return tag(props);
        
//         let element = {tag, props: {...props, children} }
//         return element;
//     }

//     function render (reactElement, container){
//         if(['string','number'].includes(typeof(reactElement))){
            
//             container.appendChild(document.createTextNode(String(reactElement)))
//             return;
//         }
//         const actualDomElement = document.createElement(reactElement.tag);
//         if(reactElement.props)
//             Object.keys(reactElement.props).filter(p=>p !== 'children').forEach(p=>actualDomElement[p] = reactElement.props[p]);
        
//         if(reactElement.props && reactElement.props.children)
//             reactElement.props.children.forEach(child=> render(child, actualDomElement));    
//         root = reactElement;
//         container.appendChild(actualDomElement);
//     }

//     function rerender(){
//         index = 0;
//         let activeElement = document.activeElement;
//         let rootElement = document.querySelector("#app");
//         if(root && rootElement.firstChild){
//             rootElement.firstChild.remove();
//             React2.render(root, rootElement);
//         }
//         if(activeElement){
//             let activeElementID = activeElement.id;
//             let newElement = document.getElementById(activeElementID)
//             if(newElement)
//                 newElement.focus();
            
//         }
//     }

//     function useStatful (initVal){
//         const currentIndex = index;
//         const currentState = hooks[currentIndex] || initVal;
//         const setState = newValue =>{
//             let result = newValue;
//             if(typeof newValue === "function")
//                 result = newValue(currentState);
            
//             hooks[currentIndex] = result;
//             setTimeout(()=>rerender());
//         }
//         index++;
//         return [currentState, setState];
//     }

//     function useEffectly(callback, depandancyArray, restrict = false){
//         let currentIndex = index;
//         const oldDependecies = hooks[currentIndex];
//         let hasChanged = true;
//         if(oldDependecies){
//             hasChanged = depandancyArray.some((dep, i) => !Object.is(dep, oldDependecies[i]));
//             if(restrict && hasChanged) callback();
//         }
//         if(!restrict && hasChanged) callback();
//         hooks[currentIndex] = depandancyArray;
//         index++;
//     }

//     return {useStatful, useEffectly, createElement, render};
// })();
