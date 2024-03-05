import React, { useContext, useState } from 'react';
import './App.css';
import {useStyledObject} from "./realHooks/useStyledObject"
import {Link} from "react-router-dom"
import {Outlet} from "react-router-dom"
import { mainContext } from '.';
import {updateObject, styleValueToNumber, numberToStyleValue, styleNumberPred} from "./realHooks/useStyledObject"
import { joinObjects } from './utils/format';
import {useAlerter} from './realHooks/useAlerter';
import { useSignal } from './realHooks/useSignal';

const obj = {
  arr: [
    1,2,3
  ],
  obj: {
    id: "12",
    name: "dean"
  }
}
const obj2 = {
  arr:[
    4,5,6
  ],
  obj:{
    name: "hadar",
    phone: "0500002323"
  }
};

console.log(joinObjects(obj,obj2))
function App() {
  const {setBasicStyles, getBasicClass, basicStyles} = useContext(mainContext)
  const r = useAlerter(()=>{console.log("!!")});
  const {createSignal, createEffect} = useSignal();
  // const {createSignal2} = useSignal();
  const [sig, setSig] = createSignal("ME");
  createEffect(()=>{console.log("HERE!!!!!")},[sig()], true)
  // const [sig2, setSig2] = createSignal("ME2");
  console.log(sig());
  // const [signal, setSignal] = useSignal("Hello");
  // const [sig, setSig] = useSignal("HELLO");
  // console.log({signal});
  return <>
  <div className={getBasicClass(basicStyles.hv, basicStyles.hl)}>asd</div>
  {/* <button onClick={()=>setBasicStyles(prev=>{
    return {
      ...prev, 
      hl: {
        ...prev["hl"], 
        ["fontSize"]: +(prev["hl"]["fontSize"].replace("px", "")) + 2 + "px"
      }
    }})}>CLICK</button> */}
  {/* <button onClick={()=>setBasicStyles(prev=>updateObject(prev, (val)=>((+(val.replace("px", "")) + 2) + "px"), "hl", "fontSize"))}>CLICK</button> */}

  <button onClick={()=>{
    setBasicStyles(prev=>updateObject(prev, styleNumberPred((val)=>val+2), "hl", "fontSize"))}}>
    CLICK
  </button>
  <button ref={r}>CLICK HERE!!!</button>

  <Link to="/test">CLICK</Link>
  <Outlet/>
  <button onClick={()=>setSig(prev=>prev+"!")}>{sig()}</button>
  {/* <button onClick={()=>setSig2(prev=>prev+"!")}>{sig2}</button> */}
  </>
}

export default App;
