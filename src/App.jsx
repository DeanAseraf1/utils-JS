import React, { useContext, useState } from 'react';
import './App.css';
import {useStyledObject} from "./realHooks/useStyledObject"
import {Link} from "react-router-dom"
import {Outlet} from "react-router-dom"
import { mainContext } from '.';
import {updateObject, styleValueToNumber, numberToStyleValue, styleNumberPred} from "./realHooks/useStyledObject"
import { joinObjects } from './utils/format';
import {useOutsideAlerter} from './hooks/useOutsideAlerter';

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
  const r = useOutsideAlerter(()=>{console.log("!!")});
  return <>
  <div className={getBasicClass(basicStyles.hv, basicStyles.hl)}>asd</div>
  <div className="y">asd</div>
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
  </>
}

export default App;
