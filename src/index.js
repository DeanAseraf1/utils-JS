import React,{createContext, useState} from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import {Home} from "./pages/Home/Home";
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Test } from './pages/Test/Test';
import { Layout } from './components/Layout/Layout';
import {useStyledObject} from "./realHooks/useStyledObject";


const root = ReactDOM.createRoot(document.getElementById('root'));
export const mainContext = createContext();

const hover = ":hover";
const maxWidth600 = "@media screen and (max-width:600px)";

const Main = () => {
  const [stylesObject, setStylesObject] = useState({
    hl:{
      color:"red",
      fontSize:"10px",
      [hover]:{
        color:"green"
      },
      [maxWidth600]:{
        color: "blue",
        [hover]:{
          backgroundColor:"black"
        }
      }
    },
    hv:{
      color:"yellow",
      [hover]:{
        color:"black"
      },
      [maxWidth600]:{
        color: "red",
        [hover]:{
          backgroundColor:"blue"
        }
      }
    }
  });
  const {styles, getClass} = useStyledObject(stylesObject, "appSO");

  return <mainContext.Provider value={{
    setBasicStyles: setStylesObject,
    basicStyles: styles,
    getBasicClass: getClass
  }}>
    <React.StrictMode>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />}>
            <Route path="/test" element={<Test />}/>
          </Route>
        </Routes>

      </BrowserRouter>
    </React.StrictMode>
</mainContext.Provider>
}


root.render(
  <Main/>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
