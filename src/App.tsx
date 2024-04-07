// import React, { ReactElement, useEffect, useRef, useState } from 'react';
// import logo from './logo.svg';
// import { signal } from '@preact/signals-react';
// import { signal } from '@preact/signals-react';
// import { Json } from './utils/sharedComponents/Json/Json';
// import { createPortal } from 'react-dom';
// import { If } from './utils/If';
// import { Board, BoardItem } from './utils/Game/Board/Board';

import { DropdownRenderer } from './utils/sharedComponents/renderers/DropdownRenderer/DropdownRenderer';
import {PopupRenderer} from "./utils/sharedComponents/renderers/PopupRenderer/PopupRenderer";
import { useEffect, useRef } from 'react';
import './App.css';
import { useValidate, defaultValidations } from './utils/hooks/useValidate';
import { resBuilder } from './utils/db';
import { useDbState } from './utils/hooks/useApi';


const plusStringNumbers = (valueA: string, valueB: string) => {
  let currentResult = "";
  let currentTwoDigitsResult = 0;
  let currentRemians = 0;
  const max = Math.max(valueA.length, valueB.length)
  
  for(let i = 0; i < max; i++){
    const aValue = +(valueA[valueA.length - i - 1] ?? 0);
    const bValue = +(valueB[valueB.length - i - 1] ?? 0);
    currentTwoDigitsResult = aValue + bValue + currentRemians;
    if(currentTwoDigitsResult >= 10){
      currentRemians = 1;
      currentTwoDigitsResult = currentTwoDigitsResult - 10;
    }
    else{
      currentRemians = 0;
    }
    
    currentResult += currentTwoDigitsResult;
  }
  
  return (currentResult + (currentRemians > 0 ? currentRemians + "" : "")).split("").reverse().join("");
}
// 1600
//  599
// 1001 
const minusStringNumbers = (valueA:string, valueB:string) => {
  let currentResult = "";
  let currentTwoDigitsResult = 0;
  let currentBorrow = 0;

  const isMinus = valueA.length < valueB.length || (valueA.length === valueB.length && valueA[0] < valueB[0])
  
  const max = Math.max(valueA.length, valueB.length)

  for(let i = 0; i < max; i++){
    let aValue = +(valueA[valueA.length - i - 1] ?? 0);
    let bValue = +(valueB[valueB.length - i - 1] ?? 0);

    if(isMinus){
      bValue -= currentBorrow

      if(bValue < aValue){
        currentBorrow = 1;
      }
      else{
        currentBorrow = 0;
      }

      currentTwoDigitsResult = (bValue + currentBorrow * 10) - (aValue);
    }
    else{
      aValue -= currentBorrow;

      if(aValue < bValue){
        currentBorrow = 1;
      }
      else{
        currentBorrow = 0;
      }

      currentTwoDigitsResult = (aValue + currentBorrow * 10) - (bValue);
    }

    currentResult += currentTwoDigitsResult;
  }

  //Removing leading zeros
  const result = (currentResult).split("").reverse().join("")
  let newResult = result;
  for(let i = 0; i<result.length; i++){
    if(result[i] === "0") continue;
    else {
      newResult = result.substring(i);
      break;
    }
  }

  return isMinus ? "-" + newResult : newResult;
}

console.log(minusStringNumbers("9999999999999999999999999999", "9999"));
console.log(9999999999999999999999999999-9999);

// const createSignal:(initValue:any)=>[(getJSX?:boolean)=>any,(v:any)=>void] = (initValue:any) => {
//   const sig = signal(initValue);
//   const getter = (getJSX=true) => {
//     if(getJSX)
//       return sig;
//     else return sig.value;
//   }
//   const setter = (v:any) => {
//     sig.value = typeof(v) === "function" ? v(sig.value) : v;
//   }
//   return [getter, setter];
// }

// const useIdPortal = (id:string) => {
  
//   const ref = useRef<any|null>(null);
//   useEffect(()=>{
//       ref.current = document.getElementById(id);
//   },[]);
//   return {
//     Initiator: (props:any) => {
//       //
//       return <>{ref.current && createPortal(props.children || "", ref.current)}</>
//     },
//   }
// }
// const useRefPortal = () => {
//   const ref = useRef<any[]>([]);
//   const elm = useRef<any|null>(null);
//   useEffect(()=>{
//     elm.current = (props:any) => <>{ref.current.map(elem => elem && createPortal(props.children || "", elem))}</>
//   },[])
//   return {
//     Initiator: (props:any) => {
//       //
//       return <>{elm.current && elm.current(props)}</>
//       // return <>{ref.current[index.current] && createPortal(props.children || "", ref.current[index.current])}</>
//     },
//     ref: (element:any) => {!ref.current.includes(element) && ref.current.push(element);console.log(ref)}
//   }
// }

// const [sig, setSig] = createSignal(20)

// const event = observable();

// const eventHandler = (data:any) => {
//   console.log(data);
// }
// const Comp = () => {
//   useEffect(()=>{
//     event.subscribe(eventHandler);
//   },[]);
//   return <>
//   COMP!
//   </>
// }


