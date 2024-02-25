import React, { useEffect, useRef, useState } from "react";
import styles from "./Home.module.css";
import { useCssVarRef } from "../../hooks/useCssVarRef"
import { useCustomStylesRef } from "../../hooks/useCustomStyles";
import { Grid } from "../../components/Grid/Grid";

export const Home = () => {
    const colors = ["green", "yellow", "red", "blue", "orange", "שלום לכולם מה שלומכם היום"];
    const lines = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    const [customStyleHandler] = useCustomStylesRef();

    const [CssVariablesHandler, CssVariablesUpdater] = useCssVarRef();

    // useEffect(()=>{
    //     CssVariablesUpdater("test", { propertyKey: "--color-black", propertyValue: "blue" })
    //     CssVariablesUpdater("test2", { propsAssignments: "--color-black: blue; --color-white: orange;" })
    // })
    const hello = [
        "hello",
        "hello",
        "hello",
        "שלום לכולם מה שלומכם היום",
        "נחמד לי מאוד לראות אתכם נחמד לי מאוד לומר לכם",
        "שאאאאאאאלום לכם שלום לכם שלום לכם שלום וווווווומה שלומכם ומה שלומכם ומה שלומכם היוםםםםםםם",
        "hello",
        "hello",
        "hello"
    ]

    return (
        <>
            <Grid ulClassName={styles.grid_gap} className={styles.grid}>
                {hello.map((item, index) => {
                    return (
                        <div key={index} className={styles.item}>
                            <h6 className={styles.item_title}>
                                {item}
                            </h6>
                            <button className={styles.item_button}>
                                <img className={styles.item_image} src="https://images2.minutemediacdn.com/image/fetch/c_fill,g_auto,f_auto,h_1350,w_1080/https%3A%2F%2Fbamsmackpow.com%2Ffiles%2F2023%2F06%2FPrime_Videos_Gen_V_-_Official_Teaser_Art.jpg" />
                            </button>
                        </div>
                    )
                })
                }
            </Grid>


            {/* <div className={styles.comp} ref={ CssVariablesHandler } data-ref-name="test">asd</div>
            <div className={styles.comp} ref={ CssVariablesHandler } data-ref-name="test2">asd</div>*/}

            <div className={styles.comp} ref={ref => CssVariablesHandler(ref, { propertyKey: "--color-black", propertyValue: "yellow" })}>asd</div>
            <div className={styles.comp} ref={ref => CssVariablesHandler(ref, { propsAssignments: "--color-black: yellow; --color-white: black;" })}>asd</div>



            <div ref={customStyleHandler}
                data-style-src="test1"
                data-style="
                color:blue;
                ~:hover{
                    color:white
                }
                ">Laaaaaaaaa</div>

            Inline styles
            {lines.map((line, index) => {
                return (
                    <div
                        key={index}
                        style={{
                            backgroundColor: colors[index % colors.length],
                            color: colors[(index + 1) % colors.length]
                        }}>
                        {line}
                    </div>
                )
            })}

            Custom styles
            {lines.map((line, index) => {
                return (
                    <div
                        ref={customStyleHandler}
                        key={index + lines.length}
                        data-style={`
                    background-color: ${colors[index % colors.length]};
                    color:${colors[(index + 1) % colors.length]};`}>
                        {line}
                    </div>)
            })}

            Custom style ref & src
            <div
                ref={customStyleHandler}
                data-style-src="test4"
                data-style="
                color:blue;
                ~:hover{
                    color:white
                }
                ">
                hello1
            </div>

            <div
                ref={customStyleHandler}
                data-style-ref="test4">
                hello2
            </div>

            <div
                ref={customStyleHandler}
                data-style-ref="test4"
                data-style="color:green;">
                hello3
            </div>

            <div
                ref={customStyleHandler}
                data-style-ref="test4"
                data-style="~:hover{
                    color:pink;
                    }
                    ~::after{
                    content:'lala';
                    }">
                hello4
            </div>

            <div
                ref={customStyleHandler}
                data-style-ref="test4"
                data-style="
                @media screen and (max-width: 600px){
                    font-size: 30px;
                }">
                hello5
            </div>

        </>
    );
}