import { ReactNode, Children } from "react";

// export const Board = (props:{width: number, height:number, children?:ReactNode}) => {
//     const {width, height, children} = props;
//     Children.map(children, (child, index)=>{
//         console.log();
//         if(typeof (child) !== typeof(BoardItem)){
//             console.log("!!")
//         }

//     })
//     return <div style={{backgroundColor:"red" ,position: "relative", width: `${width}px`, height: `${height}px`, overflow:"hidden"}}>
//         {children}
//     </div>
// }

// export const BoardItem = (props: {width:number, height:number, xPosition:number, yPosition:number, children?:ReactNode}) => {
//     const {width, height, xPosition, yPosition, children} = props;
//     return <div style={{backgroundColor:"black", width: `${width}px`, height: `${height}px`, position:"absolute", bottom: `${yPosition}px`, left: `${xPosition}px`}}>{children}</div>
// }