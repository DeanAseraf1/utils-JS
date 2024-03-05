import { useRef } from "react"

let customStyleSheet;

export const useCustomStylesheet = () => {
    if (!document.querySelector("#custom-stylesheet")) {
        customStyleSheet = document.createElement("style")
        customStyleSheet.setAttribute("id", "custom-stylesheet")
        document.head.appendChild(customStyleSheet)
    }
}

export const useCustomStylesRef = () => {
    const refs = useRef([]);
    const attributeName = "data-style"
    const srcAttributeName = "data-style-src"
    const refAttributeName = "data-style-ref"
    const customStylesReferences = []

    const styleName = "style"
    const srcName = "styleSrc"
    const refName = "styleRef"

    const pseudoSyntax = "~"
    const pseudoRegex = () => new RegExp(`${pseudoSyntax}(:|::)(\\w|\\s|\\t|\\n|\\r)*{(.|\\s|\\t|\\n|\\r)*}`, "gim")
    const pseudoBracketsRegex = () => new RegExp(`(\\${pseudoSyntax}|\\{|\\})`, "gim")

    const getNewCssClass = (className, classContent) => `.${className} {\n\t${classContent}\n}\n\n`
    const getNewCssClassName = (...names) => names.join("-");
    const getRefSyntax = (ref) => `(${ref})`
    const getRefCssClass = (ref) => `.${ref}`


    //in-function for getting a reference element from the array by key.
    const getCustomStyleRef = (key) => {
        const currentCustomStyleRef = customStylesReferences.find(item => item.key === key)
        if (!currentCustomStyleRef)
            return null

        return currentCustomStyleRef;
    }

    //in-function for replace all the '(ref)' syntax with the correct class names in the cssText
    const updateRefrencesInCSS = (cssText) => {
        for (let i = 0; i < customStylesReferences.length; i++) {
            const currentCustomStyleRef = getCustomStyleRef(customStylesReferences[i].key)
            const refName = getRefSyntax(currentCustomStyleRef.key)
            if (cssText.includes(refName))
                cssText = cssText.replaceAll(refName, getRefCssClass(currentCustomStyleRef.value))
        }
        return cssText;
    }

    //in-function for handaling pseudo syntax
    const updatePseudoRefencesInCSS = (cssText) => {
        if (pseudoRegex().test(cssText)) {
            let arr = cssText.split(pseudoBracketsRegex())
            let pseudoProperties = [];
            for (let i = 0; i < arr.length; i++) {
                if (arr[i] === pseudoSyntax)
                    pseudoProperties.push({ pseudo: arr[i + 1], properties: arr[i + 3] });
            }
            return { pseudoProperties: pseudoProperties, newCss: cssText.replaceAll(pseudoBracketsRegex(), "") };
        }
        return { pseudoProperties: [], newCss: cssText };
    }

    const refHandler = (ref) => {
        if (ref && !refs.current.includes(ref)) {
            refs.current.push(ref)

            if (ref.hasAttribute(attributeName)) {
                const attributeValue = ref.dataset[styleName]
                const newCssClassName = getNewCssClassName(attributeName, refs.current.length - 1);

                //checking ref
                let isRef = false;
                if (srcName in ref.dataset) {
                    const key = ref.dataset[srcName]
                    const currentCustomStyleRef = getCustomStyleRef(key);
                    if (currentCustomStyleRef)
                        console.warn(`custom-style-src="${key} is already declared."\nPlease use different value.`)

                    isRef = true;
                    customStylesReferences.push({ key: key, value: newCssClassName })
                }

                let isCopy = false;
                if (refName in ref.dataset) {
                    const key = ref.dataset[refName]
                    const currentCustomStyleRef = getCustomStyleRef(key);
                    console.log(currentCustomStyleRef);
                    if (currentCustomStyleRef)
                        ref.classList.add(currentCustomStyleRef.value);

                    isCopy = true;
                }

                //handaling pseudo elements
                const pseudoUpdates = updatePseudoRefencesInCSS(attributeValue)
                const pseudoObjects = pseudoUpdates.pseudoProperties;
                for (let j = 0; j < pseudoObjects.length; j++) {
                    customStyleSheet.sheet.insertRule(
                        getNewCssClass(`${newCssClassName}${pseudoObjects[j].pseudo}`, updateRefrencesInCSS(pseudoObjects[j].properties)),
                        customStyleSheet.sheet.cssRules.length)
                }

                //inserting the main rule
                customStyleSheet.sheet.insertRule(
                    getNewCssClass(newCssClassName, updateRefrencesInCSS(pseudoUpdates.newCss)),
                    customStyleSheet.sheet.cssRules.length)

                ref.removeAttribute(attributeName)
                ref.classList.add(newCssClassName)


                if (isRef)
                    ref.removeAttribute(srcAttributeName)
                if (isCopy)
                    ref.removeAttribute(refAttributeName);
            }

            const referenceElements = document.querySelectorAll(`[${refAttributeName}]`)
            for (let i = 0; i < referenceElements.length; i++) {
                const customStyleRef = referenceElements[i].dataset[refName]
                const customStyle = getCustomStyleRef(customStyleRef)
                if (!customStyle) {
                    //    console.warn(`custom-style-ref="${customStyleRef}" is not defined.\nTry adding it to the refered element.\nAnd check that it uses a custom-style attribute.`)
                    return
                }
                referenceElements[i].classList.add(customStyle.value)
                referenceElements[i].removeAttribute(refAttributeName)
            }
        }

        return refs;
    }

    return [refHandler]

}