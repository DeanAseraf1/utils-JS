import React, { useContext, useState } from 'react';
import './App.css';
import {useStyledObject} from "./realHooks/useStyledObject"
import {Link} from "react-router-dom"
import {Outlet} from "react-router-dom"
import { mainContext } from '.';
import {updateObject, styleValueToNumber, numberToStyleValue, styleNumberPred} from "./realHooks/useStyledObject"

function App() {
  const {setBasicStyles, getBasicClass, basicStyles} = useContext(mainContext)

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

  <Link to="/test">CLICK</Link>
  <Outlet/>
  </>
}

export default App;