function App() {
  const [s, setS, updateS] = useDbState("", "/get", "/put", {id: "none"});
  console.log(s);
  const ref = useRef("")
  // console.log(resBuilder.success({data: "success!"}));
  // console.log(resBuilder.success({message: "Horray!"}));
  // console.log(resBuilder.error({err: "error!"}));
  // console.log(resBuilder.error({message: "Error message!"}));
  // const {Initiator: IdInitiator} = useIdPortal("0101")
  // const {Initiator: RefInitiator, ref} = useRefPortal()
  // console.log("!!!")
  // const [s, setS] = useState(false)
  // const [arr, setArr] = useState<any[]>([{
  //   id: "1233",
  //   name: "maor",
  //   arr: [
  //       "Hello",
  //       "Goodbye"
  //   ],
  //   obj: {
  //       arr: [1,2,3,1],
  //       la: true,
  //       li: 22,
  //       lo: {
  //         ["@metaverse"]: "Hello from the other side"
  //       }
  //   }},
  //   {
  //     id: "1233",
  //     name: "maor",
  //     arr: [
  //         "Hello",
  //         "Goodbye"
  //     ],
  //     obj: {
  //         arr: [1,2,3,1],
  //         la: true,
  //         li: 22,
  //         lo: {
  //           ["@metaverse"]: "Hello from the other side"
  //         }
  //     }}])
  const {register, messageRenderer, isInvalid, validate, reset, getMessage} = useValidate()
  return (
    // <>
    // {/* <Board width={200} height={200}>
    //   <BoardItem width={10} height={10} xPosition={10} yPosition={10}/>
    // </Board> */}
    //   {/* <If condition={false}>
    //     <>
    //       Hello!
    //     </>
    //   </If>


    //   <IdInitiator><p>Hello from ID!!</p></IdInitiator>
    //   <RefInitiator><p>Hello from ref!!</p></RefInitiator>
    //   <button onClick={()=>setSig((prev:any)=>prev + 1)}>{sig()}</button>
    //   <button onClick={()=>setS(prev=>!prev)}>RERENDER</button>
    //   <div id="0101">1</div>
    //   <div ref={ref}>2</div>
    //   <div ref={ref}>3</div>
    //   <div ref={ref}>4</div>
    //     <Json value={arr} keyName='JSON' setValue={setArr} options={{}}/> */}


    //     {/* <div className='sss'>
    //       <PopupRenderer 
    //       buttonRenderer={props => <button {...props}>pop</button>} 
    //       // popupRenderer={(props, closeButtonProps) => <span className={`${props.className} testPopupClass`}><button {...closeButtonProps}/>{props.children}<div>lksjdlkjads</div></span>}
    //       // wrapperRenderer={props => <span {...props}/>}
    //       // includeCloseButton={true}
    //       >
    //         <div className='testPopupClass'>saddas</div>
    //       </PopupRenderer>
    //       <DropdownRenderer 
    //       buttonRenderer={props => <button {...props}>Hello</button>} 
    //       // dropdownRenderer={(props, closeButtonProps) => <span className={`${props.className} testDropdownClass`}><button {...closeButtonProps}/>{props.children}</span>}
    //       // wrapperRenderer={props => <span {...props}/>}
    //       openningDirection={{x:0, y:-1}}
    //       includeCloseButton={false}
    //       >
    //         <div className='testDropdownClass'>saddas</div>
    //       </DropdownRenderer>

    //     </div> */}
    // </>

    <>
      <div className='sss'>
        <PopupRenderer
        includeCloseButton={true}
        className='popup'
        buttonClassName="popupButton"
        closeButtonClassName='popupButton'
        buttonChildren="OPEN POPUP"
        closeButtonChildren="CLOSE">
          <div>saddas</div>
          <div>saddas</div>
        </PopupRenderer>

        <DropdownRenderer
        includeCloseButton={true}
        className='dropdown'
        buttonClassName="dropdownButton"
        closeButtonClassName='dropdownButton'
        buttonChildren="OPEN DROPDOWN"
        closeButtonChildren="CLOSE">
          <div>saddas</div>
          <div>saddas</div>
        </DropdownRenderer>

        <DropdownRenderer
        className='dropdown'
        buttonClassName="dropdownButton"
        closeButtonClassName='dropdownButton'
        buttonRenderer={(props, isOpen) => <button {...props}>{isOpen ? "^" : "v"}</button>}>
          <div>saddas</div>
          <div>saddas</div>
        </DropdownRenderer>
      </div>

      <h1>useValidate</h1>
      <>
        <h3>Strings</h3>
        <p>
          A basic usage of the hook:
        </p>

        <input type='text' {...register("txt", 
        [defaultValidations.rangeLength(10, 20)])} />

        <br/>
        {messageRenderer("txt", (msg) => msg)}
      </>

      <>
        <h3>Numbers</h3>
        <p>
          There's also 3 ways to render error messages on an element,
          <br/>
          by using the "(useValidate()).messageFunction", using the "(useValidate()).isInvalid" functions that returns from the hook, or using the "(useValidate()).getMessage()" function.
          <br/>
          <br/>
          By using the "classNameFunction()" you will be able to ajust the styling for the element when the validation is changed.
          <br/>
          <br/>
          You can also assign you own custom validation.
          <br/>
          Each validation is a function that accpet the input value and returns the error message(or undefined).
          <br/>
          <br/>
          This is an example for how to use the "useValidate" hook with number typed value:
        </p>

        <input type='number' {...register("num", [
          defaultValidations.rangeValue(10, 20),
        ], {
          classNameFunction: (isInvalid) => isInvalid ? "InvalidClassname" : "ValidClassname",
          initialValue: "44",
          emptyValue: "0000",
        })}
        />

        <br/>
        {messageRenderer("num", (msg) => msg)}

        <br/>
        {getMessage("num")}

        <br/>
        {isInvalid("num") && <>Hello!</>}
      </>

      <>
        <h3>Checkboxes</h3>
        <p>
          You can set the message that appears by setting the "validations" argument of the register function, 
          and sending the message as an argument to the function (defaultValidations is a default object containning some simple validations functions).
          <br/>
          <br/>
          There's also 3 booleans that allows you to control when a value will be validated,
          <br/>
          validateOnMount, validateOnBlur and validateOnChange.
          <br/>
          <br/>
          You can also use the "option.styleFunction()" from the register function to change the styling of the element.
          <br/>
          <br/>
          This is an example for how to use the "useValidate" hook with boolean typed value:
        </p>

        <input type='checkbox' {...register("bool", [
          defaultValidations.required("This Checkbox has to be selected.")
        ], {
          // type: "checkbox",
          styleFunction: (isInvalid) => isInvalid ? {borderColor: "red"} : {},
          validateOnMount: true,
          validateOnBlur: true,
          focusOnBlur: false,
          validateOnChange: false,
        })}
        />

        <br/>
        {messageRenderer("bool", (msg) => msg)}
      </>

      <>
        <h3>Dates</h3>
        <p>
          You can set an onBlur or onChange functions of your own to run, by setting them in the "options" object argument of the register function.
          <br/>
          <br/>
          There's also a boolean called "logging" that is allowing the input to log to the console.
        </p>

        <input type='date' {...register("date", [
          defaultValidations.date("This field have to be filled."),
        ], {
          onBlur: (e) => console.log("Now I'm here!"),
          onChange: (e) => console.log("I'm here!"),
          validateOnMount: false,
          validateOnBlur: true,
          validateOnChange: false,
          logging: true,
        })}
        />

        <br/>
        {messageRenderer("date", (msg) => msg)}
      </>

      <>
        <h3>The validate() and reset() functions</h3>
        <p>
          You can activate the validations of all (or specific) registered elements by using the "validate()" function from the "useValidate()" hook.
          <br/>
          <br/>
          To activate the validation of a specific elemnt, use the ids argument of the "validate()" function and specify the ids to validate.
          <br/>
          <br/>
          You also able to reset all (or specific) messages by running the "reset()" function.
        </p>
        <br/>
        <button onClick={()=>console.log(validate())}>Click to Validate!</button>
        <button onClick={()=>console.log(reset())}>Click to Reset!</button>
      </>

      <>
        <h3>All the "useValidate()" hook properties</h3>
        <p>
          register: A function to add an element to the validator, returns the element props as an object.<br/>
          validate: A function you can use to validate all (or specific) elements.<br/>

          reset: A function to reset the error messages of all(or specific) elements.<br/>
          setError: A function to set the error message of a registered element.<br/>
          setValue: A function to set a value to a registered element.<br/>
          messageRenderer: A function to render an error messages of a registered element.<br/>
          getMessage: A function to retrive an error message of a registered element.<br/>

          getRawValue: A function to retrive a raw value from a registered element.<br/>
          isInvalid: A function to retrive information about the validity state of a registered element.<br/>
          rerender: A function to rerender all the registered elements.<br/>
        </p>
      </>

      <>
        <h3>All the "useValidate()" hook "options" properties from the register function</h3>
        <p>
          initialValue: Setting the initial value of the registered element.<br/>
          emptyValue: Setting the empty value of the registered element.<br/>
          

          classNameFunction: A function to set the registered element className when validity is changed.<br/>
          styleFunction A function to set the registered element style when validity is changed.<br/>
          {/* setValue: A function to set a seperate value from outside the validator.<br/> */}
          {/* setMessage: A function to set a seperate message from outside the validator.<br/> */}
          

          {/* onMount: A function to run when the element is mounted.<br/> */}
          validateOnMount: A boolean that indicates whether to validate the element when it's mounted.<br/>

          onChange: A function to run when the element is changed. <br/>
          validateOnChange: A boolean that indicates whether to validate the element when it's changed.<br/>
          
          onBlur: A function to run when the element is blured. <br/>
          validateOnBlur: A boolean that indicates weather to validate the element when it's blured.<br/>
          focusOnBlur: A boolean to indicate weather to focus on the element when it's invalidated & blured.<br/>
          
          {/* onValidate: A function to run when the element is validated.<br/> */}
        
          logging: A boolean to indicate weather to log to the console or not.<br/>
        </p>
      </>
    </>
  );
}

export default App;
