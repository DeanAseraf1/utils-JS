import { useEffect, useContext } from "react"
import styles from "../Test/Test.module.css"
import { useStyledObject } from "../../realHooks/useStyledObject"
import { mainContext } from "../.."

export const Test = () => {
    const { getBasicClass, basicStyles} = useContext(mainContext)

    return <div>
        <h1 className={getBasicClass(basicStyles.hl)}>HEADER</h1>
        <h2>HEADER2</h2>
        <p>PARAGRAPH</p>
    </div>
}